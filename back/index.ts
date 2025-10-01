import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { runEnabledLinks } from "./links";
import { generateCodeChallenge } from "./links/zalo";
import { authRoutes } from "./routes/authRoutes";
import { chatRoutes } from "./routes/chatRoutes";
import { companyRoutes } from "./routes/companyRoutes";
import { employeeRoutes } from "./routes/employeeRoutes";
import { invitationRoutes } from "./routes/invitationRoutes";
import { manageRoutes } from "./routes/manageRoutes";
import { notesRoutes } from "./routes/notesRoutes";
import { uploadRoutes } from "./routes/uploadRoutes";

// Initialize database
try {
	// await seedDb();
	await runEnabledLinks();
	console.info("Database initialized successfully");
} catch (error) {
	console.error("Failed to initialize database", { error });
	process.exit(1);
}

const app = new Hono();

const apiRoutes = app
	.basePath("/api")
	.route("/manage", manageRoutes)
	.route("/auth", authRoutes)
	.route("/employee", employeeRoutes)
	.route("/company", companyRoutes)
	.route("/chat", chatRoutes)
	.route("/upload", uploadRoutes)
	.route("/invitation", invitationRoutes)
	.route("/notes", notesRoutes);

app
	.get("/uploads/*", serveStatic({ root: "./uploads", rewriteRequestPath: (path) => path.replace(/^\/uploads/, "") }))
	.get("*", serveStatic({ root: "./front/dist" }))
	.get("*", serveStatic({ path: "./front/dist/index.html" }));

console.log(
	generateCodeChallenge("1234567890123456789012345678901234567890123"),
);

export default app;

export type ApiTypes = typeof apiRoutes;
