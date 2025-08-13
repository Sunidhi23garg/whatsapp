# WhatsApp-like App (Local MongoDB, No Replica Set, No TailwindCSS)

This build is configured **for local MongoDB** (no replica set needed) and includes:
- **Task 1:** Script to read payloads and insert/update `whatsapp.processed_messages`
- **Task 2:** WhatsApp Web–like UI (React + Vite, plain CSS)
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

You can replace the included samples with your own (same structure).

## Quick Start

### 0) Prereqs
- Node.js 18+
- Local MongoDB running on `mongodb://localhost:27017`

### 1) Backend
```bash
cd server
cp .env.example .env     # already points to local MongoDB; adjust if needed
npm install
npm run dev              # http://localhost:5000
```

### 2) Frontend
```bash
cd client
cp .env.example .env     # uses http://localhost:5000 by default
npm install
npm run dev              # http://localhost:5173
```

### 3) Process payloads
```bash
cd server
npm run process          # reads ../payloads/* and upserts into whatsapp.processed_messages
```
The UI should immediately show chats. Real-time updates are emitted on save/update (no change streams).

## Notes
- DB: `whatsapp` | Collection: `processed_messages`
- Status flow recognized: `sent`, `delivered`, `read`
- Frontend groups chats by `wa_id`; clicking shows messages + statuses + timestamps.
- All CSS is hand-written (no TailwindCSS).
