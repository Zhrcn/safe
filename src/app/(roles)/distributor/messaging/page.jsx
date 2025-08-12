"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MessageSquare } from 'lucide-react';
import ChatList from '@/components/messaging/ChatList';
import ChatPage from '@/components/messaging/ChatPage';
import axiosInstance from '@/store/services/axiosInstance';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/user/userSlice';

export default function DistributorMessagingPage() {
  const user = useSelector(selectUser);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/conversations?role=pharmacist')
      .then(res => {
        setConversations(res.data.data || []);
        setError('');
      })
      .catch(() => setError('Failed to load conversations'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setNewMessage('');
  };

  const handleSend = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    setSending(true);
    try {
      await axiosInstance.post(`/conversations/${selectedConversation._id}/messages`, {
        content: newMessage,
      });
      const res = await axiosInstance.get(`/conversations/${selectedConversation._id}`);
      setSelectedConversation(res.data.data);
      setConversations(convs => convs.map(c => c._id === res.data.data._id ? res.data.data : c));
      setNewMessage('');
    } catch {
      setError('Failed to send message');
    }
    setSending(false);
  };

  const handleInputChange = (e) => setNewMessage(e.target.value);

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    return (conv.title || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <MessageSquare className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl font-bold">Messaging (Pharmacists Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[70vh]">
            <div className="w-80 border-r pr-4 h-full">
              <ChatList
                conversations={filteredConversations}
                selectedId={selectedConversation?._id}
                onSelect={handleSelectConversation}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentUser={user}
              />
            </div>
            <div className="flex-1 h-full">
              {selectedConversation ? (
                <ChatPage
                  conversation={selectedConversation}
                  onSend={handleSend}
                  newMessage={newMessage}
                  onInputChange={handleInputChange}
                  currentUser={user}
                  loading={loading}
                  error={error}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation to start chatting.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 