export const medications = [
  {
    id: '1',
    patient: '1', 
    name: { en: 'Lisinopril', ar: 'ليزينوبريل' },
    dosage: '10mg',
    frequency: { en: 'Once daily', ar: 'مرة واحدة يوميًا' },
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2023-12-31T00:00:00.000Z',
    status: { en: 'active', ar: 'نشط' },
    prescribedBy: '2', 
    instructions: { en: 'Take with food', ar: 'تناول مع الطعام' },
    sideEffects: { en: 'Dizziness, cough', ar: 'دوار، سعال' },
    notes: { en: 'For hypertension', ar: 'لعلاج ارتفاع ضغط الدم' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 