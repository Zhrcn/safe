import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOnlineStatus } from '@/store/slices/patient/onlineStatusSlice';

export const useOnlineStatus = (conversation, currentUserId) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(state => state.onlineStatus.onlineUsers);

  // Extract participant IDs from conversation
  const participantIds = useMemo(() => {
    if (!conversation?.participants) {
      return [];
    }
    
    const ids = conversation.participants.map(participant => {
      if (typeof participant === 'string') {
        return participant;
      }
      return participant._id || participant.id;
    });
    
    return ids;
  }, [conversation]);

  // Get online status for all participants
  const onlineStatus = useMemo(() => {
    const status = {};
    participantIds.forEach(userId => {
      status[userId] = onlineUsers[userId] || false;
    });
    return status;
  }, [participantIds, onlineUsers]);

  // Get the other participant (not current user) for 1-on-1 conversations
  const otherParticipantId = useMemo(() => {
    if (!conversation?.participants || conversation.participants.length !== 2) {
      return null;
    }
    
    // Find the participant that is not the current user
    const otherId = participantIds.find(id => id !== currentUserId);
    return otherId;
  }, [conversation, participantIds, currentUserId]);

  // Check if the other participant is online
  const isOtherParticipantOnline = useMemo(() => {
    if (!otherParticipantId) return false;
    const status = onlineUsers[otherParticipantId] || false;
    return status;
  }, [otherParticipantId, onlineUsers]);

  // Fetch online status when conversation changes
  useEffect(() => {
    if (participantIds.length > 0) {
      dispatch(fetchOnlineStatus(participantIds));
    }
  }, [dispatch, participantIds]);

  return {
    onlineStatus,
    isOtherParticipantOnline,
    otherParticipantId,
    participantIds
  };
}; 