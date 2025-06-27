'use client';
import React from 'react';
import {
    User,
    Mail,
    Phone,
    Home,
    Calendar,
    MapPin,
    Building,
    Briefcase,
    GraduationCap,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground font-medium">{label}:</span>
        <span className="text-sm text-foreground font-semibold">{value}</span>
    </div>
);
const PersonalInfo = ({ patient }) => {
    if (!patient) return null;
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card text-card-foreground rounded-lg border border-primary/20 shadow-lg">
                <div className="p-8">
                    <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
                        <User className="w-6 h-6" />
                        Basic Information
                    </h2>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Full Name</span>
                            <p className="text-base text-muted-foreground font-medium">
                                {`${patient.user?.firstName} ${patient.user?.lastName}`}
                            </p>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Date of Birth</span>
                            <p className="text-base text-muted-foreground font-medium">
                                {formatDate(patient.user?.dateOfBirth)}
                            </p>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Gender</span>
                            <p className="text-base text-muted-foreground font-medium">
                                {patient.user?.gender}
                            </p>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Blood Type</span>
                            <div className="mt-1">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 shadow-sm">
                                    {patient.bloodType}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border border-primary/20 shadow-lg">
                <div className="p-8">
                    <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
                        <Mail className="w-6 h-6" />
                        Contact Information
                    </h2>
                    <div className="space-y-5">
                        <InfoItem
                            icon={Mail}
                            label="Email"
                            value={patient.user?.email}
                        />
                        <InfoItem
                            icon={Phone}
                            label="Phone"
                            value={patient.user?.phoneNumber}
                        />
                        <InfoItem
                            icon={Home}
                            label="Address"
                            value={patient.user?.address}
                        />
                        <InfoItem
                            icon={MapPin}
                            label="City"
                            value={patient.user?.city}
                        />
                        <InfoItem
                            icon={Building}
                            label="State"
                            value={patient.user?.state}
                        />
                        <InfoItem
                            icon={Calendar}
                            label="Member Since"
                            value={formatDate(patient.user?.createdAt)}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-card text-card-foreground rounded-lg border border-primary/20 shadow-lg md:col-span-2">
                <div className="p-8">
                    <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
                        <Briefcase className="w-6 h-6" />
                        Additional Information
                    </h2>
                    <div className="space-y-5">
                        <InfoItem
                            icon={GraduationCap}
                            label="Education"
                            value={patient.user?.education}
                        />
                        <InfoItem
                            icon={Briefcase}
                            label="Occupation"
                            value={patient.user?.occupation}
                        />
                        <InfoItem
                            icon={Heart}
                            label="Marital Status"
                            value={patient.user?.maritalStatus}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PersonalInfo; 