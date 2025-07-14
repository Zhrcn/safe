'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import NewRequestDialog from '@/components/doctor/NewRequestDialog';
import { useGetRequestsQuery, useCreateRequestMutation } from '@/store/services/doctor/medicineApi';
import { openNewRequestDialog, closeNewRequestDialog } from '@/store/slices/doctor/medicineUiSlice';
import { getPharmacists } from '@/store/services/patient/providerApi';
import { getMedicines } from '@/store/services/doctor/medicineApi';
import { toast } from 'react-hot-toast';

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function statusColor(status, available) {
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (status === 'responded' && available === true) return 'bg-green-100 text-green-800';
  if (status === 'responded' && available === false) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

export default function MedicineRequestsPage() {
  const dispatch = useDispatch();
  const { data: requests = [], isLoading, isError, refetch, isFetching } = useGetRequestsQuery();
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const newRequestDialogOpen = useSelector((state) => state.medicineUi.newRequestDialogOpen);

  // Pharmacies and medicines state
  const [pharmacies, setPharmacies] = useState([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [pharmaciesError, setPharmaciesError] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch pharmacies
  const fetchPharmacies = useCallback(() => {
    setPharmaciesLoading(true);
    setPharmaciesError(null);
    getPharmacists()
      .then((data) => {
        setPharmacies(
          (data || []).map((ph) => ({
            id: ph._id || ph.id || ph.pharmacistId || ph.user?._id || ph.userId,
            name: ph.pharmacyName || ph.name || (ph.user ? `${ph.user.firstName} ${ph.user.lastName}` : 'Pharmacy'),
            avatar: ph.user?.profileImage || '',
            email: ph.user?.email || '',
          }))
        );
        setPharmaciesLoading(false);
      })
      .catch(() => {
        setPharmaciesError('Failed to load pharmacies.');
        setPharmaciesLoading(false);
      });
  }, []);

  // Fetch medicines
  const fetchMedicines = useCallback(() => {
    setMedicinesLoading(true);
    setMedicinesError(null);
    getMedicines()
      .then((data) => {
        setMedicines(data || []);
        setMedicinesLoading(false);
      })
      .catch(() => {
        setMedicinesError('Failed to load medicines.');
        setMedicinesLoading(false);
      });
  }, []);

  // Initial load
  useEffect(() => {
    fetchPharmacies();
    fetchMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    refetch();
    fetchPharmacies();
    fetchMedicines();
  };

  // Handle new request creation with toast feedback
  const handleCreateRequest = async (requestData) => {
    try {
      await createRequest(requestData).unwrap();
      toast.success('Medicine request created!');
      refetch();
      fetchPharmacies();
      fetchMedicines();
      dispatch(closeNewRequestDialog());
    } catch (err) {
      toast.error('Failed to create medicine request.');
    }
  };

const getPharmacyById = (id) => pharmacies.find((p) => p.id === id) || {};

return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-white pb-12">
      <div className="w-full max-w-full bg-white/80 rounded-2xl shadow-lg p-0 sm:p-6 mt-8">
      <div className="sticky top-0 z-10 bg-white/80 rounded-t-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 pt-6 pb-4 border-b">
          <div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight">Medicine Requests</h1>
            <p className="text-muted-foreground text-sm">Manage and track your medicine requests to pharmacies.</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground text-xs">{requests.length} total</span>
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isFetching || pharmaciesLoading || medicinesLoading}>
              {isFetching ? <span className="animate-spin mr-2">⏳</span> : null} Refresh
            </Button>
            <Button variant="default" onClick={() => dispatch(openNewRequestDialog())}>
              + New Request
            </Button>
          </div>
        </div>
        {/* Divider */}
        <div className="my-4 border-t" />
        {/* Table */}
        {isLoading || isFetching ? (
          <div className="flex flex-col gap-4 py-8 px-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-error text-center py-8">Failed to load requests.</div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <span className="text-6xl mb-2">💊</span>
            <span className="mb-2">No medicine requests yet.</span>
            <Button variant="default" onClick={() => dispatch(openNewRequestDialog())}>
              Create your first request
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto px-2">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => {
                  // Use populated pharmacy object if present
                  const pharmacyObj = req.pharmacy && typeof req.pharmacy === 'object' ? req.pharmacy : null;
                  const pharmacyName = pharmacyObj?.pharmacyName || req.pharmacyName || 'Pharmacy';
                  const pharmacyAvatar = pharmacyObj?.user?.profileImage || '';
                  return (
                    <TableRow key={req.id || req._id} className="hover:bg-blue-50 cursor-pointer">
                      <TableCell>
                        <span className="font-medium text-card-foreground">{req.medicineName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar src={pharmacyAvatar} alt={pharmacyName} size={24} />
                          <span>{pharmacyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(req.status, req.available)}>
                          {req.status === 'pending'
                            ? 'Pending'
                            : req.status === 'responded' && req.available === true
                            ? 'Available'
                            : req.status === 'responded' && req.available === false
                            ? 'Not Available'
                            : req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setDetailsOpen(true); }}>View</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Pharmacies and medicines loading/error */}
        {(pharmaciesLoading || medicinesLoading) && (
          <div className="text-muted-foreground mt-4 px-6">Loading data...</div>
        )}
        {(pharmaciesError || medicinesError) && (
          <div className="text-error mt-4 px-6">{pharmaciesError || medicinesError}</div>
        )}
      </div>
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Medicine Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Medicine:</span> {selectedRequest.medicineName}
              </div>
              <div>
                <span className="font-semibold">Pharmacy:</span> {selectedRequest.pharmacy && typeof selectedRequest.pharmacy === 'object' ? selectedRequest.pharmacy.pharmacyName : selectedRequest.pharmacyName}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <Badge className={statusColor(selectedRequest.status, selectedRequest.available)}>
                  {selectedRequest.status === 'pending'
                    ? 'Pending'
                    : selectedRequest.status === 'responded' && selectedRequest.available === true
                    ? 'Available'
                    : selectedRequest.status === 'responded' && selectedRequest.available === false
                    ? 'Not Available'
                    : selectedRequest.status}
                </Badge>
              </div>
              <div>
                <span className="font-semibold">Date:</span> {formatDate(selectedRequest.createdAt)}
              </div>
              {selectedRequest.message && (
                <div>
                  <span className="font-semibold">Message:</span> {selectedRequest.message}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* New Request Dialog (pharmacy required) */}
      <NewRequestDialog
        open={newRequestDialogOpen}
        onClose={() => dispatch(closeNewRequestDialog())}
        pharmacies={pharmacies}
        medicines={medicinesLoading || medicinesError ? [] : medicines}
        onCreate={handleCreateRequest}
        isCreating={isCreating}
        requirePharmacy
      />
    </div>
  );
}