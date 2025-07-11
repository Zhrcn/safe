import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { format } from 'date-fns';
import { 
    HeartPulse, DropletIcon, Stethoscope, BarChart3, FileImage, Pill, Info
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

const DicomViewer = dynamic(() => import('@/components/medical/DicomViewer'), { ssr: false });

const MedicalFileTabs = ({ medicalFile, loading, error, activeTab }) => {
    const { t } = useTranslation('common');

    if (loading) {
        return <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;
    }
    if (error) {
        return <div className="min-h-[200px] flex items-center justify-center text-destructive">{typeof error === 'string' ? error : error?.message || 'An error occurred.'}</div>;
    }
    if (!medicalFile) {
        return <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">No medical file data.</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'vitalSigns':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.recentVitalSigns', 'Recent Vital Signs')}</h3>
                        {medicalFile.vitalSigns && medicalFile.vitalSigns.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0 max-w-full">
                                {medicalFile.vitalSigns.map(vital => (
                                    <Card key={vital._id || vital.id} className="bg-muted/50 w-full">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <HeartPulse className="h-5 w-5 text-primary" />
                                                <p className="font-medium text-foreground">{t('patient.profile.vitalSigns', 'Vital Signs')}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {vital.bloodPressure && <div><span className="font-semibold">BP:</span> {vital.bloodPressure}</div>}
                                                {vital.heartRate && <div><span className="font-semibold">HR:</span> {vital.heartRate} bpm</div>}
                                                {vital.temperature && <div><span className="font-semibold">Temp:</span> {vital.temperature}°C</div>}
                                                {vital.weight && <div><span className="font-semibold">Weight:</span> {vital.weight} kg</div>}
                                                {vital.height && <div><span className="font-semibold">Height:</span> {vital.height} cm</div>}
                                                {vital.bmi && <div><span className="font-semibold">BMI:</span> {vital.bmi}</div>}
                                                {vital.oxygenSaturation && <div><span className="font-semibold">O2 Sat:</span> {vital.oxygenSaturation}%</div>}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">{t('patient.profile.date', 'Date')}: {vital.date && !isNaN(new Date(vital.date).getTime()) ? format(new Date(vital.date), 'PPP') : ''}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noVitalSignsRecorded', 'No Vital Signs Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.vitalSignsDescription', 'Your recent vital signs will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            case 'allergies':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.myAllergies', 'My Allergies')}</h3>
                        {medicalFile.allergies && medicalFile.allergies.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalFile.allergies.map(allergy => (
                                    <Card key={allergy._id || allergy.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 gap-2">
                                        <div className="flex items-center gap-3">
                                            <DropletIcon className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-medium text-foreground flex items-center gap-2">
                                                    {allergy.name}
                                                    {allergy.severity && (
                                                        <Badge className={`ml-2 ${allergy.severity === 'severe' ? 'bg-destructive text-white' : allergy.severity === 'moderate' ? 'bg-orange-200 text-orange-900' : 'bg-yellow-100 text-yellow-900'}`}>{allergy.severity}</Badge>
                                                    )}
                                                </p>
                                                {allergy.reaction && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.reaction', 'Reaction')}: {allergy.reaction}</p>}
                                                {allergy.notes && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.notes', 'Notes')}: {allergy.notes}</p>}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noAllergiesRecorded', 'No Allergies Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.allergiesDescription', 'You can add your allergies here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            case 'chronicConditions':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.chronicConditionsTitle', 'Chronic Conditions')}</h3>
                        {medicalFile.chronicConditions && medicalFile.chronicConditions.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalFile.chronicConditions.map(condition => (
                                    <Card key={condition._id || condition.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 gap-2">
                                        <div className="flex items-center gap-3">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground flex items-center gap-2">
                                                    {condition.name}
                                                    {condition.status && (
                                                        <Badge className={`ml-2 ${condition.status === 'active' ? 'bg-primary text-white' : condition.status === 'resolved' ? 'bg-green-200 text-green-900' : 'bg-muted text-muted-foreground'}`}>{condition.status}</Badge>
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.diagnosedOn', 'Diagnosed on')} {condition.diagnosisDate && !isNaN(new Date(condition.diagnosisDate).getTime()) ? format(new Date(condition.diagnosisDate), 'PPP') : ''}</p>
                                                {condition.notes && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.notes', 'Notes')}: {condition.notes}</p>}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noChronicConditionsRecorded', 'No Chronic Conditions Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.chronicConditionsDescription', 'You can add your chronic conditions here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            case 'diagnoses':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.myDiagnoses', 'My Diagnoses')}</h3>
                        {medicalFile.diagnoses && medicalFile.diagnoses.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalFile.diagnoses.map(diagnosis => (
                                    <Card key={diagnosis._id || diagnosis.id} className="p-4 bg-muted/50">
                                        <p className="font-medium text-foreground mb-1">{diagnosis.name}</p>
                                        <p className="text-sm text-muted-foreground">{t('patient.profile.diagnosedBy', 'Diagnosed by')} {diagnosis.doctor} {t('patient.profile.on', 'on')} {diagnosis.date && !isNaN(new Date(diagnosis.date).getTime()) ? format(new Date(diagnosis.date), 'PPP') : ''}</p>
                                        {diagnosis.notes && <p className="text-xs text-muted-foreground mt-2">{t('patient.profile.notes', 'Notes')}: {diagnosis.notes}</p>}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noDiagnosesRecorded', 'No Diagnoses Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.diagnosesDescription', 'Your medical diagnoses will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            case 'labResults':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.labResultsTitle', 'Lab Results')}</h3>
                        {medicalFile.labResults && medicalFile.labResults.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalFile.labResults.map(result => (
                                    <Card key={result._id || result.id} className="p-4 bg-muted/50">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BarChart3 className="h-5 w-5 text-primary" />
                                                <span className="font-medium text-foreground">{result.testName}</span>
                                                {result.labName && <span className="ml-2 text-xs text-muted-foreground">{result.labName}</span>}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {result.date && !isNaN(new Date(result.date).getTime()) ? format(new Date(result.date), 'PPP') : ''}</p>
                                            {result.normalRange && <p className="text-xs text-muted-foreground">{t('patient.profile.normalRange', 'Normal Range')}: {result.normalRange}</p>}
                                            {result.unit && <p className="text-xs text-muted-foreground">{t('patient.profile.unit', 'Unit')}: {result.unit}</p>}
                                            {result.results && typeof result.results === 'object' && (
                                                <div className="mt-2">
                                                    <table className="min-w-[200px] text-xs border rounded">
                                                        <thead><tr><th className="px-2 py-1">Test</th><th className="px-2 py-1">Value</th></tr></thead>
                                                        <tbody>
                                                            {Object.entries(result.results).map(([key, value]) => (
                                                                <tr key={key}><td className="px-2 py-1 font-semibold">{key}</td><td className="px-2 py-1">{value}</td></tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noLabResultsAvailable', 'No Lab Results Available')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.labResultsDescription', 'Your lab test results will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            case 'imagingReports':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.imagingReportsTitle', 'Imaging Reports')}</h3>
                        {medicalFile.imagingReports && medicalFile.imagingReports.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalFile.imagingReports.map(report => (
                                    <Card key={report._id || report.id} className="p-4 bg-muted/50">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileImage className="h-5 w-5 text-primary" />
                                                <span className="font-medium text-foreground">{report.type}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t('patient.profile.date', 'Date')}: {report.date && !isNaN(new Date(report.date).getTime()) ? format(new Date(report.date), 'PPP') : ''}</p>
                                            {report.images && report.images.length > 0 ? (
                                                <div className="flex flex-col gap-4 mt-2">
                                                    <div className="w-full font-semibold text-xs mb-1">DICOM Viewer</div>
                                                    <DicomViewer imageUrls={report.images.map(img => img.src || img)} />
                                                </div>
                                            ) : (
                                                <div className="text-xs text-muted-foreground mt-2">{t('patient.profile.noImages', 'No images available')}</div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noImagingReportsAvailable', 'No Imaging Reports Available')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.imagingReportsDescription', 'Your imaging reports (X-rays, MRIs, etc.) will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            case 'medications':
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t('patient.profile.currentMedications', 'Current Medications')}</h3>
                        {medicalFile.medications && medicalFile.medications.length > 0 ? (
                            <div className="grid gap-3">
                                {medicalFile.medications.map(med => (
                                    <Card key={med._id || med.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 gap-2">
                                        <div className="flex items-center gap-3">
                                            <Pill className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-foreground flex items-center gap-2">{med.name} <span className="text-xs text-muted-foreground">{med.dosage}</span></p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.frequency', 'Frequency')}: {med.frequency}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.status', 'Status')}: {med.status}</p>
                                                <p className="text-sm text-muted-foreground">{t('patient.profile.startDate', 'Start')}: {med.startDate && !isNaN(new Date(med.startDate).getTime()) ? format(new Date(med.startDate), 'PPP') : ''} | {t('patient.profile.endDate', 'End')}: {med.endDate && !isNaN(new Date(med.endDate).getTime()) ? format(new Date(med.endDate), 'PPP') : ''}</p>
                                                {med.notes && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.notes', 'Notes')}: {med.notes}</p>}
                                                {med.prescribedBy && <p className="text-xs text-muted-foreground mt-1">{t('patient.profile.prescribedBy', 'Prescribed by')}: {med.prescribedBy}</p>}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Alert className="bg-blue-50 text-blue-800 border-blue-200" icon={<Info className="h-4 w-4" />}>
                                <AlertTitle>{t('patient.profile.noMedicationsRecorded', 'No Medications Recorded')}</AlertTitle>
                                <AlertDescription>{t('patient.profile.medicationsDescription', 'Your current and past medications will appear here.')}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Select a tab to view medical records</p>
                    </div>
                );
        }
    };

    return (
        <div className="w-full min-w-0 max-w-full overflow-x-visible">
            {renderContent()}
        </div>
    );
};

export default MedicalFileTabs; 