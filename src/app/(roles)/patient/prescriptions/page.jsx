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
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPrescriptions } from '@/store/slices/patient/prescriptionsSlice';

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

// --- Refactored PrescriptionCard UI ---
const PrescriptionCard = ({ prescription, onShowQR, onViewDetails }) => {
    const { t } = useTranslation('common');
    const notesPreview = prescription.notes ? prescription.notes.slice(0, 60) + (prescription.notes.length > 60 ? '...' : '') : null;

    // Status helpers
    const statusMap = {
        active: {
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            icon: <Check className="w-4 h-4" />,
            ring: 'ring-emerald-300/60',
        },
        completed: {
            color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
            icon: <Check className="w-4 h-4" />,
            ring: 'ring-blue-300/60',
        },
        pending: {
            color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
            icon: <Clock className="w-4 h-4" />,
            ring: 'ring-amber-300/60',
        },
        expired: {
            color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
            icon: <X className="w-4 h-4" />,
            ring: 'ring-red-300/60',
        },
        default: {
            color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
            icon: <AlertCircle className="w-4 h-4" />,
            ring: 'ring-gray-300/60',
        }
    };
    const status = prescription.status || 'default';
    const statusInfo = statusMap[status] || statusMap.default;

    // Defensive mapping for doctor info and date
    const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : t('patient.prescriptions.unknownDoctor');
    const doctorSpecialty = prescription.doctorSpecialty || t('patient.prescriptions.unknownSpecialty');
    const doctorPhoto = prescription.doctorPhoto || '/avatars/default-avatar.svg';
    const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : t('patient.prescriptions.noDate');
    const prescriptionId = prescription.id || t('patient.prescriptions.noId');
    const medications = Array.isArray(prescription.medications) ? prescription.medications : [];

    return (
        <Card className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 group">
            {/* Status badge at top left */}
            <div className="absolute top-4 left-4 z-10">
                <Badge
                    variant="outline"
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border-2 shadow ${statusInfo.color} ${statusInfo.ring}`}
                >
                    {statusInfo.icon}
                    <span>{t(`patient.prescriptions.${prescription.status}`) || t('patient.prescriptions.unknownStatus')}</span>
                </Badge>
            </div>
            {/* Doctor avatar and info */}
            <CardHeader className="pb-2 pt-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className={`h-14 w-14 border-2 border-border shadow ${statusInfo.ring}`}>
                            <AvatarImage src={doctorPhoto} alt={doctorName} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-bold text-base">
                                <User className="h-7 w-7" />
                            </AvatarFallback>
                        </Avatar>
                        {/* Status dot */}
                        <span className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow ${statusInfo.color}`}>
                            {statusInfo.icon}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-foreground truncate mb-0.5">
                            {doctorName}
                        </CardTitle>
                        {doctorSpecialty && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate mb-1">
                                {doctorSpecialty}
                            </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                                <Calendar className="w-3 h-3 text-primary" />
                                <span>{prescriptionDate}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                                <span className="font-mono text-primary font-bold text-xs">#{prescriptionId}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            {/* Medications */}
            <CardContent className="pt-0 pb-2">
                <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Pill className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm text-foreground">{t('patient.prescriptions.medications')}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold">{medications.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {medications.length > 0 ? medications.map((medication, index) => (
                            <span
                                key={index}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold border ${getPillColor(index)} shadow-sm`}
                                aria-label={`${t('patient.prescriptions.medications')}: ${medication.name || t('patient.prescriptions.unknownMedication')}`}
                            >
                                <Pill className="w-3 h-3" />
                                {medication.name || t('patient.prescriptions.unknownMedication')}
                            </span>
                        )) : <span className="text-xs text-muted-foreground">{t('patient.prescriptions.noMedications')}</span>}
                    </div>
                </div>
                {/* Doctor's notes preview */}
                {notesPreview && (
                    <div className="bg-muted/60 rounded-lg p-2 border border-border mt-2">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-foreground mb-1">
                                    {t('patient.prescriptions.doctorsNotes')}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed" title={prescription.notes}>
                                    {notesPreview}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            {/* Actions */}
            <CardFooter className="flex items-center justify-between gap-2 pt-0 pb-3 px-4">
                <Tooltip content={t('patient.prescriptions.viewDetails')}>
                    <Button
                        onClick={() => onViewDetails(prescription)}
                        className="h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-sm text-xs"
                        aria-label={t('patient.prescriptions.viewDetails')}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('patient.prescriptions.viewDetails')}
                    </Button>
                </Tooltip>
                <div className="flex items-center gap-1.5">
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Tooltip content={t('patient.prescriptions.showQRCode')}>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onShowQR(prescription)}
                                className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl shadow-sm"
                                aria-label={t('patient.prescriptions.showQRCode')}
                            >
                                <QrCode className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip content={t('patient.prescriptions.download')}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl shadow-sm"
                            aria-label={t('patient.prescriptions.download')}
                        >
                            <Download className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip content={t('patient.prescriptions.print')}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl shadow-sm"
                            aria-label={t('patient.prescriptions.print')}
                        >
                            <Printer className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                </div>
            </CardFooter>
        </Card>
    );
};
// --- End Refactored PrescriptionCard ---

const PrescriptionDetailDialog = ({ open, onClose, prescription, onShowQR }) => {
    const { t } = useTranslation('common');
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
    // Defensive mapping for doctor info and date
    const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : t('patient.prescriptions.unknownDoctor');
    const doctorPhoto = prescription.doctorPhoto || '/avatars/default-avatar.svg';
    const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : t('patient.prescriptions.noDate');
    const prescriptionEndDate = prescription.endDate ? new Date(prescription.endDate).toLocaleDateString() : t('patient.prescriptions.noEndDate');
    const prescriptionId = prescription.id || t('patient.prescriptions.noId');
    const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-6">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-bold text-foreground">{t('patient.prescriptions.prescriptionDetails')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 -mr-2">
                    <div className="flex items-center gap-4 p-4 bg-info/10 rounded-2xl">
                        <Avatar className="h-20 w-20 border-4 border-info/20 shadow-md">
                            <AvatarImage src={doctorPhoto} alt={doctorName} />
                            <AvatarFallback>
                                <User className="h-10 w-10 text-info" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-foreground">{doctorName}</h3>
                            <div className="flex items-center gap-2 text-md text-muted-foreground mt-1">
                                <Calendar className="w-5 h-5" />
                                <span>{t('patient.prescriptions.prescribedOn')}: {prescriptionDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-md text-muted-foreground mt-1">
                                <Clock className="w-5 h-5" />
                                <span>{t('patient.prescriptions.validUntil')}: {prescriptionEndDate}</span>
                            </div>
                        </div>
                        <Badge variant="outline" className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[prescription.status]}`}>
                            {statusIcons[prescription.status]}
                            <span className="ml-2">{t(`patient.prescriptions.${prescription.status}`) || t('patient.prescriptions.unknownStatus')}</span>
                        </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-foreground">{t('patient.prescriptions.medications')} {medications.length}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {medications.length > 0 ? medications.map((medication, index) => (
                                <Card key={index} className="p-4 border border-border shadow-sm transition-shadow hover:shadow-md">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <Pill className="w-5 h-5" />
                                            </div>
                                            <h5 className="font-bold text-lg text-foreground">{medication.name || t('patient.prescriptions.unknownMedication')}</h5>
                                        </div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <p><span className="font-medium">{t('patient.prescriptions.dosage')}:</span> {medication.dosage || t('patient.prescriptions.noDosage')}</p>
                                            <p><span className="font-medium">{t('patient.prescriptions.frequency')}:</span> {medication.frequency || t('patient.prescriptions.noFrequency')}</p>
                                            {medication.instructions && (
                                                <p><span className="font-medium">{t('patient.prescriptions.instructions')}:</span> {medication.instructions}</p>
                                            )}
                                            {medication.notes && (
                                                <p><span className="font-medium">{t('patient.prescriptions.notes')}:</span> {medication.notes}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : <span className="text-xs text-muted-foreground">{t('patient.prescriptions.noMedications')}</span>}
                        </div>
                    </div>
                    {prescription.notes && (
                        <div className="space-y-3 p-4 bg-muted rounded-2xl border border-border">
                            <h4 className="text-xl font-semibold text-foreground">{t('patient.prescriptions.doctorsNotes')}</h4>
                            <p className="text-muted-foreground leading-relaxed">{prescription.notes}</p>
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4 mt-4 border-t border-border flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6 py-2">
                        {t('patient.prescriptions.close')}
                    </Button>
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Button onClick={() => onShowQR(prescription)} className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <QrCode className="w-5 h-5 mr-2" />
                            {t('patient.prescriptions.showQRCode')}
                        </Button>
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
            <DialogContent className="sm:max-w-[450px] p-6 text-center">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-bold text-foreground">{t('patient.prescriptions.prescriptionQRCode')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-4 bg-info/10 rounded-2xl border border-info/20">
                    <p className="text-md text-info font-medium">
                        {t('patient.prescriptions.scanThisCodeAtThePharmacyToGetYourPrescription')}
                    </p>
                    <div className="p-5 bg-card rounded-2xl shadow-xl border-4 border-primary/30">
                        <QRCodeSVG
                            value={JSON.stringify({
                                id: prescription.id,
                                doctor: prescription.doctorName,
                                date: prescription.date,
                                medications: (Array.isArray(prescription.medications) ? prescription.medications : []).map(med => med.name).join(', '),
                                patientId: prescription.patientId || '',
                                patientName: prescription.patientName || '',
                            })}
                            size={250}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                        <p><span className="font-semibold">{t('patient.prescriptions.prescriptionID')}:</span> {prescription.id}</p>
                        <p><span className="font-semibold">{t('patient.prescriptions.medications')}:</span> {(Array.isArray(prescription.medications) ? prescription.medications : []).map(med => med.name).join(', ')}</p>
                    </div>
                </div>
                <DialogFooter className="pt-4 mt-4 border-t border-border flex justify-end">
                    <Button variant="outline" onClick={onClose} className="px-6 py-2">
                        {t('patient.prescriptions.close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
const PrescriptionsPage = () => {
    const dispatch = useDispatch();
    const { prescriptions, loading: isLoading, error } = useSelector(state => state.prescriptions);
    // Defensive: ensure prescriptions is always an array
    const prescriptionsSafe = Array.isArray(prescriptions) ? prescriptions : (prescriptions?.data && Array.isArray(prescriptions.data) ? prescriptions.data : []);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const { t, i18n } = useTranslation('common');
    const isRtl = i18n.language === 'ar';
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
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <PageHeader
                title={t('patient.prescriptions.title')}
                description={t('patient.prescriptions.description')}
            />
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-auto flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('patient.prescriptions.searchPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 border border-border rounded-2xl focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 w-full justify-center sm:w-auto">
                                <ListFilter className="w-4 h-4" />
                                {t('patient.prescriptions.status')}
                                {': '}
                                {t(`patient.prescriptions.${filterStatus}`)}
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card border-border">
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
                            <Button variant="outline" className="flex items-center gap-2 w-full justify-center sm:w-auto">
                                <ListFilter className="w-4 h-4" />
                                {t('patient.prescriptions.sort')}
                                {': '}
                                {sortBy === 'date' ? t('patient.prescriptions.date') : t('patient.prescriptions.doctorName')}
                                {` (${sortOrder === 'asc' ? t('patient.prescriptions.ascending') : t('patient.prescriptions.descending')})`}
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-card border-border">
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
                <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">{t('patient.prescriptions.loadingPrescriptions')}</p>
                </div>
            )}
            {error && (
                <div className="text-center py-10">
                    <p className="text-lg text-destructive">{error}</p>
                    <Button 
                        onClick={handleRetry} 
                        className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                        {t('patient.prescriptions.retry')}
                    </Button>
                </div>
            )}
            {!isLoading && !error && ( (prescriptionsSafe.length === 0 && searchTerm === '') ? (
                <div className="bg-card p-6 rounded-2xl shadow-sm text-center py-10 border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{t('patient.prescriptions.noPrescriptionsFound')}</h3>
                    <p className="text-muted-foreground mb-4">{t('patient.prescriptions.itLooksLikeYouDontHaveAnyPrescriptionsRecordedYet')}</p>
                    <p className="text-sm text-muted-foreground">{t('patient.prescriptions.prescriptionsWillAppearHereOnceIssuedByYourDoctor')}</p>
                </div>
            ) : (prescriptionsSafe.length === 0 && searchTerm !== '') ? (
                <div className="bg-card p-6 rounded-2xl shadow-sm text-center py-10 border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{t('patient.prescriptions.noMatchingPrescriptions')}</h3>
                    <p className="text-muted-foreground mb-4">{t('patient.prescriptions.yourSearchFor', { searchTerm })}</p>
                    <Button 
                        onClick={() => setSearchTerm('')} 
                        className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                        {t('patient.prescriptions.clearSearch')}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {prescriptionsSafe.map((prescription) => (
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