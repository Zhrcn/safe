export const conversations = [
  {
    id: 1,
    title: 'Dr. Sarah Johnson',
    subtitle: 'Primary Care Physician',
    avatar: '/avatars/doctor-1.jpg',
    lastMessage: 'Your test results are ready. Would you like to discuss them?',
    lastMessageTime: '2024-03-15T10:30:00',
    read: false,
    messages: [
      {
        id: 1,
        content: 'Hello, I wanted to follow up on your recent check-up.',
        timestamp: '2024-03-15T09:00:00',
        sender: 'Dr. Sarah Johnson',
        read: true,
        avatar: '/avatars/doctor-1.jpg'
      },
      {
        id: 2,
        content: 'Hi Dr. Johnson, yes I had a few questions about the blood work.',
        timestamp: '2024-03-15T09:05:00',
        sender: 'You',
        read: true
      },
      {
        id: 3,
        content: 'Your test results are ready. Would you like to discuss them?',
        timestamp: '2024-03-15T10:30:00',
        sender: 'Dr. Sarah Johnson',
        read: false,
        avatar: '/avatars/doctor-1.jpg'
      }
    ]
  },
  {
    id: 2,
    title: 'Dr. Michael Chen',
    subtitle: 'Cardiologist',
    avatar: '/avatars/doctor-2.jpg',
    lastMessage: 'The new medication seems to be working well.',
    lastMessageTime: '2024-03-14T15:45:00',
    read: true,
    messages: [
      {
        id: 1,
        content: 'How are you feeling with the new medication?',
        timestamp: '2024-03-14T14:00:00',
        sender: 'Dr. Michael Chen',
        read: true,
        avatar: '/avatars/doctor-2.jpg'
      },
      {
        id: 2,
        content: 'I\'ve noticed some improvement in my symptoms.',
        timestamp: '2024-03-14T14:30:00',
        sender: 'You',
        read: true
      },
      {
        id: 3,
        content: 'The new medication seems to be working well.',
        timestamp: '2024-03-14T15:45:00',
        sender: 'Dr. Michael Chen',
        read: true,
        avatar: '/avatars/doctor-2.jpg'
      }
    ]
  },
  {
    id: 3,
    title: 'Nurse Emily Rodriguez',
    subtitle: 'Care Coordinator',
    avatar: '/avatars/nurse-1.jpg',
    lastMessage: 'Your next appointment is scheduled for next Tuesday.',
    lastMessageTime: '2024-03-13T11:20:00',
    read: true,
    messages: [
      {
        id: 1,
        content: 'I\'m calling to confirm your upcoming appointment.',
        timestamp: '2024-03-13T10:00:00',
        sender: 'Nurse Emily Rodriguez',
        read: true,
        avatar: '/avatars/nurse-1.jpg'
      },
      {
        id: 2,
        content: 'Yes, I\'ll be there. What time is it scheduled for?',
        timestamp: '2024-03-13T10:15:00',
        sender: 'You',
        read: true
      },
      {
        id: 3,
        content: 'Your next appointment is scheduled for next Tuesday.',
        timestamp: '2024-03-13T11:20:00',
        sender: 'Nurse Emily Rodriguez',
        read: true,
        avatar: '/avatars/nurse-1.jpg'
      }
    ]
  }
]; 