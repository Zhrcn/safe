'use client';
import React from 'react';
import {
    Activity,
    Heart,
    AlertTriangle,
    Thermometer,
    Droplet,
    Scale,
    Calendar,
    User,
    FileText,
    Stethoscope,
    Science,
    LocalHospital,
    Medication,
    Vaccines,
    History,
    Folder,
    Warning,
    Bloodtype,
    Download,
    Visibility,
    File,
    Microscope,
    Pill,
    Syringe,
    Scalpel,
    Clock,
    Eye,
    MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator'; 
import { Skeleton } from '@/components/ui/skeleton'; 
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <div>
            <span className="text-sm text-muted-foreground">{label}</span>
            <p className="text-sm text-foreground">{value || 'Not provided'}</p>
        </div>
    </div>
);
const RecordCard = ({ record }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'lab':
                return <Microscope className="w-5 h-5" />;
            case 'imaging':
                return <FileText className="w-5 h-5" />;
            case 'vitals':
                return <Stethoscope className="w-5 h-5" />;
            case 'medication':
                return <Pill className="w-5 h-5" />;
            case 'immunization':
                return <Syringe className="w-5 h-5" />;
            case 'surgery':
                return <Scalpel className="w-5 h-5" />;
            case 'allergy':
                return <AlertTriangle className="w-5 h-5" />;
            case 'condition':
                return <Heart className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'lab':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'imaging':
                return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'vitals':
                return 'bg-success/10 text-success border-success/20';
            case 'medication':
                return 'bg-info/10 text-info border-info/20';
            case 'immunization':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'surgery':
                return 'bg-error/10 text-error border-error/20';
            case 'allergy':
                return 'bg-error/10 text-error border-error/20';
            case 'condition':
                return 'bg-warning/10 text-warning border-warning/20';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getIcon(record.type)}
                    <div>
                        <h3 className="text-lg font-medium text-foreground">
                            {record.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div>
                                <Badge className={getTypeColor(record.type)}>
                                    {record.type}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(record.date)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Download">
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <span className="text-sm text-muted-foreground">
                            Last Updated
                        </span>
                        <span className="block text-sm text-foreground">
                            {formatDate(record.lastUpdated)}
                        </span>
                    </div>
                </div>
                {record.doctor && (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Doctor
                            </span>
                            <span className="block text-sm text-foreground">
                                {record.doctor}
                            </span>
                        </div>
                    </div>
                )}
                {record.location && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                            <span className="text-sm text-muted-foreground">
                                Location
                            </span>
                            <span className="block text-sm text-foreground">
                                {record.location}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
const MedicalHistory = ({ patient }) => {
    const medicalRecords = patient.medicalRecords || [];
    const isLoading = false; 
    const error = null; 
    const getRecordTypeColor = (type) => {
        switch (type) {
            case 'allergy':
                return 'bg-red-100 text-red-800';
            case 'condition':
                return 'bg-yellow-100 text-yellow-800';
            case 'medication':
                return 'bg-blue-100 text-blue-800';
            case 'immunization':
                return 'bg-green-100 text-green-800';
            case 'lab':
                return 'bg-purple-100 text-purple-800';
            case 'imaging':
                return 'bg-indigo-100 text-indigo-800';
            case 'vitals':
                return 'bg-teal-100 text-teal-800';
            case 'surgery':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getRecordTypeIcon = (type) => {
        switch (type) {
            case 'allergy':
                return <AlertTriangle className="w-5 h-5" />;
            case 'condition':
                return <Heart className="w-5 h-5" />;
            case 'medication':
                return <Pill className="w-5 h-5" />;
            case 'immunization':
                return <Syringe className="w-5 h-5" />;
            case 'lab':
                return <Microscope className="w-5 h-5" />;
            case 'imaging':
                return <FileText className="w-5 h-5" />;
            case 'vitals':
                return <Stethoscope className="w-5 h-5" />;
            case 'surgery':
                return <Scalpel className="w-5 h-5" />;
            default:
                return <Folder className="w-5 h-5" />;
        }
    };
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive border border-destructive rounded-2xl p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm">Error loading medical history: {error.message || 'An unknown error occurred.'}</p>
            </div>
        );
    }
    if (medicalRecords.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <History className="w-16 h-16 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">No Medical Records Found</h3>
                <p className="text-sm">Your medical history appears to be empty. Add new records to view them here.</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicalRecords.map((record) => (
                    <RecordCard key={record.id} record={record} />
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    onClick={handleAdd}
                    variant="default"
                    size="sm"
                    className="mr-2"
                >
                    Add
                </Button>
                <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="mr-2"
                >
                    Edit
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};
export default MedicalHistory; 