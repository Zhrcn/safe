"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Pill, Bell, Search, AlertCircle, Eye, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import NewRequestDialog from '@/components/doctor/NewRequestDialog';
import { getPharmacists } from '@/store/services/patient/providerApi';
import { getMedicines, useGetRequestsQuery, useCreateRequestMutation, useDeleteRequestMutation } from '@/store/services/doctor/medicineApi';

export default function PatientCheckMedicinePage({ hideHeader = false }) {
  const { t } = useTranslation("common");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequestDialog, setNewRequestDialog] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const { data: requests = [], isLoading, isError, refetch, isFetching } = useGetRequestsQuery();
  const [createRequest, { isLoading: isCreatingRequest }] = useCreateRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();

  const fetchPharmacies = useCallback(() => {
    setPharmaciesLoading(true);
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
        setPharmacies([]);
        setPharmaciesLoading(false);
      });
  }, []);

  const fetchMedicines = useCallback(() => {
    setMedicinesLoading(true);
    getMedicines()
      .then((data) => {
        setMedicines(data || []);
        setMedicinesLoading(false);
      })
      .catch(() => {
        setMedicines([]);
        setMedicinesLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPharmacies();
    fetchMedicines();
  }, [fetchPharmacies, fetchMedicines]);

  const handleCreateRequest = async ({ pharmacyId, medicineName }) => {
    setIsCreating(true);
    try {
      await createRequest({ pharmacyId, medicineName }).unwrap();
      setNewRequestDialog(false);
      refetch();
    } catch (err) {
      // Optionally show error
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      await deleteRequest(id).unwrap();
      refetch();
    } catch (err) {
      // Optionally show error
    }
  };

  const openDialog = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="flex flex-col space-y-6">
      {!hideHeader && (
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          {t("patient.medicineRequests", "Check Medicine Availability")}
        </h1>
      )}
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setNewRequestDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("newRequest", "New Request")}
            </Button>
          </div>
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-error text-center py-8">Failed to load requests.</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="h-24 w-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center animate-pulse">
                    <AlertCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">{t("noRequestsFound", "No Medicine Requests Found")}</h3>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                  {t("noRequestsDescription", "You have not sent any medicine requests yet.")}
                </p>
              </div>
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("medicine", "Medicine")}</TableHead>
                  <TableHead>{t("pharmacy", "Pharmacy")}</TableHead>
                  <TableHead>{t("status", "Status")}</TableHead>
                  <TableHead>{t("date", "Date")}</TableHead>
                  <TableHead>{t("actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req._id || req.id}>
                    <TableCell>{req.medicineName}</TableCell>
                    <TableCell>{req.pharmacyName}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openDialog(req)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {req.status === 'pending' && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleCancelRequest(req._id || req.id)}
                          disabled={isDeleting}
                          title="Cancel Request"
                        >
                          ✕
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
              <Pill className="h-5 w-5 text-primary" />
              {t("requestDetails", "Request Details")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {selectedRequest ? (
              <div className="text-left space-y-2">
                <div><strong>{t("medicine", "Medicine")}:</strong> {selectedRequest.medicineName}</div>
                <div><strong>{t("pharmacy", "Pharmacy")}:</strong> {selectedRequest.pharmacyName}</div>
                <div><strong>{t("status", "Status")}:</strong> {selectedRequest.status}</div>
                <div><strong>{t("date", "Date")}:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</div>
                <div><strong>{t("message", "Message")}:</strong> {selectedRequest.message || t("noMessage", "No message provided.")}</div>
              </div>
            ) : null}
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={closeDialog} className="px-6">
              {t("close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <NewRequestDialog
        open={newRequestDialog}
        onClose={() => setNewRequestDialog(false)}
        pharmacies={pharmacies}
        medicines={medicinesLoading ? [] : medicines}
        onCreate={handleCreateRequest}
        isCreating={isCreating || isCreatingRequest}
        requirePharmacy
      />
    </div>
  );
} 