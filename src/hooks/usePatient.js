import { useSelector, useDispatch } from 'react-redux';
import { getPatientData, updatePatientData, clearPatientData } from '@/store/patientSlice';
import { useEffect } from 'react';

export default function usePatient() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    if (!data && !loading && !error) {
      dispatch(getPatientData());
    }
  }, [data, loading, error, dispatch]);

  const updateProfile = async (updateData) => {
    try {
      await dispatch(updatePatientData(updateData)).unwrap();
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      return false;
    }
  };

  const refresh = () => {
    dispatch(getPatientData());
  };

  const clear = () => {
    dispatch(clearPatientData());
  };

  return {
    profile: data,
    loading,
    error,
    updateProfile,
    refresh,
    clear
  };
}
