'use client';

import { Typography, Box, Paper, List, ListItem, ListItemText, TextField, Button, Divider } from '@mui/material';
import { Send } from 'lucide-react';
import { useState } from 'react';

// Mock Conversation Data (replace with actual data fetching)
const mockConversations = [
  { id: 1, participant: 'Dr. Ahmad Al-Ali', lastMessage: 'See you next week.', time: '10:30 AM' },
  { id: 2, participant: 'Downtown Pharmacy', lastMessage: 'Your prescription is ready.', time: 'Yesterday' },
  { id: 3, participant: 'Dr. Maria Garcia', lastMessage: 'Please send the lab results.', time: '2 days ago' },
];

// Mock Message Data for a selected conversation (replace with actual data fetching)
const mockMessages = [
  { id: 1, sender: 'Doctor', text: 'Hello Patient A, how are you feeling today?', time: '10:00 AM' },
  { id: 2, sender: 'Patient', text: 'I am feeling better, thank you for asking.', time: '10:05 AM' },
  { id: 3, sender: 'Doctor', text: 'That is good to hear. Your test results came back...', time: '10:10 AM' },
];

export default function PatientMessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]); // Select the first conversation by default
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Implement sending message logic here (API call)
      console.log('Sending message:', messageInput);
      setMessageInput('');
      // In a real app, you would update the messages list after sending
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md h-[80vh] flex"> {/* Theme-aware background, shadow, and fixed height for layout */}
        <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white font-bold absolute top-4 left-4"> {/* Positioned absolute to not affect flex layout */}
          Patient Messaging
        </Typography>
        {/* Removed the paragraph text as the layout will now fill the space */}

        <Box className="flex flex-1 mt-12"> {/* Container for messaging layout, added margin top to clear the title */}
          {/* Conversations List (Sidebar) */}
          <Box className="w-1/4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"> {/* Theme-aware border and overflow */}
            <List>
              {mockConversations.map((conversation) => (
                <ListItem
                  button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  selected={selectedConversation?.id === conversation.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" // Theme-aware borders and hover
                   sx={{
                     '&.Mui-selected': {
                       backgroundColor: '#e0e0e0', // Light gray background for selected in light mode
                       '.dark & ': {
                         backgroundColor: '#424242', // Darker gray in dark mode
                       }
                     },
                     '&.Mui-selected:hover': {
                        backgroundColor: '#d5d5d5', // Slightly darker hover in light mode
                        '.dark & ': {
                           backgroundColor: '#525252', // Slightly darker hover in dark mode
                        }
                     }
                   }}
                >
                  <ListItemText
                    primary={<Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">{conversation.participant}</Typography>} // Theme-aware text
                    secondary={
                      <Box className="flex justify-between">
                        <Typography variant="body2" className="text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap mr-2">{conversation.lastMessage}</Typography> {/* Theme-aware text */}
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">{conversation.time}</Typography> {/* Theme-aware text */}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Active Chat Area */}
          <Box className="flex-1 flex flex-col"> {/* Column layout for messages and input */}
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <Box className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"> {/* Theme-aware background and border */}
                  <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">{selectedConversation.participant}</Typography> {/* Theme-aware text */}
                </Box>

                {/* Messages Display Area */}
                <Box className="flex-1 overflow-y-auto p-4 space-y-4"> {/* Theme-aware background (inherits from Paper), padding, and spacing */}
                   {mockMessages.map((message) => (
                     <Box key={message.id} className={`flex ${message.sender === 'Patient' ? 'justify-end' : 'justify-start'}`}> {/* Align messages */} {/* Theme-aware message bubble */}
                        <Box className={`rounded-lg p-3 max-w-[70%] ${message.sender === 'Patient' ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white'}`}> {/* Themed bubble colors */}
                           <Typography variant="body2">{message.text}</Typography>
                           <Typography variant="caption" className={`mt-1 block ${message.sender === 'Patient' ? 'text-blue-100 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}`} align={message.sender === 'Patient' ? 'right' : 'left'}> {/* Themed timestamp color */}
                              {message.time}
                           </Typography>
                        </Box>
                     </Box>
                   ))}
                </Box>

                {/* Message Input Area */}
                <Box className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700"> {/* Theme-aware background, border, spacing, and alignment */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                     InputLabelProps={{
                       style: { color: 'inherit' }, // Inherit color for theme compatibility
                     }}
                     InputProps={{
                       className: 'text-gray-900 dark:text-white', // Themed input text
                     }}
                      sx={{
                         '& .MuiOutlinedInput-root': { // Style the input border
                             fieldset: { borderColor: '#d1d5db' }, // Default border
                             '&:hover fieldset': { borderColor: '#9ca3af' }, // Hover border
                              '&.Mui-focused fieldset': { borderColor: '#3b82f6' }, // Focused border
                               '& .MuiOutlinedInput-notchedOutline': { // Dark theme borders
                                    borderColor: '#4b5563',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                   borderColor: '#6b7280',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                   borderColor: '#60a5fa',
                              },
                         },
                          '& .MuiInputBase-input::placeholder': { // Themed placeholder color
                              color: '#9ca3af', // Default placeholder color
                              opacity: 1, // Ensure placeholder is visible
                              '.dark & ': { // Dark mode placeholder color
                                   color: '#6b7280',
                              },
                          },
                          '& .MuiInputLabel-outlined': { // Themed label color
                               color: '#6b7280', // Default label color
                                '.dark & ': { // Dark mode label color
                                    color: '#9ca3af',
                              },
                          },
                      }}
                  />
                  <Button variant="contained" onClick={handleSendMessage} endIcon={<Send size={16} />} className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold transition-colors duration-200"> {/* Themed button */}
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Box className="flex-1 flex items-center justify-center">
                 <Typography variant="h6" color="text.secondary" className="text-gray-500 dark:text-gray-400">Select a conversation to view messages</Typography> {/* Themed text */}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
