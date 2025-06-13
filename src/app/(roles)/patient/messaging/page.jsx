'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  VideoCall as VideoCallIcon,
  Chat as ChatIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';

const MessageBubble = ({ message, isOwn }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent={isOwn ? 'flex-end' : 'flex-start'}
      mb={2}
    >
      <Box
        sx={{
          maxWidth: '70%',
          p: 2,
          borderRadius: 2,
          bgcolor: isOwn 
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {!isOwn && (
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            {message.sender}
          </Typography>
        )}
        <Typography variant="body1">
          {message.content}
        </Typography>
        {message.attachments && message.attachments.length > 0 && (
          <Stack direction="row" spacing={1} mt={1}>
            {message.attachments.map((attachment, index) => (
              <Chip
                key={index}
                icon={<AttachFileIcon />}
                label={attachment.name}
                size="small"
                onClick={() => window.open(attachment.url, '_blank')}
              />
            ))}
          </Stack>
        )}
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

const ChatWindow = ({ selectedChat, onSendMessage }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedChat) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        sx={{
          bgcolor: alpha(theme.palette.background.default, 0.5),
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha(theme.palette.background.default, 0.5),
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={selectedChat.avatar} />
          <Box flex={1}>
            <Typography variant="h6">
              {selectedChat.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedChat.role}
            </Typography>
          </Box>
          <IconButton>
            <VideoCallIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
        }}
      >
        {selectedChat.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isOwn={message.sender === 'You'}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box display="flex" gap={1}>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

const ChatList = ({ chats, selectedChat, onSelectChat, searchQuery }) => {
  const theme = useTheme();

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha(theme.palette.background.default, 0.5),
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSelectChat(null, e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          size="small"
        />
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredChats.map((chat) => (
          <ListItem
            key={chat.id}
            button
            selected={selectedChat?.id === chat.id}
            onClick={() => onSelectChat(chat)}
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <CircleIcon
                    sx={{
                      fontSize: 12,
                      color: chat.online ? 'success.main' : 'grey.500',
                    }}
                  />
                }
              >
                <Avatar src={chat.avatar} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={chat.role}
              primaryTypographyProps={{
                fontWeight: chat.unread ? 'bold' : 'normal',
              }}
              secondaryTypographyProps={{
                color: chat.unread ? 'primary' : 'text.secondary',
              }}
            />
            {chat.unread && (
              <Chip
                label={chat.unread}
                color="primary"
                size="small"
                sx={{ minWidth: 20, height: 20 }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const MessagingPage = () => {
  const theme = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState(mockPatientData.messages);

  const handleSelectChat = (chat, query) => {
    if (query !== undefined) {
      setSearchQuery(query);
      return;
    }
    setSelectedChat(chat);
    // Mark messages as read when selecting a chat
    if (chat) {
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const handleSendMessage = (content) => {
    if (!selectedChat) return;

    const newMessage = {
      sender: 'You',
      content,
      timestamp: new Date().toISOString(),
      attachments: []
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: content,
              lastMessageTime: 'Just now'
            }
          : chat
      )
    );

    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: content,
      lastMessageTime: 'Just now'
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        title="Messaging"
        subtitle="Communicate with your healthcare providers"
      />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            searchQuery={searchQuery}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <ChatWindow
            selectedChat={selectedChat}
            onSendMessage={handleSendMessage}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessagingPage;
