'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LabResultView from '@/components/medical/LabResultView';
import ImagingView from '@/components/medical/ImagingView';
import PrescriptionView from '@/components/medical/PrescriptionView';
import ConsultationView from '@/components/medical/ConsultationView';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/patient/ErrorState';
import { useSelector } from 'react-redux';

export default function MedicalRecordFilePage() {
  const { id } = useParams();
  const medicalRecords = useSelector(state => state.medicalRecords.records || []);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !medicalRecords.length) {
      setError('No medical records found.');
      setLoading(false);
      return;
    }
    const found = medicalRecords.find(r => String(r.id) === String(id));
    if (!found) {
      setError('Medical record not found.');
    } else {
      setRecord(found);
    }
    setLoading(false);
  }, [id, medicalRecords]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!record) return <ErrorState message="Medical record not found." />;

  switch (record.type) {
    case 'lab_result':
      return <LabResultView record={record} />;
    case 'imaging':
      return <ImagingView record={record} />;
    case 'prescription':
      return <PrescriptionView record={record} />;
    case 'consultation':
      return <ConsultationView record={record} />;
    default:
      return <ErrorState message="Unknown medical record type." />;
  }
} 