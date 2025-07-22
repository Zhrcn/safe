'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import PageHeader from '@/components/patient/PageHeader';
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
    Sun,
    Moon,
    Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage, getInitialsFromName } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Separator } from '@/components/ui/Separator';
import { Input } from '@/components/ui/Input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/DropdownMenu';
import { ChevronDown, ListFilter, Search } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPrescriptions } from '@/store/slices/patient/prescriptionsSlice';
import { useTheme } from '@/components/ThemeProviderWrapper';

const pillColors = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
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
    const { t } = useTranslation('common');
    if (!prescription) return null;
    const statusMap = {
        active: { label: t('patient.prescriptions.active'), className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <Check className="w-4 h-4" /> },
        completed: { label: t('patient.prescriptions.completed'), className: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Check className="w-4 h-4" /> },
        pending: { label: t('patient.prescriptions.pending'), className: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-4 h-4" /> },
        expired: { label: t('patient.prescriptions.expired'), className: 'bg-red-100 text-red-700 border-red-200', icon: <X className="w-4 h-4" /> },
        default: { label: t('patient.prescriptions.unknownStatus'), className: 'bg-gray-100 text-gray-700 border-gray-200', icon: <AlertCircle className="w-4 h-4" /> },
    };
    const status = prescription.status || 'default';
    const statusInfo = statusMap[status] || statusMap.default;
    const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : t('patient.prescriptions.unknownDoctor');
    const doctorSpecialty = prescription.doctorSpecialty || t('patient.prescriptions.unknownSpecialty');
    const doctorPhoto = prescription.doctorPhoto || null;
    const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : t('patient.prescriptions.noDate');
    const expiryDate = prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : t('patient.prescriptions.noEndDate');
    const diagnosis = prescription.diagnosis || t('patient.prescriptions.noDiagnosis');
    const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
    return (
        <Card className="group hover:shadow-2xl transition-all border border-border bg-card flex flex-col h-full relative rounded-2xl focus-within:ring-2 focus-within:ring-primary outline-none">
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border shadow-sm ${statusInfo.className}`}>{statusInfo.icon}{statusInfo.label}</span>
            </div>
            <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex-1 space-y-3 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-12 w-12 border-2 border-primary/30 shadow">
                            {doctorPhoto ? (
                                <AvatarImage src={doctorPhoto} alt={doctorName} />
                            ) : (
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                    {getInitialsFromName(doctorName)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">{doctorName}</h3>
                            <p className="text-xs text-muted-foreground font-medium truncate">{doctorSpecialty}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{prescriptionDate}</span>
                        <span className="mx-2">|</span>
                        <Clock className="h-4 w-4" />
                        <span>{expiryDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Pill className="h-4 w-4 text-primary" />
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{t('patient.prescriptions.medications')}: <b>{medications.length}</b></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-4 w-4 text-blue-400" />
                        <span className="truncate" title={diagnosis}>{diagnosis}</span>
                    </div>
                </div>
                <div className="flex items-end gap-3">
                    <Tooltip content={t('patient.prescriptions.viewDetails')}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(prescription)}
                            className="focus:ring-2 focus:ring-primary"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            {t('patient.prescriptions.viewDetails')}
                        </Button>
                    </Tooltip>
                </div>
            </CardContent>
        </Card>
    );
};

const PrescriptionDetailDialog = ({ open, onClose, prescription, onShowQR }) => {
    const { t } = useTranslation('common');
    if (!prescription) return null;
    const statusMap = {
        active: { label: t('patient.prescriptions.active'), className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <Check className="w-4 h-4" /> },
        completed: { label: t('patient.prescriptions.completed'), className: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Check className="w-4 h-4" /> },
        pending: { label: t('patient.prescriptions.pending'), className: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-4 h-4" /> },
        expired: { label: t('patient.prescriptions.expired'), className: 'bg-red-100 text-red-700 border-red-200', icon: <X className="w-4 h-4" /> },
        default: { label: t('patient.prescriptions.unknownStatus'), className: 'bg-gray-100 text-gray-700 border-gray-200', icon: <AlertCircle className="w-4 h-4" /> },
    };
    const status = prescription.status || 'default';
    const statusInfo = statusMap[status] || statusMap.default;
    const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : t('patient.prescriptions.unknownDoctor');
    const doctorSpecialty = prescription.doctorSpecialty || t('patient.prescriptions.unknownSpecialty');
    const doctorPhoto = prescription.doctorPhoto || null;
    const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : t('patient.prescriptions.noDate');
    const prescriptionEndDate = prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : t('patient.prescriptions.noEndDate');
    const prescriptionId = prescription.id || t('patient.prescriptions.noId');
    const diagnosis = prescription.diagnosis || t('patient.prescriptions.noDiagnosis');
    const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
    const dispenseHistory = Array.isArray(prescription.dispenseHistory) ? prescription.dispenseHistory : [];
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full p-0 rounded-2xl bg-card border border-border overflow-hidden"> 
                <div className="bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/30 shadow">
                            {doctorPhoto ? (
                                <AvatarImage src={doctorPhoto} alt={doctorName} />
                            ) : (
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                    {getInitialsFromName(doctorName)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Pill className="w-5 h-5 text-primary" /> 
                                {t('patient.prescriptions.prescriptionDetails')}
                            </DialogTitle>
                            <div className="text-xs text-muted-foreground font-medium mt-1">{doctorName}</div>
                            <div className="text-xs text-muted-foreground font-medium">{doctorSpecialty}</div>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border shadow-sm ${statusInfo.className}`}>{statusInfo.icon}{statusInfo.label}</span>
                </div>
                <div className="p-4 space-y-4"> 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> 
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> <b>{t('patient.prescriptions.prescribedOn')}</b>: {prescriptionDate}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> <b>{t('patient.prescriptions.validUntil')}</b>: {prescriptionEndDate}</span>
                            <span className="text-xs text-muted-foreground"><b>{t('patient.prescriptions.prescriptionID')}</b>: {prescriptionId}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Info className="h-3 w-3 text-blue-400" /> <b>{t('patient.prescriptions.diagnosis')}</b>: {diagnosis}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Pill className="h-3 w-3 text-primary" /> <b>{t('patient.prescriptions.medications')}</b>: {medications.length}</span>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="text-base font-semibold text-foreground mb-1 flex items-center gap-1"><Pill className="h-4 w-4 text-primary" />{t('patient.prescriptions.medications')}</h4>
                        <ul className="space-y-1">
                            {medications.length > 0 ? medications.map((medication, index) => (
                                <li key={index} className="border border-border rounded-lg p-2 bg-muted/30">
                                    <div className="font-semibold text-primary mb-0.5 flex items-center gap-1"><Pill className="h-3 w-3 text-primary" />{medication?.name || t('patient.prescriptions.unknownMedication')}</div>
                                    <div className="text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1">
                                        <span><b>{t('patient.prescriptions.dosage')}:</b> {medication?.dosage || t('patient.prescriptions.noDosage')}</span>
                                        <span><b>{t('patient.prescriptions.frequency')}:</b> {medication?.frequency || t('patient.prescriptions.noFrequency')}</span>
                                        {medication?.duration && <span><b>{t('patient.prescriptions.duration')}:</b> {medication.duration}</span>}
                                        {medication?.route && <span><b>{t('patient.prescriptions.route')}:</b> {medication.route}</span>}
                                        {medication?.instructions && <span className="md:col-span-2"><b>{t('patient.prescriptions.instructions')}:</b> {medication.instructions}</span>}
                                    </div>
                                </li>
                            )) : <span className="text-xs text-muted-foreground">{t('patient.prescriptions.noMedications')}</span>}
                        </ul>
                    </div>
                    {diagnosis && (
                        <div className="bg-muted/40 rounded-lg p-2 border border-border">
                            <h4 className="text-base font-semibold text-foreground mb-1 flex items-center gap-1"><Info className="h-4 w-4 text-blue-400" />{t('patient.prescriptions.diagnosis')}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{diagnosis}</p>
                        </div>
                    )}
                    {prescription.notes && (
                        <div className="bg-muted/40 rounded-lg p-2 border border-border">
                            <h4 className="text-base font-semibold text-foreground mb-1">{t('patient.prescriptions.doctorsNotes')}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{prescription.notes}</p>
                        </div>
                    )}
                    {dispenseHistory.length > 0 && (
                        <div className="bg-muted/40 rounded-lg p-2 border border-border">
                            <h4 className="text-base font-semibold text-foreground mb-1">{t('patient.prescriptions.dispenseHistory')}</h4>
                            <ul className="space-y-1">
                                {dispenseHistory.map((entry, idx) => (
                                    <li key={idx} className="flex flex-col md:flex-row md:items-center md:gap-2 text-xs text-muted-foreground border-b border-border pb-1 last:border-b-0 last:pb-0">
                                        <span><b>{t('patient.prescriptions.pharmacist')}:</b> {entry.pharmacistId || '-'}</span>
                                        <span><b>{t('patient.prescriptions.date')}:</b> {entry.dispenseDate ? new Date(entry.dispenseDate).toLocaleDateString() : '-'}</span>
                                        <span><b>{t('patient.prescriptions.quantityDispensed')}:</b> {entry.quantityDispensed || '-'}</span>
                                        {entry.pharmacyNotes && <span><b>{t('patient.prescriptions.pharmacyNotes')}:</b> {entry.pharmacyNotes}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <DialogFooter className="py-2 my-2 mx-4 border-t border-border flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-4 m-2 py-1.5"
                    >
                        {t('patient.prescriptions.close')}
                    </Button>
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Tooltip content={t('patient.prescriptions.showQRCode')}>
                            <Button
                                variant="info"
                                onClick={() => onShowQR(prescription)}
                                className="px-4 m-2 py-1.5 focus:ring-2 focus:ring-primary"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                {t('patient.prescriptions.showQRCode')}
                            </Button>
                        </Tooltip>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const QRCodeDialog = ({ open, onClose, prescription }) => {
    const { t } = useTranslation('common');
    if (!prescription) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full p-6 rounded-2xl bg-card border border-border text-center">
                <DialogHeader className="mb-2"> 
                    <DialogTitle className="text-xl font-bold text-foreground">{t('patient.prescriptions.prescriptionQRCode')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4 py-2"> 
                    <p className="text-sm text-info font-medium">
                        {t('patient.prescriptions.scanThisCodeAtThePharmacyToGetYourPrescription')}
                    </p>
                    <div className="p-3 bg-background rounded-2xl shadow border-2 border-primary/30">
                        <QRCodeSVG
                            value={JSON.stringify({
                                id: prescription.id,
                                doctor: prescription.doctorName,
                                date: prescription.date,
                                medications: (Array.isArray(prescription.medications) ? prescription.medications : []).map(med => med.name).join(', '),
                                patientId: prescription.patientId || '',
                                patientName: prescription.patientName || '',
                            })}
                            size={180} 
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        <p><span className="font-semibold">{t('patient.prescriptions.prescriptionID')}:</span> {prescription?.id}</p>
                        <p><span className="font-semibold">{t('patient.prescriptions.medications')}:</span> {(Array.isArray(prescription?.medications) ? prescription.medications : []).map(med => med?.name).join(', ')}</p>
                    </div>
                </div>
                <DialogFooter className="pt-2 mt-2 border-t border-border flex justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-4 py-1.5"
                    >
                        {t('patient.prescriptions.close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const PrescriptionsPage = () => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();
    const { prescriptions: prescriptionsSafe, isLoading, error } = useSelector((state) => state.prescriptions);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    useEffect(() => {
        dispatch(fetchPrescriptions());
    }, [dispatch]);

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
        dispatch(fetchPrescriptions());
    };

    const filteredPrescriptions = (prescriptionsSafe || [])
        .filter(p => p && (filterStatus === 'all' || p.status === filterStatus))
        .filter(p => {
            if (!searchTerm || !p) return true;
            const term = searchTerm.toLowerCase();
            return (
                (p.doctorName && p.doctorName.toLowerCase().includes(term)) ||
                (p.medications && Array.isArray(p.medications) && p.medications.some(med => med && med.name && med.name.toLowerCase().includes(term))) ||
                (p.notes && p.notes.toLowerCase().includes(term)) ||
                (p.id && String(p.id).toLowerCase().includes(term))
            );
        })
        .sort((a, b) => {
            if (!a || !b) return 0;
            if (sortBy === 'date') {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (sortBy === 'doctorName') {
                const nameA = (a.doctorName || '').toLowerCase();
                const nameB = (b.doctorName || '').toLowerCase();
                if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
                if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            }
            return 0;
        });

    return (
        <div className={`min-h-screen bg-card dark:bg-background p-4 sm:p-8 lg:p-12 transition-colors duration-300 ${currentTheme === 'safeNight' ? 'dark' : ''}`}>
            
            <PageHeader
                title={t('patient.prescriptions.title')}
                description={t('patient.prescriptions.description')}
            />
            <div className="mb-8 flex flex-col sm:flex-row gap-6 justify-between items-center bg-muted/40 border border-border rounded-2xl p-4">
                <div className="relative w-full sm:w-auto flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('patient.prescriptions.searchPlaceholder')}
                        className="w-full pl-11 pr-3 py-3 border border-border rounded-2xl focus:ring-primary focus:border-primary text-base shadow-none bg-white dark:bg-background dark:text-blue-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 w-full justify-center sm:w-auto text-base px-5 py-3 rounded-xl shadow bg-white dark:bg-blue-950/30 dark:text-blue-100"
                            >
                                <ListFilter className="w-5 h-5" />
                                {t('patient.prescriptions.status')}
                                {': '}
                                {t(`patient.prescriptions.${filterStatus}`)}
                                <ChevronDown className="w-5 h-5 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card dark:bg-blue-950/30 border-border rounded-xl shadow-lg">
                            <DropdownMenuLabel className="text-foreground">{t('patient.prescriptions.status')}</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                                <DropdownMenuRadioItem value="all" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.all')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.active')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="completed" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.completed')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="pending" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.pending')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="expired" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.expired')}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 w-full justify-center sm:w-auto text-base px-5 py-3 rounded-xl shadow bg-white dark:bg-blue-950/30 dark:text-blue-100"
                            >
                                <ListFilter className="w-5 h-5" />
                                <span>
                                    {t('patient.prescriptions.sort')}
                                    {': '}
                                    {sortBy === 'date' ? t('patient.prescriptions.date') : t('patient.prescriptions.doctorName')}
                                    {` (${sortOrder === 'asc' ? t('patient.prescriptions.ascending') : t('patient.prescriptions.descending')})`}
                                </span>
                                <ChevronDown className="w-5 h-5 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card dark:bg-blue-950/30 border-border rounded-xl shadow-lg">
                            <DropdownMenuLabel className="text-foreground">{t('patient.prescriptions.sort')}</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                <DropdownMenuRadioItem value="date" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.date')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="doctorName" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.doctorName')}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                                <DropdownMenuRadioItem value="asc" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.ascending')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="desc" className="text-foreground hover:bg-accent">
                                    {t('patient.prescriptions.descending')}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {isLoading && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="bg-card rounded-2xl shadow p-8 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid mb-4" />
                        <p className="text-xl text-muted-foreground">{t('patient.prescriptions.loadingPrescriptions')}</p>
                    </div>
                </div>
            )}
            {error && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="bg-card rounded-2xl shadow p-8 flex flex-col items-center">
                        <AlertCircle className="w-10 h-10 text-danger mb-2" />
                        <p className="text-xl text-danger mb-2">{error}</p>
                        <Button
                            onClick={handleRetry}
                            variant="outline"
                            className="mt-2"
                        >
                            {t('patient.prescriptions.retry')}
                        </Button>
                    </div>
                </div>
            )}
            {!isLoading && !error && (filteredPrescriptions.length === 0 && searchTerm === '') && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="bg-card rounded-2xl shadow p-8 flex flex-col items-center border border-border">
                        <div className="w-32 h-32 mx-auto mb-4 opacity-80 flex items-center justify-center">
                            <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="128" height="128" rx="24" fill="#F3F4F6"/>
                                <path d="M40 80c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="#A0AEC0" strokeWidth="4" strokeLinecap="round"/>
                                <circle cx="64" cy="56" r="12" fill="#CBD5E1"/>
                                <circle cx="64" cy="56" r="8" fill="#E5E7EB"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{t('patient.prescriptions.noPrescriptionsFound')}</h3>
                        <p className="text-muted-foreground mb-2">{t('patient.prescriptions.itLooksLikeYouDontHaveAnyPrescriptionsRecordedYet')}</p>
                        <p className="text-base text-muted-foreground">{t('patient.prescriptions.prescriptionsWillAppearHereOnceIssuedByYourDoctor')}</p>
                    </div>
                </div>
            )}
            {!isLoading && !error && (filteredPrescriptions.length === 0 && searchTerm !== '') && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="bg-card rounded-2xl shadow p-8 flex flex-col items-center border border-border">
                        <img src="/illustrations/no-results.svg" alt="No matching prescriptions" className="w-32 h-32 mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">{t('patient.prescriptions.noMatchingPrescriptions')}</h3>
                        <p className="text-muted-foreground mb-2">{t('patient.prescriptions.yourSearchFor', { searchTerm })}</p>
                        <Button
                            onClick={() => setSearchTerm('')}
                            variant="outline"
                            className="mt-2"
                        >
                            {t('patient.prescriptions.clearSearch')}
                        </Button>
                    </div>
                </div>
            )}
            {!isLoading && !error && filteredPrescriptions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {filteredPrescriptions.map((prescription) => (
                        prescription && (
                            <PrescriptionCard
                                key={prescription.id || Math.random()}
                                prescription={prescription}
                                onShowQR={handleShowQR}
                                onViewDetails={handleViewDetails}
                            />
                        )
                    ))}
                </div>
            )}
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