const Conversation = require('../models/Conversation');

exports.getUserConversations = async (req, res) => {
  try {
    // Fetch conversations where the current user is a participant
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'firstName lastName email role')
      .populate('messages.sender', 'firstName lastName email');
    res.status(200).json({ data: conversations });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
