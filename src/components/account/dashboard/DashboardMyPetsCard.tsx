import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "../accountStore";
import { buildImageUrl } from "@/lib/api";
import type { PetOut } from "@/lib/api";

/**
 * 格式化生日显示（YYYY-MM-DD -> YYYY-MM）
 */
function formatBirthday(birthday?: string | null): string {
  if (!birthday) return "-";
  try {
    const date = new Date(birthday);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  } catch {
    // 如果已经是 YYYY-MM 格式，直接返回
    if (birthday.match(/^\d{4}-\d{2}$/)) {
      return birthday;
    }
    return birthday;
  }
}

/**
 * 格式化重量显示
 */
function formatWeight(weightValue?: number | string | null, weightUnit?: string | null): string {
  if (!weightValue) return "-";
  const unit = weightUnit || "lbs";
  return `${weightValue} ${unit}`;
}

/**
 * 格式化行为/性格显示
 */
function formatBehavior(behavior?: string | null): string {
  if (!behavior) return "-";
  // 将下划线分隔的字符串转换为首字母大写的单词
  return behavior
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function PetCard({ pet }: { pet: PetOut }) {
  // 使用主照片，如果没有则使用第一张照片，都没有则使用占位符
  const avatarUrl = pet.primary_photo
    ? buildImageUrl(pet.primary_photo)
    : pet.photos && pet.photos.length > 0
    ? buildImageUrl(pet.photos[0])
    : "";

  const birthday = formatBirthday(pet.birthday);
  const weight = formatWeight(pet.weight_value, pet.weight_unit);
  const behavior = formatBehavior(pet.behavior);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-[14px] flex items-center gap-[16px] w-full cursor-pointer transition-colors duration-200 hover:bg-[#F9FAFB]">
      <div className="flex items-center w-full gap-[16px]">
        <div className="size-[56px] rounded-full overflow-hidden border border-[#E5E7EB] bg-[#E5E7EB] flex items-center justify-center">
          {avatarUrl ? (
            <img alt={pet.name} className="size-full object-cover object-center" src={avatarUrl} />
          ) : (
            <Icon name="pet" className="size-8 text-[#99A1AF]" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[16px] leading-[28px] text-[#DE6A07]">
            {pet.name}
          </p>
          <p className="font-['Comfortaa:Regular',sans-serif] font-bold text-[12px] leading-[18px] text-[#4A3C2A]">
            {birthday}
          </p>
          <div className="flex flex-col mt-[10px]">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12px] leading-[18px] text-[#4A3C2A]">
              {weight}
            </p>
            {behavior !== "-" && (
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12px] leading-[18px] text-[#4A3C2A]">
                {behavior}
              </p>
            )}
          </div>
        </div>
      </div>
      <Icon name="nav-next" className="text-[#99A1AF]" size={14} />
    </div>
  );
}

export default function DashboardMyPetsCard() {
  const navigate = useNavigate();
  const { pets, isLoadingPets, fetchPets } = useAccountStore();
  const hasFetchedRef = useRef(false);

  // 组件挂载时加载数据（只执行一次）
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
      <div className="flex items-center justify-between mb-[24px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[16px] leading-[24px] text-[#4A3C2A]">
          My pets
        </p>
        <button
          type="button"
          onClick={() => navigate("/account/pets/new")}
          className="flex items-center gap-[6px] font-['Comfortaa:Regular',sans-serif] font-bold text-[12.25px] leading-[17.5px] text-[#8B6357] cursor-pointer"
        >
          <Icon name="add-2" className="w-5 h-5" />
          Add pet
        </button>
      </div>
      {isLoadingPets ? (
        <div className="text-[#4A3C2A] text-sm py-4">Loading pets...</div>
      ) : pets.length === 0 ? (
        <div className="text-[#4A3C2A] text-sm py-4">No pets yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
