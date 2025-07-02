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

const PrescriptionCard = ({ prescription, onShowQR, onViewDetails }) => {
    const { t } = useTranslation('common');
    const notesPreview = prescription.notes ? prescription.notes.slice(0, 60) + (prescription.notes.length > 60 ? '...' : '') : null;
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
            case 'expired': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
            default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Check className="w-3 h-3" />;
            case 'completed': return <Check className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'expired': return <X className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    const getStatusGradient = (status) => {
        switch (status) {
            case 'active': return 'from-emerald-500/20 to-emerald-600/20';
            case 'completed': return 'from-blue-500/20 to-blue-600/20';
            case 'pending': return 'from-amber-500/20 to-amber-600/20';
            case 'expired': return 'from-red-500/20 to-red-600/20';
            default: return 'from-gray-500/20 to-gray-600/20';
        }
    };

    return (
        <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-0 bg-gradient-to-br from-white via-blue-50/40 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 rounded-3xl shadow-xl hover:shadow-3xl">
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getStatusGradient(prescription.status)} opacity-80 animate-pulse`} />
            
            <div className="absolute top-4 right-4 z-10">
                <Badge 
                    variant="outline" 
                    className={`px-4 py-2 text-sm font-bold rounded-full border-2 shadow-lg backdrop-blur-sm ${getStatusColor(prescription.status)} transition-all duration-300 group-hover:scale-110`}
                >
                    {getStatusIcon(prescription.status)}
                    <span className="ml-2">{t(`patient.prescriptions.${prescription.status}`)}</span>
                </Badge>
            </div>

            <CardHeader className="pb-3 pt-6">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <div className="relative">
                            <Avatar className="h-14 w-14 ring-3 ring-primary/20 shadow-xl transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
                                <AvatarImage src={prescription.doctorPhoto} alt={prescription.doctorName} />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-bold text-base">
                                    <User className="h-7 w-7" />
                                </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-lg ${getStatusColor(prescription.status).split(' ')[0]}`}>
                                {getStatusIcon(prescription.status)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate mb-1">
                            Dr. {prescription.doctorName}
                        </CardTitle>
                        {prescription.doctorSpecialty && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold truncate mb-2">
                                {prescription.doctorSpecialty}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                <Calendar className="w-3 h-3 text-primary" />
                                <span className="font-medium">{new Date(prescription.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-full">
                                <span className="font-mono text-primary font-bold text-xs">#{prescription.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4">
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-4 bg-gradient-to-b from-primary to-primary/60 rounded-full shadow-sm" />
                            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                {t('patient.prescriptions.medications')}
                            </h4>
                            <span className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full font-semibold shadow-sm border border-gray-200 dark:border-gray-700">
                                {(Array.isArray(prescription.medications) ? prescription.medications : []).length}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(prescription.medications) ? prescription.medications : []).map((medication, index) => (
                                <span
                                    key={index}
                                    className={`inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold border-2 shadow-sm transition-all duration-300 hover:shadow-md ${getPillColor(index)}`}
                                    aria-label={`${t('patient.prescriptions.medications')}: ${medication.name}`}
                                >
                                    <Pill className="w-3 h-3" />
                                    {medication.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {notesPreview && (
                        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-3 border-2 border-blue-200/50 dark:border-blue-800/30 shadow-lg">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                                        {t('patient.prescriptions.doctorsNotes')}
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed" title={prescription.notes}>
                                        {notesPreview}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            <div className="px-4 pb-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Tooltip content={t('patient.prescriptions.viewDetails')}>
                            <Button
                                onClick={() => onViewDetails(prescription)}
                                className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 text-sm"
                                aria-label={t('patient.prescriptions.viewDetails')}
                            >
                                <Eye className="w-4 h-4 mr-1.5" />
                                {t('patient.prescriptions.viewDetails')}
                            </Button>
                        </Tooltip>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {(prescription.status === 'active' || prescription.status === 'pending') && (
                            <Tooltip content={t('patient.prescriptions.showQRCode')}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onShowQR(prescription)}
                                    className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/80 dark:bg-primary/20 dark:hover:bg-primary/30 dark:text-primary-foreground dark:hover:text-primary-foreground/80 border-2 border-primary/30 dark:border-primary/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
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
                                className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/80 dark:bg-primary/20 dark:hover:bg-primary/30 dark:text-primary-foreground dark:hover:text-primary-foreground/80 border-2 border-primary/30 dark:border-primary/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                                aria-label={t('patient.prescriptions.download')}
                            >
                                <Download className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                        <Tooltip content={t('patient.prescriptions.print')}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/80 dark:bg-primary/20 dark:hover:bg-primary/30 dark:text-primary-foreground dark:hover:text-primary-foreground/80 border-2 border-primary/30 dark:border-primary/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                                aria-label={t('patient.prescriptions.print')}
                            >
                                <Printer className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
            
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-10 right-10 w-20 h-20 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-500 rounded-full blur-2xl" />
            </div>
        </Card>
    );
};
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
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-6">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-bold text-foreground">{t('patient.prescriptions.prescriptionDetails')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 -mr-2">
                    <div className="flex items-center gap-4 p-4 bg-info/10 rounded-2xl">
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
                                <span>{t('patient.prescriptions.prescribedOn')}: {new Date(prescription.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-md text-muted-foreground mt-1">
                                <Clock className="w-5 h-5" />
                                <span>{t('patient.prescriptions.validUntil')}: {new Date(prescription.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Badge variant="outline" className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[prescription.status]}`}>
                            {statusIcons[prescription.status]}
                            <span className="ml-2">{t(`patient.prescriptions.${prescription.status}`)}</span>
                        </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-foreground">{t('patient.prescriptions.medications')} {(Array.isArray(prescription.medications) ? prescription.medications : []).length}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Array.isArray(prescription.medications) ? prescription.medications : []).map((medication, index) => (
                                <Card key={index} className="p-4 border border-border shadow-sm transition-shadow hover:shadow-md">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <Pill className="w-5 h-5" />
                                            </div>
                                            <h5 className="font-bold text-lg text-foreground">{medication.name}</h5>
                                        </div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <p><span className="font-medium">{t('patient.prescriptions.dosage')}:</span> {medication.dosage}</p>
                                            <p><span className="font-medium">{t('patient.prescriptions.frequency')}:</span> {medication.frequency}</p>
                                            {medication.instructions && (
                                                <p><span className="font-medium">{t('patient.prescriptions.instructions')}:</span> {medication.instructions}</p>
                                            )}
                                            {medication.notes && (
                                                <p><span className="font-medium">{t('patient.prescriptions.notes')}:</span> {medication.notes}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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