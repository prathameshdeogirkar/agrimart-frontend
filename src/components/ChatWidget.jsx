import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-[1000] w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-600/30 flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-colors"
                    >
                        <MessageSquareText size={28} strokeWidth={2.5} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default ChatWidget;
