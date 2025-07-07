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

// Theme context for toggling light/dark mode
const ThemeContext = React.createContext();

const useTheme = () => React.useContext(ThemeContext);

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

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full shadow border border-border"
        >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-900" />}
        </Button>
    );
};

const PrescriptionCard = ({ prescription, onShowQR, onViewDetails }) => {
    const { t } = useTranslation('common');
    if (!prescription) return null;
    const notesPreview = prescription.notes ? prescription.notes.slice(0, 60) + (prescription.notes.length > 60 ? '...' : '') : null;

    const statusMap = {
        active: {
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            icon: <Check className="w-4 h-4" />,
            ring: 'ring-emerald-300/60 dark:ring-emerald-800/60',
        },
        completed: {
            color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
            icon: <Check className="w-4 h-4" />,
            ring: 'ring-blue-300/60 dark:ring-blue-800/60',
        },
        pending: {
            color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
            icon: <Clock className="w-4 h-4" />,
            ring: 'ring-amber-300/60 dark:ring-amber-800/60',
        },
        expired: {
            color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
            icon: <X className="w-4 h-4" />,
            ring: 'ring-red-300/60 dark:ring-red-800/60',
        },
        default: {
            color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
            icon: <AlertCircle className="w-4 h-4" />,
            ring: 'ring-gray-300/60 dark:ring-gray-800/60',
        }
    };
    const status = prescription.status || 'default';
    const statusInfo = statusMap[status] || statusMap.default;

    const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : t('patient.prescriptions.unknownDoctor');
    const doctorSpecialty = prescription.doctorSpecialty || t('patient.prescriptions.unknownSpecialty');
    const doctorPhoto = prescription.doctorPhoto || '/avatars/default-avatar.svg';
    const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : t('patient.prescriptions.noDate');
    const prescriptionId = prescription.id || t('patient.prescriptions.noId');
    const medications = Array.isArray(prescription.medications) ? prescription.medications : [];

    return (
        <Card className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-background dark:via-blue-950/30 dark:to-blue-900/40 shadow-lg hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-4 left-4 z-10">
                <Badge
                    variant="outline"
                    className={` flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border-2 shadow ${statusInfo.color} ${statusInfo.ring}`}
                >
                    {statusInfo.icon}
                    <span>{t(`patient.prescriptions.${prescription.status}`) || t('patient.prescriptions.unknownStatus')}</span>
                </Badge>
            </div>
            {/* Doctor avatar and info */}
            <CardHeader className="pb-2 pt-8">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Avatar className={`h-16 w-16 border-4 border-white dark:border-blue-900 shadow-lg ${statusInfo.ring}`}>
                            <AvatarImage src={doctorPhoto} alt={doctorName} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-bold text-base">
                                <User className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        {/* Status dot */}
                        <span className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white dark:border-blue-900 flex items-center justify-center shadow ${statusInfo.color}`}>
                            {statusInfo.icon}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-extrabold text-foreground truncate mb-0.5">
                            {doctorName}
                        </CardTitle>
                        {doctorSpecialty && (
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium truncate mb-1">
                                {doctorSpecialty}
                            </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
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
                        <span className="font-semibold text-base text-foreground">{t('patient.prescriptions.medications')}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold">{medications.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {medications.length > 0 ? medications.map((medication, index) => (
                            <span
                                key={index}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold border ${getPillColor(index)} shadow-sm hover:scale-105 transition-transform`}
                                aria-label={`${t('patient.prescriptions.medications')}: ${medication?.name || t('patient.prescriptions.unknownMedication')}`}
                            >
                                <Pill className="w-3 h-3" />
                                {medication?.name || t('patient.prescriptions.unknownMedication')}
                            </span>
                        )) : <span className="text-xs text-muted-foreground">{t('patient.prescriptions.noMedications')}</span>}
                    </div>
                </div>
                {/* Doctor's notes preview */}
                {notesPreview && (
                    <div className="bg-muted/60 rounded-xl p-3 border border-border mt-2 shadow-inner">
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
            <CardFooter className="flex items-center justify-between gap-2 pt-0 pb-4 px-6">
                <Tooltip content={t('patient.prescriptions.viewDetails')}>
                    <Button
                        onClick={() => onViewDetails(prescription)}
                        className="h-10 px-4 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary text-primary font-bold rounded-xl shadow-md text-sm transition-all"
                        aria-label={t('patient.prescriptions.viewDetails')}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('patient.prescriptions.viewDetails')}
                    </Button>
                </Tooltip>
                <div className="flex items-center gap-2">
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Tooltip content={t('patient.prescriptions.showQRCode')}>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onShowQR(prescription)}
                                className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl shadow-md"
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
                            className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl shadow-md"
                            aria-label={t('patient.prescriptions.download')}
                        >
                            <Download className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip content={t('patient.prescriptions.print')}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl shadow-md"
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

const PrescriptionDetailDialog = ({ open, onClose, prescription, onShowQR }) => {
    const { t } = useTranslation('common');
    if (!prescription) return null;
    const statusColors = {
        active: 'bg-success/10 text-success dark:bg-emerald-900/20 dark:text-emerald-400',
        completed: 'bg-info/10 text-info dark:bg-blue-900/20 dark:text-blue-400',
        expired: 'bg-error/10 text-error dark:bg-red-900/20 dark:text-red-400',
        pending: 'bg-warning/10 text-warning dark:bg-amber-900/20 dark:text-amber-400',
    };
    const statusIcons = {
        active: <Check className="w-4 h-4" />,
        completed: <Check className="w-4 h-4" />,
        expired: <X className="w-4 h-4" />,
        pending: <AlertCircle className="w-4 h-4" />,
    };
    const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : t('patient.prescriptions.unknownDoctor');
    const doctorPhoto = prescription.doctorPhoto || '/avatars/default-avatar.svg';
    const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : t('patient.prescriptions.noDate');
    const prescriptionEndDate = prescription.endDate ? new Date(prescription.endDate).toLocaleDateString() : t('patient.prescriptions.noEndDate');
    const prescriptionId = prescription.id || t('patient.prescriptions.noId');
    const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-8 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-background dark:via-blue-950/30 dark:to-blue-900/40 shadow-2xl">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-3xl font-extrabold text-foreground">{t('patient.prescriptions.prescriptionDetails')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-8 overflow-y-auto max-h-[70vh] pr-2 -mr-2">
                    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-info/10 dark:bg-blue-950/30 rounded-2xl shadow">
                        <Avatar className="h-24 w-24 border-4 border-info/20 dark:border-blue-800 shadow-lg">
                            <AvatarImage src={doctorPhoto} alt={doctorName} />
                            <AvatarFallback>
                                <User className="h-12 w-12 text-info dark:text-blue-400" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 w-full">
                            <h3 className="text-2xl font-bold text-foreground">{doctorName}</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                                <div className="flex items-center gap-2 text-md text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <span>{t('patient.prescriptions.prescribedOn')}: {prescriptionDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-md text-muted-foreground">
                                    <Clock className="w-5 h-5" />
                                    <span>{t('patient.prescriptions.validUntil')}: {prescriptionEndDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-md text-muted-foreground">
                                    <span className="font-mono text-primary font-bold text-xs">#{prescriptionId}</span>
                                </div>
                            </div>
                        </div>
                        <Badge variant="outline" className={`px-4 py-2 text-base font-semibold rounded-full ${statusColors[prescription.status]}`}>
                            {statusIcons[prescription.status]}
                            <span className="ml-2">{t(`patient.prescriptions.${prescription.status}`) || t('patient.prescriptions.unknownStatus')}</span>
                        </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-foreground">{t('patient.prescriptions.medications')} <span className="text-primary">({medications.length})</span></h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {medications.length > 0 ? medications.map((medication, index) => (
                                <Card key={index} className="p-5 border border-border shadow-md transition-shadow hover:shadow-lg rounded-2xl bg-white/80 dark:bg-blue-950/30">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary shadow">
                                                <Pill className="w-6 h-6" />
                                            </div>
                                            <h5 className="font-bold text-lg text-foreground">{medication?.name || t('patient.prescriptions.unknownMedication')}</h5>
                                        </div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <p><span className="font-medium">{t('patient.prescriptions.dosage')}:</span> {medication?.dosage || t('patient.prescriptions.noDosage')}</p>
                                            <p><span className="font-medium">{t('patient.prescriptions.frequency')}:</span> {medication?.frequency || t('patient.prescriptions.noFrequency')}</p>
                                            {medication?.instructions && (
                                                <p><span className="font-medium">{t('patient.prescriptions.instructions')}:</span> {medication.instructions}</p>
                                            )}
                                            {medication?.notes && (
                                                <p><span className="font-medium">{t('patient.prescriptions.notes')}:</span> {medication.notes}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : <span className="text-xs text-muted-foreground">{t('patient.prescriptions.noMedications')}</span>}
                        </div>
                    </div>
                    {prescription.notes && (
                        <div className="space-y-3 p-5 bg-muted/80 dark:bg-muted/40 rounded-2xl border border-border shadow-inner">
                            <h4 className="text-xl font-semibold text-foreground">{t('patient.prescriptions.doctorsNotes')}</h4>
                            <p className="text-muted-foreground leading-relaxed">{prescription.notes}</p>
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4 mt-4 border-t border-border flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 border-primary text-primary dark:bg-gradient-to-r dark:from-blue-900 dark:to-primary dark:text-blue-100">
                        {t('patient.prescriptions.close')}
                    </Button>
                    {(prescription.status === 'active' || prescription.status === 'pending') && (
                        <Button onClick={() => onShowQR(prescription)} className="px-6 py-2 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary text-primary font-bold rounded-xl shadow-md text-sm transition-all dark:bg-gradient-to-r dark:from-blue-900 dark:to-primary dark:text-blue-100">
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
            <DialogContent className="sm:max-w-[450px] p-8 text-center rounded-3xl bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-background dark:via-blue-950/30 dark:to-blue-900/40 shadow-2xl">
                <DialogHeader className="pb-4 mb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-bold text-foreground">{t('patient.prescriptions.prescriptionQRCode')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-6 py-4 bg-info/10 dark:bg-blue-950/30 rounded-2xl border border-info/20 dark:border-blue-800/30 shadow">
                    <p className="text-md text-info dark:text-blue-400 font-medium">
                        {t('patient.prescriptions.scanThisCodeAtThePharmacyToGetYourPrescription')}
                    </p>
                    <div className="p-5 bg-card dark:bg-background rounded-2xl shadow-xl border-4 border-primary/30 dark:border-blue-800/30">
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
                        <p><span className="font-semibold">{t('patient.prescriptions.prescriptionID')}:</span> {prescription?.id}</p>
                        <p><span className="font-semibold">{t('patient.prescriptions.medications')}:</span> {(Array.isArray(prescription?.medications) ? prescription.medications : []).map(med => med?.name).join(', ')}</p>
                    </div>
                </div>
                <DialogFooter className="pt-4 mt-4 border-t border-border flex justify-end">
                    <Button variant="outline" onClick={onClose} className="px-6 py-2 dark:bg-blue-950/30 dark:text-blue-100">
                        {t('patient.prescriptions.close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        typeof window !== 'undefined'
            ? (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
            : 'light'
    );

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const PrescriptionsPage = () => {
    const dispatch = useDispatch();
    const { prescriptions, loading: isLoading, error } = useSelector(state => state.prescriptions);
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
    const themeContext = useTheme ? useTheme() : null;
    const { theme } = themeContext || { theme: 'light' };

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

    const filteredPrescriptions = prescriptionsSafe
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
        <ThemeProvider>
            <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-background dark:via-blue-950/30 dark:to-blue-900/40 p-4 sm:p-8 lg:p-12 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
                <div className="flex justify-end mb-4">
                    <ThemeToggleButton />
                </div>
                <PageHeader
                    title={t('patient.prescriptions.title')}
                    description={t('patient.prescriptions.description')}
                />
                <div className="mb-8 flex flex-col sm:flex-row gap-6 justify-between items-center">
                    <div className="relative w-full sm:w-auto flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('patient.prescriptions.searchPlaceholder')}
                            className="w-full pl-11 pr-3 py-3 border border-border rounded-2xl focus:ring-primary focus:border-primary text-base shadow bg-white dark:bg-blue-950/30 dark:text-blue-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2 w-full justify-center sm:w-auto text-base text-primary border-primary px-5 py-3 rounded-xl shadow bg-white dark:bg-blue-950/30 dark:text-blue-100">
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
                                <Button variant="outline" className="flex items-center text-primary border-primary gap-2 w-full justify-center sm:w-auto text-base px-5 py-3 rounded-xl shadow bg-white dark:bg-blue-950/30 dark:text-blue-100">
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
                    <div className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
                            <p className="text-xl text-muted-foreground">{t('patient.prescriptions.loadingPrescriptions')}</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle className="w-10 h-10 text-destructive" />
                            <p className="text-xl text-destructive">{error}</p>
                            <Button 
                                onClick={handleRetry} 
                                className="mt-4 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg shadow transition-all duration-300 dark:bg-gradient-to-r dark:from-blue-900 dark:to-primary dark:text-blue-100"
                            >
                                {t('patient.prescriptions.retry')}
                            </Button>
                        </div>
                    </div>
                )}
                {!isLoading && !error && ( (filteredPrescriptions.length === 0 && searchTerm === '') ? (
                    <div className="bg-card dark:bg-blue-950/30 p-8 rounded-3xl shadow-lg text-center py-16 border border-border flex flex-col items-center gap-4">
                        <img src="/illustrations/empty-state.svg" alt="No prescriptions" className="w-32 h-32 mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">{t('patient.prescriptions.noPrescriptionsFound')}</h3>
                        <p className="text-muted-foreground mb-2">{t('patient.prescriptions.itLooksLikeYouDontHaveAnyPrescriptionsRecordedYet')}</p>
                        <p className="text-base text-muted-foreground">{t('patient.prescriptions.prescriptionsWillAppearHereOnceIssuedByYourDoctor')}</p>
                    </div>
                ) : (filteredPrescriptions.length === 0 && searchTerm !== '') ? (
                    <div className="bg-card dark:bg-blue-950/30 p-8 rounded-3xl shadow-lg text-center py-16 border border-border flex flex-col items-center gap-4">
                        <img src="/illustrations/no-results.svg" alt="No matching prescriptions" className="w-32 h-32 mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">{t('patient.prescriptions.noMatchingPrescriptions')}</h3>
                        <p className="text-muted-foreground mb-2">{t('patient.prescriptions.yourSearchFor', { searchTerm })}</p>
                        <Button 
                            onClick={() => setSearchTerm('')} 
                            className="mt-4 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg shadow transition-all duration-300 dark:bg-gradient-to-r dark:from-blue-900 dark:to-primary dark:text-blue-100"
                        >
                            {t('patient.prescriptions.clearSearch')}
                        </Button>
                    </div>
                ) : (
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
        </ThemeProvider>
    );
};
export default PrescriptionsPage; 