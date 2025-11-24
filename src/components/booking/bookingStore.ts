import { create } from "zustand";
import { getCurrentUser, type MeOut } from "@/lib/api";

export type ServiceType = "mobile" | "instore";
export type PetType = "dog" | "cat" | "other";
export type CoatCondition = "not-matted" | "matted" | "severely-matted";
export type Behavior = "friendly" | "anxious" | "hard-to-handle" | "senior-pets";
export type GroomingFrequency = "weekly" | "bi-weekly" | "monthly" | "occasionally";
export type WeightUnit = "lbs" | "kg";
export type Gender = "male" | "female" | "neutered" | "spayed";

interface BookingState {
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Step 1: Form data
  address: string;
  serviceType: ServiceType;
  city: string;
  province: string;
  postCode: string;

  // Step 2: Pet information
  petName: string;
  petType: PetType;
  breed: string;
  isMixedBreed: boolean;
  precisePetType: string; // For "other" pet type
  dateOfBirth: string; // YYYY-MM format
  gender: Gender | "";
  weight: string;
  weightUnit: WeightUnit;
  coatCondition: CoatCondition | "";
  behavior: Behavior | "";
  groomingFrequency: GroomingFrequency | "";
  petPhoto: File | null;
  referenceStyles: File[];
  specialNotes: string;

  // UI state
  isLoginModalOpen: boolean;

  // User info (loaded from API)
  userInfo: MeOut | null;

  // Actions
  setAddress: (address: string) => void;
  setServiceType: (serviceType: ServiceType) => void;
  setCity: (city: string) => void;
  setProvince: (province: string) => void;
  setPostCode: (postCode: string) => void;
  setPetName: (name: string) => void;
  setPetType: (type: PetType) => void;
  setBreed: (breed: string) => void;
  setIsMixedBreed: (isMixed: boolean) => void;
  setPrecisePetType: (type: string) => void;
  setDateOfBirth: (date: string) => void;
  setGender: (gender: Gender | "") => void;
  setWeight: (weight: string) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  setCoatCondition: (condition: CoatCondition | "") => void;
  setBehavior: (behavior: Behavior | "") => void;
  setGroomingFrequency: (frequency: GroomingFrequency | "") => void;
  setPetPhoto: (file: File | null) => void;
  setReferenceStyles: (files: File[]) => void;
  setSpecialNotes: (notes: string) => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  loadUserInfo: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  address: "",
  serviceType: "mobile" as ServiceType,
  city: "",
  province: "BC",
  postCode: "",
  petName: "",
  petType: "dog" as PetType,
  breed: "",
  isMixedBreed: false,
  precisePetType: "",
  dateOfBirth: "",
  gender: "" as Gender | "",
  weight: "",
  weightUnit: "lbs" as WeightUnit,
  coatCondition: "" as CoatCondition | "",
  behavior: "" as Behavior | "",
  groomingFrequency: "" as GroomingFrequency | "",
  petPhoto: null as File | null,
  referenceStyles: [] as File[],
  specialNotes: "",
  isLoginModalOpen: false,
  userInfo: null as MeOut | null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),

  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setAddress: (address) => set({ address }),

  setServiceType: (serviceType) => set({ serviceType }),

  setCity: (city) => set({ city }),

  setProvince: (province) => set({ province }),

  setPostCode: (postCode) => set({ postCode }),

  setPetName: (name) => set({ petName: name }),

  setPetType: (type) => set({ petType: type }),

  setBreed: (breed) => set({ breed }),

  setIsMixedBreed: (isMixed) => set({ isMixedBreed: isMixed }),

  setPrecisePetType: (type) => set({ precisePetType: type }),

  setDateOfBirth: (date) => set({ dateOfBirth: date }),

  setGender: (gender) => set({ gender }),

  setWeight: (weight) => set({ weight }),

  setWeightUnit: (unit) => set({ weightUnit: unit }),

  setCoatCondition: (condition) => set({ coatCondition: condition }),

  setBehavior: (behavior) => set({ behavior }),

  setGroomingFrequency: (frequency) => set({ groomingFrequency: frequency }),

  setPetPhoto: (file) => set({ petPhoto: file }),

  setReferenceStyles: (files) => set({ referenceStyles: files }),

  setSpecialNotes: (notes) => set({ specialNotes: notes }),

  setIsLoginModalOpen: (isLoginModalOpen) => set({ isLoginModalOpen }),

  loadUserInfo: async () => {
    // This function should be called from the component with user context
    // We'll handle the user check in the component
    try {
      const info = await getCurrentUser();
      set({ userInfo: info });
      // Auto-fill address if available
      if (info.address) {
        set({ address: info.address });
        // Auto-fill city and postcode based on address (mock data for now)
        set({ city: "Vancouver", postCode: "E1N 2E5" });
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      set({ userInfo: null });
    }
  },

  reset: () => set(initialState),
}));
