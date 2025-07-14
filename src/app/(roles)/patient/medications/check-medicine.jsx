"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Pill, Bell, Search, AlertCircle, Eye, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

// Placeholder for fetching and sending requests - replace with RTK Query or axios as needed
const usePatientMedicineRequests = () => {
  // TODO: Replace with real fetch logic
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRequests([]); // TODO: Replace with real data
      setLoading(false);
    }, 1000);
  }, []);
  return { requests, loading };
};

export default function PatientCheckMedicinePage() {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("medicine");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequestDialog, setNewRequestDialog] = useState(false);
  const { requests, loading } = usePatientMedicineRequests();

  const openDialog = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  // Placeholder for sending a new request
  const handleSendRequest = (e) => {
    e.preventDefault();
    // TODO: Implement send logic
    setNewRequestDialog(false);
  };

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Pill className="h-6 w-6 text-primary" />
        {t("patient.medicineRequests", "Check Medicine Availability")}
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1 rounded-xl border border-border mb-4">
          <TabsTrigger value="medicine" className="rounded-lg font-medium">
            <span className="flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              {t("medicineRequests", "Medicine Requests")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="rounded-lg font-medium">
            <span className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              {t("reminders", "Reminders")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="rounded-lg font-medium">
            <span className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              {t("checkAvailability", "Check Availability")}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="medicine" className="mt-4">
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setNewRequestDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("newRequest", "New Request")}
                </Button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
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
                      <TableRow key={req._id}>
                        <TableCell>{req.medicineName}</TableCell>
                        <TableCell>{req.pharmacyName}</TableCell>
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
        </TabsContent>
        <TabsContent value="reminders" className="mt-4">
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">{t("reminders", "Reminders")}</h3>
              <p>{t("remindersPlaceholder", "This tab will show reminders for your medicine requests.")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="availability" className="mt-4">
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">{t("checkAvailability", "Check Availability")}</h3>
              <p>{t("availabilityPlaceholder", "This tab will allow you to check medicine availability at pharmacies.")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
      <Dialog open={newRequestDialog} onOpenChange={setNewRequestDialog}>
        <DialogContent className="sm:max-w-[500px] bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
              <Plus className="h-5 w-5 text-primary" />
              {t("newMedicineRequest", "New Medicine Request")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendRequest} className="grid gap-6 py-6">
            {/* TODO: Add pharmacy and medicine selection fields */}
            <div>
              <label className="block mb-1 font-medium">{t("medicine", "Medicine")}</label>
              <input className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t("pharmacy", "Pharmacy")}</label>
              <input className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">{t("message", "Message")}</label>
              <textarea className="w-full border rounded px-3 py-2" rows={3} />
            </div>
            <DialogFooter className="gap-3">
              <Button variant="outline" type="button" onClick={() => setNewRequestDialog(false)} className="px-6">
                {t("cancel", "Cancel")}
              </Button>
              <Button type="submit" className="px-6">
                {t("sendRequest", "Send Request")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 