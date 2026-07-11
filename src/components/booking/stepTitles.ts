export function formatLocalDateLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMembershipStepTitle(isMember: boolean, endAt?: string | null): string {
  const membershipExpiryDate = formatLocalDateLabel(endAt);
  if (isMember) {
    return membershipExpiryDate
      ? `Membership until ${membershipExpiryDate}`
      : "Membership";
  }

  return "Membership (optional but save more)";
}

export const STEP_TITLES: Record<number, string> = {
  1: "Address and service type",
  2: "Pet information",
  3: "package and add-on",
  4: getMembershipStepTitle(false),
  5: "Choose service date and time",
  6: "Review & Confirm",
};
