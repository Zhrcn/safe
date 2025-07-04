const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');
const { io } = require('../server');

exports.getUserConversations = async (req, res) => {
  try {
    let conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'firstName lastName email role')
      .populate('messages.sender', 'firstName lastName email')
      .sort({ updatedAt: -1 });

    conversations = conversations.map(conv => {
      let other = null;
      if (conv.participants && conv.participants.length > 1) {
        console.log('Participants:', conv.participants);
        other = conv.participants.find(
          p => p._id.toString() !== req.user.id.toString()
        );
        console.log('Other:', other);
      }
      const otherName = other ? [other.firstName, other.lastName].filter(Boolean).join(' ') : 'Unknown';
      return {
        ...conv.toObject(),
        title: otherName
      };
    });

    res.status(200).json({ data: conversations });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'firstName lastName email role')
      .populate('messages.sender', 'firstName lastName email');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let other = conversation.participants.find(
      p => p._id.toString() !== req.user.id.toString()
    );
    const otherName = other ? [other.firstName, other.lastName].filter(Boolean).join(' ') : 'Unknown';
    
    const conversationWithTitle = {
      ...conversation.toObject(),
      title: otherName
    };

    res.status(200).json({ data: conversationWithTitle });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { participants, subject } = req.body;
    
    if (!participants.includes(req.user.id)) {
      participants.push(req.user.id);
    }

    const existingConversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length }
    });

    if (existingConversation) {
      return res.status(200).json({ data: existingConversation });
    }

    const conversation = new Conversation({
      participants,
      subject: subject || 'New Conversation',
      messages: []
    });

    await conversation.save();
    
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName email role');

    res.status(201).json({ data: populatedConversation });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('participants', 'firstName lastName email role');

    res.status(200).json({ data: updatedConversation });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Conversation.findByIdAndDelete(req.params.id);
    res.status(200).json({ data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    conversation.messages.forEach(message => {
      if (message.receiver && message.receiver.toString() === req.user.id) {
        message.read = true;
      }
    });

    await conversation.save();
    
    const updatedConversation = await Conversation.findById(req.params.id)
      .populate('participants', 'firstName lastName email role')
      .populate('messages.sender', 'firstName lastName email');

    res.status(200).json({ data: updatedConversation });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
