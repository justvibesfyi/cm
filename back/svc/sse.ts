import type { SSEEvent } from "../types";

interface SSEConnection {
  userId: string;
  companyId: string;
  controller: ReadableStreamDefaultController;
}

// In-memory storage for active SSE connections
const connections = new Map<string, SSEConnection>();

function useSSE() {
  
  const addConnection = (userId: string, companyId: string, controller: ReadableStreamDefaultController): void => {
    // Store the connection
    connections.set(userId, {
      userId,
      companyId,
      controller
    });
  };

  const removeConnection = (userId: string): void => {
    const connection = connections.get(userId);
    if (connection) {
      try {
        connection.controller.close();
      } catch (error) {
        // Connection might already be closed
        console.warn('Error closing SSE connection:', error);
      }
      connections.delete(userId);
    }
  };

  const broadcastToCompany = (companyId: string, event: SSEEvent): void => {
    const companyConnections = Array.from(connections.values())
      .filter(conn => conn.companyId === companyId);

    const eventData = `data: ${JSON.stringify(event)}\n\n`;

    companyConnections.forEach(connection => {
      try {
        connection.controller.enqueue(eventData);
      } catch (error) {
        // Connection might be closed, remove it
        console.warn('Error sending SSE event, removing connection:', error);
        connections.delete(connection.userId);
      }
    });
  };

  const getActiveConnections = (): number => {
    return connections.size;
  };

  const getCompanyConnections = (companyId: string): number => {
    return Array.from(connections.values())
      .filter(conn => conn.companyId === companyId).length;
  };

  const cleanup = (): void => {
    // Close all connections and clear the map
    connections.forEach(connection => {
      try {
        connection.controller.close();
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    });
    connections.clear();
  };

  return {
    addConnection,
    removeConnection,
    broadcastToCompany,
    getActiveConnections,
    getCompanyConnections,
    cleanup
  };
}

export default useSSE;