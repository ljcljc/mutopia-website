import { create } from "zustand";
import {
  getAddresses,
  getStores,
  getPetBreeds,
  getServices,
  getAddOns,
  getMembershipPlans,
  type MeOut,
  type AddressOut,
  type AddressIn,
  type StoreLocationOut,
  type PetPayload,
  type PetBreedOut,
  type ServiceOut,
  type AddOnOut,
  type MembershipPlanOut,
  type BookingSubmitIn,
  type TimeSlotIn,
} from "@/lib/api";
import { useAuthStore } from "@/components/auth/authStore";

// 与后端枚举保持一致
export type ServiceType = "mobile" | "in_store";
export type PetType = "dog" | "cat" | "other";
export type CoatCondition = "not_matted" | "matted" | "severely_matted";
export type Behavior = "friendly" | "anxious" | "hard_to_handle" | "senior_pets";
export type GroomingFrequency = "weekly" | "bi_weekly" | "monthly" | "occasionally";
export type WeightUnit = "kg" | "lbs"; // 后端使用 "lb" 而不是 "lbs"
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
  petPhoto: File | null; // 对应 API: photos (数组) - 保留用于 UI 显示
  referenceStyles: File[]; // 对应 API: reference_photos (数组) - 保留用于 UI 显示
  photoIds: number[]; // 上传后的宠物照片 ID 列表
  referencePhotoIds: number[]; // 上传后的参考照片 ID 列表
  photoUrls: string[]; // 上传后的宠物照片 URL 列表（相对路径）
  referencePhotoUrls: string[]; // 上传后的参考照片 URL 列表（相对路径）
  specialNotes: string; // 对应 API: special_notes

  // Step 3: Service package and add-ons
  servicePackage: ServicePackage | ""; // 保持向后兼容，但实际使用 serviceId
  serviceId: number | null; // 实际的服务 ID（从 API 获取）
  addOns: number[]; // Array of add-on IDs (changed from string[] to number[])

  // UI state
  isLoginModalOpen: boolean;

  // User info (loaded from API)
  // userInfo is now managed by authStore, we keep this for backward compatibility
  // but it will be synced from authStore
  userInfo: MeOut | null;
  isLoadingUserInfo: boolean;

  // Pet breeds (loaded from API)
  petBreeds: PetBreedOut[];
  isLoadingBreeds: boolean;

  // Services (loaded from API)
  services: ServiceOut[];
  isLoadingServices: boolean;

  // Add-ons (loaded from API)
  addOnsList: AddOnOut[];
  isLoadingAddOns: boolean;

  // Membership plans (loaded from API)
  membershipPlans: MembershipPlanOut[];
  isLoadingMembershipPlans: boolean;

  // Step 4: Membership and discount options
  useMembership: boolean; // Maps to open_membership in API
  membershipPlanId: number | null; // Maps to membership_plan_id in API
  useMembershipDiscount: boolean; // Maps to use_special_coupon or use_official_coupon
  useCashCoupon: boolean; // Maps to use_official_coupon
  cashCouponCount: number;
  couponType: "cash" | "invite" | null; // Type of coupon to use: cash credit or invite credit

  // Step 5: Date and time slots
  selectedTimeSlots: TimeSlotIn[]; // Changed to match API format

  // Additional fields
  notes: string; // Additional notes for booking

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
  setPhotoIds: (ids: number[]) => void;
  setReferencePhotoIds: (ids: number[]) => void;
  setPhotoUrls: (urls: string[]) => void;
  setReferencePhotoUrls: (urls: string[]) => void;
  setSpecialNotes: (notes: string) => void;
  setServicePackage: (pkg: ServicePackage | "") => void;
  setAddOns: (addOns: number[]) => void;
  toggleAddOn: (addOnId: number) => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  loadUserInfo: () => Promise<void>;
  loadPetBreeds: () => Promise<void>;
  loadServices: () => Promise<void>;
  loadAddOns: () => Promise<void>;
  loadMembershipPlans: () => Promise<void>;
  setUseMembership: (value: boolean) => void;
  setMembershipPlanId: (id: number | null) => void;
  setUseMembershipDiscount: (value: boolean) => void;
  setUseCashCoupon: (value: boolean) => void;
  setCouponType: (type: "cash" | "invite" | null) => void;
  setServiceId: (id: number | null) => void;
  setSelectedTimeSlots: (slots: TimeSlotIn[]) => void;
  setNotes: (notes: string) => void;
  getPetPayload: () => PetPayload; // 转换为 PetPayload 格式
  getAddressPayload: () => AddressIn; // 转换为 AddressIn 格式
  getBookingSubmitPayload: () => BookingSubmitIn; // 转换为 BookingSubmitIn 格式
  reset: () => void;
  hasFormData: () => boolean; // 检查表单是否有内容
}

const initialState = {
  currentStep: 1,
  address: "100 Vancouver Crescent",
  serviceType: "mobile" as ServiceType,
  city: "Miramichi",
  province: "NB",
  postCode: "E1N 2E6",
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
  weightUnit: "lbs" as WeightUnit, // 后端默认使用 kg
  coatCondition: "" as CoatCondition | "",
  behavior: "" as Behavior | "",
  groomingFrequency: "" as GroomingFrequency | "",
  petPhoto: null as File | null,
  referenceStyles: [] as File[],
  photoIds: [] as number[],
  referencePhotoIds: [] as number[],
  photoUrls: [] as string[],
  referencePhotoUrls: [] as string[],
  specialNotes: "",
  servicePackage: "" as ServicePackage | "",
  serviceId: null as number | null,
  addOns: [] as number[],
  isLoginModalOpen: false,
  userInfo: null as MeOut | null,
  isLoadingUserInfo: false,
  petBreeds: [] as PetBreedOut[],
  isLoadingBreeds: false,
  services: [] as ServiceOut[],
  isLoadingServices: false,
  addOnsList: [] as AddOnOut[],
  isLoadingAddOns: false,
  membershipPlans: [] as MembershipPlanOut[],
  isLoadingMembershipPlans: false,
  useMembership: false,
  membershipPlanId: null as number | null,
  useMembershipDiscount: false,
  useCashCoupon: false,
  cashCouponCount: 0,
  couponType: null as "cash" | "invite" | null,
  selectedTimeSlots: [] as TimeSlotIn[],
  notes: "",
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

  setPhotoIds: (ids) => set({ photoIds: ids }),

  setReferencePhotoIds: (ids) => set({ referencePhotoIds: ids }),

  setPhotoUrls: (urls) => set({ photoUrls: urls }),

  setReferencePhotoUrls: (urls) => set({ referencePhotoUrls: urls }),

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

  setNotes: (notes) => set({ notes }),

  setMembershipPlanId: (id) => set({ membershipPlanId: id }),

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
      photo_ids: state.photoIds.length > 0 ? state.photoIds : undefined,
      reference_photo_ids: state.referencePhotoIds.length > 0 ? state.referencePhotoIds : undefined,
    };
  },

  // 将 bookingStore 中的地址信息转换为 AddressIn（用于提交预约）
  getAddressPayload: (): AddressIn => {
    const state = useBookingStore.getState();
    
    // 如果选择了已保存的地址，使用该地址
    if (state.selectedAddressId) {
      const selectedAddress = state.addresses.find((addr) => addr.id === state.selectedAddressId);
      if (selectedAddress) {
        return {
          id: selectedAddress.id,
          address: selectedAddress.address,
          city: selectedAddress.city,
          province: selectedAddress.province,
          postal_code: selectedAddress.postal_code,
          service_type: selectedAddress.service_type,
        };
      }
    }
    
    // 如果选择了门店，使用门店地址
    if (state.selectedStoreId) {
      const selectedStore = state.stores.find((store) => store.id === state.selectedStoreId);
      if (selectedStore) {
        return {
          id: null,
          address: selectedStore.address,
          city: selectedStore.city,
          province: selectedStore.province,
          postal_code: selectedStore.postal_code,
          service_type: state.serviceType,
        };
      }
    }
    
    // 否则使用手动输入的地址
    return {
      id: null,
      address: state.address,
      city: state.city,
      province: state.province,
      postal_code: state.postCode,
      service_type: state.serviceType,
    };
  },

  // 将 bookingStore 中的所有信息转换为 BookingSubmitIn（用于提交预约）
  getBookingSubmitPayload: (): BookingSubmitIn => {
    const state = useBookingStore.getState();
    const weightValue = state.weight ? parseFloat(state.weight) : null;
    
    return {
      service_id: state.serviceId!,
      add_on_ids: state.addOns,
      weight_value: weightValue,
      weight_unit: state.weightUnit,
      membership_plan_id: state.membershipPlanId,
      open_membership: state.useMembership,
      use_special_coupon: state.useMembershipDiscount,
      use_official_coupon: state.useCashCoupon,
      address: useBookingStore.getState().getAddressPayload(),
      pet: useBookingStore.getState().getPetPayload(),
      preferred_time_slots: state.selectedTimeSlots,
      notes: state.notes,
      store_id: state.serviceType === "in_store" ? state.selectedStoreId : null,
    };
  },

  loadUserInfo: async () => {
    const state = useBookingStore.getState();
    // 如果已经在加载中或已有数据，则不再请求（防止重复调用）
    if (state.isLoadingUserInfo || state.userInfo !== null) {
      return;
    }
    try {
      set({ isLoadingUserInfo: true });
      // Get user info from authStore (set by LoginModalContent after login)
      const info = useAuthStore.getState().userInfo;
      if (info) {
        set({ userInfo: info, isLoadingUserInfo: false });
        // Auto-fill address if available
        if (info.address) {
          set({ address: info.address });
          // Auto-fill city and postcode based on address (mock data for now)
          set({ city: "Vancouver", postCode: "E1N 2E5" });
        }
      } else {
        // If userInfo is not in authStore, it means user hasn't logged in yet
        set({ userInfo: null, isLoadingUserInfo: false });
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      set({ userInfo: null, isLoadingUserInfo: false });
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

  loadServices: async () => {
    const state = useBookingStore.getState();
    // 如果已经在加载中或已有数据，则不再请求
    if (state.isLoadingServices || state.services.length > 0) {
      return;
    }
    try {
      set({ isLoadingServices: true });
      const services = await getServices();
      set({ services, isLoadingServices: false });
    } catch (error) {
      console.error("Failed to load services:", error);
      set({ services: [], isLoadingServices: false });
    }
  },

  loadAddOns: async () => {
    const state = useBookingStore.getState();
    // 如果已经在加载中或已有数据，则不再请求
    if (state.isLoadingAddOns || state.addOnsList.length > 0) {
      return;
    }
    try {
      set({ isLoadingAddOns: true });
      const addOns = await getAddOns();
      set({ addOnsList: addOns, isLoadingAddOns: false });
    } catch (error) {
      console.error("Failed to load add-ons:", error);
      set({ addOnsList: [], isLoadingAddOns: false });
    }
  },

  loadMembershipPlans: async () => {
    const state = useBookingStore.getState();
    // 如果已经在加载中或已有数据，则不再请求
    if (state.isLoadingMembershipPlans || state.membershipPlans.length > 0) {
      return;
    }
    try {
      set({ isLoadingMembershipPlans: true });
      const plans = await getMembershipPlans();
      set({ membershipPlans: plans, isLoadingMembershipPlans: false });
    } catch (error) {
      console.error("Failed to load membership plans:", error);
      set({ membershipPlans: [], isLoadingMembershipPlans: false });
    }
  },

  setUseMembership: (value) => set({ useMembership: value }),
  setUseMembershipDiscount: (value) => set({ useMembershipDiscount: value }),
  setUseCashCoupon: (value) => set({ useCashCoupon: value }),
  setCouponType: (type) => {
    set({ couponType: type, useCashCoupon: type !== null });
  },

  setServiceId: (id) => set({ serviceId: id }),

  setSelectedTimeSlots: (slots) => set({ selectedTimeSlots: slots }),

  reset: () => set(initialState),

  hasFormData: (): boolean => {
    const state = useBookingStore.getState();
    // 检查关键字段是否有内容（排除初始默认值）
    const hasAddressData: boolean = state.address !== initialState.address || 
      state.city !== initialState.city || 
      state.province !== initialState.province || 
      state.postCode !== initialState.postCode ||
      state.selectedAddressId !== null ||
      state.selectedStoreId !== null;
    
    const hasPetData: boolean = state.petName !== "" ||
      state.breed !== "" ||
      state.dateOfBirth !== "" ||
      state.gender !== "" ||
      state.weight !== "" ||
      state.coatCondition !== "" ||
      state.behavior !== "" ||
      state.groomingFrequency !== "" ||
      state.petPhoto !== null ||
      state.referenceStyles.length > 0 ||
      state.photoIds.length > 0 ||
      state.referencePhotoIds.length > 0 ||
      state.specialNotes !== "";
    
    const hasServiceData: boolean = state.serviceId !== null ||
      state.addOns.length > 0 ||
      state.selectedTimeSlots.length > 0 ||
      state.notes !== "";
    
    const hasMembershipData: boolean = state.useMembership ||
      state.membershipPlanId !== null ||
      state.useMembershipDiscount ||
      state.useCashCoupon ||
      state.couponType !== null;
    
    // 如果当前步骤大于1，也认为有数据（用户至少进入了Step2）
    const hasProgress: boolean = state.currentStep > 1;
    
    return hasAddressData || hasPetData || hasServiceData || hasMembershipData || hasProgress;
  },
}));
