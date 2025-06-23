'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Video,
  MessageCircle,
  User,
  Clock,
  Download,
  Paperclip,
  Check,
  X,
  Send,
  Plus,
  FileText,
  Image,
  ChevronLeft,
  Search,
  Info
} from 'lucide-react';
import { mockPatientData } from '@/mockdata/patientData';
import PageHeader from '@/components/patient/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { NotificationProvider, useNotification } from '@/components/ui/Notification';
import { ScrollArea } from '@/components/ui/ScrollArea';
import Link from 'next/link';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { consultations as mockConsultations } from '@/mockdata/consultations';

const ConsultationCard = ({ consultation, onOpenDialog }) => {
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
    switch (type.toLowerCase()) {
        case 'video': return 'Video Call';
        case 'chat': return 'Chat';
        case 'phone': return 'Phone Call';
        default: return type;
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
        case 'video': return Video;
        case 'chat': return MessageCircle;
        case 'phone': return Phone;
        default: return MessageCircle;
    }
  };

  const getLastMessage = () => {
    if (!consultation?.messages?.length) {
      return "No messages yet";
    }
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
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={consultation.doctorAvatar || '/images/default-avatar.png'} />
                <AvatarFallback className="bg-primary text-primary text-xl font-semibold">
                  {consultation.doctorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {getUnreadCount() > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-primary-foreground bg-primary rounded-full ring-2 ring-card">
                  {getUnreadCount()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{consultation.doctorName}</h3>
              <p className="text-sm text-muted-foreground capitalize">{getTypeLabel(consultation.type)} Consultation</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <TypeIconComponent className="h-4 w-4" />
                  <span>{getTypeLabel(consultation.type)}</span>
              </div>
            </div>
            <Badge className={statusColors[consultation.status] || 'bg-muted text-muted-foreground border-border'}>
                <StatusIconComponent className="w-3 h-3 mr-1" />
                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-foreground line-clamp-2">
              <span className="font-semibold">Last Message:</span> {getLastMessage()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getLastMessageTime()}
            </p>

            {consultation.attachments && consultation.attachments.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-foreground mb-2">Attachments:</h4>
                <div className="flex flex-wrap gap-2">
                  {consultation.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted hover:bg-accent transition-colors"
                    >
                      <Paperclip className="w-3 h-3" />
                      {attachment.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1"
            onClick={() => onOpenDialog(consultation)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {consultation.status === 'pending' ? 'View Consultation' : 'Continue Chat'}
          </Button>
          {consultation.status === 'pending' && (
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ConsultationsPageContent = () => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [newConsultationDialogOpen, setNewConsultationDialogOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    const handleNewConsultationSubmit = () => {
        if (!question.trim()) return;
        showNotification({ message: 'Question submitted!', severity: 'success' });
        setNewConsultationDialogOpen(false);
        setQuestion('');
        mockConsultations.unshift({
            id: `con_${mockConsultations.length + 1}`,
            doctorName: 'Dr. Alice Wonderland',
            doctorId: 'doc_1',
            patientId: mockPatientData.id,
            question,
            answer: '',
            status: 'Pending',
        });
    };
    const handleChat = (consultation) => {
        router.push(`/chat/${consultation.doctorId}`);
    };
    const patientConsultations = mockConsultations.filter(c => c.patientId === mockPatientData.id);
    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Consultations"
                description="Ask your doctor a question and view your Q&A history."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Consultations', href: '/patient/consultations' }
                ]}
            />
            <div className="flex justify-end">
                <Button onClick={() => setNewConsultationDialogOpen(true)}>
                    Ask a Question
                </Button>
            </div>
            <div className="mt-4">
                {isLoading ? (
                    <div className="text-center py-10 text-muted-foreground">Loading...</div>
                ) : patientConsultations.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No consultations yet.</div>
                ) : (
                    <div className="space-y-4">
                        {patientConsultations.map((consultation) => (
                            <div key={consultation.id} className="bg-muted rounded-lg p-4 border border-border flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">Question:</span>
                                    <span>{consultation.question}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                    <span className="font-semibold">Answer:</span>
                                    {consultation.answer ? (
                                        <span>{consultation.answer}</span>
                                    ) : (
                                        <span className="italic text-muted-foreground">Not answered yet</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleChat(consultation)}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        Chat
                                    </Button>
                                    <span className="ml-4 text-xs text-muted-foreground">Status: {consultation.answer ? 'Answered' : 'Pending'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Dialog open={newConsultationDialogOpen} onOpenChange={setNewConsultationDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Ask a New Question</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="question" className="text-sm font-medium">Your Question</Label>
                        <Textarea
                            id="question"
                            rows={4}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type your question here..."
                            required
                        />
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setNewConsultationDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleNewConsultationSubmit}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default function ConsultationsPage() {
    return (
        <NotificationProvider>
            <ConsultationsPageContent />
        </NotificationProvider>
    );
}
