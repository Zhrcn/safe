export const mockPatientData = {
  appointments: [
    {
      id: 1,
      doctorId: 1,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-03-25",
      time: "10:00 AM",
      status: "scheduled",
      type: "regular",
      reason: "Regular checkup",
      notes: "Please bring your recent blood test results",
      location: "Main Hospital - Cardiology Department",
      duration: 30,
    },
    {
      id: 2,
      doctorId: 2,
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "2024-03-28",
      time: "2:30 PM",
      status: "completed",
      type: "follow-up",
      reason: "Follow-up on skin condition",
      notes: "Previous treatment showed improvement",
      location: "Medical Center - Dermatology Clinic",
      duration: 45,
    },
    {
      id: 3,
      doctorId: 3,
      doctorName: "Dr. Emily Brown",
      specialty: "Pediatrics",
      date: "2024-04-02",
      time: "11:15 AM",
      status: "cancelled",
      type: "emergency",
      reason: "Fever and cough",
      notes: "Patient requested cancellation",
      location: "Children's Hospital - Pediatrics Wing",
      duration: 30,
    }
  ],
  prescriptions: [
    {
      id: 1,
      doctorId: 1,
      doctorName: "Dr. Sarah Johnson",
      date: "2024-03-15",
      medications: [
        {
          id: 1,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take with food",
          refills: 2,
          status: "active"
        },
        {
          id: 2,
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take with meals",
          refills: 1,
          status: "active"
        }
      ],
      notes: "Continue current medications and schedule follow-up in 30 days",
      status: "pending"
    },
    {
      id: 2,
      doctorId: 2,
      doctorName: "Dr. Michael Chen",
      date: "2024-02-28",
      medications: [
        {
          id: 3,
          name: "Hydrocortisone Cream",
          dosage: "1%",
          frequency: "Apply twice daily",
          duration: "14 days",
          instructions: "Apply to affected area",
          refills: 0,
          status: "completed"
        }
      ],
      notes: "Apply cream to affected areas until symptoms improve",
      status: "completed"
    },
    {
      id: 3,
      doctorId: 1,
      doctorName: "Dr. Sarah Johnson",
      date: "2024-03-20",
      medications: [
        {
          id: 4,
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
          instructions: "Take after meals",
          refills: 0,
          status: "pending"
        }
      ],
      notes: "Complete the full course of antibiotics",
      status: "pending"
    }
  ],
  consultations: [
    {
      id: 1,
      doctorId: 1,
      doctorName: "Dr. Sarah Johnson",
      date: "2024-03-20",
      time: "3:00 PM",
      type: "video",
      status: "scheduled",
      reason: "Review of recent test results",
      notes: "Please have your blood test results ready",
      duration: 30,
      messages: [
        {
          sender: "You",
          message: "I have my blood test results ready for the consultation.",
          timestamp: "2024-03-20T14:30:00Z",
          read: true
        },
        {
          sender: "Dr. Sarah Johnson",
          message: "Thank you for preparing the results. I'll review them during our consultation.",
          timestamp: "2024-03-20T14:35:00Z",
          read: true
        }
      ],
      attachments: [
        {
          id: 1,
          name: "Blood Test Results.pdf",
          type: "pdf",
          size: "2.5MB",
          uploadedAt: "2024-03-19"
        }
      ]
    },
    {
      id: 2,
      doctorId: 2,
      doctorName: "Dr. Michael Chen",
      date: "2024-03-18",
      time: "11:00 AM",
      type: "in-person",
      status: "completed",
      reason: "Skin condition follow-up",
      notes: "Patient reported improvement in symptoms",
      duration: 45,
      messages: [
        {
          sender: "You",
          message: "The prescribed cream has helped reduce the redness significantly.",
          timestamp: "2024-03-18T10:45:00Z",
          read: true
        },
        {
          sender: "Dr. Michael Chen",
          message: "That's great to hear. Let's discuss the progress during our appointment.",
          timestamp: "2024-03-18T10:50:00Z",
          read: true
        },
        {
          sender: "Dr. Michael Chen",
          message: "Based on today's examination, we can reduce the frequency of application.",
          timestamp: "2024-03-18T11:45:00Z",
          read: true
        }
      ],
      attachments: [
        {
          id: 2,
          name: "Skin Photos.jpg",
          type: "image",
          size: "1.8MB",
          uploadedAt: "2024-03-17"
        }
      ]
    }
  ],
  doctors: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      hospital: "Main Hospital",
      yearsExperience: 15,
      rating: 4.8,
      photo: "/doctors/doctor1.jpg",
      isPrimary: true,
      hasAccess: true,
      education: [
        {
          degree: "MD",
          institution: "Harvard Medical School",
          year: 2009
        },
        {
          degree: "Cardiology Fellowship",
          institution: "Johns Hopkins Hospital",
          year: 2012
        }
      ],
      languages: ["English", "Spanish"],
      availability: {
        monday: ["9:00 AM", "2:00 PM"],
        wednesday: ["10:00 AM", "3:00 PM"],
        friday: ["9:00 AM", "1:00 PM"]
      }
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      hospital: "Medical Center",
      yearsExperience: 12,
      rating: 4.9,
      photo: "/doctors/doctor2.jpg",
      isPrimary: false,
      hasAccess: true,
      education: [
        {
          degree: "MD",
          institution: "Stanford Medical School",
          year: 2010
        },
        {
          degree: "Dermatology Residency",
          institution: "UCLA Medical Center",
          year: 2014
        }
      ],
      languages: ["English", "Mandarin"],
      availability: {
        tuesday: ["9:00 AM", "4:00 PM"],
        thursday: ["10:00 AM", "3:00 PM"]
      }
    }
  ],
  pharmacists: [
    {
      id: 1,
      name: "John Smith",
      pharmacy: "City Pharmacy",
      yearsExperience: 8,
      rating: 4.7,
      photo: "/pharmacists/pharmacist1.jpg",
      education: [
        {
          degree: "PharmD",
          institution: "University of California",
          year: 2016
        }
      ],
      languages: ["English", "French"],
      specialties: ["Compounding", "Medication Therapy Management"],
      availability: {
        monday: ["8:00 AM", "6:00 PM"],
        wednesday: ["8:00 AM", "6:00 PM"],
        friday: ["8:00 AM", "6:00 PM"]
      }
    },
    {
      id: 2,
      name: "Maria Garcia",
      pharmacy: "Health Plus Pharmacy",
      yearsExperience: 10,
      rating: 4.9,
      photo: "/pharmacists/pharmacist2.jpg",
      education: [
        {
          degree: "PharmD",
          institution: "University of Texas",
          year: 2014
        }
      ],
      languages: ["English", "Spanish"],
      specialties: ["Geriatric Care", "Immunizations"],
      availability: {
        tuesday: ["9:00 AM", "7:00 PM"],
        thursday: ["9:00 AM", "7:00 PM"],
        saturday: ["10:00 AM", "4:00 PM"]
      }
    }
  ],
  messages: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      avatar: "/doctors/doctor1.jpg",
      isOnline: true,
      lastMessage: "Please bring your recent blood test results",
      lastMessageTime: "10:30 AM",
      unreadCount: 2,
      messages: [
        {
          sender: "Dr. Sarah Johnson",
          content: "Hello, how are you feeling today?",
          timestamp: "2024-03-20T10:00:00",
          attachments: []
        },
        {
          sender: "You",
          content: "I'm doing better, thank you for asking.",
          timestamp: "2024-03-20T10:05:00",
          attachments: []
        },
        {
          sender: "Dr. Sarah Johnson",
          content: "That's good to hear. Please bring your recent blood test results to our next appointment.",
          timestamp: "2024-03-20T10:30:00",
          attachments: []
        }
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Dermatologist",
      avatar: "/doctors/doctor2.jpg",
      isOnline: false,
      lastMessage: "The cream is working well",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      messages: [
        {
          sender: "Dr. Michael Chen",
          content: "How is the cream working for you?",
          timestamp: "2024-03-19T15:00:00",
          attachments: []
        },
        {
          sender: "You",
          content: "The cream is working well, thank you.",
          timestamp: "2024-03-19T15:30:00",
          attachments: []
        }
      ]
    },
    {
      id: 3,
      name: "John Smith",
      role: "Pharmacist",
      avatar: "/pharmacists/pharmacist1.jpg",
      isOnline: true,
      lastMessage: "Your prescription is ready for pickup",
      lastMessageTime: "2 hours ago",
      unreadCount: 1,
      messages: [
        {
          sender: "John Smith",
          content: "Your prescription is ready for pickup at City Pharmacy.",
          timestamp: "2024-03-20T09:00:00",
          attachments: []
        },
        {
          sender: "You",
          content: "Thank you, I'll pick it up today.",
          timestamp: "2024-03-20T09:15:00",
          attachments: []
        },
        {
          sender: "John Smith",
          content: "Great, we're open until 6 PM.",
          timestamp: "2024-03-20T09:20:00",
          attachments: []
        }
      ]
    }
  ],
  profile: {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    dateOfBirth: "1985-06-15",
    gender: "male",
    address: {
      street: "123 Main St",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      country: "USA"
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 234 567 8901"
    },
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS123456",
      groupNumber: "GRP789012",
      expiryDate: "2024-12-31"
    },
    medicalHistory: {
      bloodType: "O+",
      allergies: ["Penicillin", "Pollen"],
      conditions: ["Hypertension", "Type 2 Diabetes"],
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily"
        },
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily"
        }
      ]
    }
  },
  medicalRecord: {
    basicInfo: {
      bloodType: "O+",
      height: "175 cm",
      weight: "70 kg",
      lastUpdated: "2024-03-20"
    },
    vitalSigns: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "37.0°C",
      lastUpdated: "2024-03-20",
      history: [
        { date: "2024-03-20", value: "120/80 mmHg" },
        { date: "2024-03-15", value: "118/78 mmHg" },
        { date: "2024-03-10", value: "122/82 mmHg" }
      ]
    },
    allergies: [
      { name: "Penicillin", severity: "Severe" },
      { name: "Pollen", severity: "Moderate" },
      { name: "Shellfish", severity: "Mild" }
    ],
    conditions: [
      { name: "Hypertension", status: "Controlled" },
      { name: "Type 2 Diabetes", status: "Managed" },
      { name: "Asthma", status: "Stable" }
    ],
    medications: [
      { name: "Lisinopril", dosage: "10mg daily" },
      { name: "Metformin", dosage: "500mg twice daily" },
      { name: "Albuterol", dosage: "As needed" }
    ],
    immunizations: [
      { name: "COVID-19", date: "2023-12-15", status: "Complete" },
      { name: "Influenza", date: "2023-10-01", status: "Complete" },
      { name: "Tetanus", date: "2022-05-20", status: "Complete" }
    ],
    labResults: [
      { name: "Complete Blood Count", date: "2024-03-15", status: "Normal" },
      { name: "Lipid Panel", date: "2024-03-15", status: "Normal" },
      { name: "A1C", date: "2024-03-15", status: "Normal" }
    ],
    procedures: [
      { name: "Appendectomy", date: "2015-06-10", status: "Completed" },
      { name: "Colonoscopy", date: "2023-11-20", status: "Completed" }
    ],
    familyHistory: [
      { condition: "Heart Disease", relation: "Father" },
      { condition: "Diabetes", relation: "Mother" },
      { condition: "Cancer", relation: "Grandmother" }
    ],
    lifestyle: {
      smoking: "Never",
      alcohol: "Occasional",
      exercise: "Regular",
      diet: "Balanced"
    }
  },
  conversations: [
    {
      id: 1,
      participants: [
        {
          id: "patient-id",
          firstName: "John",
          lastName: "Doe",
          name: "John Doe",
          role: "Patient",
          avatar: "/avatars/patient.jpg",
          isOnline: true
        },
        {
          id: "doctor-1",
          name: "Dr. Sarah Johnson",
          role: "Cardiologist",
          avatar: "/doctors/doctor1.jpg",
          isOnline: true
        }
      ],
      messages: [
        {
          id: 1,
          sender: "Dr. Sarah Johnson",
          content: "Hello, how are you feeling today?",
          timestamp: "2024-03-20T14:00:00Z",
          read: true
        },
        {
          id: 2,
          sender: "You",
          content: "I'm doing better, thank you for asking.",
          timestamp: "2024-03-20T14:05:00Z",
          read: true
        },
        {
          id: 3,
          sender: "Dr. Sarah Johnson",
          content: "Please remember to bring your blood test results to our next appointment.",
          timestamp: "2024-03-20T14:30:00Z",
          read: false
        }
      ]
    },
    {
      id: 2,
      participants: [
        {
          id: "patient-id",
          firstName: "John",
          lastName: "Doe",
          name: "John Doe",
          role: "Patient",
          avatar: "/avatars/patient.jpg",
          isOnline: true
        },
        {
          id: "doctor-2",
          name: "Dr. Michael Chen",
          role: "Dermatologist",
          avatar: "/doctors/doctor2.jpg",
          isOnline: false
        }
      ],
      messages: [
        {
          id: 1,
          sender: "Dr. Michael Chen",
          content: "How is the skin condition responding to the treatment?",
          timestamp: "2024-03-19T10:00:00Z",
          read: true
        },
        {
          id: 2,
          sender: "You",
          content: "It's getting better, but still a bit itchy.",
          timestamp: "2024-03-19T10:10:00Z",
          read: true
        },
        {
          id: 3,
          sender: "Dr. Michael Chen",
          content: "The cream should be applied twice daily as prescribed.",
          timestamp: "2024-03-19T10:15:00Z",
          read: true
        }
      ]
    }
  ]
}; 