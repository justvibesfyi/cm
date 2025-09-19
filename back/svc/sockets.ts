
import type { ServerWebSocket } from "bun";
import useEmployee from "./employee";
import useMessage from "./message";

interface SocketConnection {
  ws: ServerWebSocket<unknown>;
  userId: string;
  companyId: number;
}

interface SocketMessage {
  type: 'customer_message' | 'employee_message';
  content: string;
  customerId?: string;
  customerName?: string;
  platform?: string;
  timestamp?: string;
}

// Store active connections grouped by company
const connections = new Map<number, SocketConnection[]>();

const useSockets = () => {
  return {
    // Add employee to company broadcast group
    addConnection: async (ws: ServerWebSocket<unknown>, userId: string) => {
      const employeeDb = useEmployee();
      const employee = await employeeDb.getFullEmployee(userId);
      
      if (!employee || employee.company_id === null) {
        ws.close(1008, "Employee not found or not in company");
        return;
      }

      const connection: SocketConnection = {
        ws,
        userId,
        companyId: employee.company_id
      };

      // Add to company group
      if (!connections.has(employee.company_id)) {
        connections.set(employee.company_id, []);
      }
      connections.get(employee.company_id)!.push(connection);

      console.log(`Employee ${userId} joined company ${employee.company_id} broadcast group`);
    },

    // Remove connection when employee disconnects
    removeConnection: (ws: ServerWebSocket<unknown>) => {
      for (const [companyId, companyConnections] of connections.entries()) {
        const index = companyConnections.findIndex(conn => conn.ws === ws);
        if (index !== -1) {
          const connection = companyConnections[index];
          companyConnections.splice(index, 1);
          
          if (companyConnections.length === 0) {
            connections.delete(companyId);
          }
          
          console.log(`Employee ${connection.userId} left company ${companyId} broadcast group`);
          break;
        }
      }
    },

    // Broadcast message from customer to all employees in company
    broadcastCustomerMessage: (companyId: number, message: SocketMessage) => {
      const companyConnections = connections.get(companyId);
      if (!companyConnections) {
        console.log(`No active connections for company ${companyId}`);
        return;
      }

      const messageData = JSON.stringify({
        ...message,
        type: 'customer_message',
        timestamp: new Date().toISOString()
      });

      let sentCount = 0;
      companyConnections.forEach(connection => {
        try {
          connection.ws.send(messageData);
          sentCount++;
        } catch (error) {
          console.error(`Failed to send message to employee ${connection.userId}:`, error);
        }
      });

      console.log(`Broadcasted customer message to ${sentCount} employees in company ${companyId}`);
    },

    // Handle message from employee
    handleEmployeeMessage: async (ws: ServerWebSocket<unknown>, messageData: any) => {
      // Find the connection
      let connection: SocketConnection | undefined;
      for (const companyConnections of connections.values()) {
        connection = companyConnections.find(conn => conn.ws === ws);
        if (connection) break;
      }

      if (!connection) {
        console.error("Connection not found for employee message");
        return;
      }

      try {
        const message = JSON.parse(messageData);
        
        if (message.type === 'employee_message' && message.customerId && message.content) {
          // Save message to database
          const messageDb = useMessage();
          await messageDb.saveEmployeeMessage(
            message.content,
            connection.companyId,
            connection.userId,
            message.customerId
          );

          // TODO: Forward message to appropriate link (telegram, etc.)
          // This would require access to the link instances from links/index.ts
          console.log(`Employee ${connection.userId} sent message to customer ${message.customerId}`);
        }
      } catch (error) {
        console.error("Error handling employee message:", error);
      }
    },

    // Get active connections count for a company
    getCompanyConnectionCount: (companyId: number): number => {
      return connections.get(companyId)?.length || 0;
    },

    // Get all active companies with connections
    getActiveCompanies: (): number[] => {
      return Array.from(connections.keys());
    }
  };
};

export default useSockets;