'use client';
import React from 'react';
import {
    Building2,
    CreditCard,
    FileText,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground font-medium">{label}:</span>
        <span className="text-sm text-foreground font-semibold">{value}</span>
    </div>
);
const Insurance = ({ patient }) => {
    if (!patient) return null;
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-8">
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
                    <Building2 className="w-6 h-6" />
                    Insurance Information
                </h2>
                <div className="space-y-5">
                    <div>
                        <span className="text-sm text-muted-foreground font-semibold">Provider</span>
                        <p className="text-base text-foreground font-medium mt-1">
                            {patient.insurance?.provider || 'N/A'}
                        </p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                        <span className="text-sm text-muted-foreground font-semibold">Policy Number</span>
                        <p className="text-base text-foreground font-medium mt-1">
                            {patient.insurance?.policyNumber || 'N/A'}
                        </p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                        <span className="text-sm text-muted-foreground font-semibold">Group Number</span>
                        <p className="text-base text-foreground font-medium mt-1">
                            {patient.insurance?.groupNumber || 'N/A'}
                        </p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                        <span className="text-sm text-muted-foreground font-semibold">Coverage Type</span>
                        <p className="text-base text-foreground font-medium mt-1">
                            {patient.insurance?.coverageType || 'N/A'}
                        </p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                        <span className="text-sm text-muted-foreground font-semibold">Status</span>
                        <div className="mt-1">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-2xl text-xs font-bold border shadow-sm ${
                                patient.insurance?.status === 'active'
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-danger/10 text-danger border-danger/20'
                            }`}>
                                <CheckCircle2 className="w-3 h-3" />
                                {patient.insurance?.status || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-8">
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
                    <FileText className="w-6 h-6" />
                    Coverage Details
                </h2>
                <div className="space-y-4">
                    <InfoItem
                        icon={CreditCard}
                        label="Deductible"
                        value={`$${patient.insurance?.deductible || '0'}`}
                    />
                    <InfoItem
                        icon={CreditCard}
                        label="Co-pay"
                        value={`$${patient.insurance?.copay || '0'}`}
                    />
                    <InfoItem
                        icon={CreditCard}
                        label="Out-of-pocket Maximum"
                        value={`$${patient.insurance?.outOfPocketMax || '0'}`}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Effective Date"
                        value={formatDate(patient.insurance?.effectiveDate)}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Expiration Date"
                        value={formatDate(patient.insurance?.expirationDate)}
                    />
                </div>
            </div>
            <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-8">
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
                    <Phone className="w-6 h-6" />
                    Contact Information
                </h2>
                <div className="space-y-4">
                    <InfoItem
                        icon={Phone}
                        label="Phone"
                        value={patient.insurance?.contactPhone || 'N/A'}
                    />
                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value={patient.insurance?.contactEmail || 'N/A'}
                    />
                    <InfoItem
                        icon={MapPin}
                        label="Address"
                        value={patient.insurance?.contactAddress || 'N/A'}
                    />
                </div>
            </div>
        </div>
    );
};
export default Insurance; 