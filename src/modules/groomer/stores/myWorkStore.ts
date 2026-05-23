import { create } from "zustand";
import {
  cancelGroomerBooking,
  decideGroomerInvitation,
  getGroomerHistory,
  getGroomerHistoryDetail,
  getGroomerMyWorkCalendar,
  getGroomerMyWorkSchedule,
  startGroomerTravel,
  type GroomerCancelBookingIn,
  type GroomerHistoryDetailOut,
  type GroomerHistoryIn,
  type GroomerHistoryOut,
  type GroomerMyWorkOut,
  type InvitationDecisionIn,
} from "@/lib/api";

interface GroomerMyWorkState {
  myWork: GroomerMyWorkOut | null;
  history: GroomerHistoryOut | null;
  selectedHistoryDetail: GroomerHistoryDetailOut | null;
  isLoadingMyWork: boolean;
  isLoadingHistory: boolean;
  isLoadingHistoryDetail: boolean;
  isCancelingAppointment: boolean;
  isStartingTravel: boolean;
  cancelAppointment: (bookingId: number, data: GroomerCancelBookingIn) => Promise<void>;
  fetchMyWork: () => Promise<void>;
  fetchHistory: (params?: GroomerHistoryIn) => Promise<void>;
  fetchHistoryDetail: (historyDetailRef: number | string) => Promise<void>;
  clearHistoryDetail: () => void;
  decideInvitation: (invitationId: number, data: InvitationDecisionIn) => Promise<void>;
  startTravel: (bookingId: number) => Promise<void>;
}

let latestHistoryRequestId = 0;
let latestHistoryDetailRequestId = 0;
const inFlightHistoryRequests = new Map<string, Promise<GroomerHistoryOut>>();

function getHistoryParamsKey(params?: GroomerHistoryIn): string {
  return JSON.stringify({
    pet_name: params?.pet_name || "",
    date_from: params?.date_from || "",
    date_to: params?.date_to || "",
    page: params?.page || "",
    page_size: params?.page_size || "",
  });
}

export const useGroomerMyWorkStore = create<GroomerMyWorkState>((set) => ({
  myWork: null,
  history: null,
  selectedHistoryDetail: null,
  isLoadingMyWork: false,
  isLoadingHistory: false,
  isLoadingHistoryDetail: false,
  isCancelingAppointment: false,
  isStartingTravel: false,

  cancelAppointment: async (bookingId, data) => {
    set({ isCancelingAppointment: true });
    try {
      await cancelGroomerBooking(bookingId, data);
    } finally {
      set({ isCancelingAppointment: false });
    }
  },

  fetchMyWork: async () => {
    set({ isLoadingMyWork: true });
    try {
      const [calendar, schedule] = await Promise.all([
        getGroomerMyWorkCalendar(),
        getGroomerMyWorkSchedule(),
      ]);
      set({ myWork: { ...calendar, ...schedule } });
    } finally {
      set({ isLoadingMyWork: false });
    }
  },

  fetchHistory: async (params) => {
    const requestId = latestHistoryRequestId + 1;
    latestHistoryRequestId = requestId;
    const paramsKey = getHistoryParamsKey(params);
    set({ isLoadingHistory: true });

    let requestPromise = inFlightHistoryRequests.get(paramsKey);
    if (!requestPromise) {
      requestPromise = getGroomerHistory(params).finally(() => {
        inFlightHistoryRequests.delete(paramsKey);
      });
      inFlightHistoryRequests.set(paramsKey, requestPromise);
    }

    try {
      const history = await requestPromise;
      if (requestId === latestHistoryRequestId) {
        set({ history });
      }
    } catch (error) {
      if (requestId === latestHistoryRequestId) {
        throw error;
      }
    } finally {
      if (requestId === latestHistoryRequestId) {
        set({ isLoadingHistory: false });
      }
    }
  },

  fetchHistoryDetail: async (historyDetailRef) => {
    const requestId = latestHistoryDetailRequestId + 1;
    latestHistoryDetailRequestId = requestId;
    set({ isLoadingHistoryDetail: true, selectedHistoryDetail: null });
    try {
      const selectedHistoryDetail = await getGroomerHistoryDetail(historyDetailRef);
      if (requestId === latestHistoryDetailRequestId) {
        set({ selectedHistoryDetail });
      }
    } catch (error) {
      if (requestId === latestHistoryDetailRequestId) {
        throw error;
      }
    } finally {
      if (requestId === latestHistoryDetailRequestId) {
        set({ isLoadingHistoryDetail: false });
      }
    }
  },

  clearHistoryDetail: () => {
    latestHistoryDetailRequestId += 1;
    set({ selectedHistoryDetail: null, isLoadingHistoryDetail: false });
  },

  decideInvitation: async (invitationId, data) => {
    await decideGroomerInvitation(invitationId, data);
  },

  startTravel: async (bookingId) => {
    set({ isStartingTravel: true });
    try {
      await startGroomerTravel(bookingId);
    } finally {
      set({ isStartingTravel: false });
    }
  },
}));
