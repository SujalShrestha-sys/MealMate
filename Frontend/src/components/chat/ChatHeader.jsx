import React from "react";
import { Headphones, X } from "lucide-react";

const ChatHeader = ({ onClose }) => {
    return (
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 flex items-center gap-3">

            {/* Support icon */}
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Headphones size={18} className="text-white" />
            </div>

            {/* Title and status */}
            <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">MealMate Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-[dot-pulse_2s_ease-in-out_infinite]" />
                    <span className="text-green-100 text-xs">We typically reply in minutes</span>
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default ChatHeader;
