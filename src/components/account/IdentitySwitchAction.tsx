import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrangeButton } from "@/components/common";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthStore } from "@/components/auth/authStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ApplyGroomerModal from "@/components/groomer/ApplyGroomerModal";
import { getIdentitySwitchConfig, shouldNavigateIdentitySwitch, type IdentityMode } from "@/components/account/identitySwitchConfig";

interface IdentitySwitchActionProps {
  mode: IdentityMode;
  targetPath: string;
  className?: string;
  controlClassName?: string;
  labelClassName?: string;
  switchClassName?: string;
  labelFirst?: boolean;
}

export default function IdentitySwitchAction({
  mode,
  targetPath,
  className,
  controlClassName,
  labelClassName,
  switchClassName,
  labelFirst = false,
}: IdentitySwitchActionProps) {
  const navigate = useNavigate();
  const { userInfo, user, isResolvingUserInfo } = useAuthStore();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isLoggedIn = Boolean(userInfo?.email ?? user?.email);
  const isCustomerMode = mode === "customer";
  const canSwitchToGroomer = Boolean(userInfo?.is_groomer);
  const isWaitingForUserInfo = isCustomerMode && isResolvingUserInfo && !userInfo;
  const shouldShowApplyButton = isCustomerMode && !canSwitchToGroomer;
  const { switchId, switchLabel, switchAriaLabel, switchChecked } = getIdentitySwitchConfig({ mode });

  const handleApplyOpen = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsApplyOpen(true);
  };

  const handleSwitchChange = (checked: boolean) => {
    if (!shouldNavigateIdentitySwitch(mode, checked)) return;
    navigate(targetPath);
  };

  const switchControl = (
    <Switch
      id={switchId}
      checked={switchChecked}
      onCheckedChange={handleSwitchChange}
      className={switchClassName}
      aria-label={switchAriaLabel}
    />
  );

  const switchLabelNode = (
    <Label
      htmlFor={switchId}
      className={labelClassName}
    >
      {switchLabel}
    </Label>
  );

  return (
    <>
      <div className={className}>
        {isWaitingForUserInfo ? (
          <div className="h-8 w-[144px]" aria-hidden="true" />
        ) : shouldShowApplyButton ? (
          <OrangeButton
            variant="secondary"
            size="compact"
            showArrow={false}
            type="button"
            onClick={handleApplyOpen}
          >
            Apply as groomer
          </OrangeButton>
        ) : (
          <div className={controlClassName ?? "flex items-center gap-2 sm:gap-3"}>
            {labelFirst ? switchLabelNode : switchControl}
            {labelFirst ? switchControl : switchLabelNode}
          </div>
        )}
      </div>

      <ApplyGroomerModal
        open={isApplyOpen}
        onOpenChange={setIsApplyOpen}
      />
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setIsApplyOpen(true);
        }}
      >
        <div />
      </LoginModal>
    </>
  );
}
