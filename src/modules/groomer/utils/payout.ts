export type GroomerPayoutSummary = {
  bankName: string;
  bankMask: string;
  statusText: string;
  onboardingCompleted: boolean;
  payoutsEnabled: boolean;
  cashOutFeeRate: number;
};

export const DEFAULT_GROOMER_PAYOUT_SUMMARY: GroomerPayoutSummary = {
  bankName: "No payout account connected",
  bankMask: "Connect your bank account to receive payouts",
  statusText: "Setup needed",
  onboardingCompleted: false,
  payoutsEnabled: false,
  cashOutFeeRate: 0.015,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getString(source: Record<string, unknown>, key: string, fallback = ""): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function getBoolean(source: Record<string, unknown>, key: string, fallback = false): boolean {
  const value = source[key];
  return typeof value === "boolean" ? value : fallback;
}

function getNumber(source: Record<string, unknown>, key: string, fallback = 0): number {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function mapGroomerPayoutSummary(raw: unknown): GroomerPayoutSummary {
  const record = asRecord(raw);
  const bankName = getString(record, "bank_name");
  const bankLast4 = getString(record, "bank_last4");
  const onboardingCompleted = getBoolean(record, "onboarding_completed");
  const payoutsEnabled = getBoolean(record, "payouts_enabled");
  const accountStatus = getString(record, "account_status");

  const statusText = payoutsEnabled
    ? "Verified"
    : onboardingCompleted
      ? "Pending review"
      : accountStatus === "restricted"
        ? "Restricted"
        : "Setup needed";

  return {
    bankName: bankName || DEFAULT_GROOMER_PAYOUT_SUMMARY.bankName,
    bankMask: bankLast4 ? `**** ${bankLast4}` : DEFAULT_GROOMER_PAYOUT_SUMMARY.bankMask,
    statusText,
    onboardingCompleted,
    payoutsEnabled,
    cashOutFeeRate: getNumber(record, "cash_out_fee_rate", DEFAULT_GROOMER_PAYOUT_SUMMARY.cashOutFeeRate),
  };
}
