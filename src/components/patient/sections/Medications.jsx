'use client';
import React from 'react';
import {
    Pill,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Medications = ({ patient }) => {
    const medsArray = Array.isArray(patient.medications) ? patient.medications : (patient.medications?.data && Array.isArray(patient.medications.data) ? patient.medications.data : []);
    function handleRefill() {
        alert('Refill requested!');
    }
    function handleRemove() {
        alert('Remove requested!');
    }
    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-8">
            <h2 className="text-xl font-extrabold mb-6 tracking-tight text-primary">Current Medications</h2>
            {medsArray.length > 0 ? (
                <div className="divide-y divide-border">
                    {medsArray.map((medication, index) => (
                        <div key={index} className="py-5 first:pt-0 last:pb-0">
                            <div className="flex items-start gap-5">
                                <div className="mt-1">
                                    <Pill className="w-6 h-6 text-primary drop-shadow" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground">
                                            {medication.name}
                                        </h3>
                                        <span className="inline-flex items-center px-3 py-1 rounded-2xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-sm">
                                            {medication.dosage}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {medication.frequency}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-2xl text-xs font-semibold border shadow-sm ${
                                        medication.status === 'active'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : 'bg-muted text-muted-foreground border-border'
                                    }`}>
                                        <AlertTriangle className="w-3 h-3" />
                                        {medication.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Pill className="w-14 h-14 text-muted-foreground opacity-50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-base font-medium">
                        No current medications
                    </p>
                </div>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                    onClick={handleRefill}
                    variant="default"
                    size="sm"
                    className="mr-2"
                >
                    Refill
                </Button>
                <Button
                    onClick={handleRemove}
                    variant="destructive"
                    size="sm"
                >
                    Remove
                </Button>
            </div>
        </div>
    );
};
export default Medications; 