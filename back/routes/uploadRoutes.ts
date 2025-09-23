import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import { type Context, Hono } from "hono";
import z from "zod";
import requiresAuth from "./middleware/requiresAuth";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// Upload configuration
const UPLOAD_CONFIGS = {
	"user-profile": {
		directory: "user-profiles",
	},
	"business-profile": {
		directory: "business-profiles",
	},
} as const;

type UploadType = keyof typeof UPLOAD_CONFIGS;

const ensureDirectoryExists = async (dir: string) => {
	if (!existsSync(dir)) {
		await mkdir(dir, { recursive: true });
	}
};

const generateUniqueFilename = (originalName: string) => {
	const ext = path.extname(originalName);
	const uuid = randomUUIDv7();
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
	file: File,
	uploadType: UploadType,
) => {
	try {
		const config = UPLOAD_CONFIGS[uploadType];
		const uploadDir = path.resolve(UPLOAD_DIR, config.directory);

		await ensureDirectoryExists(uploadDir);

		const filename = generateUniqueFilename(file.name);
		const buffer = Buffer.from(await file.arrayBuffer());
		const filePath = path.resolve(uploadDir, filename);

		await writeFile(filePath, buffer);

		return c.json(
			{
				filename,
				url: `/uploads/${config.directory}/${filename}`,
				size: file.size,
				type: file.type,
			}, 200
		);
	} catch (error) {
		console.error(`${uploadType} upload error:`, error);
		return c.json(
			{
				success: false,
				error: "Failed to upload the image",
			},
			500,
		);
	}
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

const imageUploadSchema = z.object({
	image: z
		.file()
		.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
		.refine(
			(file) => ALLOWED_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported.",
		),
});

export const uploadRoutes = new Hono()
	.use("*", requiresAuth)
	.post("/user-profile", zValidator("form", imageUploadSchema), (c) => {
		const { image } = c.req.valid("form");
		return handleImageUpload(c, image, "user-profile");
	})
	.post("/business-profile", zValidator("form", imageUploadSchema), (c) => {
		const { image } = c.req.valid("form");
		return handleImageUpload(c, image, "business-profile");
	});
