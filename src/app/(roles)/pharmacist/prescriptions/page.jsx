'use client';
import { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle, X } from 'lucide-react';
import { PharmacistPageContainer, PharmacistCard } from '@/components/pharmacist/PharmacistComponents';
import { SearchField } from '@/components/ui/Notification';
import { getPrescriptions, updatePrescriptionStatus } from '@/services/pharmacistService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import dynamic from 'next/dynamic';
import { Html5Qrcode } from 'html5-qrcode';
const QrReader = dynamic(() => import('@blackbox-vision/react-qr-reader').then(mod => mod.QrReader), { ssr: false });
function PrescriptionDetailDialog({ open, onClose, prescription }) {
  if (!prescription) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="font-bold">Prescription Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Patient</p>
            <p className="font-medium">{prescription.patientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Medication</p>
            <p className="font-medium">{prescription.medication}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Dosage</p>
            <p>{prescription.dosage}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Frequency</p>
            <p>{prescription.frequency}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Issue Date</p>
            <p>{prescription.issueDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={prescription.status === 'Pending' ? 'warning' : 'success'}>
              {prescription.status}
            </Badge>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {prescription.status === 'Pending' && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={onClose}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Filled
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default function PharmacistPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrError, setQrError] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const html5QrRef = useRef(null);
  const qrContainerId = 'html5qr-code-full-region';
  useEffect(() => {
    async function loadPrescriptions() {
      try {
        setLoading(true);
        const data = await getPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, []);
  // Debug: List available video input devices and store in state
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoInputs);
        videoInputs.forEach((device, idx) => {
          console.log(`Camera ${idx}: label=${device.label}, id=${device.deviceId}`);
        });
      });
    } else {
      console.log('navigator.mediaDevices.enumerateDevices not supported');
    }
  }, []);
  const filteredPrescriptions = searchTerm
    ? prescriptions.filter(prescription =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : prescriptions;
  const handleViewDetails = (prescriptionId) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      setSelectedPrescription(prescription);
      setDetailDialogOpen(true);
    }
  };
  const handleMarkAsFilled = async (prescriptionId) => {
    try {
      const updatedPrescription = await updatePrescriptionStatus(prescriptionId, 'Filled');
      setPrescriptions(prev => prev.map(prescription =>
        prescription.id === prescriptionId ? updatedPrescription : prescription
      ));
    } catch (error) {
      console.error('Error updating prescription status:', error);
    }
  };
  // QR code scan handler
  const handleScan = (data) => {
    if (data) {
      setQrDialogOpen(false);
      setQrError('');
      // Assume QR code contains prescription ID
      const prescriptionId = data.trim();
      handleViewDetails(prescriptionId);
    }
  };
  useEffect(() => {
    if (qrDialogOpen) {
      setQrError('');
      if (html5QrRef.current) {
        html5QrRef.current.clear().catch(() => {});
      }
      const qr = new Html5Qrcode(qrContainerId);
      html5QrRef.current = qr;
      qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          handleScan(decodedText);
          setQrError('');
          qr.stop().catch(() => {});
        },
        (errorMessage) => {
          // Only show real errors
          if (
            errorMessage &&
            !errorMessage.includes('No QR code found') &&
            !errorMessage.includes('has been stopped')
          ) {
            setQrError('QR Scan Error: ' + errorMessage);
          }
        }
      ).catch((err) => {
        setQrError('Camera error: ' + (err.message || String(err)));
      });
    }
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.clear().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrDialogOpen]);
  return (
    <PharmacistPageContainer
      title="Prescription Management"
      description="View and manage prescriptions to be filled."
    >
      <PharmacistCard
        title="Prescriptions List"
        actions={
          <div className="flex gap-2 items-center">
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Prescriptions"
            />
            <Button variant="outline" onClick={() => setQrDialogOpen(true)}>
              Scan QR
            </Button>
          </div>
        }
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
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
                    Loading prescriptions data...
                  </TableCell>
                </TableRow>
              ) : filteredPrescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <TableRow
                    key={prescription.id}
                    className="hover:bg-muted/40 transition-colors duration-200"
                  >
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.medication}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.frequency}</TableCell>
                    <TableCell>{prescription.issueDate}</TableCell>
                    <TableCell>
                      <Badge variant={prescription.status === 'Pending' ? 'warning' : 'success'}>
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
                      {prescription.status === 'Pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsFilled(prescription.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Filled
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </PharmacistCard>
      <PrescriptionDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        prescription={selectedPrescription}
      />
      {/* QR Code Reader Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Prescription QR Code</DialogTitle>
            <DialogDescription>
              Please allow camera access to scan the prescription QR code. If you have denied camera access, enable it in your browser settings.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div id={qrContainerId} style={{ width: 300, height: 300 }} />
            {qrError && <div className="text-red-500 text-sm">{qrError}</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PharmacistPageContainer>
  );
}