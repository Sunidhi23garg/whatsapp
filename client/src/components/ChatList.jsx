import React from "react";

function formatTs(ts) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

export default function ChatList({ conversations, activeWaId, onSelect }) {
  return (
    <div className="chat-list">
      {conversations.map((c) => (
        <div
          key={c._id}
          className={`chat-item ${activeWaId === c._id ? "active" : ""}`}
          onClick={() => onSelect(c._id)}
        >
          <div className="avatar">{(c.name || c._id || "?").slice(0, 1)}</div>
          <div className="meta">
            <div className="name">{c.name || c._id}</div>
            <div className="last">{c.lastMessage || ""}</div>
          </div>
          <div className="time">{formatTs(c.lastTs)}</div>
        </div>
      ))}
    </div>
  );
}
