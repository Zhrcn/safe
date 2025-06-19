'use client';
import React from 'react';
import {
    Phone,
    Mail,
    MapPin,
    User,
    Heart,
    AlertTriangle
} from 'lucide-react';
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground font-medium">{label}:</span>
        <span className="text-sm text-foreground font-semibold">{value || 'N/A'}</span>
    </div>
);
const ContactCard = ({ title, contact }) => (
    <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-8">
        <h2 className="text-xl font-extrabold mb-6 flex items-center gap-3 text-primary tracking-tight">
            <User className="w-6 h-6" />
            {title}
        </h2>
        <div className="space-y-5">
            <div>
                <span className="text-sm text-muted-foreground font-semibold">Name</span>
                <p className="text-base text-foreground font-medium mt-1">
                    {contact?.name || 'N/A'}
                </p>
            </div>
            <div className="h-px bg-border" />
            <div>
                <span className="text-sm text-muted-foreground font-semibold">Relationship</span>
                <p className="text-base text-foreground font-medium mt-1">
                    {contact?.relationship || 'N/A'}
                </p>
            </div>
            <div className="h-px bg-border" />
            <div>
                <span className="text-sm text-muted-foreground font-semibold">Phone</span>
                <p className="text-base text-foreground font-medium mt-1">
                    {contact?.phone || 'N/A'}
                </p>
            </div>
            <div className="h-px bg-border" />
            <div>
                <span className="text-sm text-muted-foreground font-semibold">Email</span>
                <p className="text-base text-foreground font-medium mt-1">
                    {contact?.email || 'N/A'}
                </p>
            </div>
            <div className="h-px bg-border" />
            <div>
                <span className="text-sm text-muted-foreground font-semibold">Address</span>
                <p className="text-base text-foreground font-medium mt-1">
                    {contact?.address || 'N/A'}
                </p>
            </div>
        </div>
    </div>
);
const EmergencyContact = ({ patient }) => {
    if (!patient) return null;
    const primaryContact = patient.emergencyContacts?.[0];
    const secondaryContact = patient.emergencyContacts?.[1];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactCard
                title="Primary Emergency Contact"
                contact={primaryContact}
            />
            <ContactCard
                title="Secondary Emergency Contact"
                contact={secondaryContact}
            />
        </div>
    );
};
export default EmergencyContact; 