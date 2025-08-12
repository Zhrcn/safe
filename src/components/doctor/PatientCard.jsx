'use client';
import { useState, useRef, useEffect } from 'react';
import {
    MoreVertical,
    User,
    Calendar,
    FileText,
    Pill,
    Activity,
    Send,
    Edit,
    Trash2,
    MessageCircle,
    Eye,
    BadgeCheck,
    IdCard,
    CalendarDays
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import AddPatientForm from './AddPatientForm';
import PrescriptionForm from './PrescriptionForm';
import PatientConditionForm from './PatientConditionForm';
import ReferralForm from './ReferralForm';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback, getInitials, getInitialsFromName } from '@/components/ui';

const DEFAULT_AVATAR = '/avatars/avatar-1.svg';

export default function PatientCard({ patient }) {
    console.log('PatientCard patient:', patient);
    console.log('PatientCard patient.user:', patient.user);
    console.log('PatientCard patient.user?.username:', patient.user?.username);
    const router = useRouter();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);
    const menuRef = useRef(null);

    const getPatientId = () => patient._id || patient.id;
    const getPatientName = () => {
        const firstName = patient.user?.firstName || patient.firstName || '';
        const lastName = patient.user?.lastName || patient.lastName || '';
        return `${firstName} ${lastName}`.trim();
    };
    const getPatientAge = () => (typeof patient.age !== 'undefined' && patient.age !== null ? patient.age : (patient.user?.age ?? 'N/A'));
    const getPatientGender = () => patient.gender || patient.user?.gender || 'N/A';
    const getPatientCondition = () => patient.condition || 'N/A';
    const getPatientMedicalId = () => patient.patientId || patient.user?.patientId || 'N/A';
    const getPatientLastVisit = () => patient.lastAppointment || patient.updatedAt || patient.lastVisit;
    const isPatientActive = () => patient.user?.isActive ?? patient.isActive ?? true;

    useEffect(() => {
        if (!menuAnchor) return;
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                handleMenuClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuAnchor]);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleOpenDialog = (dialogType) => {
        setActiveDialog(dialogType);
        handleMenuClose();
    };

    const handleCloseDialog = () => {
        setActiveDialog(null);
    };

    const handleViewPatient = () => {
        router.push(`/doctor/patients/${getPatientId()}`);
    };

    const getStatusChipClass = (status) => {
        switch(status.toLowerCase()) {
            case 'active':
                return 'bg-success/10 text-success border border-success';
            case 'urgent':
                return 'bg-warning/10 text-warning border border-warning';
            case 'inactive':
                return 'bg-muted text-muted-foreground border border-border';
            default:
                return 'bg-muted text-muted-foreground border border-border';
        }
    };

    const handleCardClick = (e) => {
        if (
            e.target.closest('button') ||
            e.target.closest('[role="menu"]') ||
            e.target.closest('.no-card-click')
        ) {
            return;
        }
        handleViewPatient();
    };

    return (
        <>
            <div
                className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 md:p-6 flex flex-col relative w-full min-h-[200px] sm:min-h-[220px] cursor-pointer hover:bg-muted/30"
                onClick={handleCardClick}
                tabIndex={0}
                role="button"
                aria-label={`Open profile for ${getPatientName()}`}
            >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                    <Avatar size="md" className="w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl font-bold flex-shrink-0">
                        {patient.user?.profileImage ? (
                            <AvatarImage src={patient.user.profileImage} alt={patient.user ? `${patient.user.firstName || ''} ${patient.user.lastName || ''}`.trim() : 'Patient'} />
                        ) : (
                            <AvatarFallback>{getInitials(patient.user?.firstName, patient.user?.lastName)}</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-semibold text-card-foreground truncate">
                                {getPatientName()}
                            </span>
                            <span className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusChipClass(isPatientActive() ? 'active' : 'inactive')}`}> 
                                <span className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isPatientActive() ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                                <span className="hidden sm:inline">{isPatientActive() ? 'active' : 'inactive'}</span>
                                <span className="sm:hidden">{isPatientActive() ? 'A' : 'I'}</span>
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                            {getPatientAge()} years • {getPatientGender()}
                        </span>
                    </div>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Open menu"
                        onClick={handleMenuOpen}
                        className="ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-full text-muted-foreground hover:bg-muted no-card-click flex-shrink-0"
                        tabIndex={-1}
                    >
                        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-2 mb-3 sm:mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Condition</p>
                        <p className="text-xs sm:text-sm text-card-foreground font-semibold truncate">{getPatientCondition()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Medical ID</p>
                        <p className="text-xs sm:text-sm text-card-foreground font-semibold truncate">{getPatientMedicalId()}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-muted-foreground font-medium">Last Visit</p>
                        <p className="text-xs sm:text-sm text-card-foreground font-semibold truncate">
                            {getPatientLastVisit() ? format(new Date(getPatientLastVisit()), 'MMM dd, yyyy') : 'None'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="flex-1 flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-medium no-card-click"
                        onClick={e => { e.stopPropagation(); handleViewPatient(); }}
                    >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">V</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-medium no-card-click"
                        onClick={e => { e.stopPropagation(); handleOpenDialog('condition'); }}
                    >
                        <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                        <span className="hidden sm:inline">Update</span>
                        <span className="sm:hidden">U</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-medium no-card-click"
                        onClick={e => { e.stopPropagation(); handleOpenDialog('prescription'); }}
                    >
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                        <span className="hidden sm:inline">Prescribe</span>
                        <span className="sm:hidden">P</span>
                    </Button>
                </div>
                {Boolean(menuAnchor) && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 top-12 w-40 sm:w-48 bg-card rounded-2xl shadow-lg py-1 border border-border z-20"
                    >
                    
                        <Button
                        variant="outline"
                        className="w-full text-xs sm:text-sm"    
                        onClick={() => handleOpenDialog('referral')}
                        >
                            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground" />
                            <span className="hidden sm:inline">Create Referral</span>
                            <span className="sm:hidden">Referral</span>
                        </Button>
                        <Button
                            onClick={() => window.location.href = `/doctor/messaging`}
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
                        >
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground" />
                            <span className="hidden sm:inline">Send Message</span>
                            <span className="sm:hidden">Message</span>
                        </Button>
                    </div>
                )}
            </div>
            {activeDialog === 'edit' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="relative p-4 sm:p-6 bg-card rounded-xl shadow-xl w-full max-w-md mx-auto border border-border">
                        <AddPatientForm 
                            onClose={handleCloseDialog} 
                            patientId={getPatientId()}
                            initialData={patient}
                            isEdit={true}
                        />
                    </div>
                </div>
            )}
            {activeDialog === 'prescription' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="relative p-4 sm:p-6 bg-card rounded-xl shadow-xl w-full max-w-2xl mx-auto border border-border">
                        <PrescriptionForm 
                            patientId={getPatientId()} 
                            patientName={getPatientName()} 
                            onClose={handleCloseDialog}
                        />
                    </div>
                </div>
            )}
            {activeDialog === 'condition' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="relative p-4 sm:p-6 bg-card rounded-xl shadow-xl w-full max-w-md mx-auto border border-border">
                        <PatientConditionForm 
                            patientId={getPatientId()} 
                            onClose={handleCloseDialog}
                            initialData={{
                                currentCondition: getPatientCondition(),
                                notes: ''
                            }}
                        />
                    </div>
                </div>
            )}
            {activeDialog === 'referral' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="relative p-4 sm:p-6 bg-card rounded-xl shadow-xl w-full max-w-md mx-auto border border-border">
                        <ReferralForm 
                            patientId={getPatientId()} 
                            patientName={getPatientName()} 
                            onClose={handleCloseDialog}
                        />
                    </div>
                </div>
            )}
        </>
    );
} 