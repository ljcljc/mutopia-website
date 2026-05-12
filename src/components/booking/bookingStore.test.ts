import { beforeEach, describe, expect, it } from "vitest";
import { useBookingStore } from "./bookingStore";
import { useAuthStore } from "@/components/auth/authStore";
import type { BookingDetailOut, MeOut } from "@/lib/api";

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
      editingBookingId: null,
      editingOrderCode: null,
      editingOriginalPayload: null,
      editingHasExistingMembershipBenefit: false,
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

describe("bookingStore loadBookingDetailForEdit", () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  it("hydrates an unpaid in-store booking for editing without dropping the store id", () => {
    const detail: BookingDetailOut = {
      id: 123,
      order_code: "ORDER-123",
      status: "awaiting_payment",
      scheduled_time: null,
      preferred_time_slots: [{ date: "2026-05-12", slot: "am" }],
      address_snapshot: {
        address: "1 Store Street",
        city: "Vancouver",
        province: "BC",
        postal_code: "V6B 1A1",
        service_type: "in_store",
        store: { id: 7, name: "Downtown Store" },
      },
      pet_snapshot: {
        id: 9,
        name: "Momo",
        pet_type: "dog",
        breed: "Poodle",
        birthday: "2024-01",
        weight_value: "12",
        weight_unit: "lbs",
      },
      package_snapshot: {
        service_id: 5,
        name: "Full grooming",
      },
      addons_snapshot: [{ id: 11, name: "Nail trim" }],
      membership_snapshot: {
        plan_id: 1,
        plan_name: "Premium Plus",
        is_new: false,
        discount_rate: "0.90",
        membership_fee: "0",
      },
      coupon_snapshot: {},
      package_amount: "80.00",
      addons_amount: "12.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "92.00",
      deposit_amount: "20.00",
      final_amount: "92.00",
    };

    useBookingStore.getState().loadBookingDetailForEdit(detail);

    const state = useBookingStore.getState();
    const submitPayload = state.getBookingSubmitPayload();

    expect(state.currentStep).toBe(6);
    expect(state.editingBookingId).toBe(123);
    expect(state.editingOrderCode).toBe("ORDER-123");
    expect(state.useMembership).toBe(false);
    expect(state.useMembershipDiscount).toBe(true);
    expect(state.membershipPlanId).toBe(1);
    expect(state.editingHasExistingMembershipBenefit).toBe(true);
    expect(state.selectedStoreId).toBe(7);
    expect(submitPayload.store_id).toBe(7);
    expect(submitPayload.open_membership).toBe(false);
    expect(submitPayload.membership_plan_id).toBe(1);
    expect(submitPayload.preferred_time_slots).toEqual([{ date: "2026-05-12", slot: "am" }]);
    expect(state.editingOriginalPayload).toBe(JSON.stringify(submitPayload));
  });

  it("treats legacy membership snapshots as an existing membership benefit", () => {
    const detail: BookingDetailOut = {
      id: 124,
      order_code: "ORDER-124",
      status: "awaiting_payment",
      scheduled_time: null,
      preferred_time_slots: [{ date: "2026-05-13", slot: "pm" }],
      address_snapshot: {
        address: "2 Home Street",
        city: "Vancouver",
        province: "BC",
        postal_code: "V6B 1A2",
        service_type: "mobile",
      },
      pet_snapshot: {
        id: 10,
        name: "Lulu",
        pet_type: "dog",
        breed: "Poodle",
        birthday: "2024-01",
        weight_value: "12",
        weight_unit: "lbs",
      },
      package_snapshot: {
        service_id: 5,
        name: "Full grooming",
      },
      addons_snapshot: [],
      membership_snapshot: {
        membership_id: 8,
        coupon_ids: [21],
      },
      coupon_snapshot: {},
      package_amount: "80.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "80.00",
      deposit_amount: "20.00",
      final_amount: "80.00",
    };

    useBookingStore.getState().loadBookingDetailForEdit(detail);

    const state = useBookingStore.getState();

    expect(state.useMembership).toBe(false);
    expect(state.membershipPlanId).toBe(null);
    expect(state.editingHasExistingMembershipBenefit).toBe(true);
  });
});
