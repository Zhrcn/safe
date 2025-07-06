'use client';ButtonButtonButtonButton
import { Pill, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
export default function MedicationCard({ medications = [] }) {
    const medsArray = Array.isArray(medications) ? medications : (medications?.data && Array.isArray(medications.data) ? medications.data : []);
    // MedicationCard received medications
    if (!medsArray?.length) {
        return (
            <Card className="p-6 text-center text-muted-foreground">
                <p>No active medications</p>
            </Card>
        );
    }
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'discontinued':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDosage = (dosage, unit) => {
        if (!dosage) return 'Dosage not specified';
        return `${dosage}${unit ? ` ${unit}` : ''}`;
    };
    const formatFrequency = (frequency) => {
        if (!frequency) return 'Frequency not specified';
        return frequency;
    };
    return (
        <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-xl font-semibold">Medications</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
                {medsArray.map((medication, index) => (
                    <div
                        key={medication?.id || index}
                        className="flex items-center p-4 border border-border rounded-2xl"
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                                {medication?.name || 'Unknown Medication'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {medication?.type || 'Prescription'}
                            </p>
                            <div className="flex items-center mt-2 gap-2">
                                <Pill className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {formatDosage(medication?.dosage, medication?.unit)}
                                </p>
                            </div>
                            <div className="flex items-center mt-1 gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {formatFrequency(medication?.frequency)}
                                </p>
                            </div>
                            {medication?.notes && (
                                <div className="flex items-center mt-1 gap-2">
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {medication.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(medication?.status)}>
                                {medication?.status || 'Unknown'}
                            </Badge>
                            <Button variant="outline" size="sm">
                                Details
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
} 