'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
    MessageCircle, Search, Plus, Send, Paperclip, Image, File, 
    MoreVertical, Check, CheckCheck, Archive, Trash2, BellRing, BellOff 
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ScrollArea, ScrollBar } from '@/components/ui/ScrollArea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Separator } from '@/components/ui/Separator';
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/DropdownMenu';
import { conversations as mockConversations } from '@/mockdata/conversations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';

const ConversationCard = ({ conversation, onSelect, isActive }) => {
    const lastMessageTime = new Date(conversation.lastMessageTime);
    const displayTime = format(lastMessageTime, 'h:mm a');
    const displayDate = format(lastMessageTime, 'MMM d, yyyy');
    const isToday = format(new Date(), 'yyyy-MM-dd') === format(lastMessageTime, 'yyyy-MM-dd');

    const title = conversation?.title || 'Untitled Conversation';
    const initials = title.split(' ').map(word => word.charAt(0)).join('').toUpperCase();

    return (
        <Card 
            className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                isActive 
                    ? 'bg-accent/30 border-primary' 
                    : 'border-transparent hover:border-secondary/30'
            }`}
            onClick={() => onSelect(conversation)}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={conversation?.avatar} alt={title} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-semibold truncate text-foreground">
                                {title}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                                {isToday ? displayTime : displayDate}
                            </span>
                        </div>
                        <p className={`text-sm truncate ${
                            conversation?.read 
                                ? 'text-muted-foreground' 
                                : 'font-medium text-foreground'
                        }`}>
                            {conversation?.lastMessage || 'No messages'}
                        </p>
                    </div>
                    {!conversation?.read && (
                        <Badge className="min-w-[20px] h-5 rounded-full flex items-center justify-center p-0 bg-primary text-primary-foreground">
                            <span className="sr-only">New messages</span>
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const MessageBubble = ({ message, isOwn }) => {
    const time = format(new Date(message.timestamp), 'h:mm a');
    
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-lg p-3 ${
                    isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted border border-border'
                }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`text-xs mt-1 ${
                        isOwn 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                    }`}>
                        {time}
                        {isOwn && (
                            <span className="ml-2">
                                {message.read ? <CheckCheck className="inline w-3 h-3" /> : <Check className="inline w-3 h-3" />}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {!isOwn && (
                <Avatar className="h-8 w-8 ml-2 order-2 border-2 border-primary/20">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {message.sender[0]}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

const MessagingPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        // Load mock conversations
        setConversations(mockConversations);
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const updatedConversation = {
            ...selectedConversation,
            messages: [
                ...selectedConversation.messages,
                {
                    id: Date.now(),
                    content: newMessage,
                    timestamp: new Date(),
                    sender: 'You',
                    read: false
                }
            ],
            lastMessage: newMessage,
            lastMessageTime: new Date()
        };

        setSelectedConversation(updatedConversation);
        setConversations(conversations.map(conv => 
            conv.id === updatedConversation.id ? updatedConversation : conv
        ));
        setNewMessage('');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Messaging"
                description="Communicate with your healthcare providers securely"
            />
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
                    {/* Conversations List */}
                    <div className="col-span-12 md:col-span-4 lg:col-span-3">
                        <Card className="h-full border-border">
                            <CardHeader className="p-4 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search conversations..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 border-border focus:border-primary focus:ring-primary/20"
                                        />
                                    </div>
                                    <Button 
                                        size="icon" 
                                        variant="ghost"
                                        className="text-primary hover:bg-primary/10"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <ScrollArea className="h-[calc(100%-80px)]">
                                <div className="p-2 space-y-2">
                                    {filteredConversations.map((conversation) => (
                                        <ConversationCard
                                            key={conversation.id}
                                            conversation={conversation}
                                            onSelect={handleConversationSelect}
                                            isActive={selectedConversation?.id === conversation.id}
                                        />
                                    ))}
                                </div>
                                <ScrollBar />
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* Chat Area */}
                    <div className="col-span-12 md:col-span-8 lg:col-span-9">
                        <Card className="h-full flex flex-col border-border">
                            {selectedConversation ? (
                                <>
                                    <CardHeader className="p-4 border-b border-border">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.title} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {selectedConversation.title[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{selectedConversation.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {selectedConversation.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="text-primary hover:bg-primary/10"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="border-border">
                                                    <DropdownMenuItem className="text-foreground hover:bg-primary/10">
                                                        <Archive className="w-4 h-4 mr-2 text-primary" />
                                                        Archive
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-foreground hover:bg-primary/10">
                                                        <BellOff className="w-4 h-4 mr-2 text-primary" />
                                                        Mute
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="border-border" />
                                                    <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <ScrollArea className="flex-1 p-4">
                                        <div className="space-y-4">
                                            {selectedConversation.messages.map((message) => (
                                                <MessageBubble
                                                    key={message.id}
                                                    message={message}
                                                    isOwn={message.sender === 'You'}
                                                />
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </ScrollArea>
                                    <div className="p-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="text-primary hover:bg-primary/10"
                                            >
                                                <Paperclip className="w-4 h-4" />
                                            </Button>
                                            <Input
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                className="flex-1 border-border focus:border-primary focus:ring-primary/20"
                                            />
                                            <Button 
                                                onClick={handleSendMessage}
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2 text-foreground">No conversation selected</h3>
                                        <p className="text-muted-foreground">
                                            Select a conversation from the list to start messaging
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingPage; 