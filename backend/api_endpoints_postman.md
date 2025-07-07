# SAFE Backend API Endpoints for Postman Testing

**Base URL:** `http://localhost:PORT/api/v1` (replace `PORT` with your backend port)

---

## Auth (`/auth`)

### Register
- **POST** `/auth/register`
- **Description:** Register a new user
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "yourPassword123",
  "role": "patient" 
}
```

### Login
- **POST** `/auth/login`
- **Description:** Login
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "yourPassword123"
}
```

### Forgot Password
- **POST** `/auth/forgot-password`
- **Description:** Request password reset
- **Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
- **POST** `/auth/reset-password`
- **Description:** Reset password
- **Body:**
```json
{
  "token": "resetTokenFromEmail",
  "password": "newPassword123"
}
```

### Verify Email
- **POST** `/auth/verify-email`
- **Description:** Verify email
- **Body:**
```json
{
  "token": "verificationTokenFromEmail"
}
```

### Resend Verification Email
- **POST** `/auth/resend-verification`
- **Description:** Resend verification email
- **Body:**
```json
{
  "email": "john@example.com"
}
```

### Get Current User
- **GET** `/auth/me`
- **Description:** Get current user (auth required)
- **Headers:** `Authorization: Bearer <token>`

### Update Profile
- **PUT** `/auth/profile`
- **Description:** Update profile (auth required)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

### Change Password
- **POST** `/auth/change-password`
- **Description:** Change password (auth required)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

### Logout
- **POST** `/auth/logout`
- **Description:** Logout (auth required)
- **Headers:** `Authorization: Bearer <token>`

---

## Patients (`/patients`)

### Get Profile
- **GET** `/patients/profile`
- **Headers:** `Authorization: Bearer <token>`

### Update Profile
- **PUT** `/patients/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "9876543210"
}
```

### Get Medical File
- **GET** `/patients/medical-file`
- **Headers:** `Authorization: Bearer <token>`

### Update Medical File
- **PUT** `/patients/medical-file`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "allergies": ["Penicillin"],
  "chronicConditions": ["Diabetes"]
}
```

### Appointments
- **GET** `/patients/appointments` — List
- **POST** `/patients/appointments` — Create
- **PUT** `/patients/appointments/:id` — Update
- **DELETE** `/patients/appointments/:id` — Delete
- **Headers:** `Authorization: Bearer <token>`
- **Create/Update Body:**
```json
{
  "doctorId": "doctorIdHere",
  "date": "2024-07-01T10:00:00Z",
  "type": "in-person", 
  "reason": "Annual checkup"
}
```

### Medications
- **GET** `/patients/medications` — List
- **POST** `/patients/medications` — Add
- **PUT** `/patients/medications/:id` — Update
- **DELETE** `/patients/medications/:id` — Delete
- **Headers:** `Authorization: Bearer <token>`
- **Add/Update Body:**
```json
{
  "name": "Aspirin",
  "dosage": "100mg",
  "frequency": "once daily",
  "notes": "Take with food"
}
```

### Consultations
- **GET** `/patients/consultations` — List
- **POST** `/patients/consultations` — Create
- **PUT** `/patients/consultations/:id` — Update
- **Headers:** `Authorization: Bearer <token>`
- **Create/Update Body:**
```json
{
  "doctorId": "doctorIdHere",
  "question": "What are the side effects of this medication?"
}
```

### Prescriptions
- **GET** `/patients/prescriptions` — List
- **GET** `/patients/prescriptions/active` — List active
- **Headers:** `Authorization: Bearer <token>`

### Messages
- **GET** `/patients/messages` — List
- **POST** `/patients/messages` — Send
- **Headers:** `Authorization: Bearer <token>`
- **Send Body:**
```json
{
  "recipientId": "doctorIdHere",
  "content": "Hello, I have a question about my prescription."
}
```

### Doctors/Pharmacists
- **GET** `/patients/doctors` — List doctors
- **GET** `/patients/doctors/:id` — Get doctor by ID
- **GET** `/patients/pharmacists` — List pharmacists
- **GET** `/patients/pharmacists/:id` — Get pharmacist by ID
- **Headers:** `Authorization: Bearer <token>`

### Dashboard Summary
- **GET** `/patients/dashboard/summary`
- **Headers:** `Authorization: Bearer <token>`

---

## Doctors (`/doctors`)
- **GET** `/doctors/` — List all doctors
- **GET** `/doctors/:id` — Get doctor by ID
- **GET** `/doctors/profile` — Get doctor profile (doctor only)
- **PATCH** `/doctors/profile` — Update doctor profile (doctor only)
- **Headers:** `Authorization: Bearer <token>`
- **Update Body:**
```json
{
  "firstName": "Dr. John",
  "lastName": "Doe",
  "specialty": "Cardiology"
}
```

---

## Pharmacists (`/pharmacists`)
- **GET** `/pharmacists/` — List all pharmacists
- **GET** `/pharmacists/:id` — Get pharmacist by ID
- **GET** `/pharmacists/profile` — Get pharmacist profile (pharmacist only)
- **PATCH** `/pharmacists/profile` — Update pharmacist profile (pharmacist only)
- **Headers:** `Authorization: Bearer <token>`
- **Update Body:**
```json
{
  "firstName": "Pharma",
  "lastName": "Cist",
  "pharmacyName": "Good Health Pharmacy"
}
```

---

## Appointments (`/appointments`)
- **POST** `/appointments/` — Create appointment (patient only)
- **GET** `/appointments/` — List appointments (patient/doctor)
- **PATCH** `/appointments/:id/status` — Update appointment status (patient/doctor)
- **GET** `/appointments/:id` — Get appointment by ID (patient/doctor)
- **PATCH** `/appointments/:id` — Update appointment details (patient only)
- **Headers:** `Authorization: Bearer <token>`
- **Create/Update Body:**
```json
{
  "doctorId": "doctorIdHere",
  "date": "2024-07-01T10:00:00Z",
  "type": "in-person",
  "reason": "Follow-up"
}
```
- **Status Update Body:**
```json
{
  "status": "completed" 
}
```

---

## Notifications (`/notifications`)
- **GET** `/notifications/` — List user notifications
- **PATCH** `/notifications/read-all` — Mark all as read
- **PATCH** `/notifications/:id/read` — Mark one as read
- **Headers:** `Authorization: Bearer <token>`

---

## Medical Files (`/medical-files`)
- **GET** `/medical-files/:id` — Get medical file by ID
- **PATCH** `/medical-files/:id/emergency-contact` — Update emergency contact
- **PATCH** `/medical-files/:id/insurance` — Update insurance details
- **Headers:** `Authorization: Bearer <token>`
- **Emergency Contact Body:**
```json
{
  "name": "Jane Doe",
  "phone": "1234567890",
  "relationship": "Spouse"
}
```
- **Insurance Body:**
```json
{
  "provider": "HealthCare Inc.",
  "policyNumber": "ABC1234567"
}
```

---

## Consultations (`/consultations`)
- **GET** `/consultations/` — List consultations
- **POST** `/consultations/` — Request a consultation
- **PATCH** `/consultations/:id` — Update consultation
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "doctorId": "doctorIdHere",
  "question": "What is the best treatment for my condition?"
}
```
- **Update Body:**
```json
{
  "answer": "You should take your medication as prescribed."
}
``` 