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
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
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
            <Badge className={statusColors[consultation.status] || 'bg-gray-100 text-gray-800 border-gray-200'}>
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
    const [activeTab, setActiveTab] = useState('all');
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newConsultationDialogOpen, setNewConsultationDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setSearchQuery('');
    };

    const handleOpenConsultation = (consultation) => {
        setSelectedConsultation(consultation);
        setDialogOpen(true);
    };

    const handleCloseConsultation = () => {
        setDialogOpen(false);
        setSelectedConsultation(null);
    };

    const handleNewConsultationSubmit = (consultationData) => {
        console.log('New consultation submitted:', consultationData);
        showNotification({
            message: 'New consultation started successfully!',
            severity: 'success',
        });
        setNewConsultationDialogOpen(false);
        const newId = `con_${(mockPatientData.consultations.length + 1).toString().padStart(3, '0')}`;
        const newCon = {
            id: newId,
            doctorName: 'Dr. Alice Wonderland',
            doctorAvatar: '/images/default-avatar.png',
            type: 'chat',
            status: 'pending',
            date: new Date().toISOString(),
            reason: consultationData.question.substring(0, 50) + '...',
            messages: [{
                id: 'msg_1',
                sender: 'patient',
                message: consultationData.question,
                timestamp: new Date().toISOString(),
                read: true,
            }],
            attachments: consultationData.attachments || [],
        };
        mockPatientData.consultations.unshift(newCon);
    };

    const handleReplyToConsultation = (consultationId, replyContent, attachments = []) => {
        console.log(`Reply to ${consultationId}:`, replyContent, attachments);
        const consultationIndex = mockPatientData.consultations.findIndex(c => c.id === consultationId);
        if (consultationIndex !== -1) {
            const updatedConsultation = { ...mockPatientData.consultations[consultationIndex] };
            const newMessage = {
                id: `msg_${updatedConsultation.messages.length + 1}`,
                sender: 'patient',
                message: replyContent,
                timestamp: new Date().toISOString(),
                read: true,
            };
            updatedConsultation.messages.push(newMessage);
            if (attachments.length > 0) {
                updatedConsultation.attachments = [...(updatedConsultation.attachments || []), ...attachments.map(att => ({ name: att.name, url: att.url, type: att.type }))];
            }
            mockPatientData.consultations[consultationIndex] = updatedConsultation;
            setSelectedConsultation(updatedConsultation); 
            showNotification({
                message: 'Message sent!',
                severity: 'success',
            });
        }
    };

    const filteredConsultations = mockPatientData.consultations.filter(c => {
        const matchesSearch = c.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.messages.some(msg => msg.message.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = activeTab === 'all' || c.status === activeTab;
        return matchesSearch && matchesStatus;
    }).sort((a,b) => new Date(b.date) - new Date(a.date));

    const renderEmptyState = () => (
        <div className="text-center py-12 bg-card rounded-lg shadow-sm">
            <MessageCircle className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-3">No Consultations Found</h3>
            <p className="text-muted-foreground mb-6">
                {searchQuery || activeTab !== 'all'
                    ? 'Try adjusting your search or filters to find consultations.'
                    : 'You don\'t have any consultations yet. Start a new one to connect with your doctor!'}
            </p>
            <Button onClick={() => setNewConsultationDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Consultation
            </Button>
        </div>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="h-full flex flex-col">
                            <CardContent className="p-6 flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-16 w-16 rounded-full bg-muted"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="h-3 bg-muted rounded w-1/2"></div>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="h-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </div>
                                <div className="flex flex-col gap-3 mt-6">
                                    <div className="h-10 bg-muted rounded w-full"></div>
                                    <div className="h-10 bg-muted rounded w-full"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );
        }

        if (filteredConsultations.length === 0) {
            return renderEmptyState();
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultations.map(consultation => (
                    <ConsultationCard
                        key={consultation.id}
                        consultation={consultation}
                        onOpenDialog={handleOpenConsultation}
                    />
                ))}
            </div>
        );
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image')) return Image;
        if (fileType.startsWith('video')) return Video;
        if (fileType === 'application/pdf') return FileText;
        return Paperclip;
    };

    return (
        <div className="flex flex-col space-y-6">
            <PageHeader
                title="Consultations"
                description="Manage your medical consultations and messages with healthcare providers."
                breadcrumbs={[
                    { label: 'Patient', href: '/patient/dashboard' },
                    { label: 'Consultations', href: '/patient/consultations' }
                ]}
            />

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap justify-end">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search consultations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => setNewConsultationDialogOpen(true)} className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        New Consultation
                    </Button>
                </div>
            </div>

            <Separator />

            {renderContent()}

            <Dialog open={newConsultationDialogOpen} onOpenChange={setNewConsultationDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Start New Consultation</DialogTitle>
                    </DialogHeader>
                    <NewConsultationDialogContent 
                        onSubmit={handleNewConsultationSubmit} 
                        onClose={() => setNewConsultationDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0">
                    {selectedConsultation && (
                        <ConsultationThread 
                            consultation={selectedConsultation} 
                            onReply={handleReplyToConsultation}
                            onClose={handleCloseConsultation}
                            getFileIcon={getFileIcon}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

const NewConsultationDialogContent = ({ onSubmit, onClose }) => {
  const [question, setQuestion] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      url: URL.createObjectURL(file)
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    const attachment = attachments[index];
    if (attachment.url) {
      URL.revokeObjectURL(attachment.url);
    }
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!question.trim()) {
        return;
    }
    onSubmit({
      question,
      attachments: attachments.map(att => ({
        name: att.name,
        type: att.type,
        size: att.size,
        url: att.url
      })),
      timestamp: new Date().toISOString(),
    });
    attachments.forEach(att => {
      if (att.url) {
        URL.revokeObjectURL(att.url);
      }
    });
    setQuestion('');
    setAttachments([]);
    onClose();
  };

  const handleClose = () => {
    attachments.forEach(att => {
      if (att.url) {
        URL.revokeObjectURL(att.url);
      }
    });
    setQuestion('');
    setAttachments([]);
    onClose();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="question" className="text-sm font-medium">Your Question</Label>
        <Textarea
          id="question"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Describe your symptoms or question here..."
          required
        />
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium">Attachments (Optional)</Label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full justify-center"
        >
          <Paperclip className="w-4 h-4 mr-2" /> Add Files
        </Button>
        <div className="mt-3 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => {
            const IconComponent = getFileIcon(attachment.type);
            return (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center gap-1.5 pr-1"
              >
                <IconComponent className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{attachment.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Start Consultation</Button>
      </DialogFooter>
    </div>
  );
};

const ConsultationThread = ({ consultation, onReply, onClose, getFileIcon }) => {
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [consultation.messages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      url: URL.createObjectURL(file)
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    const attachment = attachments[index];
    if (attachment.url) {
      URL.revokeObjectURL(attachment.url);
    }
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    if (replyContent.trim() || attachments.length > 0) {
      onReply(consultation.id, replyContent, attachments.map(att => ({ name: att.name, url: att.url, type: att.type })));
      attachments.forEach(att => {
        if (att.url) {
          URL.revokeObjectURL(att.url);
        }
      });
      setReplyContent('');
      setAttachments([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="p-6 border-b">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={consultation.doctorAvatar || '/images/default-avatar.png'} />
                    <AvatarFallback>{consultation.doctorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <DialogTitle className="text-lg font-bold">{consultation.doctorName}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hidden lg:flex">
                <X className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                <X className="h-5 w-5" />
            </Button>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {consultation.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'patient' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] p-3 rounded-lg",
                  message.sender === 'patient'
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                )}
              >
                <p className="text-sm">{message.message}</p>
                {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, idx) => {
                            const IconComponent = getFileIcon(attachment.type);
                            return (
                                <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                                >
                                    <IconComponent className="h-3 w-3" />
                                    {attachment.name}
                                </a>
                            );
                        })}
                    </div>
                )}
                <span className={cn("block text-xs mt-1", message.sender === 'patient' ? "text-primary-foreground/80 text-right" : "text-muted-foreground/80 text-left")}>
                    {format(new Date(message.timestamp), 'h:mm a')}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-6 border-t">
        {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((attachment, index) => {
                    const IconComponent = getFileIcon(attachment.type);
                    return (
                        <Badge 
                            key={index} 
                            variant="secondary" 
                            className="flex items-center gap-1.5 pr-1"
                        >
                            <IconComponent className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{attachment.name}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                                onClick={() => handleRemoveAttachment(index)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    );
                })}
            </div>
        )}
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="flex-1 min-h-[40px] max-h-[150px] resize-y"
            rows={1}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button onClick={handleSendReply} disabled={!replyContent.trim() && attachments.length === 0}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
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
