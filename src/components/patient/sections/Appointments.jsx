'use client';
import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    User,
    MessageSquare,
    Video,
    Phone,
    MapPin,
    Plus,
    X
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
const AppointmentCard = ({ appointment, onChat, onCall, onVideo }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'completed':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled':
                return 'bg-danger/10 text-danger border-danger/20';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };
    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">{appointment.type}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(appointment.date), 'MMM dd, yyyy')}</span>
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(appointment.date), 'hh:mm a')}</span>
                    </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </span>
            </div>
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</span>
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{appointment.location}</span>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={() => onChat(appointment)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                </Button>
                <Button
                    onClick={() => onCall(appointment)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <Phone className="w-4 h-4" />
                    Call
                </Button>
                <Button
                    onClick={() => onVideo(appointment)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <Video className="w-4 h-4" />
                    Video
                </Button>
            </div>
        </div>
    );
};
const AppointmentForm = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        time: '',
        location: '',
        notes: ''
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Schedule New Appointment</h2>
                    <Button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Appointment Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                            <option key="" value="">Select type</option>
                            <option key="Check-up" value="Check-up">Check-up</option>
                            <option key="Follow-up" value="Follow-up">Follow-up</option>
                            <option key="Consultation" value="Consultation">Consultation</option>
                            <option key="Emergency" value="Emergency">Emergency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Schedule
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
const Appointments = ({ patient }) => {
    const [appointments, setAppointments] = useState(patient?.appointments || []);
    const [isFormOpen, setIsFormOpen] = useState(false);
 
    const handleNewAppointment = (formData) => {
        const newAppointment = {
            id: Date.now(),
            ...formData,
            status: 'scheduled',
            doctor: {
                firstName: 'John',
                lastName: 'Doe'
            }
        };
        setAppointments([...appointments, newAppointment]);
    };

    const handleChat = (appointment) => {
        console.log('Chat with appointment:', appointment);
        // TODO: Implement chat functionality
    };

    const handleCall = (appointment) => {
        console.log('Call appointment:', appointment);
        // TODO: Implement call functionality
    };

    const handleVideo = (appointment) => {
        console.log('Video call appointment:', appointment);
        // TODO: Implement video call functionality
    };

    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-primary/20 shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold tracking-tight text-primary">Appointments</h2>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Appointment
                </Button>
            </div>
            {appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment._id || appointment.id}
                            appointment={appointment}
                            onChat={handleChat}
                            onCall={handleCall}
                            onVideo={handleVideo}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Calendar className="w-14 h-14 text-muted-foreground opacity-50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-base font-medium">
                        No appointments scheduled
                    </p>
                </div>
            )}
            <AppointmentForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleNewAppointment}
            />
        </div>
    );
};
export default Appointments; 