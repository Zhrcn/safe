"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Pill, Bell, Search, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useGetPharmacyRequestsQuery, useRespondToRequestMutation } from '@/store/services/doctor/medicineApi';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

const usePharmacyMedicineRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRequests([]); 
      setLoading(false);
    }, 1000);
  }, []);
  return { requests, loading };
};

export default function PharmacistMedicinePage() {
  const { t } = useTranslation("common");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { data: requests = [], isLoading, refetch } = useGetPharmacyRequestsQuery();
  const [respondToRequest, { isLoading: isResponding }] = useRespondToRequestMutation();

  const pharmacistRequests = requests || [];

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
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Pill className="h-6 w-6 text-primary" />
        {t("pharmacist.medicineRequests", "Medicine Requests")}
      </h1>
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : pharmacistRequests.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="h-24 w-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center animate-pulse">
                    <AlertCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">{t("noRequestsFound", "No Medicine Requests Found")}</h3>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                  {t("noRequestsDescription", "You have no medicine requests at the moment.")}
                </p>
              </div>
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("medicine", "Medicine")}</TableHead>
                  <TableHead>{t("doctor", "Doctor")}</TableHead>
                  <TableHead>{t("status", "Status")}</TableHead>
                  <TableHead>{t("date", "Date")}</TableHead>
                  <TableHead>{t("actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacistRequests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>{req.medicineName}</TableCell>
                    <TableCell>{req.doctorName || req.doctor?.firstName + ' ' + req.doctor?.lastName}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell>{new Date(req.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" onClick={() => openDialog(req)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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
                <div><strong>{t("doctor", "Doctor")}:</strong> {selectedRequest.doctorName || selectedRequest.doctor?.firstName + ' ' + selectedRequest.doctor?.lastName}</div>
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
            {selectedRequest && selectedRequest.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  onClick={async () => {
                    try {
                      await respondToRequest({ id: selectedRequest._id, available: true });
                      toast.success(t('markedAvailable', 'Marked as available!'));
                      closeDialog();
                      refetch();
                    } catch (err) {
                      toast.error(t('errorMarkingAvailable', 'Error marking as available.'));
                    }
                  }}
                  disabled={isResponding}
                  className="px-6"
                >
                  {t("markAvailable", "Available")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await respondToRequest({ id: selectedRequest._id, available: false });
                      toast.success(t('markedNotAvailable', 'Marked as not available!'));
                      closeDialog();
                      refetch();
                    } catch (err) {
                      toast.error(t('errorMarkingNotAvailable', 'Error marking as not available.'));
                    }
                  }}
                  disabled={isResponding}
                  className="px-6"
                >
                  {t("markNotAvailable", "Not Available")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 