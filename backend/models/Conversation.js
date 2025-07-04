const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: { 
    type: Boolean,
    default: false
  },
  attachments: [
    {
      filename: { type: String, required: true },
      fileType: { type: String } ,
      fileUrl: { type: String, required: true }
    }
  ]
});
const Message = mongoose.model('Message', MessageSchema);
const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [MessageSchema], 
  subject: { 
    type: String,
    trim: true,
  },
  lastMessageTimestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'], 
    default: 'active'
  },
}, {
  timestamps: true, 
  collection: 'Conversations'
});
ConversationSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastMessageTimestamp = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});
const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
