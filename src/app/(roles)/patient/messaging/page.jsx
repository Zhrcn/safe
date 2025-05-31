'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, TextField, Button, Avatar, CircularProgress, Badge, IconButton, Tooltip } from '@mui/material';
import { Send, User, Phone, Calendar, RefreshCw, Video } from 'lucide-react';
import { getConversations, getConversation, sendMessage } from '@/services/patientService';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { formatDistanceToNow } from 'date-fns';

export default function PatientMessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
        if (data.length > 0) {
          await selectConversation(data[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  const selectConversation = async (conversationId) => {
    try {
      const conversation = await getConversation(conversationId);
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation messages. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      const newMessage = await sendMessage(selectedConversation.id, messageInput);
      
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: messageInput,
        lastMessageDate: new Date().toISOString()
      }));
      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <PatientPageContainer
      title="Messages"
      description="Chat with your healthcare providers"
    >
      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="flex justify-center items-center h-64">
          <Typography color="error">{error}</Typography>
          <Button 
            startIcon={<RefreshCw size={16} />} 
            onClick={() => window.location.reload()}
            className="ml-2"
          >
            Retry
          </Button>
        </Box>
      ) : (
        <Paper elevation={3} className="bg-card text-card-foreground rounded-lg shadow-md h-[calc(100vh-240px)] flex">
          <Box className="w-1/3 md:w-1/4 border-r border-border overflow-y-auto">
            <Box className="p-4 border-b border-border">
              <Typography variant="h6" className="font-semibold">Conversations</Typography>
            </Box>
            <List disablePadding>
              {conversations.length === 0 ? (
                <Box className="p-4 text-center">
                  <Typography variant="body2" className="text-muted-foreground">
                    No conversations yet
                  </Typography>
                </Box>
              ) : (
                conversations.map((conversation) => (
                  <ListItem
                    button
                    key={conversation.id}
                    onClick={() => selectConversation(conversation.id)}
                    selected={selectedConversation?.id === conversation.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'var(--muted)',
                        '&:hover': {
                          backgroundColor: 'var(--muted)',
                        }
                      }
                    }}
                  >
                    <Box className="flex items-center w-full">
                      <Badge
                        color="primary"
                        badgeContent={conversation.unread}
                        invisible={conversation.unread === 0}
                        className="mr-3"
                      >
                        <Avatar
                          src={conversation.participantPhoto}
                          alt={conversation.participantName}
                          className={`${conversation.participantRole === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}
                        >
                          {conversation.participantName.charAt(0)}
                        </Avatar>
                      </Badge>
                      <ListItemText
                        primary={
                          <Box className="flex justify-between">
                            <Typography variant="body1" className="font-semibold">
                              {conversation.participantName}
                            </Typography>
                            <Typography variant="caption" className="text-muted-foreground">
                              {formatTime(conversation.lastMessageDate)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" className="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {conversation.lastMessage}
                          </Typography>
                        }
                      />
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          </Box>

          <Box className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <Box className="p-4 border-b border-border bg-muted/50 flex justify-between items-center">
                  <Box className="flex items-center">
                    <Avatar
                      src={selectedConversation.participantPhoto}
                      className={`${selectedConversation.participantRole === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} mr-3`}
                    >
                      {selectedConversation.participantName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" className="font-semibold">
                        {selectedConversation.participantName}
                      </Typography>
                      <Typography variant="caption" className="text-muted-foreground">
                        {selectedConversation.participantRole === 'doctor' ? 'Doctor' : 'Pharmacist'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Video call">
                      <IconButton className="text-muted-foreground hover:text-foreground">
                        <Video size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Voice call">
                      <IconButton className="text-muted-foreground hover:text-foreground">
                        <Phone size={20} />
                      </IconButton>
                    </Tooltip>
                    {selectedConversation.participantRole === 'doctor' && (
                      <Tooltip title="Schedule appointment">
                        <IconButton className="text-muted-foreground hover:text-foreground">
                          <Calendar size={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                <Box className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <Box key={message.id} className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender !== 'patient' && (
                        <Avatar
                          src={selectedConversation.participantPhoto}
                          alt={selectedConversation.participantName}
                          className="h-8 w-8 mr-2 mt-1"
                        >
                          {selectedConversation.participantName.charAt(0)}
                        </Avatar>
                      )}
                      <Box className={`rounded-lg p-3 max-w-[70%] ${
                        message.sender === 'patient' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <Typography variant="body2">{message.content}</Typography>
                        <Typography 
                          variant="caption" 
                          className={`mt-1 block ${
                            message.sender === 'patient' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`} 
                          align={message.sender === 'patient' ? 'right' : 'left'}
                        >
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Box>
                      {message.sender === 'patient' && (
                        <Avatar className="h-8 w-8 ml-2 mt-1 bg-primary/20 text-primary">
                          <User size={16} />
                        </Avatar>
                      )}
                    </Box>
                  ))}
                </Box>

                <Box className="p-4 border-t border-border flex items-center space-x-3 bg-background">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    multiline
                    maxRows={3}
                    disabled={sendingMessage}
                    InputProps={{
                      className: 'text-foreground bg-background',
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleSendMessage} 
                    disabled={!messageInput.trim() || sendingMessage}
                    endIcon={sendingMessage ? <CircularProgress size={16} /> : <Send size={16} />}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Box className="flex-1 flex items-center justify-center">
                <Typography variant="h6" className="text-muted-foreground">
                  Select a conversation to view messages
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </PatientPageContainer>
  );
}
