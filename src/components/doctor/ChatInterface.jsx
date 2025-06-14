'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar, 
    Divider, 
    IconButton, 
    Badge, 
    InputAdornment,
    CircularProgress,
    Tabs,
    Tab,
    Alert
} from '@mui/material';
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
        <ListItem 
            button 
            onClick={() => onClick(conversation.id)}
            className={`rounded-md transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
        >
            <ListItemAvatar>
                <Badge 
                    color="error" 
                    badgeContent={unreadCount} 
                    invisible={unreadCount === 0}
                    overlap="circular"
                >
                    <Avatar className={getRoleColor(otherParticipant.role)}>
                        {otherParticipant.name.charAt(0)}
                    </Avatar>
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box className="flex justify-between">
                        <Typography variant="subtitle2" className="font-medium text-foreground">
                            {otherParticipant.name}
                        </Typography>
                        {lastMessage && (
                            <Typography variant="caption" className="text-muted-foreground">
                                {format(new Date(lastMessage.timestamp), 'h:mm a')}
                            </Typography>
                        )}
                    </Box>
                }
                secondary={
                    <Typography 
                        variant="body2" 
                        className="text-muted-foreground truncate"
                        sx={{ maxWidth: '200px' }}
                    >
                        {lastMessage ? lastMessage.content : 'No messages yet'}
                    </Typography>
                }
            />
        </ListItem>
    );
}

function MessageBubble({ message, isCurrentUser }) {
    return (
        <Box 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            {!isCurrentUser && (
                <Avatar 
                    className={`mr-2 ${getRoleColor(message.sender.role)}`}
                    sx={{ width: 32, height: 32 }}
                >
                    {message.sender.name.charAt(0)}
                </Avatar>
            )}
            <Box>
                <Box 
                    className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${
                        isCurrentUser 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-muted text-muted-foreground rounded-bl-none'
                    }`}
                >
                    <Typography variant="body1">
                        {message.content}
                    </Typography>
                </Box>
                <Typography 
                    variant="caption" 
                    className="text-muted-foreground"
                    sx={{ ml: isCurrentUser ? 0 : 1, mr: isCurrentUser ? 1 : 0 }}
                >
                    {format(new Date(message.timestamp), 'h:mm a')}
                </Typography>
            </Box>
            {isCurrentUser && (
                <Avatar 
                    className={`ml-2 ${getRoleColor(message.sender.role)}`}
                    sx={{ width: 32, height: 32 }}
                >
                    {message.sender.name.charAt(0)}
                </Avatar>
            )}
        </Box>
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
        
        const nameMatches = otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase());
                const roleMatches = 
            activeTab === 'all' || 
            (activeTab === 'patients' && otherParticipant.role === 'patient') ||
            (activeTab === 'pharmacists' && otherParticipant.role === 'pharmacist') ||
            (activeTab === 'doctors' && otherParticipant.role === 'doctor');
        
        return nameMatches && roleMatches;
    });

    const currentConversation = conversations.find(c => c.id === activeConversation);

    return (
        <Box className="flex h-[calc(100vh-200px)] min-h-[500px] overflow-hidden">
            {/* Conversation List */}
            <Paper 
                className={`border border-border ${
                    isMobileView 
                        ? showConversations ? 'flex' : 'hidden' 
                        : 'flex'
                } flex-col w-full md:w-1/3 md:max-w-xs`}
            >
                <Box className="p-4 border-b border-border">
                    <Typography variant="h6" className="font-bold text-foreground mb-4">
                        Messages
                    </Typography>
                    <TextField
                        placeholder="Search conversations..."
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} className="text-muted-foreground" />
                                </InputAdornment>
                            ),
                            className: "text-foreground"
                        }}
                        className="bg-background"
                    />
                </Box>
                
                <Box className="border-b border-border">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        TabIndicatorProps={{ style: { backgroundColor: 'var(--primary)' } }}
                    >
                        <Tab 
                            label="All" 
                            value="all" 
                            className={activeTab === 'all' ? 'text-primary' : 'text-muted-foreground'}
                        />
                        <Tab 
                            label="Patients" 
                            value="patients" 
                            className={activeTab === 'patients' ? 'text-primary' : 'text-muted-foreground'}
                        />
                        <Tab 
                            label="Other" 
                            value="other" 
                            className={activeTab === 'other' ? 'text-primary' : 'text-muted-foreground'}
                        />
                    </Tabs>
                </Box>
                
                <Box className="flex-grow overflow-y-auto">
                    {loading ? (
                        <Box className="flex justify-center items-center h-full">
                            <CircularProgress size={24} />
                        </Box>
                    ) : filteredConversations.length === 0 ? (
                        <Box className="flex justify-center items-center h-full text-center p-4">
                            <Typography className="text-muted-foreground">
                                {searchQuery 
                                    ? 'No conversations match your search' 
                                    : 'No conversations found'}
                            </Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {filteredConversations.map((conversation) => (
                                <React.Fragment key={conversation.id}>
                                    <ConversationItem
                                        conversation={conversation}
                                        isActive={conversation.id === activeConversation}
                                        onClick={handleConversationClick}
                                    />
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>
            </Paper>

            {/* Messages */}
            <Paper 
                className={`border border-border border-l-0 flex-grow ${
                    isMobileView 
                        ? showConversations ? 'hidden' : 'flex' 
                        : 'flex'
                } flex-col`}
            >
                {activeConversation && currentConversation ? (
                    <>
                        {/* Conversation Header */}
                        <Box className="p-4 border-b border-border flex items-center">
                            {isMobileView && (
                                <IconButton 
                                    onClick={handleBackClick}
                                    className="mr-2"
                                    size="small"
                                >
                                    <ArrowLeft size={20} />
                                </IconButton>
                            )}
                            
                            {/* Find the other participant */}
                            {(() => {
                                const otherParticipant = currentConversation.participants.find(
                                    p => p.role !== 'doctor'
                                );
                                
                                return otherParticipant ? (
                                    <>
                                        <Avatar className={getRoleColor(otherParticipant.role)}>
                                            {otherParticipant.name.charAt(0)}
                                        </Avatar>
                                        <Box className="ml-3">
                                            <Typography variant="subtitle1" className="font-medium text-foreground">
                                                {otherParticipant.name}
                                            </Typography>
                                            <Typography variant="body2" className="text-muted-foreground capitalize">
                                                {otherParticipant.role}
                                            </Typography>
                                        </Box>
                                    </>
                                ) : null;
                            })()}
                            
                            <Box className="ml-auto">
                                <IconButton size="small">
                                    <MoreVertical size={20} className="text-muted-foreground" />
                                </IconButton>
                            </Box>
                        </Box>
                        
                        {/* Messages */}
                        <Box className="flex-grow p-4 overflow-y-auto bg-background/50">
                            {loadingMessages ? (
                                <Box className="flex justify-center items-center h-full">
                                    <CircularProgress size={24} />
                                </Box>
                            ) : messages.length === 0 ? (
                                <Box className="flex justify-center items-center h-full text-center">
                                    <Typography className="text-muted-foreground">
                                        No messages yet. Start the conversation!
                                    </Typography>
                                </Box>
                            ) : (
                                messages.map((message) => {
                                    const isCurrentUser = message.sender.role === 'doctor';
                                    
                                    return (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            isCurrentUser={isCurrentUser}
                                        />
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </Box>
                        
                        {/* Message Input */}
                        <Box className="p-3 border-t border-border bg-card">
                            <Box className="flex items-end">
                                <TextField
                                    placeholder="Type a message..."
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    InputProps={{
                                        className: "text-foreground bg-background"
                                    }}
                                />
                                <IconButton 
                                    color="primary" 
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="ml-2"
                                >
                                    <Send />
                                </IconButton>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box className="flex justify-center items-center h-full text-center">
                        <Typography className="text-muted-foreground">
                            Select a conversation to start messaging
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
} 