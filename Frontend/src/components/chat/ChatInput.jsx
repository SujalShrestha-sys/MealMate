import React, { useRef } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ value, onChange, onSend }) => {
    const inputRef = useRef(null);

    // Send message when Enter is pressed
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSend();
        }
    };

    const hasText = value.trim().length > 0;

    return (
        <div className="px-4 py-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">

                {/* Text input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30 transition-all"
                />

                {/* Send button */}
                <button
                    onClick={onSend}
                    disabled={!hasText}
                    className="w-9 h-9 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                    <Send size={15} className={hasText ? "text-white" : "text-slate-400"} />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
