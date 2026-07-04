export type IdentityMode = "customer" | "groomer";

interface IdentitySwitchOptions {
  mode: IdentityMode;
  header?: boolean;
}

export interface IdentitySwitchConfig {
  switchId: string;
  switchLabel: string;
  switchAriaLabel: string;
  switchChecked: boolean;
  dashboardPath: string;
  targetPath: string;
}

export function getIdentitySwitchConfig({
  mode,
  header = false,
}: IdentitySwitchOptions): IdentitySwitchConfig {
  if (mode === "customer") {
    return {
      switchId: header ? "header-groomer-switch" : "groomer-account-toggle",
      switchLabel: header ? "Groomer" : "Groomer account",
      switchAriaLabel: header ? "Switch to groomer" : "Groomer account toggle",
      switchChecked: false,
      dashboardPath: "/account/dashboard",
      targetPath: "/groomer/dashboard",
    };
  }

  return {
    switchId: header ? "header-pet-owner-switch" : "pet-owner-toggle",
    switchLabel: "Pet owner",
    switchAriaLabel: header ? "Switch to pet owner" : "Pet owner toggle",
    switchChecked: true,
    dashboardPath: "/groomer/dashboard",
    targetPath: "/account/dashboard",
  };
}

export function shouldNavigateIdentitySwitch(mode: IdentityMode, checked: boolean) {
  return mode === "customer" ? checked : !checked;
}
