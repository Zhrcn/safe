'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, TextField, Button, Avatar, CircularProgress, Badge, IconButton, Tooltip } from '@mui/material';
import { Send, User, Phone, Calendar, RefreshCw, Video } from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { formatDistanceToNow } from 'date-fns';
import { useGetConversationsQuery, useGetConversationByIdQuery, useSendMessageMutation } from '@/store/services/patient/conversationApi';

export default function PatientMessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const { data: conversations = [], isLoading: isLoadingConversations, error: conversationsError, refetch: refetchConversations } = useGetConversationsQuery();
  const { data: selectedConversation, isLoading: isLoadingSelectedConversation, error: selectedConversationError, refetch: refetchSelectedConversation } = useGetConversationByIdQuery(selectedConversationId, { skip: !selectedConversationId });
  const [sendMessage, { isLoading: isSendingMessage, error: sendMessageError }] = useSendMessageMutation();

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId) {
      refetchSelectedConversation();
    }
  }, [selectedConversationId, refetchSelectedConversation]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;

    try {
      await sendMessage({ conversationId: selectedConversationId, content: messageInput }).unwrap();
      setMessageInput('');
      refetchSelectedConversation(); // Refetch messages for the current conversation
      refetchConversations(); // Refetch conversations to update last message/unread count
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle specific error messages if needed, e.g., using notification service
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

  const isLoading = isLoadingConversations || isLoadingSelectedConversation;
  const error = conversationsError || selectedConversationError || sendMessageError;

  return (
    <PatientPageContainer
      title="Messages"
      description="Chat with your healthcare providers"
    >
      {isLoading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="flex justify-center items-center h-64">
          <Typography color="error">{error.message || 'An error occurred'}</Typography>
          <Button 
            startIcon={<RefreshCw size={16} />} 
            onClick={() => {
              refetchConversations();
              if (selectedConversationId) refetchSelectedConversation();
            }}
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
                    onClick={() => handleSelectConversation(conversation.id)}
                    selected={selectedConversationId === conversation.id}
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
                        badgeContent={conversation.unreadCount}
                        invisible={conversation.unreadCount === 0}
                        className="mr-3"
                      >
                        <Avatar
                          src={conversation.participant?.avatar || conversation.participantPhoto}
                          alt={conversation.participant?.name || conversation.participantName}
                          className={`${conversation.participant?.role === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}
                        >
                          {(conversation.participant?.name || conversation.participantName || 'U').charAt(0)}
                        </Avatar>
                      </Badge>
                      <ListItemText
                        primaryTypographyProps={{ component: 'div' }}
                        primary={
                          <Box className="flex justify-between">
                            <Typography variant="body1" component="div" className="font-semibold">
                              {conversation.participant?.name || conversation.participantName}
                            </Typography>
                            <Typography variant="caption" component="div" className="text-muted-foreground">
                              {formatTime(conversation.lastMessage?.timestamp || conversation.updatedAt)}
                            </Typography>
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <Typography variant="body2" component="div" className="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {conversation.lastMessage?.content || ''}
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
                      src={selectedConversation.participant?.avatar || selectedConversation.participantPhoto}
                      className={`${(selectedConversation.participant?.role || selectedConversation.participantRole) === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} mr-3`}
                    >
                      {(selectedConversation.participant?.name || selectedConversation.participantName || 'U').charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div" className="font-semibold">
                        {selectedConversation.participant?.name || selectedConversation.participantName}
                      </Typography>
                      <Typography variant="caption" component="div" className="text-muted-foreground">
                        {(selectedConversation.participant?.role || selectedConversation.participantRole) === 'doctor' ? 'Doctor' : 'Pharmacist'}
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
                    {(selectedConversation.participant?.role || selectedConversation.participantRole) === 'doctor' && (
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
                          src={selectedConversation.participant?.avatar || selectedConversation.participantPhoto}
                          alt={selectedConversation.participant?.name || selectedConversation.participantName}
                          className="h-8 w-8 mr-2 mt-1"
                        >
                          {(selectedConversation.participant?.name || selectedConversation.participantName || 'U').charAt(0)}
                        </Avatar>
                      )}
                      <Box className={`rounded-lg p-3 max-w-[70%] ${
                        message.sender === 'patient' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <Typography variant="body2" component="div">{message.content}</Typography>
                        <Typography 
                          variant="caption" 
                          component="div"
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

                <Box className="p-4 border-t border-border flex items-center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    sx={{
                      mr: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        paddingRight: '8px',
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    endIcon={isSendingMessage ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                    disabled={!messageInput.trim() || isSendingMessage}
                    sx={{
                      borderRadius: '20px',
                      padding: '12px 24px',
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Box className="flex-1 flex items-center justify-center">
                <Typography variant="body1" className="text-muted-foreground">
                  Select a conversation to start chatting.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </PatientPageContainer>
  );
}
