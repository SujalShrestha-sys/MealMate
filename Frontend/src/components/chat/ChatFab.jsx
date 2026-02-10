import React from "react";
import { MessageCircle, X } from "lucide-react";

const ChatFab = ({ isOpen, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300
        ${isOpen
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-green-600 hover:bg-green-700 animate-[chat-fab-pulse_2.5s_ease-in-out_infinite]"
                }`}
        >
            {/* Show X when chat is open, message icon when closed */}
            {isOpen ? (
                <X size={22} className="text-white" />
            ) : (
                <div className="relative">
                    <MessageCircle size={22} className="text-white" />
                    {/* Green online indicator dot */}
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-green-600 animate-[dot-pulse_2s_ease-in-out_infinite]" />
                </div>
            )}
        </button>
    );
};

export default ChatFab;
