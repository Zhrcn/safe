export const medicines = [
  {
    id: '1',
    name: { en: 'Lisinopril', ar: 'ليزينوبريل' },
    genericName: { en: 'Lisinopril', ar: 'ليزينوبريل' },
    description: {
      en: 'Used to treat high blood pressure and heart failure.',
      ar: 'يستخدم لعلاج ارتفاع ضغط الدم وفشل القلب.'
    },
    category: { en: 'Antihypertensive', ar: 'خافض للضغط' },
    availableForms: [
      {
        form: { en: 'Tablet', ar: 'قرص' },
        strengths: ['5mg', '10mg', '20mg', '40mg'],
      },
    ],
    sideEffects: { en: 'Dizziness, Cough, Headache', ar: 'دوار، سعال، صداع' },
    contraindications: { en: 'Pregnancy, Angioedema', ar: 'الحمل، وذمة وعائية' },
    interactions: { en: 'Potassium supplements, Lithium', ar: 'مكملات البوتاسيوم، الليثيوم' },
    storageInstructions: { en: 'Store at room temperature.', ar: 'يُحفظ في درجة حرارة الغرفة.' },
    manufacturer: 'Pfizer',
    barcode: '123456789',
    isPrescriptionRequired: true,
    availableStock: 100,
    usageInstructions: { en: 'Take once daily with or without food.', ar: 'تناول مرة واحدة يوميًا مع أو بدون طعام.' },
    status: { en: 'active', ar: 'نشط' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: '2',
    name: { en: 'Metformin', ar: 'ميتفورمين' },
    genericName: { en: 'Metformin', ar: 'ميتفورمين' },
    description: {
      en: 'Used to treat type 2 diabetes.',
      ar: 'يستخدم لعلاج داء السكري من النوع الثاني.'
    },
    category: { en: 'Antidiabetic', ar: 'خافض لسكر الدم' },
    availableForms: [
      {
        form: { en: 'Tablet', ar: 'قرص' },
        strengths: ['500mg', '850mg', '1000mg'],
      },
    ],
    sideEffects: { en: 'Nausea, Diarrhea, Stomach upset', ar: 'غثيان، إسهال، اضطراب المعدة' },
    contraindications: { en: 'Kidney disease, Heart failure', ar: 'مرض الكلى، فشل القلب' },
    interactions: { en: 'Alcohol, Contrast dye', ar: 'الكحول، صبغة التباين' },
    storageInstructions: { en: 'Store at room temperature.', ar: 'يُحفظ في درجة حرارة الغرفة.' },
    manufacturer: 'Merck',
    barcode: '987654321',
    isPrescriptionRequired: true,
    availableStock: 150,
    usageInstructions: { en: 'Take with meals to reduce stomach upset.', ar: 'تناول مع الوجبات لتقليل اضطراب المعدة.' },
    status: { en: 'active', ar: 'نشط' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: '3',
    name: { en: 'Hydrocortisone Cream', ar: 'كريم هيدروكورتيزون' },
    genericName: { en: 'Hydrocortisone', ar: 'هيدروكورتيزون' },
    description: {
      en: 'Used to treat skin conditions like eczema and dermatitis.',
      ar: 'يستخدم لعلاج أمراض الجلد مثل الإكزيما والتهاب الجلد.'
    },
    category: { en: 'Corticosteroid', ar: 'كورتيكوستيرويد' },
    availableForms: [
      {
        form: { en: 'Cream', ar: 'كريم' },
        strengths: ['0.5%', '1%', '2.5%'],
      },
    ],
    sideEffects: { en: 'Skin thinning, Burning, Itching', ar: 'ترقق الجلد، حرقان، حكة' },
    contraindications: { en: 'Skin infections, Open wounds', ar: 'عدوى الجلد، جروح مفتوحة' },
    interactions: { en: 'Other topical medications', ar: 'أدوية موضعية أخرى' },
    storageInstructions: { en: 'Store at room temperature.', ar: 'يُحفظ في درجة حرارة الغرفة.' },
    manufacturer: 'Johnson & Johnson',
    barcode: '456789123',
    isPrescriptionRequired: false,
    availableStock: 75,
    usageInstructions: { en: 'Apply to affected area 2-4 times daily.', ar: 'يُوضع على المنطقة المصابة 2-4 مرات يوميًا.' },
    status: { en: 'active', ar: 'نشط' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: '4',
    name: { en: 'Amoxicillin', ar: 'أموكسيسيلين' },
    genericName: { en: 'Amoxicillin', ar: 'أموكسيسيلين' },
    description: {
      en: 'Used to treat bacterial infections.',
      ar: 'يستخدم لعلاج العدوى البكتيرية.'
    },
    category: { en: 'Antibiotic', ar: 'مضاد حيوي' },
    availableForms: [
      {
        form: { en: 'Capsule', ar: 'كبسولة' },
        strengths: ['250mg', '500mg'],
      },
      {
        form: { en: 'Suspension', ar: 'معلق' },
        strengths: ['125mg/5ml', '250mg/5ml'],
      }
    ],
    sideEffects: { en: 'Nausea, Diarrhea, Rash', ar: 'غثيان، إسهال، طفح جلدي' },
    contraindications: { en: 'Penicillin allergy', ar: 'حساسية البنسلين' },
    interactions: { en: 'Birth control pills, Warfarin', ar: 'حبوب منع الحمل، الوارفارين' },
    storageInstructions: { en: 'Store at room temperature.', ar: 'يُحفظ في درجة حرارة الغرفة.' },
    manufacturer: 'GlaxoSmithKline',
    barcode: '789123456',
    isPrescriptionRequired: true,
    availableStock: 200,
    usageInstructions: { en: 'Take as directed, usually 2-3 times daily.', ar: 'تناول حسب التوجيهات، عادة 2-3 مرات يوميًا.' },
    status: { en: 'active', ar: 'نشط' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  }
]; 