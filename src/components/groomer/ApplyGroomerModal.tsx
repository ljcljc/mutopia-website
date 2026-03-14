import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, CustomSelect, CustomSelectItem, FileUpload, type FileUploadItem } from "@/components/common";
import { buildImageUrl, getCurrentUser, submitGroomerApply, uploadGroomerApplyImage } from "@/lib/api";
import { DatePicker } from "@/components/common/DatePicker";
import { useAuthStore } from "@/components/auth/authStore";

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
  hearAboutUs: string;
  onHearAboutUsChange: (value: string) => void;
}

const HEAR_ABOUT_US_OPTIONS = [
  "Social Media",
  "Advertisements",
  "Mutopia website",
  "Online reviews",
  "AI Chat",
];

function SearchableSelectField({
  label,
  placeholder,
  value,
  onValueChange,
  options,
}: {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery(value);
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (value) {
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex w-full max-w-[348px] flex-col gap-[8px]">
      <span className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] text-[#4a3c2a]">
        {label}
      </span>
      <div className="relative w-full" ref={dropdownRef}>
        <div className="h-[36px] w-full rounded-[12px] border border-[#e5e7eb] bg-white transition-colors hover:border-[#633479]">
          <div className="flex h-full items-center px-[12px] py-[4px]">
            <div className="relative shrink-0 size-[16px]">
              <Icon
                name="search"
                aria-label="Search"
                className="block size-full text-[#717182]"
              />
            </div>
            <input
              type="text"
              value={isOpen ? query : value}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="ml-[8px] flex-1 bg-transparent text-[12.25px] text-[#4a3c2a] outline-none placeholder:text-[#717182]"
            />
            <button
              type="button"
              className="ml-[8px] flex shrink-0 items-center justify-center"
              onClick={() => {
                setQuery(value);
                setIsOpen((current) => !current);
              }}
              aria-label="Toggle options"
            >
              <Icon
                name="chevron-down"
                aria-label="Dropdown"
                className={`block size-[16px] text-[#717182] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-[120] mt-1 max-h-[200px] w-full overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-white opacity-100 shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`w-full bg-white px-[12px] py-[10px] text-left text-[12.25px] text-[#4a3c2a] transition-colors hover:bg-gray-50 ${
                    value === option ? "bg-[#fff7ed]" : ""
                  }`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => {
                    onValueChange(option);
                    setQuery(option);
                    setIsOpen(false);
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-[12px] py-[10px] text-[12.25px] text-[#717182]">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
  hearAboutUs,
  onHearAboutUsChange,
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

          <SearchableSelectField
            label="How did you hear about us?"
            placeholder="Invited by a friend"
            value={hearAboutUs}
            onValueChange={onHearAboutUsChange}
            options={HEAR_ABOUT_US_OPTIONS}
          />
        </>
      )}
    </div>
  );
}

export default function ApplyGroomerModal({ open, onOpenChange }: ApplyGroomerModalProps) {
  const [sinAnswer, setSinAnswer] = useState<"yes" | "no" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState("");
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
  const userInfo = useAuthStore((state) => state.userInfo);
  const user = useAuthStore((state) => state.user);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const loginEmail = userInfo?.email ?? user?.email ?? "";
  const isAuthenticated = Boolean(loginEmail);
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
    return true;
  })();
  const isExperienceComplete = (() => {
    if (!yearsGroomingExperience) return false;
    if (servicePets.length === 0) return false;
    if (servicePets.includes("Others") && !petType.trim()) return false;
    if (providedServices.length === 0) return false;
    if (currentWorkPlaces.length === 0) return false;
    if (hasDriverLicense === null) return false;
    if (hasGroomingVan === null) return false;
    if (hasReferences === null) return false;
    if (hasReferences && references.some((ref) => !ref.name.trim() || !ref.email.trim())) return false;
    return true;
  })();
  const [step, setStep] = useState<"identification" | "experience" | "portfolio" | "submitted">(
    "identification"
  );
  const isSubmittedStep = step === "submitted";
  const isExperienceStep = step === "experience" || step === "portfolio" || isSubmittedStep;
  const [portfolioMessage, setPortfolioMessage] = useState("");
  const [portfolioPlatform, setPortfolioPlatform] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tableUploadItems, setTableUploadItems] = useState<FileUploadItem[]>([]);
  const [workUploadItems, setWorkUploadItems] = useState<FileUploadItem[]>([]);
  const [tableUploadErrorType, setTableUploadErrorType] = useState<"size" | "format" | null>(null);
  const [workUploadErrorType, setWorkUploadErrorType] = useState<"size" | "format" | null>(null);
  const portfolioPlatforms = ["Instagram", "Facebook", "TikTok", "YouTube", "Other"];
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const toggleValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  const greetingName =
    userInfo?.first_name ||
    user?.name?.split(" ")[0] ||
    (loginEmail ? loginEmail.split("@")[0] : "");

  const resetAllFields = () => {
    setSinAnswer(null);
    setFirstName("");
    setLastName("");
    setAddress("");
    setPhone("");
    setHearAboutUs("");
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
  }, [open]);

  useEffect(() => {
    if (!open || isAuthenticated) return;
    onOpenChange(false);
  }, [open, isAuthenticated, onOpenChange]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;

    setFirstName(userInfo?.first_name ?? "");
    setLastName(userInfo?.last_name ?? "");
    setBirthDate(userInfo?.birthday ?? "");
    setAddress(userInfo?.address ?? "");
    setPhone(userInfo?.phone ?? "");
  }, [
    open,
    isAuthenticated,
    loginEmail,
    userInfo?.first_name,
    userInfo?.last_name,
    userInfo?.birthday,
    userInfo?.address,
    userInfo?.phone,
  ]);

  useEffect(() => {
    if (!contentScrollRef.current) return;
    contentScrollRef.current.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

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
              if (pet === "Others") return "other";
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
        email: loginEmail || null,
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
        has_bathing_experience: false,
        has_grooming_experience: true,
        hear_about_us: hearAboutUs.trim() || "",
      };
      await submitGroomerApply(payload);
      if (isAuthenticated) {
        try {
          const updatedUserInfo = await getCurrentUser();
          setUserInfo(updatedUserInfo);
        } catch (fetchError) {
          console.error("[ApplyGroomer] failed to refresh user info:", fetchError);
        }
      }
      setStep("submitted");
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
          uploadGroomerApplyImage(file, category, loginEmail || null, (progress) => {
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
                {`Hi ${greetingName || "there"}, welcome to join our grooming team`}
              </p>
            </div>
            <div className="px-[24px] flex items-center justify-between text-[10px] leading-[12px]">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4c4c4c]">
                {step === "portfolio"
                  ? "Complete the application in about 3 minute"
                  : step === "experience"
                    ? "Complete the application in about 5 minutes"
                    : "Fill out the application in about 5 minutes"}
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">
                {step === "portfolio" ? "Upload pictures or paste the link." : "All fields are required."}
              </p>
            </div>
          </div>
          </div>

          <div ref={contentScrollRef} className="flex-1 overflow-y-auto pb-[32px]">
            <div className="px-[24px] flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[12px]">
                  <div className="flex items-start justify-between">
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
                  </div>
                  <div className="h-[7px] w-full rounded-full bg-[rgba(222,106,7,0.2)] overflow-hidden">
                    <div
                      className={`h-full bg-[#de6a07] ${
                        isSubmittedStep
                          ? "w-full"
                          : isExperienceStep
                            ? "w-full"
                            : "w-2/3"
                      }`}
                    />
                  </div>
                </div>

              {step === "identification" && (
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
                  hearAboutUs={hearAboutUs}
                  onHearAboutUsChange={setHearAboutUs}
                />
              )}

              {step === "submitted" && (
                <div className="flex flex-col gap-[20px]">
                  <div className="rounded-[8px] border border-[#98d455] bg-[#f0fbdf] px-[12px] py-[10px]">
                    <div className="flex items-start gap-[8px]">
                      <Icon name="check-green" size={16} className="mt-[1px] shrink-0 text-[#6da326]" />
                      <p className="font-['Comfortaa:Regular',sans-serif] text-[12px] leading-[17.5px] text-[#669a29]">
                        We have received your application for the Groomer position. We are reviewing your application and will be in touch soon regarding next steps.
                      </p>
                    </div>
                  </div>
                </div>
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
                      {["Dogs", "Cats", "Others"].map((pet) => (
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
                    {servicePets.includes("Others") && (
                      <label className="flex flex-col gap-[8px] w-full max-w-[348px]">
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
                    )}
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

              {!isAccountStep && !isSubmittedStep && (
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
                          onOpenChange(false);
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
