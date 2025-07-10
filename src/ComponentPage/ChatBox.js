import React, { useState } from "react";
import { ArrowUp } from "react-feather";
import "./Chatbox.css";

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { sender: "user", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages([...messages, userMsg]);
        setInput("");

        const res = await fetch(`${process.env.REACT_APP_API_URL}/chatbox`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        const aiMsg = { sender: "ai", text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages((prev) => [...prev, aiMsg]);
    };

    return (
        <div className="chatbox-wrapper">
            {isOpen && (
                <div className="chatbox">
                    <div className="chatbox-header">
                        <span>Support chat</span>
                    </div>
                    <div className="chatbox-body">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message-wrapper ${msg.sender}`}>
                                {msg.sender === "ai" && (
                                    <div className="chat-avatar">
                                        <img src="/support-avatar.png" alt="Support" />
                                    </div>
                                )}
                                <div className={`chat-message ${msg.sender}`}>
                                    <p>{msg.text}</p>
                                    <span className="chat-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chatbox-input">
                        <input
                            type="text"
                            placeholder="Type something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend}><ArrowUp /></button>
                    </div>
                </div>
            )}
            {!isOpen && (
                <button className="chatbox-toggle" onClick={() => setIsOpen(true)}>
                    💬
                </button>
            )}
        </div>
    );
};

export default ChatBox;
