import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (formData) => API.post("/auth/register", formData);
export const loginUser = (formData) => API.post("/auth/login", formData);
export const getProfile = () => API.get("/auth/profile");

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
