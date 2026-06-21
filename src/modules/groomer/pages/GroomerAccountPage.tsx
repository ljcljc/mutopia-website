import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useIsMobile } from "@/components/ui/use-mobile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PersonalInfoCard from "@/components/account/PersonalInfoCard";
import AddServiceAreaModal from "@/modules/groomer/components/AddServiceAreaModal";
import {
  PayoutCard,
  PerformanceBenefitItem,
  SimpleListCard,
  accountCenterTheme,
  type AccountListRow,
} from "@/components/account-center";
import {
  createGroomerPayoutLoginLink,
  createGroomerPayoutOnboardingLink,
  getGroomerServiceAreas,
  getServiceAreaProvinces,
  getServiceAreas,
  saveGroomerServiceAreas,
  type GroomerServiceAreaOut,
  type ProvinceOut,
  type ServiceAreaOut,
} from "@/lib/api";
import { useGroomerPerformance } from "@/modules/groomer/hooks/useGroomerPerformance";
import { useGroomerPayoutSummary } from "@/modules/groomer/hooks/useGroomerPayoutSummary";
import {
  getGroomerPerformancePresentation,
} from "@/modules/groomer/utils/performance";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getString(source: Record<string, unknown>, key: string, fallback = ""): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function createServiceRow(label: string, index: number): AccountListRow {
  return {
    id: label.toLowerCase().replace(/\s+/g, "-"),
    label,
    heightClassName: index === 0 ? "h-[48px]" : "h-[52px]",
    rowClickable: false,
  };
}

function createServiceRows(labels: string[]) {
  return [...labels]
    .sort((left, right) => left.localeCompare(right))
    .map((label, index) => createServiceRow(label, index));
}

function getPerformanceTagText(level: string, fallbackLabel: string) {
  if (level === "level_a") return "Level A (85-100)";
  if (level === "level_b") return "Level B (70-84)";
  if (level === "level_c") return "Level C (0-69)";
  return fallbackLabel;
}

function ToastStatusIcon({ type }: { type: "check" | "warning" }) {
  return (
    <span className="flex size-4 items-center justify-center rounded-full bg-[#19181A]">
      {type === "check" ? (
        <Icon name="check" className="size-2.5 text-white" />
      ) : (
        <span className="font-sans text-[10px] font-bold leading-none text-white">!</span>
      )}
    </span>
  );
}

export default function GroomerAccountPage() {
  const navigate = useNavigate();
  useIsMobile();
  const hasShownAccountLoadError = useRef(false);
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSavingAreas, setIsSavingAreas] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceOut[]>([]);
  const [serviceAreaOptions, setServiceAreaOptions] = useState<ServiceAreaOut[]>([]);
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<GroomerServiceAreaOut[]>([]);
  const showAccountLoadError = useCallback(() => {
    if (hasShownAccountLoadError.current) return;
    hasShownAccountLoadError.current = true;
    toast.error("Failed to load account data");
  }, []);
  const { performance, isLoading: isLoadingPerformance, error: performanceError } = useGroomerPerformance();
  const { payout, isLoading: isLoadingPayout, error: payoutError } = useGroomerPayoutSummary();
  const [isOpeningPayoutSettings, setIsOpeningPayoutSettings] = useState(false);

  const showServiceAreaToast = (
    message: string,
    type: "check" | "warning",
  ) => {
    toast(message, {
      icon: <ToastStatusIcon type={type} />,
    });
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoadingAreas(true);
      try {
        const [provinceList, areaList, selectedList] = await Promise.all([
          getServiceAreaProvinces(),
          getServiceAreas(),
          getGroomerServiceAreas(),
        ]);
        if (cancelled) return;
        setProvinces(provinceList);
        setServiceAreaOptions(areaList);
        setSelectedServiceAreas(selectedList);
      } catch (error) {
        console.error("Failed to load groomer service areas:", error);
        showAccountLoadError();
      } finally {
        if (!cancelled) {
          setIsLoadingAreas(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [showAccountLoadError]);

  useEffect(() => {
    if (performanceError || payoutError) {
      showAccountLoadError();
    }
  }, [performanceError, payoutError, showAccountLoadError]);

  const serviceRows: AccountListRow[] = useMemo(
    () => createServiceRows(selectedServiceAreas.map((item) => item.label)),
    [selectedServiceAreas],
  );

  const handleSaveAreas = async (serviceAreaIds: number[]) => {
    setIsSavingAreas(true);
    try {
      await saveGroomerServiceAreas({ service_area_ids: serviceAreaIds });
      const selectedList = await getGroomerServiceAreas();
      setSelectedServiceAreas(selectedList);
      setIsAddAreaModalOpen(false);
      showServiceAreaToast("Service areas updated", "check");
    } catch (error) {
      console.error("Failed to save groomer service areas:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save service areas");
    } finally {
      setIsSavingAreas(false);
    }
  };

  const selectedPerformance = performance
    ? getGroomerPerformancePresentation(
        performance.level,
        performance.levelLabel,
        performance.serviceFeeRate,
      )
    : null;

  const handleOpenPayoutSettings = async () => {
    if (isOpeningPayoutSettings) return;

    setIsOpeningPayoutSettings(true);
    try {
      const response = payout.onboardingCompleted
        ? await createGroomerPayoutLoginLink()
        : await createGroomerPayoutOnboardingLink();
      const url = getString(asRecord(response), "url");
      if (!url) throw new Error("Failed to load payout settings");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open payout settings:", error);
      toast.error(error instanceof Error ? error.message : "Failed to open payout settings");
    } finally {
      setIsOpeningPayoutSettings(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(36*var(--px393))] pt-[calc(8*var(--px393))] sm:mx-auto sm:max-w-[944px] sm:px-6 sm:pb-8 sm:pt-2 lg:min-h-0 lg:px-6 lg:pb-4 lg:pt-1">
        <div className="mb-4 flex items-center justify-between sm:mb-5">
          <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">My account</h1>
          <div className="flex items-center gap-3">
            <Label
              htmlFor="groomer-pet-owner-toggle"
              className="cursor-pointer font-comfortaa text-[14px] font-bold leading-[22px] text-[#FFF7ED]"
            >
              Pet owner
            </Label>
            <Switch
              id="groomer-pet-owner-toggle"
              className="data-[state=checked]:border-[#DE6A07] data-[state=checked]:bg-[#DE6A07]"
              checked
              onCheckedChange={(checked) => {
                if (!checked) navigate("/account/profile");
              }}
              aria-label="Switch back to pet owner account"
            />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <PersonalInfoCard mode="groomer" />

          <SimpleListCard
            title="Service areas"
            titleIcon="location"
            actionText="Modify"
            actionIcon="pencil"
            onActionClick={() => setIsAddAreaModalOpen(true)}
            actionButtonClassName={accountCenterTheme.actionInteractiveClassName}
            rows={serviceRows}
            emptyText={isLoadingAreas ? "Loading service areas..." : "No service areas saved yet."}
          />

          <PayoutCard
            bankName={payout.bankName}
            bankMask={payout.bankMask}
            statusText={isLoadingPayout ? "Loading..." : payout.statusText}
            actionText={payout.onboardingCompleted ? "Manage" : "Setup"}
            onActionClick={handleOpenPayoutSettings}
            actionDisabled={isLoadingPayout || isOpeningPayoutSettings}
            className="lg:h-[152px]"
          />

          <section className="rounded-[20px] border-[1.47px] border-[#4A2C55] bg-white px-5 pb-5 pt-[19px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] lg:h-[332px]">
            <div className="mb-[14px] flex items-center justify-between">
              <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Performance</h2>
              {selectedPerformance ? (
                <div className={selectedPerformance.badgeClassName}>
                  <div className="flex h-full items-center">
                    <span className={selectedPerformance.badgeTextClassName}>
                      {getPerformanceTagText(performance?.level ?? "", selectedPerformance.badgeText)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="inline-flex h-[26px] items-center rounded-full bg-[#F5F1EC] px-3">
                  <span className="font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357]">Loading...</span>
                </div>
              )}
            </div>
            <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">
              {isLoadingPerformance ? "Loading your performance benefits..." : "Maintain your performance to keep these benefits:"}
            </p>
            <ul className="mt-3 space-y-3">
              {(selectedPerformance?.benefits ?? []).map((benefit) => (
                <PerformanceBenefitItem
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                  tone={selectedPerformance?.benefitTone ?? "neutral"}
                />
              ))}
            </ul>
            <OrangeButton
              type="button"
              variant="outline"
              size="medium"
              className="mt-6 w-full border-[#633479]! text-[#633479]! shadow-[0_4px_12px_0_rgba(74,44,85,0.30)] hover:bg-[rgba(99,52,121,0.12)]! active:!bg-[rgba(99,52,121,0.12)] focus-visible:!bg-[rgba(99,52,121,0.12)] focus-visible:!border-[#633479] active:!border-[#633479] lg:w-[247px]"
              onClick={() => navigate("/groomer/account/performance")}
            >
              <span className="text-center font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#633479]">
                View your performance
              </span>
            </OrangeButton>
          </section>
        </div>
      </div>
      <AddServiceAreaModal
        open={isAddAreaModalOpen}
        onOpenChange={setIsAddAreaModalOpen}
        provinces={provinces}
        areaOptions={serviceAreaOptions}
        selectedAreaIds={selectedServiceAreas.map((item) => item.service_area_id)}
        isSaving={isSavingAreas}
        onSave={handleSaveAreas}
      />
    </>
  );
}
