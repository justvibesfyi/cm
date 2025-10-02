# Implementation Plan

- [x] 1. Create shared SSE event types





  - Write discriminated union types for type-safe SSE events
  - Create transport abstraction interface
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4_

- [x] 2. Build SSE service using composable pattern





  - [x] 2.1 Create useSSE composable service


    - Track active connections per company
    - Implement company-scoped broadcasting
    - _Requirements: 1.5, 3.1, 3.2, 3.3_
  


  - [x] 2.2 Add SSE endpoint route
    - Create authenticated `/events/stream` route
    - Handle connection establishment and cleanup
    - _Requirements: 1.5, 5.4_

- [x] 3. Create event broadcaster composable





  - Write useEventBroadcaster service
  - Add broadcast methods for each entity type
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Integrate broadcasting with existing routes






  - Add SSE broadcasts to customer routes after DB operations
  - Add SSE broadcasts to employee routes after DB operations  
  - Add SSE broadcasts to note routes after DB operations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.3_

- [ ] 5. Build frontend SSE client
  - [ ] 5.1 Create RealtimeTransport interface and SSE implementation
    - Write transport abstraction for future extensibility
    - Implement SSE client with reconnection logic
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 5.2 Create React SSE provider
    - Build context provider for SSE connection management
    - Handle typed event processing and state updates
    - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4_

- [ ] 6. Connect SSE events to application state
  - Update customer/employee/note data on SSE events
  - Handle real-time message updates
  - _Requirements: 1.1, 1.2, 1.3, 1.4_