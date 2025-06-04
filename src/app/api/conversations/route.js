import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Conversation from '@/models/Conversation';

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const conversations = await Conversation.find({ 
      participants: session.user._id 
    }).populate('participants', 'name email role').lean();

    return NextResponse.json(conversations || []);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
