import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { seedDb } from "./db/seed";
import { runEnabledLinks } from "./links";
import { authRoutes } from "./routes/authRoutes";
import { chatRoutes } from "./routes/chatRoutes";
import { companyRoutes } from "./routes/companyRoutes";
import { employeeRoutes } from "./routes/employeeRoutes";
import { manageRoutes } from "./routes/manageRoutes";

// Initialize database
try {
	await seedDb();
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
	.route("/chat", chatRoutes);

app
	.get("*", serveStatic({ root: "./front/dist" }))
	.get("*", serveStatic({ path: "./front/dist/index.html" }));

export default app;

export type ApiTypes = typeof apiRoutes;
