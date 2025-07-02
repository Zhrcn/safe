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
import { NotificationProvider, useNotification } from '@/components/ui/Notification';
import { Textarea } from '@/components/ui/Textarea';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConsultations, addConsultation } from '@/store/slices/patient/consultationsSlice';
import { useGetDoctorsQuery } from '@/store/services/doctor/doctorApi';

const ConsultationCard = ({ consultation, onOpenDialog, onCancel }) => {
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

  const getLastMessage = () => {
    if (!consultation?.messages?.length) return "No messages yet";
    const lastMessage = consultation.messages[consultation.messages.length - 1];
    return lastMessage.message || "No message content";
  };

  const getLastMessageTime = () => {
    if (!consultation?.messages?.length) {
      return new Date(consultation?.date || new Date()).toLocaleString();
    }
    const lastMessage = consultation.messages[consultation.messages.length - 1];
    return new Date(lastMessage.timestamp || consultation.date).toLocaleString();
  };

  const getUnreadCount = () => {
    if (!consultation?.messages?.length) return 0;
    return consultation.messages.filter(msg => !msg.isDoctor && !msg.read).length;
  };

  const StatusIconComponent = statusIcons[consultation.status] || Info;
  const TypeIconComponent = getTypeIcon(consultation.type) || MessageCircle;

  return (
    <Card className="flex flex-col shadow-sm border border-border rounded-2xl hover:shadow-lg transition-all duration-200 w-full h-full min-h-[340px]">
      <CardContent className="p-8 flex flex-col gap-6 h-full">
        <div className="flex items-center gap-8">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={consultation.doctorAvatar || '/images/default-avatar.png'} />
              <AvatarFallback className="bg-primary text-primary text-2xl font-semibold">
                {consultation.doctorName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {getUnreadCount() > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-sm font-bold text-primary-foreground bg-primary rounded-full ring-2 ring-card">
                {getUnreadCount()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold truncate">{consultation.doctorName}</h3>
              <Badge className={statusColors[consultation.status] || 'bg-muted text-muted-foreground border-border'} size="lg">
                <StatusIconComponent className="w-4 h-4 mr-1" />
                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-2 text-base text-muted-foreground">
              <TypeIconComponent className="h-5 w-5" />
              <span>{getTypeLabel(consultation.type)} Consultation</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-base">
            <span className="font-medium text-foreground">Last Message:</span>
            <span className="truncate">{getLastMessage()}</span>
          </div>
          <div className="text-sm text-muted-foreground">{getLastMessageTime()}</div>
          {consultation.attachments?.length > 0 && (
            <div className="flex flex-col gap-1 mt-2">
              <span className="font-medium text-base text-foreground">Attachments:</span>
              <div className="flex flex-wrap gap-2">
                {consultation.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-muted text-sm font-medium hover:bg-accent transition"
                  >
                    <Paperclip className="w-4 h-4" />
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-1 border-primary text-primary text-base py-3"
            variant="default"
            onClick={() => onOpenDialog(consultation)}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {consultation.status === 'pending' ? 'View' : 'Continue Chat'}
          </Button>
          {consultation.status === 'pending' && (
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10 text-base py-3"
              onClick={() => onCancel && onCancel(consultation)}
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ConsultationsPageContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { showNotification } = useNotification();
  const [newConsultationDialogOpen, setNewConsultationDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const dispatch = useDispatch();
  const { data: doctorsData, isLoading: doctorsLoading, error: doctorsError } = useGetDoctorsQuery();
  useEffect(() => {
    dispatch(fetchConsultations());
  }, [dispatch]);
  const { consultations, loading: consultationsLoading, error } = useSelector(state => state.consultations);

  const handleCancelConsultation = (consultation) => {
    showNotification({ message: 'Cancel feature coming soon.', severity: 'info' });
  };

  const handleNewConsultationSubmit = async () => {
    if (!question.trim() || !selectedDoctor) return;
    try {
      await dispatch(addConsultation({ doctorId: selectedDoctor, question })).unwrap();
      showNotification({ message: t('patient.consultations.submitSuccess'), severity: 'success' });
      setNewConsultationDialogOpen(false);
      setQuestion('');
      setSelectedDoctor('');
    } catch (e) {
      showNotification({ message: e?.message || 'Failed to submit question', severity: 'error' });
    }
  };

  const handleChat = (consultation) => {
    router.push(`/chat/${consultation.doctor?._id || consultation.doctor}`);
  };

  return (
    <div
      className="flex flex-col gap-8 w-full max-w-none px-0 py-8"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      style={{ width: '100%' }}
    >
      <PageHeader
        title={t('patient.consultations.title')}
        description={t('patient.consultations.description')}
        breadcrumbs={[
          { label: t('patient.dashboard.breadcrumb'), href: '/patient/dashboard' },
          { label: t('patient.consultations.title'), href: '/patient/consultations' }
        ]}
      />
      <div className="flex justify-end w-full px-6">
        <Button
          onClick={() => setNewConsultationDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3 font-semibold text-lg"
        >
          {t('patient.consultations.askQuestion')}
        </Button>
      </div>
      <div className="w-full px-4">
        {consultationsLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-muted-foreground text-xl">{t('patient.consultations.loading')}</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-destructive text-xl">{error}</span>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-muted-foreground text-xl">{t('patient.consultations.noConsultations')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
            {consultations.map((consultation) => (
              <div key={consultation._id} className="w-full h-full flex">
                <ConsultationCard
                  consultation={consultation}
                  onOpenDialog={handleChat}
                  onCancel={handleCancelConsultation}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={newConsultationDialogOpen} onOpenChange={setNewConsultationDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t('patient.consultations.askQuestion')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Label htmlFor="doctor" className="text-sm font-medium">Select Doctor</Label>
            {doctorsLoading ? (
              <div className="text-muted-foreground">Loading doctors...</div>
            ) : doctorsError ? (
              <div className="text-destructive">Failed to load doctors</div>
            ) : (
              <select
                id="doctor"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">Select a doctor</option>
                {doctorsData?.data?.map((doc) => (
                  <option key={doc._id || doc.id} value={doc._id || doc.id}>
                    {doc.firstName && doc.lastName ? `${doc.firstName} ${doc.lastName}` : doc.name || doc.user?.firstName || doc._id}
                  </option>
                ))}
              </select>
            )}
            <Label htmlFor="question" className="text-sm font-medium">Your Question</Label>
            <Textarea
              id="question"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              required
              className="rounded-lg"
            />
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              className="border-primary text-primary"
              variant="outline"
              onClick={() => setNewConsultationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-foreground"
              variant="default"
              onClick={handleNewConsultationSubmit}
              disabled={!selectedDoctor || !question.trim()}
            >
              {t('patient.consultations.askQuestion')}
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
    <NotificationProvider>
      <main className={isRtl ? 'rtl' : 'ltr'} style={{ width: '100%' }}>
        <ConsultationsPageContent />
      </main>
    </NotificationProvider>
  );
}
