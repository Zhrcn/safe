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
  Paper,
  InputAdornment,
  CircularProgress,
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
  ArrowBack as ArrowBackIcon,
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
      px={2}
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
          boxShadow: theme.shadows[1],
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            [isOwn ? 'right' : 'left']: -8,
            width: 0,
            height: 0,
            border: '8px solid transparent',
            borderTopColor: isOwn 
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.background.paper, 0.8),
            borderBottom: 0,
            marginLeft: '-8px',
            marginBottom: '-8px',
          }
        }}
      >
        {!isOwn && (
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            {message.sender}
          </Typography>
        )}
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {message.content}
        </Typography>
        {message.attachments && message.attachments.length > 0 && (
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
            {message.attachments.map((attachment, index) => (
              <Chip
                key={index}
                icon={<AttachFileIcon />}
                label={attachment.name}
                size="small"
                onClick={() => window.open(attachment.url, '_blank')}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              />
            ))}
          </Stack>
        )}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          display="block" 
          mt={1}
          sx={{ textAlign: isOwn ? 'right' : 'left' }}
        >
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
  const [isTyping, setIsTyping] = useState(false);

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
        <Stack spacing={2} alignItems="center">
          <ChatIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Select a chat to start messaging
          </Typography>
        </Stack>
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
          bgcolor: 'background.paper',
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
          <Stack direction="row" spacing={1}>
            <Tooltip title="Start Video Call">
              <IconButton>
                <VideoCallIcon />
                      </IconButton>
                    </Tooltip>
            <Tooltip title="More Options">
              <IconButton>
                <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
          </Stack>
                  </Box>
                </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: alpha(theme.palette.background.default, 0.3),
        }}
      >
        {selectedChat.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isOwn={message.sender === 'You'}
          />
        ))}
        {isTyping && (
          <Box display="flex" alignItems="center" gap={1} px={2} mb={2}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              {selectedChat.name} is typing...
                        </Typography>
                      </Box>
                      )}
        <div ref={messagesEndRef} />
                </Box>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box display="flex" gap={1}>
          <Tooltip title="Attach File">
            <IconButton>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              }
            }}
          />
          <Tooltip title="Send Message">
            <span>
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <SendIcon />
              </IconButton>
            </span>
          </Tooltip>
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
        bgcolor: 'background.paper',
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
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
            }
          }}
        />
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredChats.map((chat) => (
          <ListItem
            key={chat.id}
            selected={selectedChat?.id === chat.id}
            onClick={() => onSelectChat(chat)}
            sx={{
              cursor: 'pointer',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }
                      }
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
                <Avatar 
                  src={chat.avatar || '/images/default-avatar.png'} 
                  alt={chat.name}
                />
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      // Reset to chat list view on mobile when screen size changes
      if (window.innerWidth < 768) {
        setShowChatList(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSelectChat = (chat, query) => {
    if (query !== undefined) {
      setSearchQuery(query);
      return;
    }
    setSelectedChat(chat);
    if (isMobileView) {
      setShowChatList(false);
    }
    // Mark messages as read when selecting a chat
    if (chat) {
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const handleBackToChatList = () => {
    setShowChatList(true);
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
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      maxWidth: '1400px', 
      margin: '0 auto',
      height: 'calc(100vh - 100px)',
      minHeight: '600px'
    }}>
      <PageHeader
        title="Messaging"
        subtitle="Communicate with your healthcare providers"
      />

      <Box sx={{ 
        height: 'calc(100% - 80px)',
        mt: 2,
        display: 'flex',
        gap: 2,
        position: 'relative'
      }}>
        {/* Chat List */}
        <Box sx={{ 
          width: { xs: '100%', md: '350px' },
          display: { xs: showChatList ? 'block' : 'none', md: 'block' },
          height: '100%',
          position: { xs: 'absolute', md: 'relative' },
          left: 0,
          top: 0,
          zIndex: { xs: showChatList ? 1 : 0, md: 1 },
          bgcolor: 'background.paper',
          boxShadow: { xs: showChatList ? 3 : 0, md: 0 },
          transition: 'all 0.3s ease-in-out',
        }}>
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            searchQuery={searchQuery}
          />
        </Box>

        {/* Chat Window */}
        <Box sx={{ 
          flex: 1,
          display: { xs: showChatList ? 'none' : 'block', md: 'block' },
          height: '100%',
          position: 'relative'
        }}>
          {isMobileView && !showChatList && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              zIndex: 2,
              p: 1,
              bgcolor: 'background.paper',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <IconButton
                onClick={handleBackToChatList}
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="subtitle1" noWrap>
                {selectedChat?.name}
                </Typography>
              </Box>
            )}
          <Box sx={{ 
            height: '100%',
            pt: isMobileView && !showChatList ? '48px' : 0
          }}>
            <ChatWindow
              selectedChat={selectedChat}
              onSendMessage={handleSendMessage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagingPage;
