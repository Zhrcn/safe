"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/patient/PageHeader";
import {
  addVitalSigns,
  addAllergy,
  addChronicCondition,
  addDiagnosis,
  addLabResult,
  addImagingReport,
  addMedication,
} from "@/store/slices/patient/medicalRecordSlice";
import axiosInstance from "@/store/services/axiosInstance";

const CATEGORY_OPTIONS = [
  { value: "vitalSigns", label: "Vital Signs" },
  { value: "allergies", label: "Allergy" },
  { value: "chronicConditions", label: "Chronic Condition" },
  { value: "diagnoses", label: "Diagnosis" },
  { value: "labResults", label: "Lab Result" },
  { value: "imagingReports", label: "Imaging Report" },
  { value: "medications", label: "Medication" },
];

const initialFormState = {
  vitalSigns: {
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    bmi: "",
    oxygenSaturation: "",
    notes: "",
  },
  allergies: {
    name: "",
    severity: "mild",
    reaction: "",
    notes: "",
  },
  chronicConditions: {
    name: "",
    status: "active",
    diagnosisDate: "",
    notes: "",
  },
  diagnoses: {
    name: "",
    doctor: "",
    date: "",
    notes: "",
  },
  labResults: {
    testName: "",
    labName: "",
    date: "",
    normalRange: "",
    unit: "",
    results: "",
    notes: "",
  },
  imagingReports: {
    type: "",
    date: "",
    notes: "",
    images: "",
  },
  medications: {
    name: "",
    dosage: "",
    frequency: "",
    status: "active",
    startDate: "",
    prescribedBy: "",
    notes: "",
  },
};

export default function UploadMedicalRecordPage() {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const router = useRouter();
  const [category, setCategory] = useState("vitalSigns");
  const [form, setForm] = useState(initialFormState[category]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  React.useEffect(() => {
    setForm(initialFormState[category]);
    setError(null);
    setSuccess(false);
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      let uploadUrl = "";
      if (category === "labResults") uploadUrl = "/medical-records/upload/labtest";
      else if (category === "imagingReports") uploadUrl = "/medical-records/upload/imaging";
      else return;
      const res = await axiosInstance.post(uploadUrl, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setFileUrl(res.data.filePath);
    } catch (err) {
      setError("File upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      let action;
      switch (category) {
        case "vitalSigns":
          action = addVitalSigns(form);
          break;
        case "allergies":
          action = addAllergy(form);
          break;
        case "chronicConditions":
          action = addChronicCondition(form);
          break;
        case "diagnoses":
          action = addDiagnosis(form);
          break;
        case "labResults": {
          let results = form.results;
          try { results = JSON.parse(form.results); } catch {}
          action = addLabResult({ ...form, results, attachment: fileUrl });
          break;
        }
        case "imagingReports": {
          action = addImagingReport({ ...form, images: fileUrl ? [{ src: fileUrl }] : [], notes: form.notes, type: form.type, date: form.date });
          break;
        }
        case "medications":
          action = addMedication(form);
          break;
        default:
          setError("Invalid category");
          setLoading(false);
          return;
      }
      const result = await dispatch(action).unwrap();
      setSuccess(true);
      setTimeout(() => router.push("/patient/medical-records"), 1200);
    } catch (err) {
      setError(err?.message || "Failed to upload record");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (category) {
      case "vitalSigns":
        return (
          <>
            <Input label="Blood Pressure" name="bloodPressure" value={form.bloodPressure || ""} onChange={handleChange} placeholder="e.g. 120/80" />
            <Input label="Heart Rate" name="heartRate" value={form.heartRate || ""} onChange={handleChange} placeholder="e.g. 72" type="number" />
            <Input label="Temperature" name="temperature" value={form.temperature || ""} onChange={handleChange} placeholder="e.g. 36.8" type="number" />
            <Input label="Weight (kg)" name="weight" value={form.weight || ""} onChange={handleChange} placeholder="e.g. 70" type="number" />
            <Input label="Height (cm)" name="height" value={form.height || ""} onChange={handleChange} placeholder="e.g. 175" type="number" />
            <Input label="BMI" name="bmi" value={form.bmi || ""} onChange={handleChange} placeholder="e.g. 22.9" type="number" />
            <Input label="Oxygen Saturation (%)" name="oxygenSaturation" value={form.oxygenSaturation || ""} onChange={handleChange} placeholder="e.g. 98" type="number" />
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
          </>
        );
      case "allergies":
        return (
          <>
            <Input label="Allergy Name" name="name" value={form.name || ""} onChange={handleChange} placeholder="e.g. Penicillin" />
            <select name="severity" value={form.severity} onChange={handleChange} className="input">
              <option key="mild" value="mild">Mild</option>
              <option key="moderate" value="moderate">Moderate</option>
              <option key="severe" value="severe">Severe</option>
            </select>
            <Input label="Reaction" name="reaction" value={form.reaction || ""} onChange={handleChange} placeholder="e.g. Rash" />
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
          </>
        );
      case "chronicConditions":
        return (
          <>
            <Input label="Condition Name" name="name" value={form.name || ""} onChange={handleChange} placeholder="e.g. Hypertension" />
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option key="active1" value="active">Active</option>
              <option key="resolved" value="resolved">Resolved</option>
              <option key="managed" value="managed">Managed</option>
            </select>
            <Input label="Diagnosis Date" name="diagnosisDate" value={form.diagnosisDate || ""} onChange={handleChange} type="date" />
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
          </>
        );
      case "diagnoses":
        return (
          <>
            <Input label="Diagnosis Name" name="name" value={form.name || ""} onChange={handleChange} placeholder="e.g. Asthma" />
            <Input label="Doctor" name="doctor" value={form.doctor || ""} onChange={handleChange} placeholder="e.g. Dr. Ahmad" />
            <Input label="Date" name="date" value={form.date || ""} onChange={handleChange} type="date" />
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
          </>
        );
      case "labResults":
        return (
          <>
            <Input label="Test Name" name="testName" value={form.testName || ""} onChange={handleChange} placeholder="e.g. CBC" />
            <Input label="Lab Name" name="labName" value={form.labName || ""} onChange={handleChange} placeholder="e.g. Al-Mouwasat Lab" />
            <Input label="Date" name="date" value={form.date || ""} onChange={handleChange} type="date" />
            <Input label="Normal Range" name="normalRange" value={form.normalRange || ""} onChange={handleChange} placeholder="e.g. 4.5-11.0 x10^9/L" />
            <Input label="Unit" name="unit" value={form.unit || ""} onChange={handleChange} placeholder="e.g. mg/dL" />
            <Textarea label="Results (JSON)" name="results" value={form.results || ""} onChange={handleChange} placeholder='{"wbc":7.2,"rbc":4.8}' />
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
            <label className="block font-medium mt-2">Upload Lab Report (PDF/Image)</label>
            <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
            {fileUrl && <div className="text-xs text-green-600 mt-1">File uploaded: {fileUrl}</div>}
          </>
        );
      case "imagingReports":
        return (
          <>
            <Input label="Imaging Type" name="type" value={form.type || ""} onChange={handleChange} placeholder="e.g. Chest X-Ray" />
            <Input label="Date" name="date" value={form.date || ""} onChange={handleChange} type="date" />
            <label className="block font-medium mt-2">Upload Imaging File (DICOM/Image)</label>
            <input type="file" accept=".dcm,image/*" onChange={handleFileChange} />
            {fileUrl && <div className="text-xs text-green-600 mt-1">File uploaded: {fileUrl}</div>}
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
          </>
        );
      case "medications":
        return (
          <>
            <Input label="Medication Name" name="name" value={form.name || ""} onChange={handleChange} placeholder="e.g. Lisinopril" />
            <Input label="Dosage" name="dosage" value={form.dosage || ""} onChange={handleChange} placeholder="e.g. 10mg" />
            <Input label="Frequency" name="frequency" value={form.frequency || ""} onChange={handleChange} placeholder="e.g. Once daily" />
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option key="active2" value="active">Active</option>
              <option key="discontinued" value="discontinued">Discontinued</option>
              <option key="completed" value="completed">Completed</option>
            </select>
            <Input label="Start Date" name="startDate" value={form.startDate || ""} onChange={handleChange} type="date" />
            <Input label="Prescribed By" name="prescribedBy" value={form.prescribedBy || ""} onChange={handleChange} placeholder="e.g. Dr. Ahmad" />
            <Textarea label="Notes" name="notes" value={form.notes || ""} onChange={handleChange} placeholder="Additional notes" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={t("patient.medicalRecords.upload", "Upload New Medical Record")}
        description={t("patient.medicalRecords.uploadDescription", "Add a new entry to your personal medical record.")}
        breadcrumbs={[
          { label: t("patient.dashboard.breadcrumb"), href: "/patient/dashboard" },
          { label: t("patient.medicalRecords.title", "Medical Records"), href: "/patient/medical-records" },
          { label: t("patient.medicalRecords.upload", "Upload New Record"), href: "/patient/medical-records/upload" },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>{t("patient.medicalRecords.upload", "Upload New Medical Record")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            <label className="block font-medium mb-1">{t("Category")}</label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input mb-4"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
              ))}
            </select>
            {renderFields()}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{t("Upload successful!")}</div>}
            <Button variant="outline" type="submit" disabled={loading} className="w-1/2 justify-center">
              {loading ? t("Uploading...") : t("Upload Record")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 