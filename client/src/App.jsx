import React, { useEffect, useState } from "react";
import { fetchConversations, fetchMessages, sendMessage } from "./api";
import { socket } from "./socket";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [activeWaId, setActiveWaId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", wa_id: "" });

  useEffect(() => {
    refreshConversations();
  }, []);

  useEffect(() => {
    if (!activeWaId) return;
    fetchMessages(activeWaId).then((m) => {
      setMessages(m);
      const last = m[m.length - 1];
      setUserInfo({ name: last?.name || "", wa_id: activeWaId });
    });
  }, [activeWaId]);

  useEffect(() => {
    function onNew(msg) {
      if (msg.wa_id === activeWaId) setMessages((prev) => [...prev, msg]);
      refreshConversations();
    }
    function onUpdate(update) {
      // When server can't provide the whole doc, we bump a refetch
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

  function refreshConversations() {
    fetchConversations().then(setConversations);
  }

  async function handleSend(text) {
    if (!activeWaId) return;
    await sendMessage({
      wa_id: activeWaId,
      name: "You",
      text
    });
  }

  return (
    <div className="app">
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
  );
}
