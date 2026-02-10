import React, { useState } from "react";
import ChatFab from "./ChatFab";
import ChatPanel from "./ChatPanel";

// Helper to format time
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Auto-reply messages from support
const AUTO_REPLIES = [
    "Thanks for reaching out! Let me look into that for you.",
    "Of course! Could you provide a bit more detail?",
    "Got it — I'll check on that right away.",
    "Sure thing! Is there anything else I can help with?",
];

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "support",
            name: "MealMate Support",
            text: "Hi there! 👋 How can we help you today?",
            time: formatTime(new Date()),
        },
    ]);
    const [input, setInput] = useState("");

    // Toggle the chat panel open/closed
    const handleToggle = () => {
        if (isOpen) {
            handleClose();
        } else {
            setIsOpen(true);
        }
    };

    // Close with slide-down animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 200);
    };

    // Send a message and get an auto-reply
    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            sender: "user",
            name: "You",
            text: input.trim(),
            time: formatTime(new Date()),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simulate support reply after 1.2 seconds
        setTimeout(() => {
            const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
            const supportMessage = {
                id: Date.now() + 1,
                sender: "support",
                name: "MealMate Support",
                text: randomReply,
                time: formatTime(new Date()),
            };
            setMessages((prev) => [...prev, supportMessage]);
        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* Chat panel - only shows when open */}
            {isOpen && (
                <ChatPanel
                    isClosing={isClosing}
                    messages={messages}
                    input={input}
                    onInputChange={setInput}
                    onSend={handleSend}
                    onClose={handleClose}
                />
            )}

            {/* Floating action button - always visible */}
            <ChatFab isOpen={isOpen} onClick={handleToggle} />
        </div>
    );
};

export default ChatWidget;
