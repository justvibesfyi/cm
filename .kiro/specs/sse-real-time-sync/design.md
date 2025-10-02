# Design Document

## Overview

The SSE real-time synchronization system will provide immediate data updates to company members through Server-Sent Events. The architecture separates client actions (HTTP requests) from server broadcasts (SSE events), ensuring simple client-server communication while maintaining real-time synchronization across company members.

## Architecture

### High-Level Flow
1. Client performs action via HTTP request
2. Server processes request and updates database
3. Server broadcasts complete updated object to company members via SSE
4. Connected company members receive and apply updates to their local state

### Component Structure
- **SSE Service**: Manages connections and broadcasts events to company members
- **Event Broadcaster**: Integrates with existing routes to send updates after data changes
- **Client SSE Manager**: Handles connection, reconnection, and event processing on frontend
- **Company Scoping**: Ensures events only reach authorized company members
- **Transport Abstraction**: Interface layer that allows switching between SSE and future transport mechanisms (polling, WebSockets) without changing business logic

## Components and Interfaces

### SSE Service (Backend)
```typescript
interface SSEService {
  addConnection(userId: string, companyId: string, response: Response): void;
  removeConnection(userId: string): void;
  broadcastToCompany(companyId: string, event: SSEEvent): void;
  cleanup(): void;
}

// Type-safe discriminated union for SSE events
type SSEEvent = 
  | { type: 'customer_created'; data: Customer; timestamp: string; company_id: string; }
  | { type: 'customer_updated'; data: Customer; timestamp: string; company_id: string; }
  | { type: 'customer_deleted'; data: { id: string }; timestamp: string; company_id: string; }
  | { type: 'employee_created'; data: Employee; timestamp: string; company_id: string; }
  | { type: 'employee_updated'; data: Employee; timestamp: string; company_id: string; }
  | { type: 'employee_deleted'; data: { id: string }; timestamp: string; company_id: string; }
  | { type: 'note_created'; data: Note; timestamp: string; company_id: string; }
  | { type: 'note_updated'; data: Note; timestamp: string; company_id: string; }
  | { type: 'note_deleted'; data: { id: string }; timestamp: string; company_id: string; }
  | { type: 'message_received'; data: Message; timestamp: string; company_id: string; };
```

### Event Broadcaster (Backend)
```typescript
interface EventBroadcaster {
  broadcastCustomerUpdate(customer: Customer): void;
  broadcastEmployeeUpdate(employee: Employee): void;
  broadcastNoteUpdate(note: Note): void;
  broadcastMessageReceived(message: Message): void;
}
```

### Transport Abstraction (Frontend)
```typescript
interface RealtimeTransport {
  connect(): void;
  disconnect(): void;
  onEvent(callback: (event: SSEEvent) => void): void;
  reconnect(): void;
}

interface ClientSSEManager extends RealtimeTransport {
  // SSE-specific implementation
}
```

## Data Models

### SSE Connection Tracking
- In-memory storage of active connections per company
- Connection cleanup on user disconnect
- Company-based event routing

### Event Types
Complete set of events for all entity operations:
- `customer_created/updated/deleted`: Customer entity changes
- `employee_created/updated/deleted`: Employee entity changes  
- `note_created/updated/deleted`: Note entity changes
- `message_received`: New messages from customers

Each event provides complete object data for create/update operations, and ID for delete operations.

## Error Handling

### Server-Side
- Handle connection drops gracefully
- Clean up stale connections automatically
- Log connection and broadcast errors

### Client-Side
- Automatic reconnection with exponential backoff
- Handle connection state changes
- Error logging and user notification

## Testing Strategy

### Backend Testing
- Test SSE connection management
- Verify company-scoped event broadcasting
- Test connection cleanup and error handling
- Integration tests with existing routes

### Frontend Testing
- Test SSE connection establishment
- Verify event handling and state updates
- Test reconnection logic
- Mock SSE events for component testing

### Integration Testing
- End-to-end data synchronization flow
- Multi-user company scenarios
- Network failure and recovery testing
- Cross-browser SSE compatibility