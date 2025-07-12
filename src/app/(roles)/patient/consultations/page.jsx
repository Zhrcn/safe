'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Video,
  MessageCircle,
  User,
  Clock,
  Check,
  X,
  Paperclip,
  Info
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Textarea } from '@/components/ui/Textarea';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConsultations, addConsultation, deleteConsultation, sendFollowUpQuestion } from '@/store/slices/patient/consultationsSlice';
import { getDoctors } from '@/store/services/doctor/doctorApi';

import { Alert } from '@/components/ui/Alert';

const getDoctorNameFromConsultation = (consultation, doctorsList) => {
  if (consultation.doctor && typeof consultation.doctor === 'object') {
    const firstName = consultation.doctor.firstName || consultation.doctor.user?.firstName || '';
    const lastName = consultation.doctor.lastName || consultation.doctor.user?.lastName || '';
    if (firstName || lastName) return `${firstName} ${lastName}`.trim();
  }
  if (consultation.doctorName) return consultation.doctorName;
  if (consultation.doctor && Array.isArray(doctorsList)) {
    const doc = doctorsList.find(
      d => d._id === consultation.doctor || d.id === consultation.doctor || d.user?._id === consultation.doctor
    );
    if (doc) {
      const firstName = doc.firstName || doc.user?.firstName || '';
      const lastName = doc.lastName || doc.user?.lastName || '';
      return `${firstName} ${lastName}`.trim();
    }
  }
  return 'Doctor';
};

const ConsultationCard = ({ consultation, onOpenDialog, onCancel, onDelete, doctorsList }) => {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  const statusIcons = {
    scheduled: Clock,
    completed: Check,
    cancelled: X,
    pending: Clock,
  };

  const getTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'Video Call';
      case 'chat': return 'Chat';
      case 'phone': return 'Phone Call';
      default: return type;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return Video;
      case 'chat': return MessageCircle;
      case 'phone': return User;
      default: return MessageCircle;
    }
  };

  const StatusIconComponent = statusIcons[consultation.status] || Info;
  const TypeIconComponent = getTypeIcon(consultation.type) || MessageCircle;

  const getDoctorName = () => getDoctorNameFromConsultation(consultation, doctorsList);

  return (
    <Card className="flex flex-col shadow-sm border border-border rounded-2xl hover:shadow-lg transition-all duration-200 w-full h-full min-h-[220px]">
      <CardContent className="p-4 flex flex-col gap-3 h-full text-sm">
        {/* Doctor Info */}
        <div className="flex items-center gap-3 mb-1">
          <Avatar className="h-10 w-10">
            <AvatarImage src={consultation.doctorAvatar || '/images/default-avatar.png'} />
            <AvatarFallback className="bg-primary text-primary text-base font-semibold">
              {getDoctorName().charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="font-semibold text-base text-foreground truncate">{getDoctorName()}</div>
            {consultation.doctorSpecialty && (
              <div className="text-xs text-muted-foreground truncate">{consultation.doctorSpecialty}</div>
            )}
          </div>
          <Badge className={statusColors[consultation.status] || 'bg-muted text-muted-foreground border-border'} size="sm">
            <StatusIconComponent className="w-3 h-3 mr-1" />
            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
          </Badge>
        </div>
        {/* Type Section */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <TypeIconComponent className="h-4 w-4" />
          <span className="font-medium">{getTypeLabel(consultation.type)} Consultation</span>
        </div>
        {/* Question Section */}
        <div className="p-2 rounded-lg bg-muted/40 border border-border flex flex-col gap-0.5 mb-1 text-xs">
          <div className="flex items-center gap-1 mb-0.5">
            <Info className="h-3 w-3 text-primary" />
            <span className="font-semibold text-xs text-foreground">Question</span>
          </div>
          <div className="text-muted-foreground text-xs">{consultation.question || 'No question provided.'}</div>
        </div>
        {/* Answer Section */}
        <div className="p-2 rounded-lg bg-muted/40 border border-border flex flex-col gap-0.5 mb-1 text-xs">
          <div className="flex items-center gap-1 mb-0.5">
            <Check className="h-3 w-3 text-success" />
            <span className="font-semibold text-xs text-foreground">Answer</span>
          </div>
          <div className="text-muted-foreground text-xs">{consultation.answer || <span className="italic text-warning">No answer yet.</span>}</div>
        </div>
        {/* Last Message/Time/Attachments can be shown below if desired */}
        <div className="flex gap-2 mt-1">
          <Button
            className="flex-1 text-xs py-2"
            variant="default"
            onClick={() => onOpenDialog(consultation)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {consultation.status === 'pending' ? 'Continue Chat' : 'View'}
          </Button>
          {consultation.status === 'pending' && (
            <Button
              variant="outline"
              className="flex-1 border-danger text-danger hover:bg-danger/10 text-xs py-2"
              onClick={() => onCancel && onCancel(consultation)}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 text-xs py-2 bg-secondary"
            onClick={() => onDelete && onDelete(consultation)}
          >
            <X className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ConsultationsPageContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [newConsultationDialogOpen, setNewConsultationDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [alert, setAlert] = useState(null);
  const dispatch = useDispatch();
  const [doctorsData, setDoctorsData] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState(null);
  const [continueChatDialogOpen, setContinueChatDialogOpen] = useState(false);
  const [continueChatConsultation, setContinueChatConsultation] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    dispatch(fetchConsultations());
  }, [dispatch]);

  useEffect(() => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    getDoctors()
      .then(data => {
        setDoctorsData(data);
        console.log('Fetched doctorsData:', data);
      })
      .catch(err => setDoctorsError(err.message || 'Failed to fetch doctors'))
      .finally(() => setDoctorsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDoctor && doctorsData?.data) {
      const doc = doctorsData.data.find(
        d => d._id === selectedDoctor || d.id === selectedDoctor
      );
      if (doc) {
        const firstName = doc.firstName || doc.user?.firstName || '';
        const lastName = doc.lastName || doc.user?.lastName || '';
        setSelectedDoctorName(`${firstName} ${lastName}`.trim());
      } else {
        setSelectedDoctorName('');
      }
    } else {
      setSelectedDoctorName('');
    }
  }, [selectedDoctor, doctorsData]);

  const { consultations, loading: consultationsLoading, error } = useSelector(state => state.consultations);

  useEffect(() => {
    if (consultations && consultations.length > 0) {
      console.log('Consultations:', consultations);
    }
  }, [consultations]);

  const handleCancelConsultation = (consultation) => {
    setAlert({ message: 'Cancel feature coming soon.', severity: 'info' });
  };

  const handleNewConsultationSubmit = async () => {
    if (!question.trim() || !selectedDoctor) return;
    console.log('Submitting consultation with doctorId:', selectedDoctor);
    try {
      await dispatch(addConsultation({ doctorId: selectedDoctor, question })).unwrap();
      setAlert({ message: t('patient.consultations.submitSuccess'), severity: 'success' });
      setNewConsultationDialogOpen(false);
      setQuestion('');
      setSelectedDoctor('');
    } catch (e) {
      setAlert({ message: e?.message || 'Failed to submit question', severity: 'error' });
    }
  };

  const handleChat = (consultation) => {
    if (consultation.status === 'pending') {
      setContinueChatConsultation(consultation);
      setContinueChatDialogOpen(true);
    } else {
      setSelectedConsultation(consultation);
    }
  };

  const handleDeleteConsultation = (consultation) => {
    setConsultationToDelete(consultation);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteConsultation = async () => {
    if (!consultationToDelete) return;
    try {
      await dispatch(deleteConsultation(consultationToDelete._id)).unwrap();
      setAlert({ message: 'Consultation deleted successfully.', severity: 'success' });
    } catch (e) {
      setAlert({ message: e?.message || 'Failed to delete consultation', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setConsultationToDelete(null);
    }
  };

  const handleContinueChatSubmit = async () => {
    if (!newQuestion.trim() || !continueChatConsultation) return;
    try {
      await dispatch(sendFollowUpQuestion({ 
        consultationId: continueChatConsultation._id, 
        question: newQuestion 
      })).unwrap();
      setAlert({ message: 'Question sent successfully. Waiting for doctor response.', severity: 'success' });
      setContinueChatDialogOpen(false);
      setNewQuestion('');
      setContinueChatConsultation(null);
      dispatch(fetchConsultations());
    } catch (e) {
      setAlert({ message: e?.message || 'Failed to send question', severity: 'error' });
    }
  };

  const getDoctorFullName = (doc) => {
    const firstName = doc.firstName || doc.user?.firstName || '';
    const lastName = doc.lastName || doc.user?.lastName || '';
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return '';
  };

  const filteredDoctors = Array.isArray(doctorsData)
    ? doctorsData.filter(
        (doc) => {
          const firstName = doc.firstName || doc.user?.firstName;
          const lastName = doc.lastName || doc.user?.lastName;
          return Boolean(firstName && lastName);
        }
      )
    : Array.isArray(doctorsData?.data)
      ? doctorsData.data.filter(
          (doc) => {
            const firstName = doc.firstName || doc.user?.firstName;
            const lastName = doc.lastName || doc.user?.lastName;
            return Boolean(firstName && lastName);
          }
        )
      : [];

  return (
    <div
      className="flex flex-col gap-8 w-full max-w-none px-0 py-8"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      style={{ width: "100%" }}
    >
      <PageHeader
        title={t("patient.consultations.title")}
        description={t("patient.consultations.description")}
        breadcrumbs={[
          {
            label: t("patient.dashboard.breadcrumb"),
            href: "/patient/dashboard",
          },
          {
            label: t("patient.consultations.title"),
            href: "/patient/consultations",
          },
        ]}
      />
      {/* Show alert if present */}
      {alert && (
        <div className="w-full px-4">
          <Alert>
            {typeof alert.message === "string"
              ? alert.message
              : alert.message?.message || JSON.stringify(alert.message)}
          </Alert>
        </div>
      )}
      <div className="flex justify-end w-full px-6">
        <Button
          onClick={() => setNewConsultationDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3 font-semibold text-lg"
        >
          {t("patient.consultations.askQuestion")}
        </Button>
      </div>
      <div className="w-full px-4">
        {consultationsLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-muted-foreground text-xl">
              {t("patient.consultations.loading")}
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-danger text-xl">
              {typeof error === "string"
                ? error
                : error?.message || JSON.stringify(error)}
            </span>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-muted-foreground text-xl">
              {t("patient.consultations.noConsultations")}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {consultations.map((consultation) => (
              <div key={consultation._id} className="w-full h-full flex">
                <ConsultationCard
                  consultation={consultation}
                  doctorsList={filteredDoctors}
                  onOpenDialog={handleChat}
                  onCancel={handleCancelConsultation}
                  onDelete={handleDeleteConsultation}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal for viewing consultation Q&A */}
      <Dialog
        open={!!selectedConsultation}
        onOpenChange={(open) => !open && setSelectedConsultation(null)}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
          </DialogHeader>
          {selectedConsultation && (
            <div className="flex flex-col gap-6">
              {/* Doctor Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/60">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={
                      selectedConsultation.doctorAvatar ||
                      "/images/default-avatar.png"
                    }
                  />
                  <AvatarFallback className="bg-primary text-primary text-xl font-semibold">
                    {getDoctorNameFromConsultation(
                      selectedConsultation,
                      filteredDoctors
                    ).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {getDoctorNameFromConsultation(
                      selectedConsultation,
                      filteredDoctors
                    )}
                  </div>
                  {selectedConsultation.doctorSpecialty && (
                    <div className="text-sm text-muted-foreground">
                      {selectedConsultation.doctorSpecialty}
                    </div>
                  )}
                </div>
              </div>
              {/* Question Section */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base text-foreground">
                    Question
                  </span>
                </div>
                <div className="text-muted-foreground text-base">
                  {selectedConsultation.question || "No question provided."}
                </div>
              </div>
              {/* Answer Section */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="h-5 w-5 text-success" />
                  <span className="font-semibold text-base text-foreground">
                    Answer
                  </span>
                </div>
                <div className="text-muted-foreground text-base">
                  {selectedConsultation.answer || (
                    <span className="italic text-warning">No answer yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              className=""
              variant="outline"
              onClick={() => setSelectedConsultation(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={newConsultationDialogOpen}
        onOpenChange={setNewConsultationDialogOpen}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("patient.consultations.askQuestion")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Label htmlFor="doctor" className="text-sm font-medium">
              Select Doctor
            </Label>
            {doctorsLoading ? (
              <div className="text-muted-foreground">Loading doctors...</div>
            ) : doctorsError ? (
              <div className="text-danger">Failed to load doctors</div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-muted-foreground">No doctors available.</div>
            ) : (
              <>
                <select
                  id="doctor"
                  className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="">Select a doctor</option>
                  {filteredDoctors.map((doc) => (
                    <option
                      key={doc.user?._id || doc._id || doc.id}
                      value={doc.user?._id || doc._id || doc.id}
                    >
                      {getDoctorFullName(doc)}
                    </option>
                  ))}
                </select>
                {selectedDoctorName && (
                  <div className="mt-2 text-base text-foreground font-semibold">
                    Selected Doctor: Dr. {selectedDoctorName}
                  </div>
                )}
              </>
            )}
            <Label htmlFor="question" className="text-sm font-medium">
              Your Question
            </Label>
            <Textarea
              id="question"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              required
              className="rounded-2xl"
            />
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setNewConsultationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleNewConsultationSubmit}
              disabled={!selectedDoctor || !question.trim()}
            >
              {t("patient.consultations.askQuestion")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Delete Consultation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this consultation?
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteConsultation}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Continue Chat Dialog */}
      <Dialog open={continueChatDialogOpen} onOpenChange={setContinueChatDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Continue Chat with Doctor</DialogTitle>
          </DialogHeader>
          {continueChatConsultation && (
            <div className="flex flex-col gap-4 py-2">
              {/* Doctor Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/60">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={continueChatConsultation.doctorAvatar || '/images/default-avatar.png'} />
                  <AvatarFallback className="bg-primary text-primary text-lg font-semibold">
                    {getDoctorNameFromConsultation(continueChatConsultation, filteredDoctors).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {getDoctorNameFromConsultation(continueChatConsultation, filteredDoctors)}
                  </div>
                  {continueChatConsultation.doctorSpecialty && (
                    <div className="text-sm text-muted-foreground">{continueChatConsultation.doctorSpecialty}</div>
                  )}
                </div>
              </div>
              
              {/* Previous Question */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Previous Question</span>
                </div>
                <div className="text-muted-foreground text-sm">{continueChatConsultation.question}</div>
              </div>
              
              {/* Previous Answer */}
              {continueChatConsultation.answer && (
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="font-semibold text-sm text-foreground">Doctor's Response</span>
                  </div>
                  <div className="text-muted-foreground text-sm">{continueChatConsultation.answer}</div>
                </div>
              )}
              
              {/* New Question */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="newQuestion" className="text-sm font-medium">
                  Your New Question
                </Label>
                <Textarea
                  id="newQuestion"
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your follow-up question here..."
                  required
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setContinueChatDialogOpen(false);
                setNewQuestion('');
                setContinueChatConsultation(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleContinueChatSubmit}
              disabled={!newQuestion.trim()}
            >
              Send Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function ConsultationsPage() {
  const { i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar';
  return (
    <main className={isRtl ? 'rtl' : 'ltr'} style={{ width: '100%' }}>
      <ConsultationsPageContent />
    </main>
  );
}
