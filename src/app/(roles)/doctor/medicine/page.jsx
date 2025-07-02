'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/Button';
import MedicineRequestCard from '@/components/doctor/MedicineRequestCard';
import NewRequestDialog from '@/components/doctor/NewRequestDialog';
import { useGetRequestsQuery } from '@/store/services/doctor/medicineApi';
import { openNewRequestDialog, closeNewRequestDialog } from '@/store/slices/doctor/medicineUiSlice';

const PHARMACIES = [
  { id: 'pharmacy1', name: 'City Pharmacy' },
  { id: 'pharmacy2', name: 'HealthPlus Pharmacy' },
  { id: 'pharmacy3', name: 'Wellness Drugstore' },
];

export default function MedicineRequestsPage() {
  const dispatch = useDispatch();
  const { data: requests = [], isLoading, isError, refetch } = useGetRequestsQuery();
  const newRequestDialogOpen = useSelector((state) => state.medicineUi.newRequestDialogOpen);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8" style={{ background: 'transparent' }}>
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-card-foreground">Medicine Requests</h1>
          <Button variant="primary" onClick={() => dispatch(openNewRequestDialog())}>
            New Request
          </Button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-primary">Loading requests...</div>
        ) : isError ? (
          <div className="text-error">Failed to load requests.</div>
        ) : requests.length === 0 ? (
          <div className="text-muted-foreground">No requests yet.</div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <MedicineRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>
      <NewRequestDialog
        open={newRequestDialogOpen}
        onClose={() => dispatch(closeNewRequestDialog())}
        pharmacies={PHARMACIES}
      />
    </div>
  );
}