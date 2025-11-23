import { Spinner } from "@/components/common";
import { Icon } from "@/components/common/Icon";

// Icon components
export function Icon1() {
  return (
    <div
      className="absolute left-0 overflow-clip size-[16px] top-[0.5px] pointer-events-none"
      data-name="Icon"
    >
      <Icon
        name="close-arrow"
        aria-label="Close"
        className="block size-full rotate-180"
      />
    </div>
  );
}

export function DialogContentElement() {
  return (
    <div
      className="absolute -left-px overflow-clip size-px top-[13px] pointer-events-none"
      data-name="DialogContent"
    >
      <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">
        Close
      </p>
    </div>
  );
}

export function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <Icon name="button-arrow" aria-label="Continue" className="block size-full text-white" />
    </div>
  );
}

// Button components
export function PrimitiveButton({
  onClose,
  onBack,
}: {
  onClose: () => void;
  onBack?: () => void;
}) {
  const handleClick = () => {
    console.log("Close button clicked");
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="block cursor-pointer opacity-70 overflow-visible relative shrink-0 size-[16px] hover:opacity-100 transition-all duration-200 hover:scale-110"
      data-name="Primitive.button"
      aria-label={onBack ? "Back" : "Close"}
      type="button"
    >
      {onBack ? (
        <Icon name="close-arrow" aria-label="Back" className="size-[16px] text-[#717182]" />
      ) : (
        <>
          <Icon1 />
          <DialogContentElement />
        </>
      )}
    </button>
  );
}

export function Title({
  onClose,
  onBack,
  title,
}: {
  onClose: () => void;
  onBack?: () => void;
  title: string;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="Title">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-0 relative w-full">
          <PrimitiveButton onClose={onClose} onBack={onBack} />
          <p className="basis-0 font-['Comfortaa:Regular',sans-serif] font-normal grow leading-[22.75px] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[14px] text-center">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PrimitiveDiv() {
  return (
    <div
      className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full"
      data-name="Primitive.div"
    />
  );
}

export function Frame68({
  onClose,
  onBack,
  title,
}: {
  onClose: () => void;
  onBack?: () => void;
  title: string;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-0 right-0 top-0">
      <Title onClose={onClose} onBack={onBack} title={title} />
      <PrimitiveDiv />
    </div>
  );
}

export function Label({ showRequired = false }: { showRequired?: boolean }) {
  if (!showRequired) {
    return (
      <div
        className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0"
        data-name="Label"
      >
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[14px] relative shrink-0 text-[#4a3c2a] text-[10px] text-nowrap whitespace-pre">
          {" "}
        </p>
      </div>
    );
  }
  return (
    <div
      className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0"
      data-name="Label"
    >
      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#4a3c2a] text-[10px] text-nowrap whitespace-pre">
        All fields are required.
      </p>
    </div>
  );
}

export function Frame70({ showRequired = false }: { showRequired?: boolean }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#633479] text-[16px] text-nowrap whitespace-pre">
        Welcome to Mutopia pet
      </p>
      <Label showRequired={showRequired} />
    </div>
  );
}

export function Content({ showRequired = false }: { showRequired?: boolean }) {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-[4px] items-start left-0 right-0 px-[24px] py-0 top-[52px]"
      data-name="Content"
    >
      <Frame70 showRequired={showRequired} />
    </div>
  );
}

export function WelcomeToMutopiaPet({
  onClose,
  onBack,
  title = "Log in or sign up",
  showRequired = false,
}: {
  onClose: () => void;
  onBack?: () => void;
  title?: string;
  showRequired?: boolean;
}) {
  return (
    <div
      className="h-[72px] relative shrink-0 w-full"
      data-name="Welcome to Mutopia pet"
    >
      <Frame68 onClose={onClose} onBack={onBack} title={title} />
      <Content showRequired={showRequired} />
    </div>
  );
}

// Alert components
export function Alert({ type = "error" }: { type?: "error" | "success" }) {
  if (type === "success") {
    return (
      <div className="relative shrink-0 size-[14px]" data-name="Alert">
        <Icon
          name="alert-success"
          aria-label="Success"
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alert">
      <Icon
        name="alert-error"
        aria-label="Error"
        className="absolute inset-0 size-full"
      />
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alert />
      <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px] text-nowrap whitespace-pre">
        {message}
      </p>
    </div>
  );
}

// Button components
export function Frame2({
  isLoading,
  text = "Continue",
}: {
  isLoading?: boolean;
  text?: string;
}) {
  if (isLoading) {
    return (
      <div className="relative shrink-0">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[4px] items-center justify-center relative">
          <Spinner size="small" color="white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
          {text}
        </p>
        <Icon2 />
      </div>
    </div>
  );
}

export function ButtonMediumPrincipalOrange({
  onClick,
  disabled,
  isLoading,
  text,
}: {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  text?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-[36px] relative rounded-[32px] shrink-0 w-full transition-colors ${
        disabled
          ? "bg-[#de6a07]/50 cursor-not-allowed"
          : "bg-[#de6a07] hover:bg-[#c55f06] cursor-pointer"
      }`}
      data-name="Button medium principal_orange"
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[28px] py-[16px] relative w-full">
          <Frame2 isLoading={isLoading} text={text} />
        </div>
      </div>
    </button>
  );
}

