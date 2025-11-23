import { create } from "zustand";
import { getCurrentUser, type MeOut } from "@/lib/api";

export type ServiceType = "mobile" | "instore";

interface BookingState {
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Form data
  address: string;
  serviceType: ServiceType;
  city: string;
  province: string;
  postCode: string;

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

