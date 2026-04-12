import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { OrangeButton } from "@/components/common";
import { Icon, type IconName } from "@/components/common/Icon";
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

type PerformanceTier = "gold" | "silver" | "premium";
const SERVICE_AREA_OPTIONS = [
  "Burnaby",
  "Coquitlam",
  "Delta",
  "New Westminster",
  "North Vancouver City",
  "Richmond",
  "Surrey",
  "Vancouver",
  "West Vancouver",
] as const;

const SERVICE_AREA_ORDER = new Map(SERVICE_AREA_OPTIONS.map((area, index) => [area.toLowerCase(), index]));

function createServiceRow(label: string, index: number): AccountListRow {
  return {
    id: label.toLowerCase().replace(/\s+/g, "-"),
    label,
    rightIcon: index === 0 ? undefined : "trash",
    rightIconColor: index === 0 ? undefined : "text-[#EF4444]",
    rightIconClassName:
      index === 0
        ? undefined
        : "transition-colors duration-150 hover:text-[#DC2626]",
    heightClassName: index === 0 ? "h-[48px]" : "h-[52px]",
    rowClickable: index !== 0,
  };
}

function sortServiceAreas(labels: string[]) {
  return [...labels].sort((left, right) => {
    const leftIndex = SERVICE_AREA_ORDER.get(left.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = SERVICE_AREA_ORDER.get(right.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

function createServiceRows(labels: string[]) {
  return sortServiceAreas(labels).map((label, index) => createServiceRow(label, index));
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
  const isMobile = useIsMobile();
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [serviceRows, setServiceRows] = useState<AccountListRow[]>(() => createServiceRows(["Vancouver", "Richmond"]));

  const showServiceAreaToast = (
    message: string,
    type: "check" | "warning",
  ) => {
    toast(message, {
      icon: <ToastStatusIcon type={type} />,
    });
  };

  const handleAddArea = (areaName: string) => {
    const exists = serviceRows.some((row) => row.label.toLowerCase() === areaName.toLowerCase());
    if (exists) {
      toast.error("This service area already exists");
      return;
    }

    setServiceRows((previous) => createServiceRows([...previous.map((row) => row.label), areaName]));
    showServiceAreaToast(`${areaName} added to service areas`, "check");
  };

  const handleEditArea = (areaName: string) => {
    if (!editingRowId) return;

    const exists = serviceRows.some(
      (row) => row.id !== editingRowId && row.label.toLowerCase() === areaName.toLowerCase(),
    );
    if (exists) {
      toast.error("This service area already exists");
      return;
    }

    setServiceRows((previous) =>
      createServiceRows(previous.map((row) => (row.id === editingRowId ? areaName : row.label))),
    );
    setEditingRowId(null);
    showServiceAreaToast(`${areaName} added to service areas`, "check");
  };

  const handleMobileToggleArea = (areaName: string) => {
    const isSelected = serviceRows.some((row) => row.label.toLowerCase() === areaName.toLowerCase());

    if (isSelected) {
      if (serviceRows.length === 1) {
        showServiceAreaToast("At least one service area is required", "warning");
        return;
      }

      setServiceRows((previous) =>
        createServiceRows(previous.filter((row) => row.label.toLowerCase() !== areaName.toLowerCase()).map((row) => row.label)),
      );
      showServiceAreaToast(`${areaName} removed from service areas`, "check");
      return;
    }

    setServiceRows((previous) => createServiceRows([...previous.map((row) => row.label), areaName]));
    showServiceAreaToast(`${areaName} added to service areas`, "check");
  };

  const handleRemoveArea = (row: AccountListRow) => {
    if (serviceRows.length === 1) {
      showServiceAreaToast("At least one service area is required", "warning");
      return;
    }

    setServiceRows((previous) =>
      createServiceRows(previous.filter((item) => item.id !== row.id).map((item) => item.label)),
    );
    showServiceAreaToast(`${row.label} removed from service areas`, "check");
  };

  const handleServiceRowClick = (row: AccountListRow) => {
    if (isMobile) {
      setEditingRowId(null);
      setIsAddAreaModalOpen(true);
      return;
    }

    if (row.rightIcon === "pencil") {
      setEditingRowId(row.id);
      setIsAddAreaModalOpen(true);
      return;
    }
    if (row.rightIcon !== "trash") return;

    handleRemoveArea(row);
  };

  const editingRow = serviceRows.find((row) => row.id === editingRowId) ?? null;
  const isEditMode = Boolean(editingRow);
  const selectableServiceAreas = SERVICE_AREA_OPTIONS.filter((option) => {
    const normalizedOption = option.toLowerCase();
    const isCurrentEditingValue = editingRow?.label.toLowerCase() === normalizedOption;

    if (isCurrentEditingValue) return true;

    return !serviceRows.some((row) => row.label.toLowerCase() === normalizedOption);
  });
  const performanceTier: PerformanceTier = "premium";

  const performanceConfig: Record<
    PerformanceTier,
    {
      badgeClassName: string;
      badgeTextClassName: string;
      badgeText: string;
      showStars: boolean;
      badgeIconName?: IconName;
      badgeIconClassName?: string;
      benefitTone: "gold" | "neutral";
      buttonText: string;
      benefits: Array<{ title: string; description: string }>;
    }
  > = {
    gold: {
      badgeClassName:
        "h-[26px] rounded-full bg-[linear-gradient(180deg,#FFF584_0%,#F0D65A_13.46%,#E0B730_26.92%,#C78A0E_75.96%,#BB7F12_87.98%,#C8A32B_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]",
      badgeTextClassName:
        "bg-[linear-gradient(168.31deg,#FFF7ED_0%,#FFFBEB_100%)] bg-clip-text font-comfortaa text-[12px] font-bold leading-[17.5px] text-transparent",
      badgeText: "Gold groomer",
      showStars: true,
      benefitTone: "gold",
      buttonText: "View your performance",
      benefits: [
        { title: "80% payout share", description: "Higher earnings per job" },
        { title: "Priority client matching", description: "Get bookings first in first 24 hours" },
        { title: "Free Liability Insurance", description: "Full coverage included" },
      ],
    },
    silver: {
      badgeClassName:
        "h-[26px] rounded-full bg-[linear-gradient(180deg,#EEECEC_0%,#EDECEC_16.83%,#DFDEDE_50%,#A4A4A4_88.46%,#B8B6B6_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]",
      badgeTextClassName: "font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#633479]",
      badgeText: "Silver groomer",
      showStars: false,
      badgeIconName: "star-3",
      badgeIconClassName: "size-[12px]",
      benefitTone: "neutral",
      buttonText: "View your performance",
      benefits: [
        { title: "70% payout share", description: "Higher earnings per job" },
        { title: "Priority client matching", description: "Get bookings first" },
      ],
    },
    premium: {
      badgeClassName:
        "h-[26px] rounded-full bg-[linear-gradient(180deg,#8B6357_0%,#4A2C55_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]",
      badgeTextClassName: "font-comfortaa text-[12px] font-bold leading-[17.5px] text-white",
      badgeText: "Premium groomer",
      showStars: false,
      benefitTone: "neutral",
      buttonText: "View your performance",
      benefits: [{ title: "60% payout share", description: "Higher earnings per job" }],
    },
  };

  const selectedPerformance = performanceConfig[performanceTier];

  return (
    <>
      <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-[36px] pt-2 lg:min-h-0 lg:max-w-[944px] lg:px-0 lg:pb-4 lg:pt-1">
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
            onActionClick={() => {
              setEditingRowId(null);
              setIsAddAreaModalOpen(true);
            }}
            actionButtonClassName={accountCenterTheme.actionInteractiveClassName}
            rows={serviceRows}
            onRowClick={handleServiceRowClick}
            onRightIconClick={handleRemoveArea}
          />

          <PayoutCard bankName="TD Bank Checking" bankMask="**** **** **** 5678" className="lg:h-[152px]" />

          <section className="rounded-[20px] border-[1.47px] border-[#4A2C55] bg-white px-5 pb-5 pt-[19px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] lg:h-[332px]">
            <div className="mb-[14px] flex items-center justify-between">
              <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Performance</h2>
              <div className={selectedPerformance.badgeClassName}>
                <div className="flex h-full items-center gap-2">
                  {selectedPerformance.showStars ? (
                    <div className="flex items-center gap-0.5">
                      <Icon name="star-2" className="size-[12px] text-white" />
                      <Icon name="star-2" className="size-[12px] text-white" />
                    </div>
                  ) : null}
                  {!selectedPerformance.showStars && selectedPerformance.badgeIconName ? (
                    <Icon
                      name={selectedPerformance.badgeIconName}
                      className={selectedPerformance.badgeIconClassName ?? "size-[12px]"}
                    />
                  ) : null}
                  <span className={selectedPerformance.badgeTextClassName}>{selectedPerformance.badgeText}</span>
                </div>
              </div>
            </div>
            <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">
              Maintain your excellent performance to keep these benefits:
            </p>
            <ul className="mt-3 space-y-3">
              {selectedPerformance.benefits.map((benefit) => (
                <PerformanceBenefitItem
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                  tone={selectedPerformance.benefitTone}
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
                {selectedPerformance.buttonText}
              </span>
            </OrangeButton>
          </section>
        </div>
      </div>
      <AddServiceAreaModal
        open={isAddAreaModalOpen}
        onOpenChange={(open) => {
          setIsAddAreaModalOpen(open);
          if (!open) setEditingRowId(null);
        }}
        initialValue={editingRow?.label ?? ""}
        options={isMobile ? [...SERVICE_AREA_OPTIONS] : selectableServiceAreas}
        selectedValues={serviceRows.map((row) => row.label)}
        onSubmit={isEditMode ? handleEditArea : handleAddArea}
        onMobileToggle={handleMobileToggleArea}
      />
    </>
  );
}
