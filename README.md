- [x] platform icons
- [x] Image Uploads
- [x] avatar missing fallback
- Invites
- Client Error page

- Employee Roles
    - 2 types of contacts: Customers and Employees
    - Have 2 separators that say "staff" and "customer" with > (closed) and v (open)
- Integrations
    - Tg
    - Zalo
    - Discord
- messages should be cached locally
- using polling
    - Either switch to socket/io (doesn't work through vite proxy idk why), hono ws (seems basic), bun ws (not sure how to share ws instance around)
    - Or delete websocket packages from frontend and backend

- see customer platform info (on hover?)
- localization
- dark theme fix (provider added already)
- telegram image seems to change even if avatar hasn't changed (old link becomes broken). Either compare hash or just replace the image once link changes

- initiate conversation
    - Might be limited based on the platform
- encryption
    - GDPR (auto deletion of user data after 30)
    - encryption of messages and keys

- multiple conversations per user (closed tickets)
- analytics
  - how many users 
  - how many users per platform, pie chart
  - new users per day/ week/month/quarter
  - message per day/week/month/quarter
- employee to employee convo