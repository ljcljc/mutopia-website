export interface TimelineEntry {
  id: string;
  date: string;
  type: string;
}

export interface BookingHealthQuestionnaire {
  lifestyle: {
    neighborhoodDraft: string;
    neighborhoods: string[];
    livingArrangement: string[];
    localEnvironment: string[];
    householdSetup: string[];
    careExperience: string[];
    bathingIntervalDays: number;
    groomingIntervalDays: number;
  };
  prevention: {
    spayedNeutered: boolean | null;
    microchipNumber: string;
    vaccinationHistory: TimelineEntry[];
    vaccinationPhotoIds: number[];
    vaccinationPhotoUrls: string[];
    internalParasiteIntervalDays: number;
    externalParasiteIntervalDays: number;
    recentTreatments: TimelineEntry[];
    recentTreatmentPhotoIds: number[];
    recentTreatmentPhotoUrls: string[];
    primaryGoals: string[];
    restrictions: string;
  };
  nutrition: {
    primaryDiet: string[];
    currentBrand: string;
    feedingHabits: string[];
    feedingFrequencyPerDay: number;
    waterIntake: string[];
    stoolCondition: string[];
    vomitingFrequency: string;
    foodSensitivities: string[];
    otherFoodSensitivity: string;
    treatFrequency: string;
    treatTimesPerDay: number;
    treatTypes: string[];
    dailySupplements: string[];
  };
  medical: {
    recentMedicalManagement: string[];
    topicalMedications: string;
    oralMedications: string;
    vetVisitFrequencyPerYear: number;
    recentVetVisitDate: string;
    recentVetVisitReason: string;
    knownFoodAllergies: string[];
    otherAllergies: string;
  };
  clinical: {
    noKnownMedicalConditions: boolean | null;
    eatingHabitsAndBehaviors: string[];
    metabolicAndGeneralHealth: string[];
    preExistingHealthConditions: string[];
    chronicConditions: string[];
    surgeryHistory: string[];
  };
}

export interface BookingHealthStepProps {
  value: BookingHealthQuestionnaire;
  onChange: (updater: (current: BookingHealthQuestionnaire) => BookingHealthQuestionnaire) => void;
}
