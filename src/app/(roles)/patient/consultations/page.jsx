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
import { Avatar, AvatarFallback, AvatarImage, getInitialsFromName } from '@/components/ui/Avatar';
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
    answered: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const statusIcons = {
    scheduled: Clock,
    completed: Check,
    cancelled: X,
    pending: Clock,
    answered: Check,
  };

  const getTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'Video Call';
      case 'chat': return 'Chat';
      case 'phone': return 'Phone Call';
      default: return 'Chat';
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

  const getActionButtonText = () => {
    if (consultation.status === 'pending') return 'Answer';
    if (consultation.answer) return 'Chat';
    return 'View';
  };

  const getActionButtonVariant = () => {
    if (consultation.status === 'pending') return 'default';
    if (consultation.answer) return 'default';
    return 'outline';
  };

  return (
    <Card className="group relative overflow-hidden border border-border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              {consultation.doctorAvatar ? (
                <AvatarImage src={consultation.doctorAvatar} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {getInitialsFromName(getDoctorName())}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">{getDoctorName()}</h3>
              {consultation.doctorSpecialty && (
                <p className="text-sm text-muted-foreground truncate">{consultation.doctorSpecialty}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <TypeIconComponent className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{getTypeLabel(consultation.type)}</span>
              </div>
            </div>
          </div>
          <Badge 
            className={`${statusColors[consultation.status] || 'bg-muted text-muted-foreground'} transition-all`} 
            size="sm"
          >
            <StatusIconComponent className="w-3 h-3 mr-1" />
            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-sm text-blue-900">Your Question</span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {consultation.question || 'No question provided.'}
            </p>
          </div>

          <div className={`border rounded-lg p-4 ${
            consultation.answer 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Check className={`h-4 w-4 ${
                consultation.answer ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className={`font-semibold text-sm ${
                consultation.answer ? 'text-green-900' : 'text-gray-600'
              }`}>
                Doctor's Answer
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              consultation.answer ? 'text-green-800' : 'text-gray-500 italic'
            }`}>
              {consultation.answer || 'Waiting for doctor response...'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Created: {new Date(consultation.createdAt).toLocaleDateString()}</span>
            {consultation.updatedAt && consultation.updatedAt !== consultation.createdAt && (
              <span>Updated: {new Date(consultation.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <Button
            className="flex-1"
            variant={getActionButtonVariant()}
            onClick={() => onOpenDialog(consultation)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {getActionButtonText()}
          </Button>
          
          {consultation.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => onCancel && onCancel(consultation)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => onDelete && onDelete(consultation)}
          >
            <X className="h-4 w-4" />
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

  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatConsultation, setChatConsultation] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isAnswerMode, setIsAnswerMode] = useState(false);
  const [chatMessagesRef, setChatMessagesRef] = useState(null);

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

  useEffect(() => {
    if (chatMessagesRef && chatConsultation?.messages) {
      chatMessagesRef.scrollTop = chatMessagesRef.scrollHeight;
    }
  }, [chatConsultation?.messages, chatMessagesRef]);

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
      setChatConsultation(consultation);
      setChatDialogOpen(true);
      setIsAnswerMode(true);
    } else if (consultation.answer) {
      setChatConsultation(consultation);
      setChatDialogOpen(true);
      setIsAnswerMode(false);
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

  const handleChatMessageSubmit = async () => {
    if (!chatMessage.trim() || !chatConsultation) return;
    try {
      if (isAnswerMode) {
        await dispatch(sendFollowUpQuestion({ 
          consultationId: chatConsultation._id, 
          question: chatMessage 
        })).unwrap();
        setAlert({ message: 'Answer sent successfully.', severity: 'success' });
      } else {
        await dispatch(sendFollowUpQuestion({ 
          consultationId: chatConsultation._id, 
          question: chatMessage 
        })).unwrap();
        setAlert({ message: 'Message sent successfully.', severity: 'success' });
      }
      setChatMessage('');
      const result = await dispatch(fetchConsultations()).unwrap();
      const updatedConsultation = result.find(c => c._id === chatConsultation._id);
      if (updatedConsultation) {
        setChatConsultation(updatedConsultation);
      }
    } catch (e) {
      setAlert({ message: e?.message || 'Failed to send message', severity: 'error' });
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
      className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Total:</span>
                <Badge variant="secondary" className="text-xs">
                  {consultations.length} consultation{consultations.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              {consultations.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Answered:</span>
                  <Badge variant="outline" className="text-xs">
                    {consultations.filter(c => c.answer).length}
                  </Badge>
                </div>
              )}
            </div>
            
            <Button
              onClick={() => setNewConsultationDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {t("patient.consultations.askQuestion")}
            </Button>
          </div>
        </div>
      </div>

      {alert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Alert className={`${
            alert.severity === 'error' ? 'border-destructive bg-destructive/10' :
            alert.severity === 'success' ? 'border-green-200 bg-green-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            {typeof alert.message === "string"
              ? alert.message
              : alert.message?.message || JSON.stringify(alert.message)}
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {consultationsLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <span className="text-muted-foreground text-xl font-medium">
              {t("patient.consultations.loading")}
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md text-center">
              <X className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Consultations</h3>
              <p className="text-destructive/80">
                {typeof error === "string"
                  ? error
                  : error?.message || JSON.stringify(error)}
              </p>
            </div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-muted/50 border border-border rounded-lg p-12 max-w-md text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No Consultations Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("patient.consultations.noConsultations")}
              </p>
              <Button
                onClick={() => setNewConsultationDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Your First Question
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {consultations.map((consultation) => (
              <ConsultationCard
                key={consultation._id}
                consultation={consultation}
                doctorsList={filteredDoctors}
                onOpenDialog={handleChat}
                onCancel={handleCancelConsultation}
                onDelete={handleDeleteConsultation}
              />
            ))}
          </div>
        )}
      </div>
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
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/60">
                <Avatar className="h-14 w-14">
                  {selectedConsultation?.doctorAvatar ? (
                    <AvatarImage src={selectedConsultation.doctorAvatar} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary text-xl font-semibold">
                      {getInitialsFromName(getDoctorNameFromConsultation(
                        selectedConsultation,
                        filteredDoctors
                      ))}
                    </AvatarFallback>
                  )}
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
              <div className="text-destructive">Failed to load doctors</div>
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
                  <option key="" value="">Select a doctor</option>
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
              variant="destructive"
              onClick={confirmDeleteConsultation}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="sm:max-w-[700px] h-[80vh] max-h-[600px] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {isAnswerMode ? 'Answer Consultation' : 'Chat with Doctor'}
            </DialogTitle>
          </DialogHeader>
          {chatConsultation && (
            <div className="flex flex-col h-full min-h-0">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/60 mb-4 flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chatConsultation.doctorAvatar || '/images/default-avatar.png'} />
                  <AvatarFallback className="bg-primary text-primary text-lg font-semibold">
                    {getInitialsFromName(getDoctorNameFromConsultation(chatConsultation, filteredDoctors))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg text-foreground">
                    {getDoctorNameFromConsultation(chatConsultation, filteredDoctors)}
                  </div>
                  {chatConsultation.doctorSpecialty && (
                    <div className="text-sm text-muted-foreground">{chatConsultation.doctorSpecialty}</div>
                  )}
                </div>
              </div>

              <div 
                ref={setChatMessagesRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-lg mb-4 min-h-0"
              >
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-primary text-primary-foreground p-3 rounded-lg">
                    <div className="text-xs opacity-80 mb-1">Your Question:</div>
                    <div>{chatConsultation.question}</div>
                  </div>
                </div>

                {chatConsultation.answer && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-muted p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Doctor's Answer:</div>
                      <div>{chatConsultation.answer}</div>
                    </div>
                  </div>
                )}

                {chatConsultation.messages && chatConsultation.messages.length > 0 && 
                  chatConsultation.messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'patient' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'patient' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="text-xs opacity-80 mb-1">
                          {message.sender === 'patient' ? 'You' : 'Doctor'}:
                        </div>
                        <div>{message.message}</div>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={isAnswerMode ? "Type your answer..." : "Type your message..."}
                  className="flex-1 resize-none min-h-[60px] max-h-[120px]"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatMessageSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleChatMessageSubmit}
                  disabled={!chatMessage.trim()}
                  className="px-4 self-end"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setChatDialogOpen(false);
                setChatMessage('');
                setChatConsultation(null);
                setIsAnswerMode(false);
              }}
            >
              Close
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
