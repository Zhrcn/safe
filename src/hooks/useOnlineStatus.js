import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOnlineStatus } from '@/store/slices/patient/onlineStatusSlice';

export const useOnlineStatus = (conversation, currentUserId) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector(state => state.onlineStatus.onlineUsers);

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

  const onlineStatus = useMemo(() => {
    const status = {};
    participantIds.forEach(userId => {
      status[userId] = onlineUsers[userId] || false;
    });
    return status;
  }, [participantIds, onlineUsers]);

  const otherParticipantId = useMemo(() => {
    if (!conversation?.participants || conversation.participants.length !== 2) {
      return null;
    }
    
    const otherId = participantIds.find(id => id !== currentUserId);
    return otherId;
  }, [conversation, participantIds, currentUserId]);

  const isOtherParticipantOnline = useMemo(() => {
    if (!otherParticipantId) return false;
    const status = onlineUsers[otherParticipantId] || false;
    return status;
  }, [otherParticipantId, onlineUsers]);

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