'use client';
import React from 'react';
import {
    Pill,
    Clock,
    AlertTriangle
} from 'lucide-react';
const Medications = ({ patient }) => {
    return (
        <div className="bg-card text-card-foreground rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Current Medications</h2>
            {patient.medications?.length > 0 ? (
                <div className="divide-y divide-border">
                    {patient.medications.map((medication, index) => (
                        <div key={index} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Pill className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-medium text-foreground">
                                            {medication.name}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                            {medication.dosage}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {medication.frequency}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
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
                <div className="text-center py-8">
                    <Pill className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                        No current medications
                    </p>
                </div>
            )}
        </div>
    );
};
export default Medications; 