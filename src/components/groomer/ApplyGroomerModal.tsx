import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VerificationCodeInput } from "@/components/auth/VerificationCodeInput";
import { PasswordInput } from "@/components/auth/LoginModalContainers";
import { validatePassword } from "@/components/auth/LoginModalPasswordValidation";
import { LoginModal } from "@/components/auth/LoginModal";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, CustomSelect, CustomSelectItem, FileUpload, type FileUploadItem } from "@/components/common";
import { buildImageUrl, getCurrentUser, sendCode, submitGroomerApply, uploadGroomerApplyImage } from "@/lib/api";
import { DatePicker } from "@/components/common/DatePicker";
import { getGroomerApplyStatus, type ApplyStatusOut } from "@/lib/api";
import { useAuthStore } from "@/components/auth/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApplyGroomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface IdentificationCommonProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  sinAnswer: "yes" | "no" | null;
  onSinChange: (value: "yes" | "no") => void;
  sinAlert: string | null;
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  maxBirthDate: string;
  address: string;
  onAddressChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
}

interface IdentificationUnauthExtraProps {
  hasBathingExperience: boolean | null;
  onBathingChange: (value: boolean) => void;
  hasGroomingExperience: boolean | null;
  onGroomingChange: (value: boolean) => void;
  hearAboutUs: string;
  onHearAboutUsChange: (value: string) => void;
  inviteCode: string;
  onInviteCodeChange: (value: string) => void;
  showReferralFields: boolean;
}

const HEAR_ABOUT_US_OPTIONS = [
  "Invited by friends",
  "Google",
  "Instagram",
  "Facebook",
  "TikTok",
  "Other",
];

function IdentificationAuthenticatedForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  sinAnswer,
  onSinChange,
  sinAlert,
  birthDate,
  onBirthDateChange,
  maxBirthDate,
  address,
  onAddressChange,
  phone,
  onPhoneChange,
}: IdentificationCommonProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex gap-[20px]">
        <label className="flex flex-1 flex-col gap-[8px]">
          <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
            First Name
          </span>
          <input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
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
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
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
          <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
            <input
              type="radio"
              name="sin"
              className="size-[16px] accent-[#de6a07] cursor-pointer"
              checked={sinAnswer === "yes"}
              onChange={() => onSinChange("yes")}
            />
            Yes
          </label>
          <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
            <input
              type="radio"
              name="sin"
              className="size-[16px] accent-[#de6a07] cursor-pointer"
              checked={sinAnswer === "no"}
              onChange={() => onSinChange("no")}
            />
            No
          </label>
        </div>
        {sinAlert && (
          <div className="h-[36px] w-fit rounded-[8px] border border-[#de1507] px-[16px] flex items-center gap-[8px] text-[#de1507]">
            <span className="size-[12px] rounded-full bg-[#de1507] text-white text-[10px] leading-[12px] flex items-center justify-center">!</span>
            <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px]">
              {sinAlert}
            </span>
          </div>
        )}
      </div>

      {sinAnswer === "yes" && (
        <>
          <div className="max-w-[348px]">
            <DatePicker
              label="Date of birth"
              placeholder="yyyy-mm-dd"
              value={birthDate}
              onChange={onBirthDateChange}
              helperText="At least 18 years old. Your birthday won't be shared."
              minDate="1900-01-01"
              maxDate={maxBirthDate}
            />
          </div>

          <div className="flex gap-[20px]">
            <label className="flex flex-1 flex-col gap-[8px]">
              <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                Address (Starting point of work)
              </span>
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(event) => onAddressChange(event.target.value)}
                className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
              />
            </label>
            <label className="flex flex-1 flex-col gap-[8px]">
              <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                Phone Number
              </span>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

function IdentificationUnauthForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  sinAnswer,
  onSinChange,
  sinAlert,
  birthDate,
  onBirthDateChange,
  maxBirthDate,
  address,
  onAddressChange,
  phone,
  onPhoneChange,
  hasBathingExperience,
  onBathingChange,
  hasGroomingExperience,
  onGroomingChange,
  hearAboutUs,
  onHearAboutUsChange,
  inviteCode,
  onInviteCodeChange,
  showReferralFields,
}: IdentificationCommonProps & IdentificationUnauthExtraProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex gap-[20px]">
        <label className="flex flex-1 flex-col gap-[8px]">
          <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
            First Name
          </span>
          <input
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
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
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
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
          <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
            <input
              type="radio"
              name="sin"
              className="size-[16px] accent-[#de6a07] cursor-pointer"
              checked={sinAnswer === "yes"}
              onChange={() => onSinChange("yes")}
            />
            Yes
          </label>
          <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
            <input
              type="radio"
              name="sin"
              className="size-[16px] accent-[#de6a07] cursor-pointer"
              checked={sinAnswer === "no"}
              onChange={() => onSinChange("no")}
            />
            No
          </label>
        </div>
        {sinAlert && (
          <div className="h-[36px] w-fit rounded-[8px] border border-[#de1507] px-[16px] flex items-center gap-[8px] text-[#de1507]">
            <span className="size-[12px] rounded-full bg-[#de1507] text-white text-[10px] leading-[12px] flex items-center justify-center">!</span>
            <span className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px]">
              {sinAlert}
            </span>
          </div>
        )}
      </div>

      {sinAnswer === "yes" && (
        <>
          <div className="flex flex-col gap-[8px]">
            <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
              Do you have bathing working experience?
            </p>
            <div className="flex gap-[20px]">
              <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                <input
                  type="radio"
                  name="bathing"
                  className="size-[16px] accent-[#de6a07] cursor-pointer"
                  checked={hasBathingExperience === true}
                  onChange={() => onBathingChange(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                <input
                  type="radio"
                  name="bathing"
                  className="size-[16px] accent-[#de6a07] cursor-pointer"
                  checked={hasBathingExperience === false}
                  onChange={() => onBathingChange(false)}
                />
                No
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
              Do you have grooming working experience?
            </p>
            <div className="flex gap-[20px]">
              <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                <input
                  type="radio"
                  name="grooming"
                  className="size-[16px] accent-[#de6a07] cursor-pointer"
                  checked={hasGroomingExperience === true}
                  onChange={() => onGroomingChange(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                <input
                  type="radio"
                  name="grooming"
                  className="size-[16px] accent-[#de6a07] cursor-pointer"
                  checked={hasGroomingExperience === false}
                  onChange={() => onGroomingChange(false)}
                />
                No
              </label>
            </div>
          </div>

          <div className="max-w-[348px]">
            <DatePicker
              label="Date of birth"
              placeholder="yyyy-mm-dd"
              value={birthDate}
              onChange={onBirthDateChange}
              helperText="At least 18 years old. Your birthday won't be shared."
              minDate="1900-01-01"
              maxDate={maxBirthDate}
            />
          </div>

          <div className="flex gap-[20px]">
            <label className="flex flex-1 flex-col gap-[8px]">
              <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                Address (Starting point of work)
              </span>
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(event) => onAddressChange(event.target.value)}
                className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
              />
            </label>
            <label className="flex flex-1 flex-col gap-[8px]">
              <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                Phone Number
              </span>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
              />
            </label>
          </div>

          {showReferralFields && (
            <div className="flex gap-[20px]">
              <label className="flex flex-1 flex-col gap-[8px]">
                <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                  How did you hear about us?
                </span>
                <CustomSelect
                  placeholder="Invited by friends"
                  value={hearAboutUs}
                  displayValue={hearAboutUs}
                  onValueChange={onHearAboutUsChange}
                  leftElement={<Icon name="search" size={16} className="text-[#717182]" />}
                >
                  {HEAR_ABOUT_US_OPTIONS.map((option) => (
                    <CustomSelectItem key={option} value={option}>
                      {option}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </label>
              <label className="flex flex-1 flex-col gap-[8px]">
                <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                  Invite code
                </span>
                <input
                  type="text"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(event) => onInviteCodeChange(event.target.value)}
                  className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                />
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ApplyGroomerModal({ open, onOpenChange }: ApplyGroomerModalProps) {
  const [email, setEmail] = useState("");
  const [applyStatus, setApplyStatus] = useState<ApplyStatusOut | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [sinAnswer, setSinAnswer] = useState<"yes" | "no" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasBathingExperience, setHasBathingExperience] = useState<boolean | null>(null);
  const [hasGroomingExperience, setHasGroomingExperience] = useState<boolean | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [yearsGroomingExperience, setYearsGroomingExperience] = useState("");
  const [servicePets, setServicePets] = useState<string[]>([]);
  const [petType, setPetType] = useState("");
  const [providedServices, setProvidedServices] = useState<string[]>([]);
  const [currentWorkPlaces, setCurrentWorkPlaces] = useState<string[]>([]);
  const [hasDriverLicense, setHasDriverLicense] = useState<boolean | null>(null);
  const [hasGroomingVan, setHasGroomingVan] = useState<boolean | null>(null);
  const [hasReferences, setHasReferences] = useState<boolean | null>(null);
  const [references, setReferences] = useState<{ name: string; email: string }[]>([
    { name: "", email: "" },
  ]);
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.userInfo);
  const user = useAuthStore((state) => state.user);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const normalizedEmail = email.trim().toLowerCase();
  const loginEmail = userInfo?.email ?? user?.email ?? "";
  const isLoggedIn = Boolean(loginEmail);
  const isAuthenticated = Boolean(
    isLoggedIn && (!normalizedEmail || loginEmail.toLowerCase() === normalizedEmail)
  );
  const isEmailRegistered = Boolean(applyStatus?.is_registered);
  const showReferralFields = !isAuthenticated && applyStatus?.is_registered === false;
  const shouldShowAccountSteps = !isAuthenticated && applyStatus?.is_registered === false;
  const loginStatusLabel = isAuthenticated ? "logged_in_ui" : "logged_out_ui";
  const [birthDate, setBirthDate] = useState("");
  const maxBirthDate = (() => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split("T")[0];
  })();
  const isFormComplete = (() => {
    if (!firstName.trim() || !lastName.trim() || !sinAnswer) return false;
    if (sinAnswer === "no") return false;
    if (!birthDate) return false;
    if (!address.trim() || !phone.trim()) return false;
    if (isAuthenticated) return true;
    if (hasBathingExperience === null || hasGroomingExperience === null) return false;
    if (showReferralFields && !hearAboutUs.trim()) return false;
    return true;
  })();
  const isExperienceComplete = (() => {
    if (!yearsGroomingExperience) return false;
    if (servicePets.length === 0) return false;
    if (!petType.trim()) return false;
    if (providedServices.length === 0) return false;
    if (currentWorkPlaces.length === 0) return false;
    if (hasDriverLicense === null) return false;
    if (hasGroomingVan === null) return false;
    if (hasReferences === null) return false;
    if (hasReferences && references.some((ref) => !ref.name.trim() || !ref.email.trim())) return false;
    return true;
  })();
  const [step, setStep] = useState<
    "identification" | "experience" | "portfolio" | "accountAgreement" | "accountVerify"
  >("identification");
  const isAccountStep = step === "accountAgreement" || step === "accountVerify";
  const isExperienceStep = step === "experience" || step === "portfolio" || isAccountStep;
  const [portfolioMessage, setPortfolioMessage] = useState("");
  const [portfolioPlatform, setPortfolioPlatform] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountPasswordConfirm, setAccountPasswordConfirm] = useState("");
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [showAccountPasswordConfirm, setShowAccountPasswordConfirm] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const passwordValidation = validatePassword(accountPassword);
  const isPasswordValid = passwordValidation.hasMinLength && passwordValidation.hasNumberOrSymbol;
  const showPasswordError = accountPassword.length > 0 && !isPasswordValid;
  const showConfirmError =
    accountPasswordConfirm.length > 0 && accountPasswordConfirm !== accountPassword;
  const [verificationCountdown, setVerificationCountdown] = useState(60);
  const [verificationError, setVerificationError] = useState("");
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [codeResent, setCodeResent] = useState(false);
  const [hasSentVerificationCode, setHasSentVerificationCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tableUploadItems, setTableUploadItems] = useState<FileUploadItem[]>([]);
  const [workUploadItems, setWorkUploadItems] = useState<FileUploadItem[]>([]);
  const [tableUploadErrorType, setTableUploadErrorType] = useState<"size" | "format" | null>(null);
  const [workUploadErrorType, setWorkUploadErrorType] = useState<"size" | "format" | null>(null);
  const portfolioPlatforms = ["Instagram", "Facebook", "TikTok", "YouTube", "Other"];
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toggleValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  const greetingName =
    userInfo?.first_name ||
    user?.name?.split(" ")[0] ||
    (loginEmail ? loginEmail.split("@")[0] : "");
  const showApplyForm = Boolean(
    applyStatus &&
    !applyStatus.is_groomer &&
    (!applyStatus.is_registered || isAuthenticated)
  );

  const resetAllFields = () => {
    setEmail("");
    setApplyStatus(null);
    setIsCheckingStatus(false);
    setStatusError(null);
    setSinAnswer(null);
    setFirstName("");
    setLastName("");
    setHasBathingExperience(null);
    setHasGroomingExperience(null);
    setAddress("");
    setPhone("");
    setHearAboutUs("");
    setInviteCode("");
    setYearsGroomingExperience("");
    setServicePets([]);
    setPetType("");
    setProvidedServices([]);
    setCurrentWorkPlaces([]);
    setHasDriverLicense(null);
    setHasGroomingVan(null);
    setHasReferences(null);
    setReferences([{ name: "", email: "" }]);
    setBirthDate("");
    setStep("identification");
    setPortfolioMessage("");
    setPortfolioPlatform("");
    setPortfolioLink("");
    setAccountPassword("");
    setAccountPasswordConfirm("");
    setShowAccountPassword(false);
    setShowAccountPasswordConfirm(false);
    setVerificationCode(Array(6).fill(""));
    setVerificationCountdown(60);
    setVerificationError("");
    setIsResendingCode(false);
    setCodeResent(false);
    setHasSentVerificationCode(false);
    setTableUploadItems([]);
    setWorkUploadItems([]);
    setTableUploadErrorType(null);
    setWorkUploadErrorType(null);
    setIsSubmitting(false);
    setSubmitError(null);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    console.log("[ApplyGroomer] inputEmail:", value, "loginEmail:", loginEmail || null);
    if (applyStatus || statusError) {
      setApplyStatus(null);
      setStatusError(null);
      setStep("identification");
    }
  };

  useEffect(() => {
    if (open) return;
    resetAllFields();
    console.log("[ApplyGroomer] renderUI:", loginStatusLabel);
    console.log("[ApplyGroomer] loginEmail:", loginEmail || null);
    console.log("[ApplyGroomer] inputEmail:", normalizedEmail || null);
    console.log("[ApplyGroomer] isLoggedIn:", isLoggedIn, "applyStatus.authenticated:", applyStatus?.authenticated ?? null);
  }, [open, loginStatusLabel, loginEmail, normalizedEmail, isLoggedIn, applyStatus]);

  useEffect(() => {
    if (!isAccountStep) return;
    if (verificationCountdown <= 0) return;
    const timer = setTimeout(() => {
      setVerificationCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isAccountStep, verificationCountdown]);

  useEffect(() => {
    if (codeResent) {
      setVerificationCountdown(60);
    }
  }, [codeResent]);

  useEffect(() => {
    if (verificationCountdown === 0 && codeResent) {
      setCodeResent(false);
    }
  }, [verificationCountdown, codeResent]);

  useEffect(() => {
    if (step !== "accountVerify") return;
    if (hasSentVerificationCode) return;
    const targetEmail = email.trim() || loginEmail;
    if (!targetEmail) return;
    setHasSentVerificationCode(true);
    sendCode({ email: targetEmail, purpose: isEmailRegistered ? "login" : "apply_groomer" })
      .then(() => {
        toast.success("Verification code sent to your email.");
        setCodeResent(true);
      })
      .catch((err) => {
        console.error("[ApplyGroomer] send verification code failed:", err);
        setVerificationError("Failed to send verification code.");
      });
  }, [step, isEmailRegistered, hasSentVerificationCode, email, loginEmail]);

  useEffect(() => {
    if (!contentScrollRef.current) return;
    contentScrollRef.current.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step]);

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
  const handleResendVerificationCode = async () => {
    if (verificationCountdown > 0) return;
    setIsResendingCode(true);
    setVerificationError("");
    try {
      await sendCode({
        email: email.trim() || loginEmail,
        purpose: isEmailRegistered ? "login" : "apply_groomer",
      });
      setCodeResent(true);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      console.error("[ApplyGroomer] resend code failed:", err);
      setVerificationError("Failed to send verification code.");
      toast.error("Failed to send verification code.");
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleSubmitApply = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const servicePetsValues = Array.from(
        new Set(
          servicePets
            .map((pet) => {
              if (pet === "Dogs") return "dog";
              if (pet === "Cats") return "cat";
              if (pet === "Other") return "other";
              return pet.toLowerCase();
            })
            .filter((value): value is string => Boolean(value))
        )
      );

      const currentWorkPlacesValues = currentWorkPlaces.map((place) => {
        if (place === "In salon") return "in_salon";
        if (place === "In-Home") return "in_home";
        if (place === "Mobile") return "mobile";
        return place.toLowerCase();
      });

      const providedServicesValues = providedServices.map((service) => {
        if (service === "Pet bather") return "pet_bather";
        if (service === "Pet groomer") return "pet_groomer";
        return service.toLowerCase();
      });

      const payload = {
        email: email.trim() || null,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birthday: birthDate,
        address: address.trim(),
        phone: phone.trim(),
        has_valid_work_permit_or_sin: sinAnswer === "yes",
        years_bathing_experience: yearsGroomingExperience ? Number(yearsGroomingExperience) : null,
        service_pets: servicePetsValues,
        pet_type: petType.trim() || null,
        provided_services: providedServicesValues,
        current_work_places: currentWorkPlacesValues,
        has_driver_license: hasDriverLicense,
        has_grooming_van: hasGroomingVan,
        has_references: hasReferences ?? false,
        references: hasReferences ? references : [],
        where_learn_bathing: portfolioMessage.trim() || null,
        work_image_ids: workUploadItems.map((item) => item.photoId).filter((id): id is number => Number.isFinite(id)),
        environment_image_ids: tableUploadItems.map((item) => item.photoId).filter((id): id is number => Number.isFinite(id)),
        showcase_profile_on: portfolioPlatform || null,
        showcase_link: portfolioLink.trim() || null,
        has_bathing_experience: hasBathingExperience ?? false,
        has_grooming_experience: hasGroomingExperience ?? false,
        hear_about_us: hearAboutUs.trim() || "",
      };
      await submitGroomerApply(payload);
      onOpenChange(false);
      if (isAuthenticated) {
        try {
          const updatedUserInfo = await getCurrentUser();
          setUserInfo(updatedUserInfo);
        } catch (fetchError) {
          console.error("[ApplyGroomer] failed to refresh user info:", fetchError);
        }
        navigate("/account/profile");
      } else {
        setIsLoginModalOpen(true);
      }
    } catch (error) {
      console.error("[ApplyGroomer] submit failed:", error);
      if (error && typeof error === "object" && "message" in error) {
        setSubmitError(String((error as { message?: unknown }).message || "Failed to submit application"));
      } else {
        setSubmitError("Failed to submit application");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

  const updateUploadItemByKey = (
    setItems: React.Dispatch<React.SetStateAction<FileUploadItem[]>>,
    fileKey: string,
    updater: (item: FileUploadItem) => FileUploadItem
  ) => {
    setItems((prev) => prev.map((item) => (getFileKey(item.file) === fileKey ? updater(item) : item)));
  };

  const handleUploadFilesChange = (
    files: File[],
    setItems: React.Dispatch<React.SetStateAction<FileUploadItem[]>>,
    category: "table_or_env" | "work_or_cert",
    setErrorType: React.Dispatch<React.SetStateAction<"size" | "format" | null>>
  ) => {
    setErrorType(null);
    setItems((prevItems) => {
      const prevMap = new Map(prevItems.map((item) => [getFileKey(item.file), item]));
      const nextItems: FileUploadItem[] = [];
      const newEntries: { file: File; key: string }[] = [];

      files.forEach((file) => {
        const key = getFileKey(file);
        const existing = prevMap.get(key);
        if (existing) {
          nextItems.push(existing);
        } else {
          nextItems.push({
            file,
            previewUrl: URL.createObjectURL(file),
            uploadStatus: "uploading",
            uploadProgress: 0,
          });
          newEntries.push({ file, key });
        }
      });

      prevItems.forEach((item) => {
        const stillExists = files.some((file) => getFileKey(file) === getFileKey(item.file));
        if (!stillExists && item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      queueMicrotask(() => {
        newEntries.forEach(({ file, key }) => {
          uploadGroomerApplyImage(file, category, email.trim() || null, (progress) => {
            updateUploadItemByKey(setItems, key, (item) => ({
              ...item,
              uploadProgress: progress,
            }));
          })
            .then((response) => {
              const fullUrl = buildImageUrl(response.url);
              updateUploadItemByKey(setItems, key, (item) => ({
                ...item,
                uploadStatus: "uploaded",
                uploadProgress: 100,
                photoId: response.id,
                serverUrl: response.url,
                previewUrl: fullUrl,
              }));
            })
            .catch((error) => {
              console.error("[ApplyGroomer] upload image failed:", error);
              updateUploadItemByKey(setItems, key, (item) => ({
                ...item,
                uploadStatus: "error",
                errorType: "upload",
              }));
            });
        });
      });

      return nextItems;
    });
  };

  const resetExperienceStep = () => {
    setYearsGroomingExperience("");
    setServicePets([]);
    setProvidedServices([]);
    setCurrentWorkPlaces([]);
    setHasDriverLicense(null);
    setHasGroomingVan(null);
    setHasReferences(null);
    setReferences([{ name: "", email: "" }]);
  };
  const addReference = () => {
    setReferences((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, { name: "", email: "" }];
    });
  };
  const removeReference = (index: number) => {
    setReferences((prev) => {
      if (prev.length <= 1) {
        return [{ name: "", email: "" }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };
  const updateReference = (index: number, field: "name" | "email", value: string) => {
    setReferences((prev) =>
      prev.map((ref, i) => (i === index ? { ...ref, [field]: value } : ref))
    );
  };

  const sinAlert = sinAnswer === "no"
    ? "Unfortunately, we are not allowed to collaborate with you by law."
    : null;

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white border border-[rgba(0,0,0,0.2)] rounded-[20px] p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[calc(100%-32px)] sm:w-[700px] sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden"
        aria-label="Apply as groomer"
      >
        <DialogTitle className="sr-only">Apply as groomer</DialogTitle>
        <DialogDescription className="sr-only">
          Apply to join the Mutopia pet grooming team.
        </DialogDescription>
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex flex-col gap-[16px] pt-[12px] mb-[16px]">
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
                  {isAccountStep
                    ? "Complete the application in about 2 minute"
                    : step === "portfolio"
                      ? "Complete the application in about 3 minute"
                      : step === "experience"
                        ? "Complete the application in about 5 minutes"
                        : `Fill out the application in about ${sinAnswer === "yes" ? "5" : "10"} minutes`}
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">
                  {isAccountStep
                    ? "Log in to your account."
                    : step === "portfolio"
                      ? "Upload pictures or paste the link."
                      : "All fields are required."}
                </p>
              </div>
            )}
          </div>
          </div>

          <div ref={contentScrollRef} className="flex-1 overflow-y-auto pb-[32px]">
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
                    {applyStatus?.is_registered && !isAuthenticated && (
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px] text-[#DE1507]">
                        This email is already registered. Please log in.
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
                        <div
                          className={`size-[28px] rounded-full border-2 flex items-center justify-center ${
                            isExperienceStep
                              ? "border-[rgba(222,106,7,0.6)] bg-[rgba(222,106,7,0.1)]"
                              : "border-[rgba(113,113,130,0.3)]"
                          }`}
                        >
                          <Icon
                            name="experience"
                            size={16}
                            className={isExperienceStep ? "text-[#de6a07]" : "text-[#717182]"}
                          />
                        </div>
                        <span
                          className={`font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] ${
                            isExperienceStep ? "text-[#de6a07]" : "text-[#717182]"
                          }`}
                        >
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
                        <div
                          className={`size-[28px] rounded-full border-2 flex items-center justify-center ${
                            isExperienceStep
                              ? "border-[rgba(222,106,7,0.6)] bg-[rgba(222,106,7,0.1)]"
                              : "border-[rgba(113,113,130,0.3)]"
                          }`}
                        >
                          <Icon
                            name="experience"
                            size={16}
                            className={isExperienceStep ? "text-[#de6a07]" : "text-[#717182]"}
                          />
                        </div>
                        <span
                          className={`font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] ${
                            isExperienceStep ? "text-[#de6a07]" : "text-[#717182]"
                          }`}
                        >
                          Experience
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-[7px]">
                        <div
                          className={`size-[28px] rounded-full border-2 flex items-center justify-center ${
                            isAccountStep
                              ? "border-[rgba(222,106,7,0.6)] bg-[rgba(222,106,7,0.1)]"
                              : "border-[rgba(113,113,130,0.3)]"
                          }`}
                        >
                          <Icon
                            name="account"
                            size={16}
                            className={isAccountStep ? "text-[#de6a07]" : "text-[#717182]"}
                          />
                        </div>
                        <span
                          className={`font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] ${
                            isAccountStep ? "text-[#de6a07]" : "text-[#717182]"
                          }`}
                        >
                          Account
                        </span>
                      </div>
                    </>
                    )}
                  </div>
                  <div className="h-[7px] w-full rounded-full bg-[rgba(222,106,7,0.2)] overflow-hidden">
                    <div
                      className={`h-full bg-[#de6a07] ${
                        isAccountStep
                          ? "w-full"
                          : isExperienceStep
                            ? isAuthenticated
                              ? "w-full"
                              : "w-2/3"
                            : isAuthenticated
                              ? "w-2/3"
                              : "w-1/3"
                      }`}
                    />
                  </div>
                </div>

              {step === "identification" && isAuthenticated && (
                <IdentificationAuthenticatedForm
                  firstName={firstName}
                  lastName={lastName}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                  sinAnswer={sinAnswer}
                  onSinChange={setSinAnswer}
                  sinAlert={sinAlert}
                  birthDate={birthDate}
                  onBirthDateChange={setBirthDate}
                  maxBirthDate={maxBirthDate}
                  address={address}
                  onAddressChange={setAddress}
                  phone={phone}
                  onPhoneChange={setPhone}
                />
              )}

              {step === "identification" && !isAuthenticated && (
                <IdentificationUnauthForm
                  firstName={firstName}
                  lastName={lastName}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                  sinAnswer={sinAnswer}
                  onSinChange={setSinAnswer}
                  sinAlert={sinAlert}
                  birthDate={birthDate}
                  onBirthDateChange={setBirthDate}
                  maxBirthDate={maxBirthDate}
                  address={address}
                  onAddressChange={setAddress}
                  phone={phone}
                  onPhoneChange={setPhone}
                  hasBathingExperience={hasBathingExperience}
                  onBathingChange={setHasBathingExperience}
                  hasGroomingExperience={hasGroomingExperience}
                  onGroomingChange={setHasGroomingExperience}
                  hearAboutUs={hearAboutUs}
                  onHearAboutUsChange={setHearAboutUs}
                  inviteCode={inviteCode}
                  onInviteCodeChange={setInviteCode}
                  showReferralFields={showReferralFields}
                />
              )}

              {step === "experience" && (
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Years of Grooming Experience
                    </p>
                    <div className="w-[348px]">
                      <CustomSelect
                        placeholder="Select"
                        value={yearsGroomingExperience}
                        displayValue={
                          yearsGroomingExperience
                            ? Number(yearsGroomingExperience) === 10
                              ? "10+ years"
                              : `${yearsGroomingExperience} year${Number(yearsGroomingExperience) > 1 ? "s" : ""}`
                            : ""
                        }
                        onValueChange={setYearsGroomingExperience}
                        leftElement={<Icon name="search" size={16} className="text-[#717182]" />}
                      >
                        {Array.from({ length: 10 }, (_, index) => {
                          const year = index + 1;
                          const label = year === 10 ? "10+ years" : `${year} year${year > 1 ? "s" : ""}`;
                          return (
                            <CustomSelectItem key={year} value={String(year)}>
                              {label}
                            </CustomSelectItem>
                          );
                        })}
                      </CustomSelect>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      What pets do you service?
                    </p>
                    <div className="flex gap-[16px]">
                      {["Dogs", "Cats"].map((pet) => (
                        <label key={pet} className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                          <input
                            type="checkbox"
                            className="size-[16px] accent-[#de6a07] cursor-pointer"
                            checked={servicePets.includes(pet)}
                            onChange={() => setServicePets((prev) => toggleValue(prev, pet))}
                          />
                          {pet}
                        </label>
                      ))}
                    </div>
                    <label className="flex flex-col gap-[8px] w-full">
                      <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                        Pet type
                      </span>
                      <input
                        type="text"
                        placeholder="Enter pet type"
                        value={petType}
                        onChange={(event) => setPetType(event.target.value)}
                        className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      What service do you provide?
                    </p>
                    <div className="flex gap-[16px]">
                      {["Pet groomer", "Pet bather"].map((service) => (
                        <label key={service} className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                          <input
                            type="checkbox"
                            className="size-[16px] accent-[#de6a07] cursor-pointer"
                            checked={providedServices.includes(service)}
                            onChange={() => setProvidedServices((prev) => toggleValue(prev, service))}
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Current work place
                    </p>
                    <div className="flex gap-[16px]">
                      {["In salon", "Mobile", "In-Home"].map((place) => (
                        <label key={place} className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                          <input
                            type="checkbox"
                            className="size-[16px] accent-[#de6a07] cursor-pointer"
                            checked={currentWorkPlaces.includes(place)}
                            onChange={() => setCurrentWorkPlaces((prev) => toggleValue(prev, place))}
                          />
                          {place}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Do you have a valid Canada driver's license?
                    </p>
                    <div className="flex gap-[20px]">
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                        <input
                          type="radio"
                          name="driver-license"
                          className="size-[16px] accent-[#de6a07] cursor-pointer"
                          checked={hasDriverLicense === true}
                          onChange={() => setHasDriverLicense(true)}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                        <input
                          type="radio"
                          name="driver-license"
                          className="size-[16px] accent-[#de6a07] cursor-pointer"
                          checked={hasDriverLicense === false}
                          onChange={() => setHasDriverLicense(false)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Do you have a van for grooming?
                    </p>
                    <div className="flex gap-[20px]">
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                        <input
                          type="radio"
                          name="grooming-van"
                          className="size-[16px] accent-[#de6a07] cursor-pointer"
                          checked={hasGroomingVan === true}
                          onChange={() => setHasGroomingVan(true)}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                        <input
                          type="radio"
                          name="grooming-van"
                          className="size-[16px] accent-[#de6a07] cursor-pointer"
                          checked={hasGroomingVan === false}
                          onChange={() => setHasGroomingVan(false)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Do you have any references?
                    </p>
                    <div className="flex gap-[20px]">
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                        <input
                          type="radio"
                          name="references"
                          className="size-[16px] accent-[#de6a07] cursor-pointer"
                          checked={hasReferences === true}
                          onChange={() => {
                            setHasReferences(true);
                            if (references.length === 0) {
                              setReferences([{ name: "", email: "" }]);
                            }
                          }}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-[8px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a] cursor-pointer">
                        <input
                          type="radio"
                          name="references"
                          className="size-[16px] accent-[#de6a07] cursor-pointer"
                          checked={hasReferences === false}
                          onChange={() => setHasReferences(false)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {hasReferences && (
                    <div className="flex flex-col gap-[12px]">
                      {references.map((ref, index) => (
                        <div key={index} className="flex gap-[20px] items-end">
                          <label className="flex flex-1 flex-col gap-[8px]">
                            <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                              Name
                            </span>
                            <input
                              type="text"
                              placeholder="Enter name"
                              value={ref.name}
                              onChange={(event) => updateReference(index, "name", event.target.value)}
                              className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                            />
                          </label>
                          <label className="flex flex-1 flex-col gap-[8px]">
                            <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                              Email
                            </span>
                            <input
                              type="email"
                              placeholder="Enter email"
                              value={ref.email}
                              onChange={(event) => updateReference(index, "email", event.target.value)}
                              className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                            />
                          </label>
                          <button
                            type="button"
                            className="h-[36px] rounded-[12px] border border-[#8b6357] px-[12px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#8b6357] shrink-0"
                            onClick={() => removeReference(index)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      {references.length < 5 && (
                        <button
                          type="button"
                          className="h-[28px] rounded-[12px] border border-[#8b6357] px-[12px] text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#8b6357] w-fit"
                          onClick={addReference}
                        >
                          + Add a reference
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === "portfolio" && (
                <div className="flex flex-col gap-[28px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                      Where did you learn bathing?
                    </p>
                    <textarea
                      value={portfolioMessage}
                      onChange={(event) => setPortfolioMessage(event.target.value)}
                      placeholder="Enter your answer"
                      className="min-h-[120px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] py-[12px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Upload your grooming table and environment (required)
                    </p>
                    <FileUpload
                      accept="image/*"
                      multiple={true}
                      maxSizeMB={10}
                      onChange={(files) =>
                        handleUploadFilesChange(files, setTableUploadItems, "table_or_env", setTableUploadErrorType)
                      }
                      onRemove={(index) => {
                        setTableUploadItems((prevItems) => {
                          const item = prevItems[index];
                          if (item?.previewUrl && item.previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(item.previewUrl);
                          }
                          return prevItems.filter((_, i) => i !== index);
                        });
                      }}
                      uploadItems={tableUploadItems}
                      buttonText="Click to upload"
                      fileTypeHint="JPG, JPEG, PNG less than 10MB"
                      showDragHint={true}
                      className="w-full"
                      errorType={tableUploadErrorType}
                      onError={(error) => setTableUploadErrorType(error.type)}
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Upload pictures of your work or certifications
                    </p>
                    <FileUpload
                      accept="image/*"
                      multiple={true}
                      maxSizeMB={10}
                      onChange={(files) =>
                        handleUploadFilesChange(files, setWorkUploadItems, "work_or_cert", setWorkUploadErrorType)
                      }
                      onRemove={(index) => {
                        setWorkUploadItems((prevItems) => {
                          const item = prevItems[index];
                          if (item?.previewUrl && item.previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(item.previewUrl);
                          }
                          return prevItems.filter((_, i) => i !== index);
                        });
                      }}
                      uploadItems={workUploadItems}
                      buttonText="Click to upload"
                      fileTypeHint="JPG, JPEG, PNG less than 10MB"
                      showDragHint={true}
                      className="w-full"
                      errorType={workUploadErrorType}
                      onError={(error) => setWorkUploadErrorType(error.type)}
                    />
                  </div>

                  <div className="flex flex-col gap-[8px] max-w-[348px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-black">
                      Showcase your working profile on
                    </p>
                    <CustomSelect
                      placeholder="Select your work place"
                      value={portfolioPlatform}
                      displayValue={portfolioPlatform}
                      onValueChange={setPortfolioPlatform}
                      leftElement={<Icon name="search" size={16} className="text-[#717182]" />}
                    >
                      {portfolioPlatforms.map((platform) => (
                        <CustomSelectItem key={platform} value={platform}>
                          {platform}
                        </CustomSelectItem>
                      ))}
                    </CustomSelect>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
                      Link
                    </p>
                    <input
                      type="text"
                      value={portfolioLink}
                      onChange={(event) => setPortfolioLink(event.target.value)}
                      placeholder="Enter your link"
                      className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] px-[16px] text-[12.25px] text-[#4a3c2a] placeholder:text-[#717182]"
                    />
                  </div>
                </div>
              )}

              {step === "accountAgreement" && (
                <div className="flex flex-col gap-[28px] items-start">
                <div className="flex flex-col gap-[16px] items-center w-full">
                    <div className="w-[348px]">
                      <PasswordInput
                        value={accountPassword}
                        onChange={setAccountPassword}
                        showPassword={showAccountPassword}
                        onTogglePassword={() => setShowAccountPassword((prev) => !prev)}
                        hasError={showPasswordError}
                        showValidation
                        label="Password"
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="w-[348px]">
                      <PasswordInput
                        value={accountPasswordConfirm}
                        onChange={setAccountPasswordConfirm}
                        showPassword={showAccountPasswordConfirm}
                        onTogglePassword={() => setShowAccountPasswordConfirm((prev) => !prev)}
                        hasError={showConfirmError}
                        label="Confirm password"
                        placeholder="Enter password"
                      />
                      {showConfirmError && (
                        <p className="font-['Comfortaa:Regular',sans-serif] text-[12px] leading-[17.5px] text-[#de1507] mt-[4px]">
                          Passwords do not match.
                        </p>
                      )}
                    </div>
                    <p className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#4a3c2a] w-[348px]">
                      By selecting Agree and continue, I agree to{" "}
                      <span className="text-[#de6a07] underline">Terms of Service</span>,{" "}
                      <span className="text-[#de6a07] underline">Payments Terms of Service</span>, and{" "}
                      <span className="text-[#de6a07] underline">Privacy Policy</span>.
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <OrangeButton
                      size="compact"
                      variant="secondary"
                      type="button"
                      className="w-[120px] h-[36px]"
                      onClick={() => setStep("portfolio")}
                    >
                      Back
                    </OrangeButton>
                    <OrangeButton
                      size="medium"
                      variant="primary"
                      type="button"
                      className="w-[200px]"
                      disabled={!isPasswordValid || !accountPasswordConfirm || showConfirmError}
                      onClick={() => setStep("accountVerify")}
                    >
                      <div className="flex items-center gap-[4px]">
                        <span className="text-[14px]">Agree and continue</span>
                        <Icon name="button-arrow" size={16} className="text-white" />
                      </div>
                    </OrangeButton>
                  </div>
                </div>
              )}

              {step === "accountVerify" && (
                <div className="flex flex-col items-center gap-[32px]">
                  <div className="flex flex-col items-center gap-[12px] w-[316px]">
                    <div className="text-center text-[#4a3c2a]">
                      <p className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px]">
                        Enter the <span className="font-['Comfortaa:Medium',sans-serif] font-medium">6-digital code sent to</span>
                      </p>
                      <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px]">
                        {email.trim() || loginEmail}
                      </p>
                    </div>
                    <p className="font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[17.5px] text-[#de6a07]">
                      {verificationCountdown > 0 ? (
                        <>
                          Expired in <span className="underline">{verificationCountdown}</span> secondes
                        </>
                      ) : (
                        "Code expired"
                      )}
                    </p>
                    <VerificationCodeInput
                      code={verificationCode}
                      onChange={setVerificationCode}
                      error={verificationError || undefined}
                    />
                    {verificationError && (
                      <p className="font-['Comfortaa:Regular',sans-serif] text-[12px] leading-[17.5px] text-[#de1507] text-center">
                        {verificationError}
                      </p>
                    )}
                    <div className="flex items-center justify-between w-full text-[#4a3c2a]">
                      <button
                        type="button"
                        className="text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a]"
                        onClick={() => setStep("portfolio")}
                      >
                        Change email
                      </button>
                      <button
                        type="button"
                        className="text-[12px] font-['Comfortaa:Bold',sans-serif] text-[#4a3c2a]"
                        onClick={handleResendVerificationCode}
                        disabled={verificationCountdown > 0 || isResendingCode}
                      >
                        {isResendingCode ? "Sending..." : "Resend code"}
                      </button>
                    </div>
                  </div>
                  <OrangeButton
                    size="medium"
                    variant="primary"
                    type="button"
                    className="w-[209px]"
                    onClick={handleSubmitApply}
                  >
                    <div className="flex items-center gap-[4px]">
                      <span className="text-[14px]">Submit</span>
                      <Icon name="button-arrow" size={16} className="text-white" />
                    </div>
                  </OrangeButton>
                </div>
              )}

              {!isAccountStep && (
                <>
                  <div className="flex items-center justify-between">
                    <OrangeButton
                      size="compact"
                      variant="secondary"
                      type="button"
                      className="w-[120px] h-[36px]"
                      onClick={() => {
                        if (step === "portfolio") {
                          setStep("experience");
                        } else if (step === "experience") {
                          setStep("identification");
                        } else {
                          setApplyStatus(null);
                        }
                      }}
                    >
                      Back
                    </OrangeButton>
                    <OrangeButton
                      size="medium"
                      variant="primary"
                      type="button"
                      className="w-[120px]"
                      loading={step === "portfolio" && !shouldShowAccountSteps && isSubmitting}
                      disabled={
                        step === "identification"
                          ? !isFormComplete
                          : step === "experience"
                            ? !isExperienceComplete
                            : isSubmitting
                      }
                      onClick={() => {
                        if (step === "identification") {
                          resetExperienceStep();
                          setStep("experience");
                        } else if (step === "experience") {
                          setStep("portfolio");
                        } else if (step === "portfolio") {
                          if (shouldShowAccountSteps) {
                            setStep(isEmailRegistered ? "accountVerify" : "accountAgreement");
                          } else {
                            handleSubmitApply();
                          }
                        }
                      }}
                    >
                      <div className="flex items-center gap-[4px]">
                        <span className="text-[14px]">
                          {step === "portfolio" && !shouldShowAccountSteps ? "Submit" : "Next"}
                        </span>
                        <Icon name="button-arrow" size={16} className="text-white" />
                      </div>
                    </OrangeButton>
                  </div>
                  {submitError && (
                    <span className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px] text-[#DE1507]">
                      {submitError}
                    </span>
                  )}
                </>
              )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <div />
    </LoginModal>
    </>
  );
}
