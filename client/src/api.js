const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchConversations() {
  const r = await fetch(`${API_URL}/api/conversations`);
  return r.json();
}

export async function fetchMessages(wa_id) {
  const r = await fetch(`${API_URL}/api/messages?wa_id=${encodeURIComponent(wa_id)}`);
  return r.json();
}

export async function sendMessage(payload) {
  const r = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return r.json();
}
