import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { authRoutes } from "./routes/auth";
import { manageRoutes } from "./routes/manage";
import { initializeApp } from "./src/database";

// Initialize database
try {
	await initializeApp();
	console.info("Database initialized successfully");
} catch (error) {
	console.error("Failed to initialize database", { error });
	process.exit(1);
}

const app = new Hono();

const apiRoutes = app
	.basePath("/api")
	.route("/manage", manageRoutes)
	.route("/auth", authRoutes);

app
	.get("*", serveStatic({ root: "./front/dist" }))
	.get("*", serveStatic({ path: "./front/dist/index.html" }));

export default app;
export type ApiTypes = typeof apiRoutes;
