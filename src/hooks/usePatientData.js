import { useSelector, useDispatch } from 'react-redux';
import { getPatientData } from '@/store/patientSlice';
import { useEffect } from 'react';

export default function usePatientData() {
  const dispatch = useDispatch();
  const {
    user,
    patient,
    appointments,
    prescriptions,
    consultations,
    healthMetrics,
    medicineReminders,
    conversations,
    loading,
    error
  } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPatientData());
  }, [dispatch]);

  return {
    user,
    patient,
    appointments,
    prescriptions,
    consultations,
    healthMetrics,
    medicineReminders,
    conversations,
    loading,
    error,
    refresh: () => dispatch(getPatientData())
  };
}
