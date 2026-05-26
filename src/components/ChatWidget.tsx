// import { useState } from "react";
// import { Send } from "lucide-react";
// import "./ChatWidget.css"; // Add your styling
// import api from "../api/axiosInstance";

// // Define the type for a message
// type Message = {
//   sender: "user" | "bot";
//   text: string;
// };

// // Define the type for the backend history message
// type HistoryMessage = {
//   role: "user" | "assistant";
//   content: string;
// };

// const ChatWidget = () => {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     { sender: "bot", text: "Hi! How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");

//   // Convert messages to backend-compatible format
//   const formatHistory = (msgs: Message[]): HistoryMessage[] => {
//     return msgs.map((msg) => ({
//       role: msg.sender === "user" ? "user" : "assistant",
//       content: msg.text,
//     }));
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg: Message = { sender: "user", text: input };
//     const thinkingMsg: Message = { sender: "bot", text: "Thinking..." };

//     // Optimistically add user + thinking messages
//     setMessages((m) => [...m, userMsg, thinkingMsg]);

//     try {
//       // Include latest messages in history
//       const history = formatHistory([...messages, userMsg]);
//       const response = await api.post("/chat/", { message: input, history });

//       // Replace "Thinking..." with bot's reply
//       setMessages((m) => {
//         const updated = [...m];
//         updated[updated.length - 1] = {
//           sender: "bot",
//           text: response.data.reply,
//         };
//         return updated;
//       });
//     } catch (error) {
//       // Replace "Thinking..." with error message
//       setMessages((m) => {
//         const updated = [...m];
//         updated[updated.length - 1] = {
//           sender: "bot",
//           text: "⚠️ Server is taking too long to respond. Please try again.",
//         };
//         return updated;
//       });
//     }

//     setInput("");
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       <button className="chat-button" onClick={() => setOpen(!open)}>
//         💬
//       </button>

//       {open && (
//         <div className="chat-box">
//           <div className="chat-header">AI Assistant</div>

//           <div className="chat-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`message ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           <div className="chat-input">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type message…"
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button onClick={sendMessage}>
//               <Send size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatWidget;


import { useState } from "react";
import { Send } from "lucide-react";
import "./ChatWidget.css"; 
import api from "../api/axiosInstance";

type Message = {
  sender: "user" | "bot";
  text: string;
};

// 1. UPDATED: Changed to Gemini's expected structure
type HistoryMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  // 2. UPDATED: Formats objects with a 'parts' array and uses 'model'
  const formatHistory = (msgs: Message[]): HistoryMessage[] => {
    return msgs.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    const thinkingMsg: Message = { sender: "bot", text: "Thinking..." };

    setMessages((m) => [...m, userMsg, thinkingMsg]);

    try {
      const history = formatHistory([...messages, userMsg]);
      const response = await api.post("/chat/", { message: input, history });

      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = {
          sender: "bot",
          text: response.data.reply,
        };
        return updated;
      });
    } catch (error) {
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "⚠️ Server is taking too long to respond. Please try again.",
        };
        return updated;
      });
    }

    setInput("");
  };

  return (
    <>
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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