import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsultations, sendFollowUpQuestion } from '@/store/slices/patient/consultationsSlice';
import ConsultationCard from './ConsultationCard';

export default function PatientConsultationsTab({ patientId }) {
  const dispatch = useDispatch();
  const consultations = useSelector(state => state.consultations.items);
  const loading = useSelector(state => state.consultations.loading);
  const error = useSelector(state => state.consultations.error);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [followUpText, setFollowUpText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchConsultations({ patientId }));
    }
  }, [dispatch, patientId]);

  const handleOpenDialog = (consultation) => {
    setActiveConsultation(consultation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setActiveConsultation(null);
    setFollowUpText('');
  };

  const handleSendFollowUp = () => {
    if (activeConsultation && followUpText.trim()) {
      dispatch(sendFollowUpQuestion({
        consultationId: activeConsultation._id,
        question: followUpText,
      })).then(() => {
        handleCloseDialog();
      });
    }
  };

  if (loading) return <div>Loading consultations...</div>;
  if (error) return <div>Error loading consultations: {error}</div>;

  return (
    <div>
      <h3>Consultations</h3>
      {consultations.length === 0 ? (
        <div>No consultations found for this patient.</div>
      ) : (
        consultations.map(consultation => (
          <ConsultationCard
            key={consultation._id}
            consultation={consultation}
            onContinueChat={() => handleOpenDialog(consultation)}
            allowPatientResponse={true}
          />
        ))
      )}
      {dialogOpen && (
        <div className="dialog">
          <h4>Send Follow-up Question</h4>
          <textarea
            value={followUpText}
            onChange={e => setFollowUpText(e.target.value)}
            rows={4}
            style={{ width: '100%' }}
          />
          <button onClick={handleSendFollowUp}>Send</button>
          <button onClick={handleCloseDialog}>Cancel</button>
        </div>
      )}
    </div>
  );
} 