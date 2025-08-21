import React, { useEffect, useState } from "react";
import { fetchConversations, fetchMessages, sendMessage } from "./api";
import { socket } from "./socket";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

import { registerUser, loginUser, getProfile } from "./api";

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeWaId, setActiveWaId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", wa_id: "" });

  // Auth states
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [profile, setProfile] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) handleProfile(); // auto-fetch profile if token exists
  }, []);

  // Conversations refresh
  useEffect(() => {
    if (profile) refreshConversations(); // only after login
  }, [profile]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (!activeWaId) return;
    fetchMessages(activeWaId).then((m) => {
      setMessages(m);
      const last = m[m.length - 1];
      setUserInfo({ name: last?.name || "", wa_id: activeWaId });
    });
  }, [activeWaId]);

  // Socket listeners
  useEffect(() => {
    function onNew(msg) {
      if (msg.wa_id === activeWaId) setMessages((prev) => [...prev, msg]);
      refreshConversations();
    }
    function onUpdate() {
      refreshConversations();
      if (activeWaId) fetchMessages(activeWaId).then(setMessages);
    }
    socket.on("message:new", onNew);
    socket.on("message:update", onUpdate);
    socket.on("message:bump", onUpdate);
    return () => {
      socket.off("message:new", onNew);
      socket.off("message:update", onUpdate);
      socket.off("message:bump", onUpdate);
    };
  }, [activeWaId]);

  // Helpers
  function refreshConversations() {
    fetchConversations().then(setConversations);
  }

  async function handleSend(text) {
    if (!activeWaId) return;
    await sendMessage({
      wa_id: activeWaId,
      name: profile?.username || "You",
      text,
    });
  }

  // Auth handlers
  const handleRegister = async () => {
    await registerUser(form);
    alert("User registered!");
  };

  const handleLogin = async () => {
    const { data } = await loginUser({
      email: form.email,
      password: form.password,
    });
    localStorage.setItem("token", data.token);
    setProfile(data.user);
    alert("Login successful!");
  };

  const handleProfile = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data);
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.removeItem("token");
      setProfile(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setConversations([]);
    setMessages([]);
    setActiveWaId(null);
  };

  return (
    <div className="app">
      {!profile ? (
        <div className="auth-page">
          <div className="auth-container">
            <h2>Welcome to Chat App</h2>

            <input
              placeholder="Username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="auth-buttons">
              <button onClick={handleRegister}>Register</button>
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="header">
            <span>Logged in as {profile.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </header>

          <div className="main">
            <aside className="sidebar">
              <div className="sidebar-header">Chats</div>
              <ChatList
                conversations={conversations}
                activeWaId={activeWaId}
                onSelect={setActiveWaId}
              />
            </aside>

            <main className="chat">
              {activeWaId ? (
                <>
                  <ChatWindow messages={messages} userInfo={userInfo} />
                  <MessageInput onSend={handleSend} />
                </>
              ) : (
                <div className="empty">Select a chat to start messaging</div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}