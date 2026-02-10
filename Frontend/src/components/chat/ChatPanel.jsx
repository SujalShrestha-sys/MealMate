import React from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatPanel = ({ isClosing, messages, input, onInputChange, onSend, onClose }) => {
    // Pick animation based on whether we're opening or closing
    const animation = isClosing
        ? "animate-[chat-slide-down_0.2s_ease-in_forwards]"
        : "animate-[chat-slide-up_0.25s_ease-out_forwards]";

    return (
        <div className={`w-[370px] h-[510px] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden ${animation}`}>
            <ChatHeader onClose={onClose} />
            <ChatMessages messages={messages} />
            <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
        </div>
    );
};

export default ChatPanel;
