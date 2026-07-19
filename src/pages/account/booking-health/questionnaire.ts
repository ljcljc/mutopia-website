import type { BookingHealthQuestionnaire, TimelineEntry } from "./types";

export interface StepMeta {
  title: string;
  subtitle: string;
  cta: string;
  timeLabel: string;
}

function createTimelineEntry(id: string): TimelineEntry {
  return { id, date: "", type: "" };
}

export const BOOKING_HEALTH_STEPS: StepMeta[] = [
  {
    title: "Lifestyle & Environment",
    subtitle: "Tell us how your pet lives day to day so grooming recommendations can be more practical.",
    cta: "Next: Prevention & Core needs",
    timeLabel: "5 mins",
  },
  {
    title: "Prevention & Core needs",
    subtitle: "Capture baseline care, parasite prevention, and anything the groomer should avoid.",
    cta: "Next: Nutrition & Digestion",
    timeLabel: "4 mins",
  },
  {
    title: "Nutrition & Digestion",
    subtitle: "A quick diet and digestion snapshot helps flag sensitivities before service day.",
    cta: "Next: Clinical History & Behaviors",
    timeLabel: "2 mins",
  },
  {
    title: "Clinical History & Behaviors",
    subtitle: "Finish with any longer-term medical patterns or behavior cues the groomer should know.",
    cta: "Submit",
    timeLabel: "1 min",
  },
];

export const LIFESTYLE_OPTIONS = {
  livingArrangement: ["Free-roaming indoors", "Crated indoors", "Free-roaming in yard", "Outdoor kennel"],
  localEnvironmentPrimary: ["Dry", "Humid", "Dusty"],
  localEnvironmentSecondary: ["Wooded", "Grassy"],
  householdSetup: ["Only pet", "Multi-pet household", "Children in home"],
  careExperience: ["Beginner (Under 1 yr)", "Intermediate (2-3 yrs)", "Experienced (3+ yrs)", "Professional breeder"],
};

export const PREVENTION_OPTIONS = {
  primaryGoals: [
    "Odor control",
    "Tear stain removal",
    "Weight management",
    "Hypoallergenic care",
    "Post-Surgery care",
    "Senior pet care",
  ],
};

export const NUTRITION_OPTIONS = {
  primaryDiet: ["Dry kibble", "Wet food", "Raw", "Home-cooked", "Mixed feeding"],
  feedingHabits: ["Scheduled meals", "Free feeding", "Slow feeder", "Needs encouragement"],
  waterIntake: ["Low", "Normal", "High", "Varies by season"],
  stoolCondition: ["Firm", "Soft", "Loose", "Irregular", "Occasional mucus"],
  vomitingFrequency: ["Never", "Rarely", "Monthly", "Weekly", "Frequently"],
  foodSensitivities: ["Chicken", "Beef", "Seafood", "Dairy", "Grains", "Others"],
  treatFrequency: ["Rarely", "1-2 times", "3-4 times", "With every meal"],
  treatTypes: ["Dental chews", "Freeze-dried", "Jerky", "Soft training treats", "Biscuit treats", "Table scraps"],
  dailySupplements: ["Probiotics", "Omega-3", "Joint support", "Skin support", "Calming aids", "None"],
};

export const MEDICAL_OPTIONS = {
  recentMedicalManagement: ["Not apply", "Current topical medications", "Current oral medications", "Known food allergies"],
  knownFoodAllergies: ["Chicken", "Beef", "Seafood", "Dairy", "Grains", "Others"],
};

export const CLINICAL_OPTIONS = {
  eatingHabitsAndBehaviors: [
    "Normal",
    "Picky eater / Selective appetite",
    "Overeating / Rapid eating",
    "Loss of appetite / Anorexia",
    "Pica (eating non-food items)",
    "Begging for human food",
    "Post-meal vomiting",
    "Polyphagia (Excessive hunger)",
  ],
  metabolicAndGeneralHealth: [
    "Normal",
    "Low energy, exercise intolerance",
    "Increased thirst & urination",
    "Unexplained weight loss",
    "Symmetrical hair loss",
    "Pot-bellied appearance",
    "Darkening of skin",
  ],
  preExistingHealthConditions: [
    "No known illnesses",
    "Food / Skin allergies",
    "Ear & Skin infections",
    "GI issues / Pancreatitis",
    "Joint problems / Arthritis",
    "Diabetes / Endocrine disorders",
    "Urinary / Kidney disease",
    "Intestinal parasites",
    "Heart conditions",
    "Viral infections (Parvo/Distemper)",
    "Tumor / Growths",
  ],
  chronicConditions: [
    "No chronic conditions",
    "Chronic allergies / Skin disease",
    "Chronic ear infections",
    "Arthritis / Joint degeneration",
    "Chronic GI / IBD",
    "Diabetes",
    "Hypothyroidism",
    "CKD (Chronic Kidney Disease)",
    "Chronic UTI / Bladder issues",
    "Heart disease / Murmur",
    "Obesity",
  ],
  surgeryHistory: [
    "No previous surgery",
    "Spay / Neuter",
    "Dental surgery / Extractions",
    "ACL / Cruciate ligament repair",
    "Hip surgery",
    "Bladder stone removal",
    "Gastrointestinal foreign body",
    "Tumor removal",
    "Fracture / Trauma repair",
    "Hernia repair",
    "Eye surgery",
  ],
};

export function createDefaultQuestionnaire(): BookingHealthQuestionnaire {
  return {
    lifestyle: {
      neighborhoodDraft: "",
      neighborhoods: [],
      livingArrangement: [],
      localEnvironment: [],
      householdSetup: [],
      careExperience: [],
      bathingIntervalDays: 0,
      groomingIntervalDays: 0,
    },
    prevention: {
      spayedNeutered: null,
      microchipNumber: "",
      vaccinationHistory: [createTimelineEntry("vaccination-1")],
      vaccinationPhotoIds: [],
      vaccinationPhotoUrls: [],
      internalParasiteIntervalDays: 0,
      externalParasiteIntervalDays: 0,
      recentTreatments: [createTimelineEntry("treatment-1")],
      recentTreatmentPhotoIds: [],
      recentTreatmentPhotoUrls: [],
      primaryGoals: [],
      restrictions: "",
    },
    nutrition: {
      primaryDiet: [],
      currentBrand: "",
      feedingHabits: [],
      feedingFrequencyPerDay: 0,
      waterIntake: [],
      stoolCondition: [],
      vomitingFrequency: "",
      foodSensitivities: [],
      otherFoodSensitivity: "",
      treatFrequency: "",
      treatTimesPerDay: 0,
      treatTypes: [],
      dailySupplements: [],
    },
    medical: {
      recentMedicalManagement: [],
      topicalMedications: "",
      oralMedications: "",
      vetVisitFrequencyPerYear: 0,
      recentVetVisitDate: "",
      recentVetVisitReason: "",
      knownFoodAllergies: [],
      otherAllergies: "",
    },
    clinical: {
      noKnownMedicalConditions: null,
      eatingHabitsAndBehaviors: [],
      metabolicAndGeneralHealth: [],
      preExistingHealthConditions: [],
      chronicConditions: [],
      surgeryHistory: [],
    },
  };
}

export function normalizeQuestionnaire(input: unknown): BookingHealthQuestionnaire {
  if (!input || typeof input !== "object") {
    return createDefaultQuestionnaire();
  }

  const base = createDefaultQuestionnaire();
  const record = input as Record<string, unknown>;
  return {
    lifestyle: { ...base.lifestyle, ...(record.lifestyle as Record<string, unknown>) },
    prevention: {
      ...base.prevention,
      ...(record.prevention as Record<string, unknown>),
      vaccinationHistory: Array.isArray((record.prevention as Record<string, unknown> | undefined)?.vaccinationHistory)
        ? (((record.prevention as Record<string, unknown>).vaccinationHistory as TimelineEntry[]) || [])
        : base.prevention.vaccinationHistory,
      vaccinationPhotoIds: Array.isArray((record.prevention as Record<string, unknown> | undefined)?.vaccinationPhotoIds)
        ? (((record.prevention as Record<string, unknown>).vaccinationPhotoIds as number[]) || [])
        : base.prevention.vaccinationPhotoIds,
      vaccinationPhotoUrls: Array.isArray((record.prevention as Record<string, unknown> | undefined)?.vaccinationPhotoUrls)
        ? (((record.prevention as Record<string, unknown>).vaccinationPhotoUrls as string[]) || [])
        : base.prevention.vaccinationPhotoUrls,
      recentTreatments: Array.isArray((record.prevention as Record<string, unknown> | undefined)?.recentTreatments)
        ? (((record.prevention as Record<string, unknown>).recentTreatments as TimelineEntry[]) || [])
        : base.prevention.recentTreatments,
      recentTreatmentPhotoIds: Array.isArray((record.prevention as Record<string, unknown> | undefined)?.recentTreatmentPhotoIds)
        ? (((record.prevention as Record<string, unknown>).recentTreatmentPhotoIds as number[]) || [])
        : base.prevention.recentTreatmentPhotoIds,
      recentTreatmentPhotoUrls: Array.isArray((record.prevention as Record<string, unknown> | undefined)?.recentTreatmentPhotoUrls)
        ? (((record.prevention as Record<string, unknown>).recentTreatmentPhotoUrls as string[]) || [])
        : base.prevention.recentTreatmentPhotoUrls,
    },
    nutrition: { ...base.nutrition, ...(record.nutrition as Record<string, unknown>) },
    medical: { ...base.medical, ...(record.medical as Record<string, unknown>) },
    clinical: { ...base.clinical, ...(record.clinical as Record<string, unknown>) },
  } as BookingHealthQuestionnaire;
}
