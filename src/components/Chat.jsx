import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

let socket;

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    // 1️⃣ Load old messages
    axios
      .get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true })
      .then((res) => setMessages(res.data.data));

    // 2️⃣ Connect socket
    socket = io(BASE_URL, { withCredentials: true });

    socket.emit("joinRoom", { targetUserId });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [targetUserId]);

  // 3️⃣ Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      targetUserId,
      text,
    });

    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Chat Header */}
      <div className="p-4 border-b border-base-300 font-semibold text-lg">
        Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isIncoming = m.senderId === targetUserId;

          return (
            <div
              key={m._id}
              className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                  isIncoming
                    ? "bg-base-200 text-base-content rounded-bl-none"
                    : "bg-purple-500 text-white rounded-br-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Box (Sticky Bottom) */}
      <div className="p-4 border-t border-base-300 bg-base-100 flex gap-2 sticky bottom-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="input input-bordered flex-1 rounded-full"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary rounded-full px-6"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
