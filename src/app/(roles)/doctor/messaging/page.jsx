'use client';

import { Typography, Box, Paper, Grid, List, ListItem, ListItemText, Divider, TextField, InputAdornment, IconButton } from '@mui/material';
import { MessageSquare, Send, User, Search } from 'lucide-react';
import { useState } from 'react';

// Mock Conversation Data
const mockConversations = [
  { id: 1, patientName: 'Patient A', lastMessage: 'Okay, see you then.', time: '10:30 AM' },
  { id: 2, patientName: 'Patient B', lastMessage: 'Thanks, Doctor.', time: 'Yesterday' },
  { id: 3, patientName: 'Patient C', lastMessage: 'Is the prescription ready?', time: '2024-06-19' },
];

// Mock Message Data for a specific conversation (e.g., Patient A)
const mockMessages = [
  { id: 1, sender: 'Patient A', text: 'Hello Doctor, I have a question about my medication.', time: '10:25 AM' },
  { id: 2, sender: 'Doctor', text: 'Hi Patient A, I received your message. What is your question?', time: '10:28 AM' },
  { id: 3, sender: 'Patient A', text: 'It\'s about the dosage schedule.', time: '10:30 AM' },
];

// Placeholder Conversation List Component
function ConversationList({
  conversations,
  onSelectConversation,
  selectedConversationId
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} className="h-full flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> {/* Theme-aware styling */}
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700"> {/* Theme-aware border */}
        <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">Conversations</Typography> {/* Theme-aware text */}
      </Box>
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700"> {/* Theme-aware border */}
        <TextField
          fullWidth
          placeholder="Search conversations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} className="text-gray-500 dark:text-gray-400"/> {/* Theme-aware icon */}
              </InputAdornment>
            ),
            className: 'text-gray-900 dark:text-white', // Theme-aware input text
          }}
          InputLabelProps={{
             style: { color: 'inherit' }, // Inherit color to work with theme-aware label
          }}
           sx={{
              '& .MuiOutlinedInput-root': { // Style the input border
                  fieldset: { borderColor: '#d1d5db' }, // Default border
                  '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                   '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                    // Dark theme borders
                    '.dark & .MuiOutlinedInput-notchedOutline': {
                         borderColor: '#4b5563',
                   },
                   '.dark &:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6b7280',
                   },
                   '.dark &.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#60a5fa',
                   },
              },
               '& .MuiInputBase-input::placeholder': {
                   color: '#9ca3af', // Default placeholder color
                   opacity: 1, // Ensure placeholder is visible
                   '.dark & ': {
                        color: '#6b7280',
                   },
               },
               '& .MuiInputLabel-outlined': {
                    color: '#6b7280', // Default label color
                     '.dark & ': {
                         color: '#9ca3af',
                   },
               },
           }}
        />
      </Box>
      <div className="flex-1 overflow-y-auto">
        <List>
          {filteredConversations.length === 0 ? (
            <ListItem>
              <ListItemText primary="No conversations found." className="text-gray-500 dark:text-gray-400"/> {/* Theme-aware text */}
            </ListItem>
          ) : (
            filteredConversations.map((conversation) => (
              <ListItem
                button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                selected={selectedConversationId === conversation.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" // Theme-aware border and hover
                 sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e0e0e0', // Default selected background
                    '.dark & ': {
                        backgroundColor: '#4a5568',
                    },
                  },
                  '&.Mui-selected:hover': {
                     backgroundColor: '#d5d5d5', // Default selected hover background
                     '.dark & ': {
                          backgroundColor: '#4a5568',
                     },
                   },
                }}
              >
                <ListItemText
                  primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{conversation.patientName}</Typography>} // Theme-aware text
                  secondary={<Typography variant="body2" className="text-gray-700 dark:text-gray-300">{conversation.lastMessage} - {conversation.time}</Typography>} // Theme-aware text
                />
              </ListItem>
            ))
          )}
        </List>
      </div>
    </Paper>
  );
}

// Placeholder Message Display Component
function MessageDisplay({
  messages
}) {
  // In a real app, replace with dynamic messages for the selected conversation
  return (
    <Paper elevation={3} className="h-full flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> {/* Theme-aware styling */}
      <Box className="p-4 border-b border-gray-200 dark:border-gray-700"> {/* Theme-aware border */}
        <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">Conversation with Patient A</Typography> {/* Theme-aware text - replace with selected patient name */}
      </Box>
      <Box className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <Typography className="text-gray-500 dark:text-gray-400">No messages yet.</Typography> // Theme-aware text
        ) : (
          messages.map(message => (
            <Box key={message.id} className={`flex ${message.sender === 'Doctor' ? 'justify-end' : 'justify-start'}`}> {/* Align messages based on sender */}
              <Box className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'Doctor' ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'}`}> {/* Themed message bubble */}
                <Typography variant="body2">{message.text}</Typography>
                <Typography variant="caption" className={`mt-1 block text-right ${message.sender === 'Doctor' ? 'text-blue-100 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}> {/* Themed timestamp */}
                  {message.time}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}

// Placeholder Message Input Component
function MessageInput({
  onSendMessage
}) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Paper elevation={3} className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"> {/* Theme-aware styling */}
      <Box className="flex items-center space-x-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
           InputProps={{
            className: 'text-gray-900 dark:text-white',
          }}
          InputLabelProps={{
             style: { color: 'inherit' },
          }}
           sx={{
              '& .MuiOutlinedInput-root': {
                  fieldset: { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#9ca3af' },
                   '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    '.dark & .MuiOutlinedInput-notchedOutline': {
                         borderColor: '#4b5563',
                   },
                   '.dark &:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6b7280',
                   },
                   '.dark &.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#60a5fa',
                   },
              },
               '& .MuiInputBase-input::placeholder': {
                   color: '#9ca3af',
                   opacity: 1,
                   '.dark & ': {
                        color: '#6b7280',
                   },
               },
               '& .MuiInputLabel-outlined': {
                    color: '#6b7280',
                     '.dark & ': {
                         color: '#9ca3af',
                   },
               },
           }}
        />
        <IconButton color="primary" onClick={handleSendMessage} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
          <Send size={24} />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default function DoctorMessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(mockConversations[0]?.id || null);
  const [messages, setMessages] = useState(mockMessages); // Replace with fetching messages for selectedConversationId

  // In a real app, you would fetch messages based on selectedConversationId
  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    // Fetch messages for this conversation
    // For now, use mockMessages
    setMessages(mockMessages); 
  };

  const handleSendMessage = (text) => {
    console.log('Sending message:', text);
    // Implement send message logic (API call)
    // For now, add to mock messages
    const newMessage = { id: messages.length + 1, sender: 'Doctor', text, time: 'Now' };
    setMessages([...messages, newMessage]);
  };

  return (
    <Box sx={{ p: 3 }}> {/* Added padding to the outer Box */}
      <Paper elevation={3} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md h-[80vh] flex"> {/* Set a fixed height and ensure flex display */}
        {/* Conversation List Sidebar */}
        <Box className="w-1/4 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full"> {/* Theme-aware border, ensure flex column, and take full height */}
          <ConversationList
            conversations={mockConversations} // Replace with fetched conversations
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
          />
        </Box>

        {/* Message Display and Input Area */}
        <Box className="flex-1 flex flex-col"> {/* Flex column to stack messages and input */}
          <Box className="flex-1 overflow-y-auto"> {/* Message Display Area */}
             <MessageDisplay messages={messages} /> {/* Pass messages */}
          </Box>

          <Box className="p-4 border-t border-gray-200 dark:border-gray-700"> {/* Message Input Area with top border */}
             <MessageInput onSendMessage={handleSendMessage} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 