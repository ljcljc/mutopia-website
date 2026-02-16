import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common";
import { getGroomerApplyStatus, type ApplyStatusOut } from "@/lib/api";

interface ApplyGroomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyGroomerModal({ open, onOpenChange }: ApplyGroomerModalProps) {
  const [email, setEmail] = useState("");
  const [applyStatus, setApplyStatus] = useState<ApplyStatusOut | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white border border-[rgba(0,0,0,0.2)] rounded-[20px] p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] max-w-[700px] [&>button]:hidden"
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
                Welcome to join our grooming team at Mutopia pet
              </p>
            </div>
            {/* <div className="px-[24px]">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4a3c2a]">
                Fill out the application in about 10 minutes
              </p>
            </div> */}
          </div>

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
                    onChange={(e) => setEmail(e.target.value)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
