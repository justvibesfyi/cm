import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import useSSE from "../svc/sse";
import requiresAuth from "./middleware/requiresAuth";

export const eventsRoutes = new Hono()
  .use("*", requiresAuth)
  .get("/stream", async (c) => {
    const user = c.var.user;
    
    // Ensure user has a company
    if (!user.company_id) {
      return c.json({ error: "You're not in a company" }, 400);
    }

    const companyId = user.company_id;
    const sse = useSSE();

    return streamSSE(c, async (stream) => {
      // Set up SSE headers
      c.header("Content-Type", "text/event-stream");
      c.header("Cache-Control", "no-cache");
      c.header("Connection", "keep-alive");

      // todo add correct origin
      c.header("Access-Control-Allow-Origin", "*");
      c.header("Access-Control-Allow-Headers", "Cache-Control");

      const streamController = {
        enqueue: (data: string) => {
          stream.write(data);
        },
        close: () => {
          // Stream will be closed by Hono
        }
      };

      sse.addConnection(user.id, companyId.toString(), streamController as ReadableStreamDefaultController);

      // Send initial connection confirmation
      const connectEvent = {
        type: "connected",
        timestamp: new Date().toISOString(),
        company_id: companyId.toString()
      };
      
      await stream.write(`data: ${JSON.stringify(connectEvent)}\n\n`);

      // Keep connection alive until client disconnects
      stream.onAbort(() => {
        sse.removeConnection(user.id);
      });
    });
  });