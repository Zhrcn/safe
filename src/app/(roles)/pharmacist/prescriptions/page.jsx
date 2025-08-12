'use client';
import { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle, X } from 'lucide-react';
import { PharmacistPageContainer, PharmacistCard } from '@/components/pharmacist/PharmacistComponents';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import dynamic from 'next/dynamic';
import axiosInstance from '@/store/services/axiosInstance';
const QRCodeScanner = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false });

export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrError, setQrError] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [manualId, setManualId] = useState("");
  const [manualError, setManualError] = useState("");
  const [dispenseDraft, setDispenseDraft] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [lastPrescriptionId, setLastPrescriptionId] = useState(null);
  useEffect(() => {
    if (!prescriptionModalOpen) {
      setDispenseDraft({});
    }
  }, [prescriptionModalOpen]);

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/prescriptions');
        setPrescriptions(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        setPrescriptions([]);
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrescriptions();
  }, []);

  const safeSearch = (searchTerm || '').toLowerCase();
  const filteredPrescriptions = prescriptions.filter(prescription =>
    (typeof prescription.patientName === 'string' && prescription.patientName.toLowerCase().includes(safeSearch)) ||
    (Array.isArray(prescription.medications) && prescription.medications.some(med => (med.name || '').toLowerCase().includes(safeSearch)))
  );

  const handleViewDetails = (prescriptionId) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      setPrescriptionDetails(prescription);
      setPrescriptionModalOpen(true);
    }
  };

  const handleCheck = (medId, checked) => {
    setDispenseDraft(prev => {
      return {
        ...prev,
        [medId]: { ...((prev && prev[medId]) || { quantity: 1 }), checked }
      };
    });
  };

  const handleQuantity = (medId, quantity, max) => {
    const safeQty = Math.max(1, Math.min(Number(quantity), max));
    setDispenseDraft(prev => {
      return {
        ...prev,
        [medId]: { ...((prev && prev[medId]) || { checked: false }), quantity: safeQty }
      };
    });
  };

  const handleSaveDispense = async () => {
    setSaveLoading(true);
    try {
      const updatedMeds = (prescriptionDetails.medications || [])
        .filter(med => {
          const draft = dispenseDraft[med._id];
          const origCount = med.refillCount || 0;
          const limit = med.refillLimit ?? 1;
          return draft && draft.checked && draft.quantity > 0 && origCount < limit;
        })
        .map(med => {
          const draft = dispenseDraft[med._id];
          const origCount = med.refillCount || 0;
          const limit = med.refillLimit ?? 1;
          return { _id: med._id, refillCount: Math.min(origCount + draft.quantity, limit) };
        });

      if (updatedMeds.length === 0) {
        setSaveLoading(false);
        return;
      }

      await axiosInstance.patch(`/prescriptions/${prescriptionDetails.id}`, { medications: updatedMeds });

      const res = await axiosInstance.get('/prescriptions');
      setPrescriptions(Array.isArray(res.data.data) ? res.data.data : []);
      const updated = await axiosInstance.get(`/prescriptions/${prescriptionDetails.id}`);
      setPrescriptionDetails(updated.data.data);
      setDispenseDraft({});

      if (updated.data.data.medications && updated.data.data.medications.every(med => (med.refillCount || 0) >= (med.refillLimit ?? 1))) {
        await axiosInstance.patch(`/prescriptions/${prescriptionDetails.id}`, { status: 'expired' });
        const expired = await axiosInstance.get(`/prescriptions/${prescriptionDetails.id}`);
        setPrescriptionDetails(expired.data.data);
      }
    } catch (error) {
      alert('Failed to dispense medicines.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseModal = () => {
    setPrescriptionModalOpen(false);
  };

  const handleManualFetch = async () => {
    if (!manualId.trim()) {
      setManualError("Please enter a prescription ID.");
      return;
    }
    setManualError("");
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/prescriptions/${manualId.trim()}`);
      const details = res.data.data;
      if (details) {
        setPrescriptionDetails(details);
        setPrescriptionModalOpen(true);
      } else {
        setPrescriptionDetails(null);
        setPrescriptionModalOpen(false);
        setManualError("Prescription not found.");
      }
    } catch (error) {
      setPrescriptionDetails(null);
      setPrescriptionModalOpen(false);
      setManualError("Prescription not found or error fetching prescription.");
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanned = async (value) => {
    if (!value) return;
    setQrDialogOpen(false);
    setQrValue(value);
    setPrescriptionLoading(true);
    setPrescriptionError("");
    let prescriptionId = value;
    try {
      const parsed = JSON.parse(value);
      if (parsed && parsed.prescriptionId) prescriptionId = parsed.prescriptionId;
    } catch {}
    try {
      const res = await axiosInstance.get(`/prescriptions/${prescriptionId.trim()}`);
      const details = res.data.data;
      if (details) {
        setPrescriptionDetails(details);
        setPrescriptionModalOpen(true);
      } else {
        setPrescriptionDetails(null);
        setPrescriptionModalOpen(false);
        setPrescriptionError("Prescription not found.");
      }
    } catch (error) {
      setPrescriptionDetails(null);
      setPrescriptionModalOpen(false);
      setPrescriptionError("Prescription not found or error fetching prescription.");
    } finally {
      setPrescriptionLoading(false);
    }
  };

  return (
    <PharmacistPageContainer
      title="Prescription Management"
      description="View and manage prescriptions to be filled."
    >
      <PharmacistCard
        title="Prescriptions List"
        actions={
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by patient or medication"
              className="border rounded px-2 py-1 text-sm"
              style={{ minWidth: 220 }}
            />
            <input
              type="text"
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              placeholder="Enter Prescription ID"
              className="border rounded px-2 py-1 text-sm"
              style={{ minWidth: 180 }}
            />
            <Button variant="outline" onClick={handleManualFetch}>
              Fetch by ID
            </Button>
            <Button variant="outline" onClick={() => setQrDialogOpen(true)}>
              Scan QR
            </Button>
          </div>
        }
      >
        <div className="rounded-md border overflow-x-auto ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading prescription data...
                  </TableCell>
                </TableRow>
              ) : filteredPrescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrescriptions.map((prescription) => {
                  const meds = Array.isArray(prescription.medications) ? prescription.medications : [];
                  return (
                    <TableRow
                      key={prescription.id}
                      className="hover:bg-muted/40 transition-colors duration-200"
                    >
                      <TableCell>{prescription.patientName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {meds.map(med => (
                            <span key={med._id || med.name} className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                              {med.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {meds.map(med => med.dosage).join(', ')}
                      </TableCell>
                      <TableCell>
                        {meds.map(med => med.frequency).join(', ')}
                      </TableCell>
                      <TableCell>{prescription.issueDate ? new Date(prescription.issueDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={prescription.status?.toLowerCase() === 'pending' ? 'warning' : prescription.status?.toLowerCase() === 'filled' ? 'success' : 'secondary'}>
                          {prescription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(prescription.id)}
                          className="text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {prescription.status?.toLowerCase() === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(prescription.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Dispense
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {manualError && (
          <div className="text-red-500 text-sm mb-2">{manualError}</div>
        )}
      </PharmacistCard>
      {prescriptionModalOpen && prescriptionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative flex flex-col" style={{ height: '80vh' }}>
            <div className="p-6 border-b border-border sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold mb-2">Prescription Details</h2>
              <div className="font-semibold text-lg mb-1">Patient: <span className="text-primary">{prescriptionDetails.patientName}</span></div>
              <div className="text-sm text-muted-foreground mb-1">Doctor: {prescriptionDetails.doctorName || '-'} {prescriptionDetails.doctorSpecialty ? `(${prescriptionDetails.doctorSpecialty})` : ''}</div>
              <div className="text-sm text-muted-foreground mb-1">Date: {prescriptionDetails.date ? new Date(prescriptionDetails.date).toLocaleDateString() : (prescriptionDetails.issueDate || '-')}</div>
              <div className="text-sm text-muted-foreground mb-1">Status: <span className="font-semibold">{prescriptionDetails.status?.toUpperCase() || '-'}</span></div>
              {prescriptionDetails.notes && <div className="text-sm text-muted-foreground mb-1">Notes: {prescriptionDetails.notes}</div>}
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-semibold mb-2 text-lg">Medicines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(prescriptionDetails.medications || [{
                  name: prescriptionDetails.medication,
                  dosage: prescriptionDetails.dosage,
                  frequency: prescriptionDetails.frequency
                }]).map((med, idx) => {
                  const refillCount = med.refillCount || 0;
                  const refillLimit = med.refillLimit ?? 1;
                  const atLimit = refillCount >= refillLimit;
                  const isViewOnly = (prescriptionDetails.status?.toLowerCase() === 'expired') || (prescriptionDetails.medications && prescriptionDetails.medications.every(m => (m.refillCount || 0) >= (m.refillLimit ?? 1)));
                  return (
                    <div key={med._id || idx} className="border rounded-lg p-4 bg-muted/50 flex flex-col gap-2 shadow-sm">
                      <div className="font-bold text-primary text-base">{med.name}</div>
                      <div className="text-sm">Dosage: <span className="font-medium">{med.dosage}</span></div>
                      <div className="text-sm">Frequency: <span className="font-medium">{med.frequency}</span></div>
                      {med.duration && <div className="text-sm">Duration: <span className="font-medium">{med.duration}</span></div>}
                      {med.route && <div className="text-sm">Route: <span className="font-medium">{med.route}</span></div>}
                      {med.instructions && <div className="text-sm">Instructions: <span className="font-medium">{med.instructions}</span></div>}
                      <div className="text-sm mt-1">Refills: <span className="font-semibold text-success">{refillCount}</span> / <span className="font-semibold">{refillLimit}</span></div>
                      <div className="flex items-center gap-2 mt-2">
                        {atLimit && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Done</span>
                        )}
                        {!isViewOnly && !atLimit && (
                          <>
                            <input
                              type="checkbox"
                              checked={!!dispenseDraft[med._id]?.checked}
                              disabled={isViewOnly || atLimit}
                              onChange={e => handleCheck(med._id, e.target.checked)}
                              className="accent-primary h-4 w-4"
                            />
                            <input
                              type="number"
                              min={1}
                              max={refillLimit - refillCount}
                              value={dispenseDraft[med._id]?.quantity || 1}
                              disabled={isViewOnly || atLimit || !dispenseDraft[med._id]?.checked}
                              onChange={e => handleQuantity(med._id, e.target.value, refillLimit - refillCount)}
                              className="w-16 border rounded px-1 py-0.5 text-sm"
                            />
                            <span className="text-xs text-muted-foreground">box(es)</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-6 border-t border-border sticky bottom-0 bg-white z-10 flex flex-col gap-2">
              {(() => {
                const isExpired = (prescriptionDetails.status?.toLowerCase() === 'expired');
                const isFilled = (prescriptionDetails.status?.toLowerCase() === 'filled');
                const canDispense = !isExpired && !isFilled;
                const isViewOnly = isExpired || (prescriptionDetails.medications && prescriptionDetails.medications.every(med => (med.refillCount || 0) >= (med.refillLimit ?? 1)));
                const hasStaged = dispenseDraft && prescriptionDetails.medications && prescriptionDetails.medications.some(
                  med => {
                    const draft = dispenseDraft[med._id];
                    return draft && draft.checked && draft.quantity > 0 && (med.refillCount || 0) < (med.refillLimit ?? 1);
                  }
                );
                return !isViewOnly && canDispense ? (
                  <Button
                    variant="primary"
                    onClick={handleSaveDispense}
                    disabled={saveLoading || !hasStaged}
                  >
                    {saveLoading ? 'Saving...' : 'Save'}
                  </Button>
                ) : null;
              })()}
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {qrDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-2">Scan Prescription QR Code</h2>
            <QRCodeScanner
              onUpdate={(err, result) => {
                if (result) handleQRScanned(result.text);
              }}
              width={350}
              height={250}
            />
            <Button variant="secondary" className="mt-4" onClick={() => setQrDialogOpen(false)}>
              Close
            </Button>
            <div className="text-xs text-yellow-700 mt-2">
              Tip: Hold the QR code steady and fill as much of the frame as possible.
            </div>
            {qrValue && (
              <div className="mt-4 text-sm text-primary font-mono break-all border-t pt-2">
                Last scanned: {qrValue}
              </div>
            )}
            {prescriptionLoading && <div className="text-muted-foreground mt-2">Loading prescription...</div>}
            {prescriptionError && <div className="text-red-500 mt-2">{prescriptionError}</div>}
          </div>
        </div>
      )}
    </PharmacistPageContainer>
  );
}