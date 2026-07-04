import IdentitySwitchAction from "@/components/account/IdentitySwitchAction";

export default function PageHeader() {
  return (
    <div className="mb-5 flex w-full items-center gap-4">
      <h1 className="font-comfortaa text-[20px] font-bold text-[#4A3C2A]">
        My Account
      </h1>
      <IdentitySwitchAction
        mode="customer"
        targetPath="/groomer/account"
        className="ml-auto flex items-center"
        labelClassName="cursor-pointer font-comfortaa text-[14px] font-bold text-[#8B6357] sm:text-sm"
        switchClassName="cursor-pointer"
      />
    </div>
  );
}
