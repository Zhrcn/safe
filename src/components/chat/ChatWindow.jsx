'use client';ButtonButtonButtonButtonButtonButtonButtonButton
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversations } from '@/mockdata/conversations';
import { doctors } from '@/mockdata/doctors';
import { patients } from '@/mockdata/patients';
function Message({ message, isOwn }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`max-w-[70%] rounded-lg p-3 ${
                    isOwn
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                }`}
            >
                <p className="text-sm">{message.content}</p>
                <p
                    className={`text-xs mt-1 ${
                        isOwn ? 'text-primary-100' : 'text-gray-500'
                    }`}
                >
                    {new Date(message.timestamp).toLocaleTimeString()}
                </p>
            </div>
        </motion.div>
    );
}
export default function ChatWindow({ recipient, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const conversation = conversations.find(
                    conv => 
                        (conv.participants.includes(currentUser.id) && 
                         conv.participants.includes(recipient.id))
                );
                if (conversation) {
                    setMessages(conversation.messages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMessages();
    }, [recipient.id, currentUser.id]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const message = {
            id: Date.now(),
            content: newMessage,
            sender: currentUser.id,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, message]);
        setNewMessage('');
        console.log('Sending message:', message);
    };
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }
    const recipientDetails = currentUser.role === 'doctor' 
        ? patients.find(p => p.id === recipient.id)
        : doctors.find(d => d.id === recipient.id);
    return (
        <div className="flex flex-col h-full">
            {}
            <div className="p-4 border-b bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {recipientDetails?.avatar ? (
                            <img 
                                src={recipientDetails.avatar} 
                                alt={recipientDetails.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                                {recipientDetails?.name?.[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{recipientDetails?.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {recipientDetails?.role || (currentUser.role === 'doctor' ? 'Patient' : 'Doctor')}
                        </p>
                    </div>
                </div>
            </div>
            {}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                <AnimatePresence>
                    {messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            isOwn={message.sender === currentUser.id}
                        />
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
            {}
            <div className="p-4 border-t bg-white dark:bg-gray-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    />
                    <Button
                        type="button"
                        className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button
                        type="button"
                        className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 text-primary disabled:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:hover:bg-transparent"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}