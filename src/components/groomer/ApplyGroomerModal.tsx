import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common";
import { getGroomerApplyStatus, type ApplyStatusOut } from "@/lib/api";
import { useAuthStore } from "@/components/auth/authStore";

interface ApplyGroomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyGroomerModal({ open, onOpenChange }: ApplyGroomerModalProps) {
  const [email, setEmail] = useState("");
  const [applyStatus, setApplyStatus] = useState<ApplyStatusOut | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const userInfo = useAuthStore((state) => state.userInfo);
  const user = useAuthStore((state) => state.user);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const normalizedEmail = email.trim().toLowerCase();
  const loginEmail = userInfo?.email ?? user?.email ?? "";
  const isLoggedIn = Boolean(loginEmail);
  const isAuthenticated = Boolean(
    isLoggedIn && (!normalizedEmail || loginEmail.toLowerCase() === normalizedEmail)
  );
  const loginStatusLabel = isAuthenticated ? "logged_in_ui" : "logged_out_ui";
  const greetingName =
    userInfo?.first_name ||
    user?.name?.split(" ")[0] ||
    (loginEmail ? loginEmail.split("@")[0] : "");
  const showApplyForm = Boolean(applyStatus && !applyStatus.is_groomer);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    console.log("[ApplyGroomer] inputEmail:", value, "loginEmail:", loginEmail || null);
    if (applyStatus || statusError) {
      setApplyStatus(null);
      setStatusError(null);
    }
  };

  useEffect(() => {
    if (!open) return;
    console.log("[ApplyGroomer] renderUI:", loginStatusLabel);
    console.log("[ApplyGroomer] loginEmail:", loginEmail || null);
    console.log("[ApplyGroomer] inputEmail:", normalizedEmail || null);
    console.log("[ApplyGroomer] isLoggedIn:", isLoggedIn, "applyStatus.authenticated:", applyStatus?.authenticated ?? null);
  }, [open, loginStatusLabel, loginEmail, normalizedEmail, isLoggedIn, applyStatus]);

  const handleContinue = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isEmailValid) {
      setApplyStatus(null);
      setStatusError("Please enter a valid email.");
      return;
    }
    setIsCheckingStatus(true);
    setStatusError(null);
    try {
      const status = await getGroomerApplyStatus(trimmedEmail);
      setApplyStatus(status);
      console.log("[ApplyGroomer] status:", status);
    } catch (error) {
      console.error("[ApplyGroomer] Failed to check status:", error);
      setStatusError("Failed to check status");
      setApplyStatus(null);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleContinue();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white border border-[rgba(0,0,0,0.2)] rounded-[20px] p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[calc(100%-32px)] sm:w-[700px] sm:max-w-[700px] max-h-[90vh] overflow-y-auto [&>button]:hidden"
        aria-label="Apply as groomer"
      >
        <DialogTitle className="sr-only">Apply as groomer</DialogTitle>
        <DialogDescription className="sr-only">
          Apply to join the Mutopia pet grooming team.
        </DialogDescription>
        <div className="flex flex-col gap-[16px] pt-[12px] pb-[32px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between px-[12px] h-[24px]">
              <button
                type="button"
                className="size-[16px] opacity-70 cursor-pointer flex items-center justify-center leading-none"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
              >
                <Icon name="close-arrow" size={16} className="text-[#4a3c2a] block" />
              </button>
              <p className="flex-1 text-center font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4c4c4c]">
                Apply as groomer
              </p>
              <div className="size-[16px]" />
            </div>
            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
            <div className="px-[24px]">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#633479]">
                {showApplyForm && isAuthenticated
                  ? `Hi ${greetingName || "there"}, welcome to join our grooming team`
                  : "Welcome to join our grooming team at Mutopia pet"}
              </p>
            </div>
            {showApplyForm && (
              <div className="px-[24px] flex items-center justify-between text-[10px] leading-[12px]">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4c4c4c]">
                  Fill out the application in about 10 minutes
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">
                  All fields are required.
                </p>
              </div>
            )}
          </div>

          {!showApplyForm && (
            <div className="px-[24px] flex flex-col items-center">
              <div className="w-[372px] flex flex-col gap-[28px]">
                <div className="flex flex-col gap-[20px]">
                  <label className="flex flex-col gap-[8px]">
                    <span className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4a3c2a]">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onKeyDown={handleEmailKeyDown}
                      placeholder="Enter your email"
                      className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                    />
                    {!isEmailValid && email.trim().length > 0 && (
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px] text-[#DE1507]">
                        Please enter a valid email.
                      </span>
                    )}
                    {statusError && (
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px] text-[#DE1507]">
                        {statusError}
                      </span>
                    )}
                    {applyStatus?.is_groomer && (
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px] text-[#DE1507]">
                        This email is already a groomer account.
                      </span>
                    )}
                  </label>
                  <OrangeButton
                    size="medium"
                    variant="primary"
                    fullWidth
                    type="button"
                    onClick={handleContinue}
                    loading={isCheckingStatus}
                  >
                    <div className="flex items-center gap-[4px]">
                      <span className="text-[14px]">Continue</span>
                      <Icon name="button-arrow" size={16} className="text-white" />
                    </div>
                  </OrangeButton>
                </div>

                <div className="relative h-px w-full bg-[rgba(0,0,0,0.1)]">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-[14px] text-[12.25px] leading-[17.5px] text-[#717182] font-['Comfortaa:Regular',sans-serif]">
                    or
                  </span>
                </div>

                <div className="flex flex-col gap-[10.5px]">
                  <button
                    type="button"
                    className="h-[36px] w-full rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white flex items-center gap-[12px] px-[15px]"
                  >
                    <Icon name="google" size={14} />
                    <span className="flex-1 text-center font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[20px] text-[#717182]">
                      Continue with Google
                    </span>
                  </button>
                  <button
                    type="button"
                    className="h-[36px] w-full rounded-[16px] border border-[rgba(0,0,0,0.1)] bg-white flex items-center gap-[12px] px-[17px]"
                  >
                    <Icon name="facebook" size={14} />
                    <span className="flex-1 text-center font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[20px] text-[#717182]">
                      Continue with Facebook
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {showApplyForm && (
            <div className="px-[24px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-start justify-between">
                  {isAuthenticated ? (
                    <>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div className="size-[28px] rounded-full border-2 border-[rgba(222,106,7,0.6)] bg-[rgba(222,106,7,0.1)] flex items-center justify-center">
                          <Icon name="account" size={16} className="text-[#de6a07]" />
                        </div>
                        <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#de6a07]">
                          Account
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div className="size-[28px] rounded-full border-2 border-[#de6a07] bg-[rgba(222,106,7,0.1)] flex items-center justify-center">
                          <Icon name="identification" size={16} className="text-[#de6a07]" />
                        </div>
                        <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#de6a07]">
                          Identification
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div className="size-[28px] rounded-full border-2 border-[rgba(113,113,130,0.3)] flex items-center justify-center">
                          <Icon name="experience" size={16} className="text-[#717182]" />
                        </div>
                        <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#717182]">
                          Experience
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div className="size-[28px] rounded-full border-2 border-[#de6a07] bg-[rgba(222,106,7,0.1)] flex items-center justify-center">
                          <Icon name="identification" size={16} className="text-[#de6a07]" />
                        </div>
                        <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#de6a07]">
                          Identification
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div className="size-[28px] rounded-full border-2 border-[rgba(113,113,130,0.3)] flex items-center justify-center">
                          <Icon name="experience" size={16} className="text-[#717182]" />
                        </div>
                        <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#717182]">
                          Experience
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div className="size-[28px] rounded-full border-2 border-[rgba(113,113,130,0.3)] flex items-center justify-center">
                          <Icon name="account" size={16} className="text-[#717182]" />
                        </div>
                        <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#717182]">
                          Account
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="h-[7px] w-full rounded-full bg-[rgba(222,106,7,0.2)] overflow-hidden">
                  <div className={`h-full bg-[#de6a07] ${isAuthenticated ? "w-2/3" : "w-1/3"}`} />
                </div>
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-[16px]">
                  <div className="flex gap-[20px]">
                    <label className="flex flex-1 flex-col gap-[8px]">
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                        First Name
                      </span>
                      <input
                        type="text"
                        placeholder="Enter your first name"
                        className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                      />
                    </label>
                    <label className="flex flex-1 flex-col gap-[8px]">
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                        Last Name
                      </span>
                      <input
                        type="text"
                        placeholder="Enter your last name"
                        className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                      />
                    </label>
                  </div>
                  <p className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-black">
                    Your name should be identical to your ID.
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Do you have a valid work permit or social insurance number (SIN) ?
                    </p>
                    <div className="flex gap-[20px]">
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a]">
                        <input type="radio" name="sin" className="size-[16px] accent-[#de6a07]" />
                        Yes
                      </label>
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a]">
                        <input type="radio" name="sin" className="size-[16px] accent-[#de6a07]" />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[16px]">
                  <div className="flex gap-[20px]">
                    <label className="flex flex-1 flex-col gap-[8px]">
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                        First Name
                      </span>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                      />
                    </label>
                    <label className="flex flex-1 flex-col gap-[8px]">
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                        Last Name
                      </span>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                      />
                    </label>
                  </div>
                  <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px] text-black">
                    Your name should be identical to your ID.
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Do you have a valid work permit or social insurance number (SIN)?
                    </p>
                    <div className="flex gap-[20px]">
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a]">
                        <input type="radio" name="sin" className="size-[16px] accent-[#de6a07]" />
                        Yes
                      </label>
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a]">
                        <input type="radio" name="sin" className="size-[16px] accent-[#de6a07]" />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <OrangeButton
                  size="compact"
                  variant="secondary"
                  type="button"
                  onClick={() => setApplyStatus(null)}
                >
                  Back
                </OrangeButton>
                <OrangeButton size="medium" variant="primary" type="button">
                  <div className="flex items-center gap-[4px]">
                    <span className="text-[14px]">Next</span>
                    <Icon name="button-arrow" size={16} className="text-white" />
                  </div>
                </OrangeButton>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
