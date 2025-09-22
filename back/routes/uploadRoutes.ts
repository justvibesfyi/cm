import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { type Context, Hono } from "hono";
import requiresAuth from "./middleware/requiresAuth";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// Validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

// Upload configuration
const UPLOAD_CONFIGS = {
	"user-profile": {
		directory: "user-profiles",
		errorMessage: "Failed to upload profile image",
	},
	"business-profile": {
		directory: "business-profiles",
		errorMessage: "Failed to upload business profile image",
	},
} as const;

type UploadType = keyof typeof UPLOAD_CONFIGS;

const validateImageFile = (file: File) => {
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return {
			valid: false,
			error: "Only JPEG, PNG, and WebP images are allowed",
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return { valid: false, error: "File size must be less than 5MB" };
	}

	return { valid: true };
};

const ensureDirectoryExists = async (dir: string) => {
	if (!existsSync(dir)) {
		await mkdir(dir, { recursive: true });
	}
};

const generateUniqueFilename = (originalName: string) => {
	const ext = path.extname(originalName);
	const uuid = randomUUID();
	return `${uuid}${ext}`;
};

const handleImageUpload = async (
	c: Context<{
		Variables: {
			user: {
				id: string;
				email: string;
				company_id: number | null;
			};
		};
	}>,
	uploadType: UploadType,
) => {
	try {
		const formData = await c.req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return c.json({ success: false, error: "No file provided" }, 400);
		}

		const validation = validateImageFile(file);
		if (!validation.valid) {
			return c.json({ success: false, error: validation.error }, 400);
		}

		const config = UPLOAD_CONFIGS[uploadType];
		const uploadDir = path.resolve(UPLOAD_DIR, config.directory);

		await ensureDirectoryExists(uploadDir);

		const filename = generateUniqueFilename(file.name);
		const buffer = Buffer.from(await file.arrayBuffer());
		const filePath = path.resolve(uploadDir, filename);

		await writeFile(filePath, buffer);

		return c.json({
			success: true,
			filename,
			url: `/uploads/${config.directory}/${filename}`,
			size: file.size,
			type: file.type,
		});
	} catch (error) {
		const config = UPLOAD_CONFIGS[uploadType];
		console.error(`${uploadType} upload error:`, error);
		return c.json(
			{
				success: false,
				error: config.errorMessage,
			},
			500,
		);
	}
};

export const uploadRoutes = new Hono()
	.use("*", requiresAuth)
	.post("/user-profile", (c) => handleImageUpload(c, "user-profile"))
	.post("/business-profile", (c) => handleImageUpload(c, "business-profile"));
