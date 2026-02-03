import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Agrimart assistant. Ask me about:",
            sender: 'bot',
            timestamp: new Date(),
            suggestions: ["Delivery time?", "Payment options", "Return policy", "Contact Support"]
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (textToSend) => {
        // If textToSend is provided (from suggestion click), use it. Otherwise use inputValue.
        const messageText = typeof textToSend === 'string' ? textToSend : inputValue;

        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: messageText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.text }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                text: data.reply || "I'm having trouble processing that right now.",
                sender: 'bot',
                timestamp: new Date(),
                suggestions: data.suggestions || [], // Capture suggestions from backend
                aiUsed: data.aiUsed
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm currently unable to connect to the server. Please try again later.",
                sender: 'bot',
                timestamp: new Date(),
                suggestions: ["Try again", "Contact Support"]
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const onSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-24 right-6 w-full max-w-[350px] md:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col overflow-hidden z-[999]"
                >
                    {/* Header */}
                    <div className="bg-emerald-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl text-white">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-sm">AgriMart Support</h3>
                                <p className="text-emerald-100 text-xs font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                onSuggestionClick={onSuggestionClick}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 mb-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Loader2 size={16} className="animate-spin" />
                                </div>
                                <div className="bg-slate-50 text-slate-500 p-3 rounded-2xl rounded-tl-none text-xs border border-slate-100 italic">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-slate-100">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about products, orders..."
                                className="flex-1 bg-slate-100 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-400"
                                maxLength={300}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                            Powered by Agrimart AI • Max 300 chars
                        </p>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWindow;
