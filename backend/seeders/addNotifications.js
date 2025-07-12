const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Load environment variables
require('dotenv').config({ path: './backend/config/config.env' });

console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT
});

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for notification seeding...'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Helper function to get random date within last 30 days
const getRandomRecentDate = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
};

// Generate notifications based on user role
const generateNotificationsForUser = (user) => {
    const notifications = [];
    const baseDate = new Date();
    
    // Common notifications for all users
    notifications.push({
        user: user._id,
        type: 'general',
        title: 'Welcome to SAFE Medical Platform',
        message: `Welcome ${user.firstName}! Thank you for joining our medical platform. We're here to help you manage your health.`,
        isRead: Math.random() > 0.5,
        relatedTo: null,
        relatedModel: 'General',
        createdAt: getRandomRecentDate(),
        updatedAt: new Date()
    });

    // Role-specific notifications
    switch (user.role) {
        case 'admin':
            notifications.push(
                {
                    user: user._id,
                    type: 'general',
                    title: 'System Maintenance Scheduled',
                    message: 'System maintenance is scheduled for tomorrow at 2:00 AM. Please ensure all critical operations are completed.',
                    isRead: false,
                    relatedTo: null,
                    relatedModel: 'General',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'general',
                    title: 'New User Registration',
                    message: 'A new doctor has registered and is awaiting approval.',
                    isRead: Math.random() > 0.7,
                    relatedTo: null,
                    relatedModel: 'User',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'general',
                    title: 'System Health Alert',
                    message: 'Database performance is optimal. All systems are running smoothly.',
                    isRead: true,
                    relatedTo: null,
                    relatedModel: 'General',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                }
            );
            break;

        case 'doctor':
            notifications.push(
                {
                    user: user._id,
                    type: 'appointment',
                    title: 'New Appointment Request',
                    message: 'You have a new appointment request from a patient. Please review and confirm.',
                    isRead: Math.random() > 0.6,
                    relatedTo: null,
                    relatedModel: 'Appointment',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'consultation',
                    title: 'Consultation Question Received',
                    message: 'A patient has submitted a consultation question. Please respond within 24 hours.',
                    isRead: Math.random() > 0.4,
                    relatedTo: null,
                    relatedModel: 'Consultation',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'prescription',
                    title: 'Prescription Renewal Reminder',
                    message: 'A patient\'s prescription is due for renewal. Please review and update if necessary.',
                    isRead: Math.random() > 0.8,
                    relatedTo: null,
                    relatedModel: 'Prescription',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'message',
                    title: 'New Message from Patient',
                    message: 'You have received a new message from a patient regarding their treatment.',
                    isRead: Math.random() > 0.3,
                    relatedTo: null,
                    relatedModel: 'Conversation',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                }
            );
            break;

        case 'patient':
            notifications.push(
                {
                    user: user._id,
                    type: 'appointment',
                    title: 'Appointment Confirmation',
                    message: 'Your appointment with Dr. Smith has been confirmed for tomorrow at 10:00 AM.',
                    isRead: Math.random() > 0.5,
                    relatedTo: null,
                    relatedModel: 'Appointment',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'prescription',
                    title: 'Prescription Ready',
                    message: 'Your prescription is ready for pickup at the pharmacy.',
                    isRead: Math.random() > 0.6,
                    relatedTo: null,
                    relatedModel: 'Prescription',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'reminder',
                    title: 'Medication Reminder',
                    message: 'Don\'t forget to take your medication. It\'s time for your daily dose.',
                    isRead: Math.random() > 0.2,
                    relatedTo: null,
                    relatedModel: 'General',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'medical_file_update',
                    title: 'Medical File Updated',
                    message: 'Your medical file has been updated with new lab results.',
                    isRead: Math.random() > 0.7,
                    relatedTo: null,
                    relatedModel: 'MedicalFile',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'consultation',
                    title: 'Consultation Response',
                    message: 'Dr. Johnson has responded to your consultation question.',
                    isRead: Math.random() > 0.4,
                    relatedTo: null,
                    relatedModel: 'Consultation',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                }
            );
            break;

        case 'pharmacist':
            notifications.push(
                {
                    user: user._id,
                    type: 'prescription',
                    title: 'New Prescription Order',
                    message: 'A new prescription has been submitted for processing.',
                    isRead: Math.random() > 0.5,
                    relatedTo: null,
                    relatedModel: 'Prescription',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'general',
                    title: 'Inventory Alert',
                    message: 'Some medications are running low in stock. Please check inventory levels.',
                    isRead: Math.random() > 0.6,
                    relatedTo: null,
                    relatedModel: 'General',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'message',
                    title: 'Message from Doctor',
                    message: 'Dr. Ahmed has sent you a message regarding a prescription clarification.',
                    isRead: Math.random() > 0.3,
                    relatedTo: null,
                    relatedModel: 'Conversation',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                },
                {
                    user: user._id,
                    type: 'general',
                    title: 'Pharmacy Schedule Update',
                    message: 'Your pharmacy schedule has been updated for next week.',
                    isRead: Math.random() > 0.8,
                    relatedTo: null,
                    relatedModel: 'General',
                    createdAt: getRandomRecentDate(),
                    updatedAt: new Date()
                }
            );
            break;
    }

    return notifications;
};

const seedNotifications = async () => {
    try {
        // Clear existing notifications
        await Notification.deleteMany({});
        console.log('Cleared existing notifications');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users to create notifications for`);

        if (users.length === 0) {
            console.log('No users found. Please run the main seed file first to create users.');
            return;
        }

        const allNotifications = [];

        // Generate notifications for each user
        for (const user of users) {
            const userNotifications = generateNotificationsForUser(user);
            allNotifications.push(...userNotifications);
            console.log(`Generated ${userNotifications.length} notifications for ${user.firstName} ${user.lastName} (${user.role})`);
        }

        // Insert all notifications
        const createdNotifications = await Notification.insertMany(allNotifications);
        console.log(`Successfully created ${createdNotifications.length} notifications`);

        // Log statistics
        const unreadCount = await Notification.countDocuments({ isRead: false });
        const readCount = await Notification.countDocuments({ isRead: true });
        
        console.log('\nNotification Statistics:');
        console.log(`Total notifications: ${createdNotifications.length}`);
        console.log(`Unread notifications: ${unreadCount}`);
        console.log(`Read notifications: ${readCount}`);

        // Log by type
        const typeStats = await Notification.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log('\nNotifications by type:');
        typeStats.forEach(stat => {
            console.log(`  ${stat._id}: ${stat.count}`);
        });

        // Log by role
        const roleStats = await Notification.aggregate([
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
            { $unwind: '$userInfo' },
            { $group: { _id: '$userInfo.role', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log('\nNotifications by user role:');
        roleStats.forEach(stat => {
            console.log(`  ${stat._id}: ${stat.count}`);
        });

        console.log('\nNotification seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding notifications:', error);
        process.exit(1);
    }
};

seedNotifications(); 