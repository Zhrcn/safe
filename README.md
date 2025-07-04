# SAFE WebApp


## Complete Project Structure

```
safe/
├── saf/
│   ├── .env.local
│   ├── .git/
│   ├── .gitignore
│   ├── .next/
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.*
│   ├── public/
│   │   ├── auth-debug.js
│   │   ├── favicon.svg
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   ├── window.svg
│   │   ├── avatars/
│   │   │   ├── avatar-1.jpg
│   │   │   ├── avatar-1.svg
│   │   │   ├── avatar-2.jpg
│   │   │   ├── avatar-2.svg
│   │   │   ├── avatar-3.jpg
│   │   │   ├── avatar-3.svg
│   │   │   ├── avatar-4.jpg
│   │   │   ├── avatar-4.svg
│   │   │   ├── avatar-5.jpg
│   │   │   └── avatar-5.svg
│   │   └── mock/
│   │       └── images/
│   │           ├── doctor1.jpg
│   │           ├── doctor2.jpg
│   │           ├── doctor3.jpg
│   │           ├── doctor4.jpg
│   │           └── doctor5.jpg
│   ├── scripts/
│   │   ├── seed-database-new.js
│   │   ├── seed-database-old.js
│   │   ├── seed-database.js
│   │   ├── seedDatabase.js
│   │   └── test-mongodb-atlas.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── logout/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── register/
│   │   │   │       └── page.jsx
│   │   │   ├── (roles)/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── users/
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── doctor/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── appointments/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── messages/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── patients/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── schedule/
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── patient/
│   │   │   │   │   ├── appointments/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── consultations/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── health-metrics/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── medicine-reminders/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── messages/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── providers/
│   │   │   │   │       └── page.jsx
│   │   │   │   └── pharmacist/
│   │   │   │       ├── dashboard/
│   │   │   │       │   └── page.jsx
│   │   │   │       ├── inventory/
│   │   │   │       │   └── page.jsx
│   │   │   │       ├── orders/
│   │   │   │       │   └── page.jsx
│   │   │   │       ├── profile/
│   │   │   │       │   └── page.jsx
│   │   │   │       └── settings/
│   │   │   │           └── page.jsx
│   │   │   ├── layout.jsx
│   │   │   └── page.jsx
│   │   ├── components/
│   │   │   ├── AboutSection.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminComponents.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── common/
│   │   │   │   ├── ContentCard.jsx
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── PageTitle.jsx
│   │   │   ├── doctor/
│   │   │   │   ├── AddPatientForm.jsx
│   │   │   │   ├── AppointmentManagement.jsx
│   │   │   │   ├── DoctorDashboardHeader.jsx
│   │   │   │   ├── DoctorLayout.jsx
│   │   │   │   ├── DoctorProfileForm.jsx
│   │   │   │   ├── PatientList.jsx
│   │   │   │   ├── PatientProfileCard.jsx
│   │   │   │   ├── RecentAppointments.jsx
│   │   │   │   ├── ScheduleCalendar.jsx
│   │   │   │   └── UpcomingConsultations.jsx
│   │   │   ├── patient/
│   │   │   │   └── PatientComponents.jsx
│   │   │   ├── pharmacist/
│   │   │   │   └── PharmacistComponents.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       └── Notification.jsx
│   │   ├── controllers/
│   │   │   ├── appointment/
│   │   │   ├── auth/
│   │   │   │   └── loginController.js
│   │   │   ├── consultation/
│   │   │   ├── conversation/
│   │   │   ├── doctor/
│   │   │   ├── healthMetrics/
│   │   │   ├── medicineReminder/
│   │   │   ├── patient/
│   │   │   └── pharmacist/
│   │   ├── hooks/
│   │   │   ├── usePatient.js
│   │   │   └── usePatientData.js
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── apiUtils.js
│   │   │   │   ├── appointmentService.js
│   │   │   │   ├── authService.js
│   │   │   │   ├── doctorService.js
│   │   │   │   └── patientService.js
│   │   │   ├── auth/
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   ├── AuthProvider.jsx
│   │   │   │   └── useAuth.js
│   │   │   ├── db/
│   │   │   │   ├── dbUtils.js
│   │   │   │   ├── index.js
│   │   │   │   ├── models/
│   │   │   │   ├── seed/
│   │   │   │   └── utils/
│   │   │   ├── hooks/
│   │   │   │   ├── useAPI.js
│   │   │   │   └── useRole.js
│   │   │   ├── mockdb/
│   │   │   │   ├── mockAppointments.js
│   │   │   │   ├── mockConsultations.js
│   │   │   │   ├── mockConversations.js
│   │   │   │   ├── mockDoctors.js
│   │   │   │   ├── mockHealthMetrics.js
│   │   │   │   ├── mockMedicines.js
│   │   │   │   └── mockPatients.js
│   │   │   ├── redux/
│   │   │   │   ├── services/
│   │   │   │   │   ├── authApi.js
│   │   │   │   │   └── authApi.js
│   │   │   │   ├── slices/
│   │   │   │   │   ├── authSlice.js
│   │   │   │   │   └── uiSlice.js
│   │   │   │   ├── dateSlice.js
│   │   │   │   ├── index.js
│   │   │   │   ├── patientSlice.js
│   │   │   │   └── store.js
│   │   │   └── services/
│   │   │       └── api.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   ├── Consultation.js
│   │   │   ├── Conversation.js
│   │   │   ├── Doctor.js
│   │   │   ├── HealthMetric.js
│   │   │   ├── Medicine.js
│   │   │   ├── MedicineReminder.js
│   │   │   ├── Notification.js
│   │   │   ├── Patient.js
│   │   │   └── Pharmacist.js
│   │   ├── seed/
│   │   │   └── index.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── patientSlice.js
│   │   └── styles/
│   │       └── globals.css
│   ├── tailwind.config.*
│   ├── test-seed.js
│   └── vercel.json
└── ...

## Key Features
- Next.js 13+ with App Router
- Role-based authentication (Patient/Doctor)
- Redux state management
- MongoDB backend
- Comprehensive API services with mock fallbacks
- Database seeding capability

## Development Setup
1. Install dependencies:
```bash
npm install
```
2. Configure environment variables (copy .env.example to .env.local)
3. Run development server:
```bash
npm run dev
```
4. Seed database (optional):
```bash
node test-seed.js
```