import React, { useEffect, useRef } from "react";

function formatTs(ts) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

function Status({ status }) {
  if (!status) return null;
  return <span className={`status status-${status}`}>{status}</span>;
}

export default function ChatWindow({ messages, userInfo }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">{(userInfo.name || userInfo.wa_id || "?").slice(0, 1)}</div>
        <div>
          <div className="title">{userInfo.name || "Unknown"}</div>
          <div className="subtitle">{userInfo.wa_id}</div>
        </div>
      </div>
      <div className="messages">
        {messages.map((m) => {
          const mine = m.from === "agent" || m.name === "You";
          return (
            <div key={m._id || m.meta_msg_id} className={`bubble-row ${mine ? "mine" : ""}`}>
              <div className="bubble">
                <div className="text">{m.text}</div>
                <div className="meta">
                  <span>{formatTs(m.timestamp)}</span>
                  <Status status={m.status} />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
