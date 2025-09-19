- Client Error page
- platform icons
- Employee Roles
- Invites
- Image Uploads
- Integrations
    - Tg
    - Zalo
    - Discord
- 2 types of contacts: Customers and Employees
    - Have 2 separators that say "staff" and "customer" with > (closed) and v (open)
- dark theme fix (provider added already)
- using polling
    - Either switch to socket/io (doesn't work through vite proxy idk why), hono ws (seems basic), bun ws (not sure how to share ws instance around)
    - Or delete websocket packages from frontend and backend

- multiple conversations per user (closed tickets)
- initiate conversation
    - Might be limited based on the platform


- analytics
  - how many users 
  - how many users per platform, pie chart
  - new users per day/ week/month/quarter
  - message per day/week/month/quarter