# Real-time Data Synchronization

## Architecture Pattern

### Client Actions
- All user-initiated actions use standard HTTP requests
- No WebSockets or other real-time protocols for client-to-server communication

### Server Broadcasts
- When any data changes on the server, broadcast the complete updated entity via SSE
- Send full object data, not just change notifications
- All authenticated users receive relevant updates in real-time

## Core Principles

1. **Complete Objects**: Always send the entire updated entity, not partial updates
2. **Immediate Broadcast**: Send SSE events immediately after successful database operations  
3. **Scoped Updates**: Only send events to users who should see the data
4. **HTTP for Actions, SSE for Updates**: Clear separation of concerns