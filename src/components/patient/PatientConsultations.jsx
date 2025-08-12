import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '@/store/services/axiosInstance';
import { getConsultationsByDoctorAndPatient, answerConsultation } from '@/store/services/patient/consultationApi';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, Send, Clock, CheckCircle, Info, User, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const ConsultationCard = ({ consultation, onChat }) => {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    answered: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const statusIcons = {
    scheduled: Clock,
    completed: CheckCircle,
    cancelled: X,
    pending: Clock,
    answered: CheckCircle,
  };

  const StatusIconComponent = statusIcons[consultation.status] || Info;
  const getDoctorName = () => {
    if (consultation.doctor && typeof consultation.doctor === 'object') {
      const firstName = consultation.doctor.firstName || consultation.doctor.user?.firstName || '';
      const lastName = consultation.doctor.lastName || consultation.doctor.user?.lastName || '';
      if (firstName || lastName) return `Dr. ${firstName} ${lastName}`.trim();
    }
    return 'Dr. Unknown';
  };

  const getActionButtonText = () => {
    if (consultation.status === 'Pending') return 'Answer';
    if (consultation.answer) return 'Chat';
    return 'Answer';
  };

  const getActionButtonVariant = () => {
    if (consultation.status === 'Pending') return 'default';
    if (consultation.answer) return 'default';
    return 'default';
  };

  return (
    <Card className="group relative overflow-hidden border border-border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              {consultation.doctor?.profileImage ? (
                <AvatarImage src={consultation.doctor.profileImage} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {getDoctorName().split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">{getDoctorName()}</h3>
              {consultation.doctor?.specialty && (
                <p className="text-sm text-muted-foreground truncate">{consultation.doctor.specialty}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Patient Consultation</span>
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
              <span className="font-semibold text-sm text-blue-900">Patient Question</span>
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
              <CheckCircle className={`h-4 w-4 ${
                consultation.answer ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className={`font-semibold text-sm ${
                consultation.answer ? 'text-green-900' : 'text-gray-600'
              }`}>
                Your Answer
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              consultation.answer ? 'text-green-800' : 'text-gray-500 italic'
            }`}>
              {consultation.answer || 'No answer provided yet...'}
            </p>
          </div>

          {consultation.messages && consultation.messages.length > 0 && (
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm text-foreground">Conversation</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {consultation.messages.map((m, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium capitalize">{m.sender}:</span>
                    <span className="text-muted-foreground ml-1">{m.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            onClick={() => onChat(consultation)}
          >
            {consultation.status === 'Pending' ? (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Answer
              </>
            ) : consultation.answer ? (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Answer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PatientConsultations({ patientId }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseDialog, setResponseDialog] = useState({ open: false, consultationId: null });
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answerDialog, setAnswerDialog] = useState({ open: false, consultationId: null, question: '' });
  const [answerText, setAnswerText] = useState('');
  const [answering, setAnswering] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatConsultation, setChatConsultation] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingChatMessage, setSendingChatMessage] = useState(false);
  const [chatMessagesRef, setChatMessagesRef] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    axiosInstance.get(`/patients/${patientId}/consultations`)
      .then(res => setConsultations(res.data.data?.consultations || res.data.consultations || []))
      .catch(err => setError('Failed to fetch consultations'))
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    if (chatMessagesRef && chatConsultation?.messages) {
      chatMessagesRef.scrollTop = chatMessagesRef.scrollHeight;
    }
  }, [chatConsultation?.messages, chatMessagesRef]);

  const handleOpenResponse = (consultationId) => {
    setResponseDialog({ open: true, consultationId });
    setResponseText('');
  };

  const handleCloseResponse = () => {
    setResponseDialog({ open: false, consultationId: null });
    setResponseText('');
  };

  const handleSendResponse = async () => {
    setSubmitting(true);
    try {
      await axiosInstance.post(`/consultations/${responseDialog.consultationId}/follow-up`, { question: responseText });
      const data = await getConsultationsByDoctorAndPatient(patientId);
      setConsultations(data);
      handleCloseResponse();
    } catch (err) {
      alert('Failed to send response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAnswer = (consultationId, question) => {
    setAnswerDialog({ open: true, consultationId, question });
    setAnswerText('');
  };

  const handleCloseAnswer = () => {
    setAnswerDialog({ open: false, consultationId: null, question: '' });
    setAnswerText('');
  };

  const handleSendAnswer = async () => {
    if (!answerText.trim()) return;
    
    setAnswering(true);
    try {
      await answerConsultation(answerDialog.consultationId, answerText);
      const data = await getConsultationsByDoctorAndPatient(patientId);
      setConsultations(data);
      handleCloseAnswer();
    } catch (err) {
      alert('Failed to send answer');
    } finally {
      setAnswering(false);
    }
  };

  const handleChat = (consultation) => {
    if (consultation.status === 'Pending') {
      handleOpenAnswer(consultation._id, consultation.question);
    } else if (consultation.answer) {
      setChatConsultation(consultation);
      setChatDialogOpen(true);
    } else {
      handleOpenAnswer(consultation._id, consultation.question);
    }
  };

  const handleChatMessageSubmit = async () => {
    if (!chatMessage.trim() || !chatConsultation) return;
    
    setSendingChatMessage(true);
    try {
      await axiosInstance.post(`/consultations/${chatConsultation._id}/follow-up`, { 
        question: chatMessage 
      });
      
      const data = await getConsultationsByDoctorAndPatient(patientId);
      setConsultations(data);
      
      const updatedConsultation = data.find(c => c._id === chatConsultation._id);
      if (updatedConsultation) {
        setChatConsultation(updatedConsultation);
      }
      
      setChatMessage('');
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSendingChatMessage(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading consultations...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-destructive mb-2">Error loading consultations</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <div className="bg-white border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Patient Consultations</h3>
              <p className="text-muted-foreground">Manage and respond to patient questions</p>
            </div>
            
            <div className=" items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Total:</span>
                <Badge variant="secondary" className="text-xs">
                  {consultations.length} consultation{consultations.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              {consultations.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Pending:</span>
                  <Badge variant="outline" className="text-xs">
                    {consultations.filter(c => c.status === 'Pending').length}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-muted/50 border border-border rounded-lg p-12 max-w-md text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No Consultations Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                This patient hasn't had any consultations yet.
              </p>
            </div>
          </div>
      ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {consultations.map((c) => (
                <ConsultationCard
                  key={c._id}
                  consultation={c}
                  onChat={handleChat}
                />
              ))}
            </div>
        )}
      </div>
      <Dialog open={responseDialog.open} onOpenChange={(open) => !open && handleCloseResponse()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Send className="h-6 w-6 text-primary" />
              Send Follow-up Message
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Your Message:</label>
              <Textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                placeholder="Type your follow-up message here..."
                rows={6}
                className="resize-none border-2 focus:border-primary transition-colors"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCloseResponse} className="px-6">
              Cancel
            </Button>
            <Button 
              onClick={handleSendResponse}
              disabled={submitting || !responseText.trim()}
              className="flex items-center gap-2 px-6 bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={answerDialog.open} onOpenChange={(open) => !open && handleCloseAnswer()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-6 w-6 text-primary" />
              Answer Patient Question
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Patient Question</h4>
              </div>
              <p className="text-blue-800 leading-relaxed">{answerDialog.question}</p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Your Answer:</label>
              <Textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Provide a detailed and helpful answer to the patient's question..."
                rows={8}
                className="resize-none border-2 focus:border-primary transition-colors"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleCloseAnswer} className="px-6">
              Cancel
            </Button>
            <Button 
              onClick={handleSendAnswer}
              disabled={answering || !answerText.trim()}
              className="flex items-center gap-2 px-6 bg-primary hover:bg-primary/90"
            >
              {answering ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Answer...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Answer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-6 w-6 text-primary" />
              Chat with Patient
            </DialogTitle>
          </DialogHeader>
          
          {chatConsultation && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {chatConsultation.patient?.user?.firstName?.[0] || 'P'}
                    </AvatarFallback>
                    </Avatar>
                  <div>
                    <h4 className="font-semibold">
                      {chatConsultation.patient?.user?.firstName || 'Patient'} {chatConsultation.patient?.user?.lastName || ''}
                    </h4>
                    <p className="text-sm text-muted-foreground">Consultation #{chatConsultation._id.slice(-6)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-sm text-blue-900">Original Question</span>
                </div>
                <p className="text-sm text-blue-800">{chatConsultation.question}</p>
              </div>

              {chatConsultation.answer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-sm text-green-900">Your Answer</span>
                  </div>
                  <p className="text-sm text-green-800">{chatConsultation.answer}</p>
                </div>
              )}

              <div 
                ref={setChatMessagesRef}
                className="flex-1 bg-muted/30 rounded-lg p-4 mb-4 overflow-y-auto min-h-0"
              >
                <div className="space-y-3">
                  {chatConsultation.messages && chatConsultation.messages.length > 0 ? (
                    chatConsultation.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'doctor'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border border-border'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                          </p>
                        </div>
              </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatMessageSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleChatMessageSubmit}
                  disabled={sendingChatMessage || !chatMessage.trim()}
                  className="px-4"
                >
                  {sendingChatMessage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
        </div>
      )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 