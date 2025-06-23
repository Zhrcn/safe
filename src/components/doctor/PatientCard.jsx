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

export default function PatientCard({ patient }) {
    const router = useRouter();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);
    const menuRef = useRef(null);
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
        router.push(`/doctor/patients/${patient.id}`);
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
    const getInitials = (patient) => {
        const name = `${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim();
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };
    return (
        <>
            <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative min-w-[300px] min-h-[220px] max-w-full">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                        {getInitials(patient)}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-card-foreground truncate">
                            {`${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`.trim()}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusChipClass(patient.user?.isActive ? 'active' : 'inactive')}`}> 
                                <span className={`inline-block w-2 h-2 rounded-full ${patient.user?.isActive ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                                {patient.user?.isActive ? 'active' : 'inactive'}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                            {patient.age} years • {patient.gender}
                        </span>
                    </div>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Open menu"
                        onClick={handleMenuOpen}
                        className="ml-2 p-2 rounded-full text-muted-foreground hover:bg-muted"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                        <div>
                        <p className="text-xs text-muted-foreground font-medium">Condition</p>
                        <p className="text-sm text-card-foreground font-semibold truncate">{patient.condition}</p>
                        </div>
                        <div>
                        <p className="text-xs text-muted-foreground font-medium">Medical ID</p>
                        <p className="text-sm text-card-foreground font-semibold truncate">{patient.medicalId || 'N/A'}</p>
                        </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Last Visit</p>
                        <p className="text-sm text-card-foreground font-semibold truncate">{patient.lastAppointment ? format(new Date(patient.lastAppointment), 'MMM dd, yyyy') : 'None'}</p>
                    </div>
                </div>
                <div className="flex flex-row gap-2 mt-auto pt-2">
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                        className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={handleViewPatient}
                        >
                        <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                        className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-primary"
                            onClick={() => handleOpenDialog('condition')}
                        >
                            <Activity className="h-4 w-4 mr-1" /> Update
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                        className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-primary"
                            onClick={() => handleOpenDialog('prescription')}
                        >
                            <FileText className="h-4 w-4 mr-1" /> Prescribe
                        </Button>
                </div>
                {Boolean(menuAnchor) && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 top-12 w-48 bg-card rounded-lg shadow-lg py-1 border border-border z-20"
                    >
                        <Button
                            onClick={() => handleOpenDialog('edit')}
                            className="w-full text-left px-4 py-2 text-sm text-card-foreground hover:bg-muted flex items-center"
                                >
                            <Edit className="h-4 w-4 mr-2 text-muted-foreground" />Edit Patient
                                </Button>
                                <Button
                                    onClick={() => handleOpenDialog('referral')}
                            className="w-full text-left px-4 py-2 text-sm text-card-foreground hover:bg-muted flex items-center"
                                >
                            <Send className="h-4 w-4 mr-2 text-muted-foreground" />Create Referral
                                </Button>
                                <Button
                                    onClick={() => window.location.href = `/doctor/messaging`}
                            className="w-full text-left px-4 py-2 text-sm text-card-foreground hover:bg-muted flex items-center"
                                >
                            <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />Send Message
                                </Button>
                            </div>
                        )}
                    </div>
            {activeDialog === 'edit' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-card rounded-xl shadow-xl max-w-md mx-auto border border-border">
                        <AddPatientForm 
                            onClose={handleCloseDialog} 
                            patientId={patient.id}
                            initialData={patient}
                            isEdit={true}
                        />
                    </div>
                </div>
            )}
            {activeDialog === 'prescription' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-card rounded-xl shadow-xl max-w-2xl mx-auto border border-border">
                        <PrescriptionForm 
                            patientId={patient.id} 
                            patientName={`${patient.user?.firstName} ${patient.user?.lastName}`} 
                            onClose={handleCloseDialog}
                        />
                    </div>
                </div>
            )}
            {activeDialog === 'condition' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-card rounded-xl shadow-xl max-w-md mx-auto border border-border">
                        <PatientConditionForm 
                            patientId={patient.id} 
                            onClose={handleCloseDialog}
                            initialData={{
                                currentCondition: patient.condition,
                                notes: ''
                            }}
                        />
                    </div>
                </div>
            )}
            {activeDialog === 'referral' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative p-6 bg-card rounded-xl shadow-xl max-w-md mx-auto border border-border">
                        <ReferralForm 
                            patientId={patient.id} 
                            patientName={`${patient.user?.firstName} ${patient.user?.lastName}`} 
                            onClose={handleCloseDialog}
                        />
                    </div>
                </div>
            )}
        </>
    );
} 