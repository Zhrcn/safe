'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import { useGetMessagesQuery, useSendMessageMutation } from '@/store/services/patient/patientApi';
import { MessageSquare, Send, User } from 'lucide-react';

const MessageBubble = ({ message, isSent }) => {
  return (
    <Box
      display="flex"
      justifyContent={isSent ? 'flex-end' : 'flex-start'}
      mb={2}
    >
      <Box
        maxWidth="70%"
        bgcolor={isSent ? 'primary.main' : 'grey.100'}
        color={isSent ? 'white' : 'text.primary'}
        p={2}
        borderRadius={2}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography variant="caption" color={isSent ? 'white' : 'text.secondary'}>
          {new Date(message.timestamp).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

const MessagesPage = () => {
  const [newMessage, setNewMessage] = useState('');
  const { data: messages, isLoading, error } = useGetMessagesQuery();
  const [sendMessage] = useSendMessageMutation();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({ content: newMessage }).unwrap();
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error.data?.message || 'Failed to load messages'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Messages</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversations
              </Typography>
              <List>
                {messages?.map((message) => (
                  <ListItem
                    key={message._id}
                    button
                    selected={message.isSelected}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <User size={20} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.sender}
                      secondary={message.lastMessage}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
              {messages?.map((message) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isSent={message.isSent}
                />
              ))}
            </CardContent>
            <Box p={2} borderTop={1} borderColor="divider">
              <form onSubmit={handleSendMessage}>
                <Box display="flex" gap={1}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!newMessage.trim()}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </form>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagesPage; 