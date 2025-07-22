'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, 
    Search, 
    User, 
    UserRound, 
    Pill, 
    Stethoscope, 
    X, 
    ArrowLeft, 
    MoreVertical 
} from 'lucide-react';
import { format } from 'date-fns';
import { conversations as mockConversations } from '@/mockdata/conversations';
import { Button } from '@/components/ui/Button';
const getRoleIcon = (role) => {
    switch(role) {
        case 'patient':
            return <UserRound size={24} className="text-blue-500" />;
        case 'pharmacist':
            return <Pill size={24} className="text-green-500" />;
        case 'doctor':
            return <Stethoscope size={24} className="text-purple-500" />;
        default:
            return <User size={24} className="text-gray-500" />;
    }
};
const getRoleColor = (role) => {
    switch(role) {
        case 'patient':
            return 'bg-blue-500';
        case 'pharmacist':
            return 'bg-green-500';
        case 'doctor':
            return 'bg-purple-500';
        default:
            return 'bg-gray-500';
    }
};
function ConversationItem({ conversation, isActive, onClick }) {
    const { participants, lastMessage, unreadCount } = conversation;
    const otherParticipant = participants.find(p => p.role !== 'doctor');
    if (!otherParticipant) return null;
    return (
        <div 
            onClick={() => onClick(conversation.id)}
            className={`flex items-center p-3 rounded-2xl cursor-pointer transition-colors ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        >
            <div className="relative mr-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getRoleColor(otherParticipant.role)}`}>
                    {otherParticipant.name.charAt(0)}
                </div>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{otherParticipant.name}</span>
                    {lastMessage && (
                        <span className="text-xs text-gray-400">{format(new Date(lastMessage.timestamp), 'h:mm a')}</span>
                    )}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                    {lastMessage ? lastMessage.content : 'No messages yet'}
                </div>
            </div>
        </div>
    );
}
function MessageBubble({ message, isCurrentUser }) {
    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isCurrentUser && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white ${getRoleColor(message.sender.role)}`}>
                    {message.sender.name.charAt(0)}
                </div>
            )}
            <div>
                <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md ${isCurrentUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                    {message.content}
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                    {format(new Date(message.timestamp), 'h:mm a')}
                </div>
            </div>
            {isCurrentUser && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 text-white ${getRoleColor(message.sender.role)}`}>
                    {message.sender.name.charAt(0)}
                </div>
            )}
        </div>
    );
}
export default function ChatInterface() {
    const [activeTab, setActiveTab] = useState('all');
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);
    const [showConversations, setShowConversations] = useState(true);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        const loadConversations = async () => {
            try {
                setLoading(true);
                setError('');
                const data = mockConversations;
                if (!data || data.length === 0) {
                    const mockConversations = [
                        {
                            id: 'conv1',
                            participants: [
                                { id: 'doctor1', name: 'Dr. Smith', role: 'doctor' },
                                { id: 'patient1', name: 'John Doe', role: 'patient' }
                            ],
                            lastMessage: {
                                content: 'How are you feeling today?',
                                timestamp: new Date().toISOString(),
                                sender: { id: 'doctor1', name: 'Dr. Smith', role: 'doctor' }
                            },
                            unreadCount: 0
                        },
                        {
                            id: 'conv2',
                            participants: [
                                { id: 'doctor1', name: 'Dr. Smith', role: 'doctor' },
                                { id: 'patient2', name: 'Jane Smith', role: 'patient' }
                            ],
                            lastMessage: {
                                content: 'I need to reschedule my appointment',
                                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                                sender: { id: 'patient2', name: 'Jane Smith', role: 'patient' }
                            },
                            unreadCount: 2
                        },
                        {
                            id: 'conv3',
                            participants: [
                                { id: 'doctor1', name: 'Dr. Smith', role: 'doctor' },
                                { id: 'pharm1', name: 'Mark Johnson', role: 'pharmacist' }
                            ],
                            lastMessage: {
                                content: 'The medication is now available',
                                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                                sender: { id: 'pharm1', name: 'Mark Johnson', role: 'pharmacist' }
                            },
                            unreadCount: 1
                        }
                    ];
                    setConversations(mockConversations);
                    setActiveConversation(mockConversations[0].id);
                    loadMessages(mockConversations[0].id);
                } else {
                    setConversations(data);
                    if (data.length > 0 && !activeConversation) {
                        setActiveConversation(data[0].id);
                        loadMessages(data[0].id);
                    }
                }
            } catch (err) {
                setError('Failed to load conversations');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadConversations();
    }, []);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    const loadMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const data = mockConversations.find(c => c.id === conversationId);
            if (!data || data.length === 0) {
                const conversation = conversations.find(c => c.id === conversationId);
                if (!conversation) {
                    setMessages([]);
                    return;
                }
                const mockMessages = [
                    {
                        id: 'msg1',
                        conversationId,
                        content: 'Hello, how can I help you today?',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        sender: conversation.participants.find(p => p.role === 'doctor'),
                        recipient: conversation.participants.find(p => p.role !== 'doctor')
                    }
                ];
                if (conversation.lastMessage && conversation.participants.find(p => p.role !== 'doctor')) {
                    mockMessages.push({
                        id: 'msg2',
                        conversationId,
                        content: conversation.lastMessage.content,
                        timestamp: conversation.lastMessage.timestamp,
                        sender: conversation.participants.find(p => p.role !== 'doctor'),
                        recipient: conversation.participants.find(p => p.role === 'doctor')
                    });
                }
                setMessages(mockMessages);
            } else {
                setMessages(data);
            }
            setConversations(conversations.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, unreadCount: 0 } 
                    : conv
            ));
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoadingMessages(false);
        }
    };
    const handleConversationClick = (conversationId) => {
        setActiveConversation(conversationId);
        loadMessages(conversationId);
        if (isMobileView) {
            setShowConversations(false);
        }
    };
    const handleBackClick = () => {
        setShowConversations(true);
    };
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeConversation) return;
        try {
            const activeConv = conversations.find(c => c.id === activeConversation);
            if (!activeConv) return;
            const recipient = activeConv.participants.find(p => p.role !== 'doctor');
            if (!recipient) return;
            const sender = activeConv.participants.find(p => p.role === 'doctor');
            if (!sender) return;
            const messageData = {
                conversationId: activeConversation,
                sender,
                recipient,
                content: newMessage
            };
            const tempMessage = {
                ...messageData,
                id: `temp-${Date.now()}`,
                timestamp: new Date().toISOString(),
                read: false
            };
            setMessages([...messages, tempMessage]);
            setNewMessage('');
            const result = await sendMessage(messageData);
            if (result.success) {
                setMessages(messages => 
                    messages.map(msg => 
                        msg.id === tempMessage.id ? result.data : msg
                    )
                );
                setConversations(conversations => 
                    conversations.map(conv => 
                        conv.id === activeConversation 
                            ? { 
                                ...conv, 
                                lastMessage: {
                                    content: newMessage,
                                    timestamp: new Date().toISOString(),
                                    sender
                                } 
                            } 
                            : conv
                    )
                );
            }
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessages(messages => 
                messages.filter(msg => !msg.id.startsWith('temp-'))
            );
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const filteredConversations = conversations.filter(conversation => {
        const otherParticipant = conversation.participants.find(p => p.role !== 'doctor');
        if (!otherParticipant) return false;
        const nameMatches = typeof otherParticipant.name === 'string'
          ? otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
          : String(otherParticipant.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const roleMatches = 
            activeTab === 'all' || 
            (activeTab === 'patients' && otherParticipant.role === 'patient') ||
            (activeTab === 'pharmacists' && otherParticipant.role === 'pharmacist') ||
            (activeTab === 'doctors' && otherParticipant.role === 'doctor');
        return nameMatches && roleMatches;
    });
    const currentConversation = conversations.find(c => c.id === activeConversation);
    return (
        <div className="flex h-[calc(100vh-200px)] min-h-[500px] overflow-hidden">
            {}
            <div 
                className={`border border-border ${
                    isMobileView 
                        ? showConversations ? 'flex' : 'hidden' 
                        : 'flex'
                } flex-col w-full md:w-1/3 md:max-w-xs`}
            >
                <div className="p-4 border-b border-border">
                    <h2 className="font-bold text-foreground mb-4">
                        Messages
                    </h2>
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="text-foreground bg-background border border-border rounded-2xl px-4 py-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-2 flex items-center">
                                <Search size={18} className="text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b border-border">
                    <div className="flex">
                        <Button
                            className={`${activeTab === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} px-4 py-2`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTabChange(null, 'all');
                            }}
                        >
                            All
                        </Button>
                        <Button
                            className={`${activeTab === 'patients' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} px-4 py-2`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTabChange(null, 'patients');
                            }}
                        >
                            Patients
                        </Button>
                        <Button
                            className={`${activeTab === 'other' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} px-4 py-2`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTabChange(null, 'other');
                            }}
                        >
                            Other
                        </Button>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-center p-4">
                            {searchQuery 
                                ? 'No conversations match your search' 
                                : 'No conversations found'}
                        </div>
                    ) : (
                        <div className="overflow-y-auto">
                            {filteredConversations.map((conversation) => (
                                <div key={conversation.id}>
                                    <ConversationItem
                                        conversation={conversation}
                                        isActive={conversation.id === activeConversation}
                                        onClick={handleConversationClick}
                                    />
                                    <div className="h-px bg-border"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {}
            <div 
                className={`border border-border border-l-0 flex-grow ${
                    isMobileView 
                        ? showConversations ? 'hidden' : 'flex' 
                        : 'flex'
                } flex-col`}
            >
                {activeConversation && currentConversation ? (
                    <>
                        {}
                        <div className="p-4 border-b border-border flex items-center">
                            {isMobileView && (
                                <Button 
                                    onClick={handleBackClick}
                                    className="mr-2"
                                >
                                    <ArrowLeft size={20} />
                                </Button>
                            )}
                            {}
                            {(() => {
                                const otherParticipant = currentConversation.participants.find(
                                    p => p.role !== 'doctor'
                                );
                                return otherParticipant ? (
                                    <>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white ${getRoleColor(otherParticipant.role)}`}>
                                            {otherParticipant.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-foreground">
                                                {otherParticipant.name}
                                            </h3>
                                            <p className="text-muted-foreground capitalize">
                                                {otherParticipant.role}
                                            </p>
                                        </div>
                                    </>
                                ) : null;
                            })()}
                            <div className="ml-auto">
                                <Button>
                                    <MoreVertical size={20} className="text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                        {}
                        <div className="flex-grow p-4 overflow-y-auto bg-background/50">
                            {loadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center items-center h-full text-center">
                                    <p className="text-muted-foreground">
                                        No messages yet. Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-y-auto">
                                    {messages.map((message) => {
                                        const isCurrentUser = message.sender.role === 'doctor';
                                        return (
                                            <MessageBubble
                                                key={message.id}
                                                message={message}
                                                isCurrentUser={isCurrentUser}
                                            />
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                        {}
                        <div className="p-3 border-t border-border bg-card">
                            <div className="flex items-end">
                                <textarea
                                    placeholder="Type a message..."
                                    className="text-foreground bg-background border border-border rounded-2xl px-4 py-2"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                ></textarea>
                                <Button 
                                    className="ml-2 bg-primary text-primary-foreground px-4 py-2 rounded-2xl"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    <Send />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-full text-center">
                        <p className="text-muted-foreground">
                            Select a conversation to start messaging
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 