import React, { useState } from "react";
import { Send } from "lucide-react";
import "./ChatWidget.css"; // we will create styling separately
import api from "../api/axiosInstance"

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hi! How can I help you today?" }]);
  const [input, setInput] = useState("");

  const formatHistory = (messages) => {
  return messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));
};

const sendMessage = async () => {
  if (!input.trim()) return;

  // 1️⃣ Add user message
  const userMsg = { sender: "user", text: input };
  setMessages((m) => [...m, userMsg]);

  // 2️⃣ Add temporary "Thinking..." message
  setMessages((m) => [...m, { sender: "bot", text: "Thinking..." }]);

  try {
    // 3️⃣ Backend request
    const response = await api.post("/chat/", { message: input,  history: formatHistory(messages) });

    // 4️⃣ Replace "Thinking..." with actual bot reply
    setMessages((m) => {
      const updated = [...m];
      updated[updated.length - 1] = {
        sender: "bot",
        text: response.data.reply,
      };
      return updated;
    });

  } catch (error) {

    // 5️⃣ Replace "Thinking..." with error message (no crash)
    setMessages((m) => {
      const updated = [...m];
      updated[updated.length - 1] = {
        sender: "bot",
        text: "⚠️ Server is taking too long to respond. Please try again.",
      };
      return updated;
    });
  }

  // Clear input
  setInput("");
};



  return (
    <>
      {/* Floating Button */}
      <button className="chat-button" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">AI Assistant</div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message…"
            />
            <button onClick={sendMessage}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
