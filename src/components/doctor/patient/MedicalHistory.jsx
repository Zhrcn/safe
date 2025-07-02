import React from 'react';
import {
  Folder,
  FlaskConical,
  Hospital,
  HeartPulse,
  Pill,
  Syringe,
  Scissors,
  AlertTriangle,
  Stethoscope,
  User,
  Clock,
  CalendarDays,
  FileText,
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { cn } from '@/utils/styles';
const MedicalHistory = ({ patient }) => {
  const medicalHistory = patient?.medicalHistory;
  const categories = [
    {
      id: 'allergies',
      title: 'Allergies',
      icon: AlertTriangle,
      color: 'text-destructive',
      items: medicalHistory?.allergies,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.name}:</span> {item.reaction} (Severity: {item.severity})
        </p>
      ),
      emptyMessage: 'No known allergies.',
    },
    {
      id: 'chronicConditions',
      title: 'Chronic Conditions',
      icon: Stethoscope,
      color: 'text-yellow-500',
      items: medicalHistory?.chronicConditions,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.name}:</span> Diagnosed: {isValid(new Date(item.diagnosisDate)) ? format(new Date(item.diagnosisDate), 'MMM dd, yyyy') : 'N/A'} (Status: {item.status})
        </p>
      ),
      emptyMessage: 'No chronic conditions.',
    },
    {
      id: 'medicationHistory',
      title: 'Medications',
      icon: Pill,
      color: 'text-blue-500',
      items: medicalHistory?.medicationHistory,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.name} ({item.dose})</span> - {item.frequency} (Prescribed by {item.prescribedBy})
        </p>
      ),
      emptyMessage: 'No medication history.',
    },
    {
      id: 'immunizations',
      title: 'Immunizations',
      icon: Syringe,
      color: 'text-green-500',
      items: medicalHistory?.immunizations,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.name}:</span> Administered: {isValid(new Date(item.dateAdministered)) ? format(new Date(item.dateAdministered), 'MMM dd, yyyy') : 'N/A'}
        </p>
      ),
      emptyMessage: 'No immunization history.',
    },
    {
      id: 'surgicalHistory',
      title: 'Surgical History',
      icon: Scissors,
      color: 'text-purple-500',
      items: medicalHistory?.surgicalHistory,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.name}:</span> Date: {isValid(new Date(item.date)) ? format(new Date(item.date), 'MMM dd, yyyy') : 'N/A'} (Hospital: {item.hospital})
        </p>
      ),
      emptyMessage: 'No surgical history.',
    },
    {
      id: 'labResults',
      title: 'Lab Results',
      icon: FlaskConical,
      color: 'text-cyan-500',
      items: medicalHistory?.labResults,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.testName}:</span> {item.results} {item.unit} (Range: {item.normalRange})
        </p>
      ),
      emptyMessage: 'No lab results.',
    },
    {
      id: 'imagingReports',
      title: 'Imaging Reports',
      icon: Hospital,
      color: 'text-orange-500',
      items: medicalHistory?.imagingReports,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.type}:</span> {item.findings}
        </p>
      ),
      emptyMessage: 'No imaging reports.',
    },
    {
      id: 'vitalSigns',
      title: 'Vital Signs',
      icon: HeartPulse,
      color: 'text-red-500',
      items: medicalHistory?.vitalSigns,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">BP:</span> {item.bloodPressure}, <span className="font-medium text-foreground">HR:</span> {item.heartRate}bpm, <span className="font-medium text-foreground">Temp:</span> {item.temperature}°C
        </p>
      ),
      emptyMessage: 'No vital signs.',
    },
    {
      id: 'attachedDocuments',
      title: 'Attached Documents',
      icon: FileText,
      color: 'text-gray-500',
      items: medicalHistory?.attachedDocuments,
      renderItem: (item) => (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{item.title}:</span> {item.type} ({isValid(new Date(item.uploadDate)) ? format(new Date(item.uploadDate), 'MMM dd, yyyy') : 'N/A'})
        </p>
      ),
      emptyMessage: 'No attached documents.',
    },
  ];
  if (!medicalHistory) {
    return (
      <div className="p-6 bg-card rounded-2xl shadow-md border border-border text-center text-muted-foreground">
        <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold">No Medical History Available</h3>
        <p className="text-sm">Please ensure the patient has a medical file associated.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.id} className="p-6 bg-card rounded-2xl shadow-md border border-border">
          <h3 className="flex items-center gap-3 text-xl font-bold text-foreground mb-4">
            <category.icon className={cn('w-6 h-6', category.color)} />
            {category.title}
          </h3>
          <div className="space-y-4">
            {category.items && category.items.length > 0 ? (
              category.items.map((item, index) => (
                <div key={index} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  {category.renderItem(item)}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic">
                {category.emptyMessage}
              </div>
            )}
          </div>
        </div>
      ))}
      {}
      {medicalHistory.familyMedicalHistory && medicalHistory.familyMedicalHistory.length > 0 && (
        <div className="p-6 bg-card rounded-2xl shadow-md border border-border md:col-span-2 lg:col-span-3">
          <h3 className="flex items-center gap-3 text-xl font-bold text-foreground mb-4">
            <User className="w-6 h-6 text-primary" />
            Family Medical History
          </h3>
          <div className="space-y-4">
            {medicalHistory.familyMedicalHistory.map((item, index) => (
              <div key={index} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{item.relation}:</span> {item.condition} - {item.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {medicalHistory.socialHistory && Object.keys(medicalHistory.socialHistory).length > 0 && (
        <div className="p-6 bg-card rounded-2xl shadow-md border border-border">
          <h3 className="flex items-center gap-3 text-xl font-bold text-foreground mb-4">
            <User className="w-6 h-6 text-primary" />
            Social History
          </h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Smoking Status:</span> {medicalHistory.socialHistory.smokingStatus}</p>
            <p><span className="font-medium text-foreground">Alcohol Use:</span> {medicalHistory.socialHistory.alcoholUse}</p>
            <p><span className="font-medium text-foreground">Occupation:</span> {medicalHistory.socialHistory.occupation}</p>
            <p><span className="font-medium text-foreground">Living Situation:</span> {medicalHistory.socialHistory.livingSituation}</p>
          </div>
        </div>
      )}
    </div>
    );
};
export default MedicalHistory; 