import { create } from "zustand";
import {
  cancelBooking,
  decideGroomerInvitation,
  getGroomerHistory,
  getGroomerHistoryDetail,
  getGroomerMyWorkCalendar,
  getGroomerMyWorkSchedule,
  startGroomerTravel,
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
  cancelAppointment: (bookingId: number) => Promise<void>;
  fetchMyWork: () => Promise<void>;
  fetchHistory: (params?: GroomerHistoryIn) => Promise<void>;
  fetchHistoryDetail: (bookingId: number) => Promise<void>;
  clearHistoryDetail: () => void;
  decideInvitation: (invitationId: number, data: InvitationDecisionIn) => Promise<void>;
  startTravel: (bookingId: number) => Promise<void>;
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

  cancelAppointment: async (bookingId) => {
    set({ isCancelingAppointment: true });
    try {
      await cancelBooking(bookingId, "Groomer canceled from My Work");
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
    set({ isLoadingHistory: true });
    try {
      const history = await getGroomerHistory(params);
      set({ history });
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  fetchHistoryDetail: async (bookingId) => {
    set({ isLoadingHistoryDetail: true, selectedHistoryDetail: null });
    try {
      const selectedHistoryDetail = await getGroomerHistoryDetail(bookingId);
      set({ selectedHistoryDetail });
    } finally {
      set({ isLoadingHistoryDetail: false });
    }
  },

  clearHistoryDetail: () => {
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
