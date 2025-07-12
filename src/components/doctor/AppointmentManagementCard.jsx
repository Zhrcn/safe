import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  acceptAppointment,
  rejectAppointment,
  updateAppointment,
  approveRescheduleRequest,
  rejectRescheduleRequest,
  clearError,
  clearSuccess
} from '../../store/slices/doctor/doctorAppointmentsSlice';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { CalendarIcon, Clock, MapPin, User, FileText } from 'lucide-react';

const AppointmentManagementCard = ({ appointment, dialogMode, onActionComplete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.doctorAppointments);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isApproveRescheduleDialogOpen, setIsApproveRescheduleDialogOpen] = useState(false);
  const [isRejectRescheduleDialogOpen, setIsRejectRescheduleDialogOpen] = useState(false);
  
  const [acceptForm, setAcceptForm] = useState({
    date: '',
    time: '',
    location: '',
    doctorNotes: ''
  });
  const [rejectForm, setRejectForm] = useState({
    doctorNotes: ''
  });
  const [updateForm, setUpdateForm] = useState({
    date: '',
    time: '',
    location: '',
    doctorNotes: '',
    patientNotes: '',
    reason: '',
    type: ''
  });
  const [approveRescheduleForm, setApproveRescheduleForm] = useState({
    newDate: '',
    newTime: '',
    doctorNotes: ''
  });
  const [rejectRescheduleForm, setRejectRescheduleForm] = useState({
    doctorNotes: ''
  });

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      const placeholderDate = new Date('1111-01-01');
      
      // If date is a placeholder, don't set it in the form
      const formDate = (appointment.date && appointmentDate.getTime() !== placeholderDate.getTime() && !isNaN(appointmentDate.getTime())) 
        ? appointmentDate.toISOString().split('T')[0] 
        : '';
      
      setUpdateForm({
        date: formDate,
        time: appointment.time || '',
        location: appointment.location || '',
        doctorNotes: appointment.doctorNotes || '',
        patientNotes: appointment.patientNotes || '',
        reason: appointment.reason || '',
        type: appointment.type || ''
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (dialogMode === 'accept') {
      setIsAcceptDialogOpen(true);
      setIsRejectDialogOpen(false);
      setIsUpdateDialogOpen(false);
      setIsApproveRescheduleDialogOpen(false);
      setIsRejectRescheduleDialogOpen(false);
    } else if (dialogMode === 'reject') {
      setIsRejectDialogOpen(true);
      setIsAcceptDialogOpen(false);
      setIsUpdateDialogOpen(false);
      setIsApproveRescheduleDialogOpen(false);
      setIsRejectRescheduleDialogOpen(false);
    } else if (dialogMode === 'reschedule') {
      setIsUpdateDialogOpen(true);
      setIsAcceptDialogOpen(false);
      setIsRejectDialogOpen(false);
      setIsApproveRescheduleDialogOpen(false);
      setIsRejectRescheduleDialogOpen(false);
    } else if (dialogMode === 'approve_reschedule') {
      setIsApproveRescheduleDialogOpen(true);
      setIsAcceptDialogOpen(false);
      setIsRejectDialogOpen(false);
      setIsUpdateDialogOpen(false);
      setIsRejectRescheduleDialogOpen(false);
    } else if (dialogMode === 'reject_reschedule') {
      setIsRejectRescheduleDialogOpen(true);
      setIsAcceptDialogOpen(false);
      setIsRejectDialogOpen(false);
      setIsUpdateDialogOpen(false);
      setIsApproveRescheduleDialogOpen(false);
    }
  }, [dialogMode]);

  const handleAccept = async () => {
    const appointmentData = {};
    if (acceptForm.date) appointmentData.date = acceptForm.date;
    if (acceptForm.time) appointmentData.time = acceptForm.time;
    if (acceptForm.location) appointmentData.location = acceptForm.location;
    if (acceptForm.doctorNotes) appointmentData.doctorNotes = acceptForm.doctorNotes;

    const result = await dispatch(acceptAppointment({ appointmentId: appointment._id, appointmentData }));
    setIsAcceptDialogOpen(false);
    setAcceptForm({ date: '', time: '', location: '', doctorNotes: '' });
    if (onActionComplete) onActionComplete();
  };

  const handleReject = async () => {
    const result = await dispatch(rejectAppointment({ 
      appointmentId: appointment._id, 
      doctorNotes: rejectForm.doctorNotes 
    }));
    setIsRejectDialogOpen(false);
    setRejectForm({ doctorNotes: '' });
    if (onActionComplete) onActionComplete();
  };

  const handleUpdate = async () => {
    // Prepare appointment data for update
    const appointmentData = {};
    if (updateForm.date) appointmentData.date = updateForm.date;
    if (updateForm.time) appointmentData.time = updateForm.time;
    if (updateForm.location) appointmentData.location = updateForm.location;
    if (updateForm.doctorNotes !== undefined) appointmentData.doctorNotes = updateForm.doctorNotes;
    if (updateForm.patientNotes !== undefined) appointmentData.patientNotes = updateForm.patientNotes;
    if (updateForm.reason) appointmentData.reason = updateForm.reason;
    if (updateForm.type) appointmentData.type = updateForm.type;

    // If this is a reschedule action, also update the status to 'rescheduled'
    if (dialogMode === 'reschedule') {
      if (!updateForm.date || !updateForm.time) {
        // Show error message
        dispatch(clearError());
        dispatch(clearSuccess());
        console.error('Missing date or time for rescheduling:', { date: updateForm.date, time: updateForm.time });
        return;
      }
      
      console.log('Rescheduling appointment with data:', { 
        appointmentId: appointment._id, 
        appointmentData 
      });
      
      appointmentData.status = 'rescheduled';
    }

    await dispatch(updateAppointment({ appointmentId: appointment._id, appointmentData }));
    
    setIsUpdateDialogOpen(false);
    if (onActionComplete) onActionComplete();
  };

  const handleApproveReschedule = async () => {
    const rescheduleData = {};
    if (approveRescheduleForm.newDate) rescheduleData.newDate = approveRescheduleForm.newDate;
    if (approveRescheduleForm.newTime) rescheduleData.newTime = approveRescheduleForm.newTime;
    if (approveRescheduleForm.doctorNotes) rescheduleData.doctorNotes = approveRescheduleForm.doctorNotes;

    await dispatch(approveRescheduleRequest({ appointmentId: appointment._id, rescheduleData }));
    setIsApproveRescheduleDialogOpen(false);
    setApproveRescheduleForm({ newDate: '', newTime: '', doctorNotes: '' });
    if (onActionComplete) onActionComplete();
  };

  const handleRejectReschedule = async () => {
    await dispatch(rejectRescheduleRequest({ 
      appointmentId: appointment._id, 
      doctorNotes: rejectRescheduleForm.doctorNotes 
    }));
    setIsRejectRescheduleDialogOpen(false);
    setRejectRescheduleForm({ doctorNotes: '' });
    if (onActionComplete) onActionComplete();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-purple-100 text-purple-800';
      case 'reschedule_requested': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    const appointmentDate = new Date(date);
    const placeholderDate = new Date('1111-01-01');
    
    // If date is a placeholder (like 1/1/1111), show as TBD
    if (appointmentDate.getTime() === placeholderDate.getTime() || isNaN(appointmentDate.getTime())) {
      return 'TBD';
    }
    
    return appointmentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canModify = appointment?.canBeModified !== false;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{appointment?.patient?.user?.firstName} {appointment?.patient?.user?.lastName}</span>
          <Badge className={getStatusColor(appointment?.status)}>
            {appointment?.status?.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="danger">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Patient:</span>
              <span>{appointment?.patient?.user?.firstName} {appointment?.patient?.user?.lastName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Date:</span>
              <span>{appointment?.date ? formatDate(appointment.date) : 'TBD'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Time:</span>
              <span>{appointment?.time || 'TBD'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Location:</span>
              <span>{appointment?.location || 'TBD'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Type:</span>
              <span className="capitalize">{appointment?.type}</span>
            </div>
            <div className="space-y-1">
              <span className="font-medium">Reason:</span>
              <p className="text-sm text-gray-600">{appointment?.reason}</p>
            </div>
            {appointment?.notes && (
              <div className="space-y-1">
                <span className="font-medium">Notes:</span>
                <p className="text-sm text-gray-600">{appointment.notes}</p>
              </div>
            )}
            {appointment?.status === 'reschedule_requested' && appointment?.rescheduleRequest && (
              <div className="space-y-1">
                <span className="font-medium text-orange-700">Reschedule Request:</span>
                <div className="bg-orange-50 border border-orange-200 rounded p-2">
                  <p className="text-sm text-orange-800">
                    <strong>Preferred Times:</strong> {appointment.rescheduleRequest?.preferredTimes || 'Not specified'}
                  </p>
                  {appointment.rescheduleRequest?.reason && (
                    <p className="text-sm text-orange-800 mt-1">
                      <strong>Reason:</strong> {appointment.rescheduleRequest.reason}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {appointment?.status === 'pending' && (
            <>
              <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" disabled={loading || !canModify}>
                    {t('doctor.appointments.accepted', 'Accepted')} {t('doctor.appointments.title', 'Appointments')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('doctor.appointments.accepted', 'Accepted')} {t('doctor.appointments.title', 'Appointments')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accept-date">Date</Label>
                      <Input
                        id="accept-date"
                        type="date"
                        value={acceptForm.date}
                        onChange={(e) => setAcceptForm({ ...acceptForm, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accept-time">Time</Label>
                      <Input
                        id="accept-time"
                        type="time"
                        value={acceptForm.time}
                        onChange={(e) => setAcceptForm({ ...acceptForm, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accept-location">Location</Label>
                      <Input
                        id="accept-location"
                        value={acceptForm.location}
                        onChange={(e) => setAcceptForm({ ...acceptForm, location: e.target.value })}
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accept-notes">Doctor Notes</Label>
                      <Textarea
                        id="accept-notes"
                        value={acceptForm.doctorNotes}
                        onChange={(e) => setAcceptForm({ ...acceptForm, doctorNotes: e.target.value })}
                        placeholder="Add notes for the patient"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAcceptDialogOpen(false)}>
                        {t('common.cancel', 'Cancel')}
                      </Button>
                      <Button onClick={handleAccept} disabled={loading}>
                        {t('doctor.appointments.accepted', 'Accepted')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="danger" disabled={loading || !canModify}>
                    {t('doctor.appointments.rejected', 'Rejected')} {t('doctor.appointments.title', 'Appointments')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('doctor.appointments.rejected', 'Rejected')} {t('doctor.appointments.title', 'Appointments')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reject-notes">Reason for Rejection</Label>
                      <Textarea
                        id="reject-notes"
                        value={rejectForm.doctorNotes}
                        onChange={(e) => setRejectForm({ doctorNotes: e.target.value })}
                        placeholder="Provide a reason for rejecting this appointment"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                        {t('common.cancel', 'Cancel')}
                      </Button>
                      <Button variant="danger" onClick={handleReject} disabled={loading}>
                        {t('doctor.appointments.rejected', 'Rejected')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          {appointment?.status === 'reschedule_requested' && (
            <>
              <Dialog open={isApproveRescheduleDialogOpen} onOpenChange={setIsApproveRescheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={loading} className="">
                    {t('doctor.appointments.approveReschedule', 'Approve Reschedule')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('doctor.appointments.approveReschedule', 'Approve Reschedule Request')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="approve-new-date">New Date</Label>
                      <Input
                        id="approve-new-date"
                        type="date"
                        value={approveRescheduleForm.newDate}
                        onChange={(e) => setApproveRescheduleForm({ ...approveRescheduleForm, newDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="approve-new-time">New Time</Label>
                      <Input
                        id="approve-new-time"
                        type="time"
                        value={approveRescheduleForm.newTime}
                        onChange={(e) => setApproveRescheduleForm({ ...approveRescheduleForm, newTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="approve-notes">Doctor Notes</Label>
                      <Textarea
                        id="approve-notes"
                        value={approveRescheduleForm.doctorNotes}
                        onChange={(e) => setApproveRescheduleForm({ ...approveRescheduleForm, doctorNotes: e.target.value })}
                        placeholder="Add notes for the patient"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsApproveRescheduleDialogOpen(false)}>
                        {t('common.cancel', 'Cancel')}
                      </Button>
                      <Button variant="default" onClick={handleApproveReschedule} disabled={loading}>
                        {t('doctor.appointments.approveReschedule', 'Approve')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isRejectRescheduleDialogOpen} onOpenChange={setIsRejectRescheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" disabled={loading}>
                    {t('doctor.appointments.rejectReschedule', 'Reject Reschedule')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('doctor.appointments.rejectReschedule', 'Reject Reschedule Request')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reject-reschedule-notes">Reason for Rejection</Label>
                      <Textarea
                        id="reject-reschedule-notes"
                        value={rejectRescheduleForm.doctorNotes}
                        onChange={(e) => setRejectRescheduleForm({ doctorNotes: e.target.value })}
                        placeholder="Provide a reason for rejecting this reschedule request"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 gap-3">
                      <Button variant="outline" onClick={() => setIsRejectRescheduleDialogOpen(false)}>
                        {t('common.cancel', 'Cancel')}
                      </Button>
                      <Button variant="default" onClick={handleRejectReschedule} disabled={loading}>
                        {t('doctor.appointments.rejectReschedule', 'Reject')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          {appointment?.status !== 'rejected' && appointment?.status !== 'completed' && appointment?.status !== 'reschedule_requested' && (
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={loading || !canModify}>
                  Update Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Update Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="update-date">Date</Label>
                      <Input
                        id="update-date"
                        type="date"
                        value={updateForm.date}
                        onChange={(e) => setUpdateForm({ ...updateForm, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="update-time">Time</Label>
                      <Input
                        id="update-time"
                        type="time"
                        value={updateForm.time}
                        onChange={(e) => setUpdateForm({ ...updateForm, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="update-location">Location</Label>
                    <Input
                      id="update-location"
                      value={updateForm.location}
                      onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="update-type">Type</Label>
                      <Select value={updateForm.type} onValueChange={(value) => setUpdateForm({ ...updateForm, type: value })}>
                        <SelectTrigger>
                          <span>
                            <SelectValue placeholder="Select type" />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkup">Checkup</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="update-reason">Reason</Label>
                      <Input
                        id="update-reason"
                        value={updateForm.reason}
                        onChange={(e) => setUpdateForm({ ...updateForm, reason: e.target.value })}
                        placeholder="Enter reason"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="update-doctor-notes">Doctor Notes</Label>
                    <Textarea
                      id="update-doctor-notes"
                      value={updateForm.doctorNotes}
                      onChange={(e) => setUpdateForm({ ...updateForm, doctorNotes: e.target.value })}
                      placeholder="Add notes for the patient"
                    />
                  </div>
                  <div>
                    <Label htmlFor="update-patient-notes">Patient Notes</Label>
                    <Textarea
                      id="update-patient-notes"
                      value={updateForm.patientNotes}
                      onChange={(e) => setUpdateForm({ ...updateForm, patientNotes: e.target.value })}
                      placeholder="Add notes for the patient"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button variant="default" onClick={handleUpdate} disabled={loading}>
                      {t('common.update', 'Update')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {!canModify && (
            <div className="text-sm text-red-600">
              Cannot modify appointment within 24 hours of scheduled time
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentManagementCard; 