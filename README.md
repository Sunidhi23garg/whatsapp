# WhatsApp-like App 

This build is configured **for local MongoDB** (no replica set needed) and includes:
- **Task 1:** Script to read payloads and insert/update `whatsapp.processed_messages`
- **Task 2:** WhatsApp Web–like UI (React + Vite, CSS)
- **Task 3:** "Send Message" demo with real-time updates via Socket.IO (emits on save/update; no change streams required)

### Payload file names supported (place in `/payloads`):
- conversation_1_message_1.json
- conversation_1_message_2.json
- conversation_1_status_1.json
- conversation_1_status_2.json
- conversation_2_message_1.json
- conversation_2_message_2.json
- conversation_2_status_1.json
- conversation_2_status_2.json

### Screenshots
<img width="1919" height="514" alt="image" src="https://github.com/user-attachments/assets/41c9c2d0-f456-4fee-8e06-1bcf785f13d7" />

- In mobile...
<img width="625" height="500" alt="image" src="https://github.com/user-attachments/assets/9113151c-ea78-4894-9692-3050f1ef08d7" />



## Quick Start

### 0) Prereqs
- Node.js 18+
- Local MongoDB running on `mongodb://localhost:27017`

### 1) Backend
```bash
cd server
npm install
npm run dev             
```

### 2) Frontend
```bash
cd client
npm install
npm run dev      
```

### 3) Process payloads
```bash
cd server
npm run process      
```
The UI should immediately show chats. Real-time updates are emitted on save/update (no change streams).

## Notes
- DB: `whatsapp` | Collection: `processed_messages`
- Status flow recognized: `sent`, `delivered`, `read`
- Frontend groups chats by `wa_id`; clicking shows messages + statuses + timestamps.
- All CSS is hand-written).
