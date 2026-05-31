import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerAccountPage from "./GroomerAccountPage";
import { toast } from "sonner";
import {
  createGroomerPayoutLoginLink,
  createGroomerPayoutOnboardingLink,
  getGroomerPerformance,
  getGroomerPayoutSummary,
  getGroomerServiceAreas,
  getServiceAreaProvinces,
  getServiceAreas,
} from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    getServiceAreaProvinces: vi.fn(),
    getServiceAreas: vi.fn(),
    getGroomerServiceAreas: vi.fn(),
    saveGroomerServiceAreas: vi.fn(),
    getGroomerPerformance: vi.fn(),
    getGroomerPayoutSummary: vi.fn(),
    createGroomerPayoutOnboardingLink: vi.fn(),
    createGroomerPayoutLoginLink: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("GroomerAccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.mocked(getServiceAreaProvinces).mockResolvedValue([]);
    vi.mocked(getServiceAreas).mockResolvedValue([]);
    vi.mocked(getGroomerServiceAreas).mockResolvedValue([]);
    vi.mocked(getGroomerPayoutSummary).mockResolvedValue({
      bank_name: "TD Bank",
      bank_last4: "5678",
      onboarding_completed: true,
      payouts_enabled: true,
      account_status: "active",
    });
    vi.mocked(createGroomerPayoutOnboardingLink).mockResolvedValue({ ok: true, url: "https://example.com/onboarding" });
    vi.mocked(createGroomerPayoutLoginLink).mockResolvedValue({ ok: true, url: "https://example.com/login" });
    Object.defineProperty(window, "open", {
      writable: true,
      value: vi.fn(),
    });
  });

  it("renders performance tier and payout share from the performance api", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 91,
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {},
      recent_feedback: [],
    });

    render(
      <MemoryRouter>
        <GroomerAccountPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Gold Groomer")).toBeInTheDocument();
    expect(screen.getByText("85% payout share")).toBeInTheDocument();
    expect(screen.getByText("Priority client matching")).toBeInTheDocument();
    expect(screen.getByText("TD Bank")).toBeInTheDocument();
    expect(screen.getByText("**** 5678")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("shows an error toast when payout loading fails", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 91,
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {},
      recent_feedback: [],
    });
    vi.mocked(getGroomerPayoutSummary).mockRejectedValue(new Error("payout failed"));

    render(
      <MemoryRouter>
        <GroomerAccountPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Gold Groomer")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Failed to load account data");
  });
});
