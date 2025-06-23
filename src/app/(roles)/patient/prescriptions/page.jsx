'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import PageHeader from '@/components/patient/PageHeader';
import { mockPatientData } from '@/mockdata/patientData';
import {
    Pill,
    Calendar,
    User,
    Clock,
    Download,
    Printer,
    AlertCircle,
    Check,
    X,
    QrCode,
    Eye,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Separator } from '@/components/ui/Separator';
import { Input } from '@/components/ui/Input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/DropdownMenu';
import { ChevronDown, ListFilter, Search } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { Tooltip } from '@/components/ui/Tooltip';
const pillColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-yellow-100 text-yellow-800',
  'bg-indigo-100 text-indigo-800',
];

const getPillColor = (idx) => pillColors[idx % pillColors.length];

const AnimatedStatusBadge = ({ status }) => {
  const animated = status === 'active' || status === 'pending';
  return (
    <span className={animated ? 'animate-pulse' : ''}>
      <StatusBadge status={status} size="medium" className="shadow-sm" />
    </span>
  );
};

const PrescriptionCard = ({ prescription, onShowQR, onViewDetails }) => {
    const notesPreview = prescription.notes ? prescription.notes.slice(0, 60) + (prescription.notes.length > 60 ? '...' : '') : null;
    return (
        <Card
            bordered
            hoverable
            className="flex flex-col min-h-[370px] h-full transition-all duration-300 group shadow-md hover:shadow-2xl hover:scale-[1.03] border-border/80 hover:border-primary/60 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-background via-blue-50/60 to-background dark:via-blue-900/10 rounded-xl"
        >
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2 border-b border-border bg-gradient-to-r from-primary/10 to-blue-100/30 dark:from-primary/20 dark:to-blue-900/10 rounded-t-xl">
                <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm rounded-xl">
                    <AvatarImage src={prescription.doctorPhoto} alt={prescription.doctorName} />
                    <AvatarFallback>
                        <User className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{prescription.doctorName}</CardTitle>
                    {prescription.doctorSpecialty && (
                      <div className="text-xs text-blue-700/80 dark:text-blue-300/80 font-medium truncate">{prescription.doctorSpecialty}</div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(prescription.date).toLocaleDateString()}</span>
                        <span className="mx-2 text-border">|</span>
                        <span className="font-mono text-[11px] text-primary/80">#{prescription.id}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 min-w-fit">
                    <AnimatedStatusBadge status={prescription.status} />
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-2 p-4">
                <div className="mb-2 flex flex-col gap-1">
                    <span className="font-semibold text-sm text-foreground">Medications:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {prescription.medications.map((medication, index) => (
                            <span
                                key={index}
                                className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-semibold border border-border shadow-sm ${getPillColor(index)}`}
                                aria-label={`Medication: ${medication.name}`}
                            >
                                <Pill className="w-3.5 h-3.5" />
                                {medication.name}
                            </span>
                        ))}
                    </div>
                </div>
                {notesPreview && (
                  <div className="mt-2 text-xs text-muted-foreground italic truncate" title={prescription.notes}>
                    <span className="font-medium text-foreground">Doctor's Notes:</span> {notesPreview}
                  </div>
                )}
            </CardContent>
            <div className="border-t border-border w-full" />
            <CardFooter className="flex gap-2 justify-end p-4 pt-2 bg-background/80 backdrop-blur-sm rounded-b-xl">
                <Tooltip content="View Details">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(prescription)}
                        className="text-primary focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="View Details"
                        tabIndex={0}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </Tooltip>
                {(prescription.status === 'active' || prescription.status === 'pending') && (
                    <Tooltip content="Show QR Code">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onShowQR(prescription)}
                            className="text-primary focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="Show QR Code"
                            tabIndex={0}
                        >
                            <QrCode className="w-4 h-4" />
                        </Button>
                    </Tooltip>
                )}
                <Tooltip content="Download">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Download"
                        tabIndex={0}
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </Tooltip>
                <Tooltip content="Print">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Print"
                        tabIndex={0}
                    >
                        <Printer className="w-4 h-4" />
                    </Button>
                </Tooltip>
            </CardFooter>
        </Card>
    );
};
const PrescriptionDetailDialog = ({ open, onClose, prescription, onShowQR }) => {
    if (!prescription) return null;
    const statusColors = {
        active: 'bg-success/10 text-success',
        completed: 'bg-info/10 text-info',
        expired: 'bg-error/10 text-error',
        pending: 'bg-warning/10 text-warning',
    };
    const statusIcons = {
        active: <Check className="w-4 h-4" />,
        completed: <Check className="w-4 h-4" />,
        expired: <X className="w-4 h-4" />,
        pending: <AlertCircle className="w-4 h-4" />,
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-6">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-bold text-foreground">Prescription Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 -mr-2">
                    <div className="flex items-center gap-4 p-4 bg-info/10 rounded-lg">
                        <Avatar className="h-20 w-20 border-4 border-info/20 shadow-md">
                            <AvatarImage src={prescription.doctorPhoto} alt={prescription.doctorName} />
                            <AvatarFallback>
                                <User className="h-10 w-10 text-info" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-foreground">Dr. {prescription.doctorName}</h3>
                            <div className="flex items-center gap-2 text-md text-muted-foreground mt-1">
                                <Calendar className="w-5 h-5" />
                                <span>Prescribed on: {new Date(prescription.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-md text-muted-foreground mt-1">
                                <Clock className="w-5 h-5" />
                                <span>Valid until: {new Date(prescription.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Badge variant="outline" className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[prescription.status]}`}>
                            {statusIcons[prescription.status]}
                            <span className="ml-2">{prescription.status}</span>
                        </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-foreground">Medications ({prescription.medications.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {prescription.medications.map((medication, index) => (
                                <Card key={index} className="p-4 border border-border shadow-sm transition-shadow hover:shadow-md">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <Pill className="w-5 h-5" />
                                            </div>
                                            <h5 className="font-bold text-lg text-foreground">{medication.name}</h5>
                                        </div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                                            <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                                            {medication.instructions && (
                                                <p><span className="font-medium">Instructions:</span> {medication.instructions}</p>
                                            )}
                                            {medication.notes && (
                                                <p><span className="font-medium">Notes:</span> {medication.notes}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                    {prescription.notes && (
                        <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
                            <h4 className="text-xl font-semibold text-foreground">Doctor's Notes</h4>
                            <p className="text-muted-foreground leading-relaxed">{prescription.notes}</p>
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4 mt-4 border-t border-border flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6 py-2">
                        Close
                    </Button>
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Button onClick={() => onShowQR(prescription)} className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <QrCode className="w-5 h-5 mr-2" />
                            Show QR Code
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
const QRCodeDialog = ({ open, onClose, prescription }) => {
    if (!prescription) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-6 text-center">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-bold text-foreground">Prescription QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-4 bg-info/10 rounded-lg border border-info/20">
                    <p className="text-md text-info font-medium">
                        Scan this code at the pharmacy to get your prescription
                    </p>
                    <div className="p-5 bg-card rounded-lg shadow-xl border-4 border-primary/30">
                        <QRCodeSVG
                            value={JSON.stringify({
                                id: prescription.id,
                                doctor: prescription.doctorName,
                                date: prescription.date,
                                medications: prescription.medications.map(med => med.name).join(', '),
                                patientId: mockPatientData.id,
                                patientName: mockPatientData.name,
                            })}
                            size={250}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                        <p><span className="font-semibold">Prescription ID:</span> {prescription.id}</p>
                        <p><span className="font-semibold">Medications:</span> {prescription.medications.map(med => med.name).join(', ')}</p>
                    </div>
                </div>
                <DialogFooter className="pt-4 mt-4 border-t border-border flex justify-end">
                    <Button variant="outline" onClick={onClose} className="px-6 py-2">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
const PrescriptionsPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    useEffect(() => {
        loadPrescriptions();
    }, [filterStatus, searchTerm, sortBy, sortOrder]);
    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            setError(null);
            let filtered = mockPatientData.prescriptions || [];
            if (searchTerm) {
                filtered = filtered.filter(
                    (p) =>
                        p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.medications.some((m) =>
                            m.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                );
            }
            if (filterStatus !== 'all') {
                filtered = filtered.filter((p) => p.status === filterStatus);
            }
            filtered.sort((a, b) => {
                let comparison = 0;
                if (sortBy === 'date') {
                    comparison = new Date(a.date) - new Date(b.date);
                } else if (sortBy === 'doctorName') {
                    comparison = a.doctorName.localeCompare(b.doctorName);
                }
                return sortOrder === 'asc' ? comparison : -comparison;
            });
            setPrescriptions(filtered);
        } catch (err) {
            setError('Failed to load prescriptions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleShowQR = (prescription) => {
        setSelectedPrescription(prescription);
        setIsQrDialogOpen(true);
    };
    const handleViewDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setIsDetailDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedPrescription(null);
    };
    const handleCloseQrDialog = () => {
        setIsQrDialogOpen(false);
        setSelectedPrescription(null);
    };
    const handleRetry = () => {
        loadPrescriptions();
    };
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <PageHeader
                title="My Prescriptions"
                description="View and manage all your active, past, and pending prescriptions."
            />
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-auto flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search prescriptions by doctor or medication..."
                        className="w-full pl-9 pr-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 w-full justify-center sm:w-auto">
                                <ListFilter className="w-4 h-4" />
                                Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card border-border">
                            <DropdownMenuLabel className="text-foreground">Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                                <DropdownMenuRadioItem value="all" className="text-foreground hover:bg-accent">
                                    All
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active" className="text-foreground hover:bg-accent">
                                    Active
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="completed" className="text-foreground hover:bg-accent">
                                    Completed
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="pending" className="text-foreground hover:bg-accent">
                                    Pending
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="expired" className="text-foreground hover:bg-accent">
                                    Expired
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 w-full justify-center sm:w-auto">
                                <ListFilter className="w-4 h-4" />
                                Sort: {sortBy === 'date' ? 'Date' : 'Doctor'} ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card border-border">
                            <DropdownMenuLabel className="text-foreground">Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                <DropdownMenuRadioItem value="date" className="text-foreground hover:bg-accent">
                                    Date
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="doctorName" className="text-foreground hover:bg-accent">
                                    Doctor Name
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                                <DropdownMenuRadioItem value="asc" className="text-foreground hover:bg-accent">
                                    Ascending
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="desc" className="text-foreground hover:bg-accent">
                                    Descending
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {loading && (
                <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">Loading prescriptions...</p>
                </div>
            )}
            {error && (
                <div className="text-center py-10">
                    <p className="text-lg text-destructive">{error}</p>
                    <Button onClick={handleRetry} className="mt-4">Retry</Button>
                </div>
            )}
            {!loading && !error && ( (prescriptions.length === 0 && searchTerm === '') ? (
                <div className="bg-card p-6 rounded-lg shadow-sm text-center py-10 border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-3">No Prescriptions Found</h3>
                    <p className="text-muted-foreground mb-4">It looks like you don't have any prescriptions recorded yet.</p>
                    <p className="text-sm text-muted-foreground">Prescriptions will appear here once issued by your doctor.</p>
                </div>
            ) : (prescriptions.length === 0 && searchTerm !== '') ? (
                <div className="bg-card p-6 rounded-lg shadow-sm text-center py-10 border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-3">No Matching Prescriptions</h3>
                    <p className="text-muted-foreground mb-4">Your search for "{searchTerm}" did not yield any results.</p>
                    <Button onClick={() => setSearchTerm('')} className="mt-4">Clear Search</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {prescriptions.map((prescription) => (
                        <PrescriptionCard
                            key={prescription.id}
                            prescription={prescription}
                            onShowQR={handleShowQR}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ))}
            <PrescriptionDetailDialog
                open={isDetailDialogOpen}
                onClose={handleCloseDialog}
                prescription={selectedPrescription}
                onShowQR={handleShowQR}
            />
            <QRCodeDialog
                open={isQrDialogOpen}
                onClose={handleCloseQrDialog}
                prescription={selectedPrescription}
            />
        </div>
    );
};
export default PrescriptionsPage; 