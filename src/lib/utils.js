import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export function getAgeFromDateOfBirth(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function getDoctorName(appointment, t) {
  if (appointment.doctor?.user?.firstName && appointment.doctor?.user?.lastName) {
    return `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`;
  }
  if (appointment.doctor?.firstName && appointment.doctor?.lastName) {
    return `${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
  }
  if (appointment.doctor?.name) {
    return appointment.doctor.name;
  }
  if (appointment.doctorName) {
    return appointment.doctorName;
  }
  return t ? t('doctor.appointments.unknownDoctor', 'Unknown Doctor') : 'Unknown Doctor';
}


export function getStatusVariant(status) {
  switch ((status || '').toLowerCase()) {
    case 'scheduled':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'cancelled':
      return 'danger';
    case 'pending':
      return 'outline';
    default:
      return 'default';
  }
} 