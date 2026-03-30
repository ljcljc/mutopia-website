import { beforeEach, describe, expect, it } from "vitest";
import { useBookingStore } from "./bookingStore";
import { useAuthStore } from "@/components/auth/authStore";
import type { MeOut } from "@/lib/api";

const mockUserInfo: MeOut = {
  id: "user-1",
  email: "booking@example.com",
  first_name: "Booking",
  last_name: "Tester",
  address: "123 Pet Street",
  receive_marketing_message: false,
  role: "customer",
  is_email_verified: true,
  is_groomer: false,
};

describe("bookingStore loadUserInfo", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      userInfo: null,
    });

    useBookingStore.setState({
      currentStep: 1,
      address: "",
      serviceType: "mobile",
      city: "",
      province: "",
      postCode: "",
      selectedAddressId: null,
      selectedStoreId: null,
      addresses: [],
      isLoadingAddresses: false,
      stores: [],
      petName: "",
      selectedPetId: null,
      petType: "dog",
      breed: "",
      isMixedBreed: false,
      precisePetType: "",
      dateOfBirth: "",
      gender: "",
      weight: "",
      weightUnit: "lbs",
      coatCondition: "",
      approveShave: null,
      behavior: "",
      groomingFrequency: "",
      petPhoto: null,
      referenceStyles: [],
      photoIds: [],
      referencePhotoIds: [],
      photoUrls: [],
      referencePhotoUrls: [],
      specialNotes: "",
      servicePackage: "",
      serviceId: null,
      addOns: [],
      isLoginModalOpen: false,
      userInfo: null,
      isLoadingUserInfo: false,
      petBreeds: [],
      isLoadingBreeds: false,
      services: [],
      isLoadingServices: false,
      addOnsList: [],
      isLoadingAddOns: false,
      membershipPlans: [],
      isLoadingMembershipPlans: false,
      coupons: [],
      isLoadingCoupons: false,
      selectedCouponIds: [],
      useMembership: false,
      membershipPlanId: null,
      useMembershipDiscount: false,
      useCashCoupon: false,
      cashCouponCount: 0,
      couponType: null,
      selectedTimeSlots: [],
      notes: "",
    });
  });

  it("copies the saved address without injecting hard-coded city or postal code", async () => {
    useAuthStore.getState().setUserInfo(mockUserInfo);

    await useBookingStore.getState().loadUserInfo();

    const state = useBookingStore.getState();
    expect(state.address).toBe("123 Pet Street");
    expect(state.city).toBe("");
    expect(state.postCode).toBe("");
    expect(state.userInfo).toEqual(mockUserInfo);
  });
});
