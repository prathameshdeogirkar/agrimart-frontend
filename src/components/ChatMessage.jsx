import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, onSuggestionClick }) => {
    const isBot = message.sender === 'bot';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col mb-4 ${isBot ? 'items-start' : 'items-end'}`}
        >
            <div className={`flex gap-3 max-w-[90%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                        }`}
                >
                    {isBot ? <Bot size={16} /> : <User size={16} />}
                </div>

                <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${isBot
                            ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                            : 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-500/20'
                        }`}
                >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <span className={`text-[10px] block mt-1 opacity-50 ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Render Suggestions if present */}
            {isBot && message.suggestions && message.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-11 max-w-[90%]">
                    {message.suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => onSuggestionClick(suggestion)}
                            className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-sm"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ChatMessage;
