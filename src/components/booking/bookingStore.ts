import { create } from "zustand";
import {
  getCurrentUser,
  getAddresses,
  getStores,
  getPetBreeds,
  type MeOut,
  type AddressOut,
  type StoreLocationOut,
  type PetPayload,
  type PetBreedOut,
} from "@/lib/api";

// 与后端枚举保持一致
export type ServiceType = "mobile" | "in_store";
export type PetType = "dog" | "cat" | "other";
export type CoatCondition = "not_matted" | "matted" | "severely_matted";
export type Behavior = "friendly" | "anxious" | "hard_to_handle" | "senior_pets";
export type GroomingFrequency = "weekly" | "bi_weekly" | "monthly" | "occasionally";
export type WeightUnit = "kg" | "lb"; // 后端使用 "lb" 而不是 "lbs"
export type Gender = "male" | "female" | "unknown"; // 与后端枚举一致
export type ServicePackage = "premium-bath" | "full-grooming";

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
  selectedAddressId: number | null; // 选中的地址 ID
  selectedStoreId: number | null; // 选中的门店 ID（用于 in_store 服务）
  addresses: AddressOut[]; // 用户已保存的地址列表
  stores: StoreLocationOut[]; // 门店列表

  // Step 2: Pet information - 使用与 API 一致的字段名称
  petName: string; // 对应 API: name
  petType: PetType; // 对应 API: pet_type
  breed: string; // 对应 API: breed
  isMixedBreed: boolean; // 对应 API: mixed_breed
  precisePetType: string; // 对应 API: precise_type
  dateOfBirth: string; // 对应 API: birthday (YYYY-MM format)
  gender: Gender | ""; // 对应 API: gender
  weight: string; // 对应 API: weight_value (需要转换为 number)
  weightUnit: WeightUnit; // 对应 API: weight_unit
  coatCondition: CoatCondition | ""; // 对应 API: coat_condition
  behavior: Behavior | ""; // 对应 API: behavior
  groomingFrequency: GroomingFrequency | ""; // 对应 API: grooming_frequency
  petPhoto: File | null; // 对应 API: photos (数组)
  referenceStyles: File[]; // 对应 API: reference_photos (数组)
  specialNotes: string; // 对应 API: special_notes

  // Step 3: Service package and add-ons
  servicePackage: ServicePackage | "";
  addOns: string[]; // Array of add-on IDs

  // UI state
  isLoginModalOpen: boolean;

  // User info (loaded from API)
  userInfo: MeOut | null;

  // Pet breeds (loaded from API)
  petBreeds: PetBreedOut[];
  isLoadingBreeds: boolean;

  // Actions
  setAddress: (address: string) => void;
  setServiceType: (serviceType: ServiceType) => void;
  setCity: (city: string) => void;
  setProvince: (province: string) => void;
  setPostCode: (postCode: string) => void;
  setSelectedAddressId: (id: number | null) => void;
  setSelectedStoreId: (id: number | null) => void;
  loadAddresses: () => Promise<void>;
  loadStores: () => Promise<void>;
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
  setServicePackage: (pkg: ServicePackage | "") => void;
  setAddOns: (addOns: string[]) => void;
  toggleAddOn: (addOnId: string) => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  loadUserInfo: () => Promise<void>;
  loadPetBreeds: () => Promise<void>;
  getPetPayload: () => PetPayload; // 转换为 PetPayload 格式
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  address: "",
  serviceType: "mobile" as ServiceType,
  city: "",
  province: "BC",
  postCode: "",
  selectedAddressId: null as number | null,
  selectedStoreId: null as number | null,
  addresses: [] as AddressOut[],
  stores: [] as StoreLocationOut[],
  petName: "",
  petType: "dog" as PetType,
  breed: "",
  isMixedBreed: false,
  precisePetType: "",
  dateOfBirth: "",
  gender: "" as Gender | "",
  weight: "",
  weightUnit: "kg" as WeightUnit, // 后端默认使用 kg
  coatCondition: "" as CoatCondition | "",
  behavior: "" as Behavior | "",
  groomingFrequency: "" as GroomingFrequency | "",
  petPhoto: null as File | null,
  referenceStyles: [] as File[],
  specialNotes: "",
  servicePackage: "" as ServicePackage | "",
  addOns: [] as string[],
  isLoginModalOpen: false,
  userInfo: null as MeOut | null,
  petBreeds: [] as PetBreedOut[],
  isLoadingBreeds: false,
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

  setSelectedAddressId: (id) =>
    set((state) => {
      const selectedAddress = state.addresses.find((addr) => addr.id === id);
      if (selectedAddress) {
        return {
          selectedAddressId: id,
          address: selectedAddress.address,
          city: selectedAddress.city,
          province: selectedAddress.province,
          postCode: selectedAddress.postal_code,
        };
      }
      return { selectedAddressId: id };
    }),

  setSelectedStoreId: (id) =>
    set((state) => {
      const selectedStore = state.stores.find((store) => store.id === id);
      if (selectedStore) {
        return {
          selectedStoreId: id,
          address: selectedStore.address,
          city: selectedStore.city,
          province: selectedStore.province,
          postCode: selectedStore.postal_code,
        };
      }
      return { selectedStoreId: id };
    }),

  loadAddresses: async () => {
    try {
      const addresses = await getAddresses();
      set({ addresses });
      // 如果有默认地址，自动选择
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        useBookingStore.getState().setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
      set({ addresses: [] });
    }
  },

  loadStores: async () => {
    try {
      const stores = await getStores();
      set({ stores });
    } catch (error) {
      console.error("Failed to load stores:", error);
      set({ stores: [] });
    }
  },

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

  setServicePackage: (pkg) => set({ servicePackage: pkg }),

  setAddOns: (addOns) => set({ addOns }),

  toggleAddOn: (addOnId) =>
    set((state) => {
      const currentAddOns = state.addOns;
      const isSelected = currentAddOns.includes(addOnId);
      return {
        addOns: isSelected
          ? currentAddOns.filter((id) => id !== addOnId)
          : [...currentAddOns, addOnId],
      };
    }),

  setIsLoginModalOpen: (isLoginModalOpen) => set({ isLoginModalOpen }),

  // 将 bookingStore 中的宠物信息转换为 PetPayload（用于提交预约）
  getPetPayload: (): PetPayload => {
    const state = useBookingStore.getState();
    const weightValue = state.weight ? parseFloat(state.weight) : null;
    
    return {
      name: state.petName,
      pet_type: state.petType,
      breed: state.breed || null,
      mixed_breed: state.isMixedBreed,
      precise_type: state.precisePetType || null,
      birthday: state.dateOfBirth || null,
      gender: state.gender || null,
      weight_value: weightValue,
      weight_unit: state.weightUnit,
      coat_condition: state.coatCondition || null,
      behavior: state.behavior || null,
      grooming_frequency: state.groomingFrequency || null,
      special_notes: state.specialNotes || null,
    };
  },

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

  loadPetBreeds: async () => {
    const state = useBookingStore.getState();
    // 如果已经在加载中或已有数据，则不再请求
    if (state.isLoadingBreeds || state.petBreeds.length > 0) {
      return;
    }
    try {
      set({ isLoadingBreeds: true });
      const breeds = await getPetBreeds();
      set({ petBreeds: breeds, isLoadingBreeds: false });
    } catch (error) {
      console.error("Failed to load pet breeds:", error);
      set({ petBreeds: [], isLoadingBreeds: false });
    }
  },

  reset: () => set(initialState),
}));
