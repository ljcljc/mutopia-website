import { useEffect, useRef, useState } from "react";
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
 * 格式化日期显示（YYYY-MM-DD）
 */
function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
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

function PetCard({ pet, onSelect }: { pet: PetOut; onSelect: (petId: number) => void }) {
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
    <div
      role="button"
      tabIndex={0}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-[14px] transition-colors duration-200 hover:bg-[#F9FAFB]"
      onClick={() => onSelect(pet.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(pet.id)}
    >
      <div className="flex w-full gap-4">
        <div className="size-[56px] rounded-full overflow-hidden border border-[#E5E7EB] bg-[#E5E7EB] flex items-center justify-center">
          {avatarUrl ? (
            <img alt={pet.name} className="size-full object-cover object-center" src={avatarUrl} />
          ) : (
            <Icon name="pet" className="size-8 text-[#99A1AF]" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-comfortaa font-bold text-[16px] leading-[28px] text-[#DE6A07]">
            {pet.name}
          </p>
          <p className="font-comfortaa font-bold text-[12px] leading-[18px] text-[#4A3C2A]">
            {birthday}
          </p>
          <div className="mt-[10px] flex flex-col">
            <p className="font-comfortaa font-normal text-[12px] leading-[18px] text-[#4A3C2A]">
              {weight}
            </p>
            {behavior !== "-" && (
              <p className="font-comfortaa font-normal text-[12px] leading-[18px] text-[#4A3C2A]">
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

function MemorializedPetCard({ pet, onSelect }: { pet: PetOut; onSelect: (petId: number) => void }) {
  const avatarUrl = pet.primary_photo
    ? buildImageUrl(pet.primary_photo)
    : pet.photos && pet.photos.length > 0
    ? buildImageUrl(pet.photos[0])
    : "";

  const birthday = formatBirthday(pet.birthday);
  const memorializedAt = formatDate(pet.memorialized_at);

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-[14px] transition-colors duration-200 hover:bg-[#F9FAFB]"
      onClick={() => onSelect(pet.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(pet.id)}
    >
      <div className="flex w-full gap-4">
        <div className="size-[56px] rounded-full overflow-hidden border border-[#E5E7EB] bg-[#E5E7EB] flex items-center justify-center">
          {avatarUrl ? (
            <img alt={pet.name} className="size-full object-cover object-center" src={avatarUrl} />
          ) : (
            <Icon name="pet" className="size-8 text-[#99A1AF]" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-comfortaa font-bold text-[16px] leading-[28px] text-[#DE6A07]">
            {pet.name}
          </p>
          <p className="font-comfortaa font-bold text-[12px] leading-[18px] text-[#4A3C2A]">
            {birthday} - {memorializedAt}
          </p>
        </div>
      </div>
      <Icon name="nav-next" className="text-[#99A1AF]" size={14} />
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[rgba(0,0,0,0.12)]" />
    </div>
  );
}

export default function DashboardMyPetsCard() {
  const navigate = useNavigate();
  const { pets, memorializedPets, isLoadingPets, isLoadingMemorializedPets, fetchPets, fetchMemorializedPets } =
    useAccountStore();
  const hasFetchedRef = useRef(false);
  const [isMemorializedOpen, setIsMemorializedOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(min-width: 640px)");
    const sync = () => setIsMemorializedOpen(media.matches);
    sync();
    if (media.addEventListener) {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  // 组件挂载时加载数据（只执行一次）
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPets();
    fetchMemorializedPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl bg-white p-5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div className="mb-6 flex items-center justify-between">
        <p className="font-comfortaa font-medium text-[16px] leading-[24px] text-[#4A3C2A]">
          My pets
        </p>
        <button
          type="button"
          onClick={() => navigate("/account/pets/new", { state: { from: "dashboard" } })}
          className="flex cursor-pointer items-center gap-[6px] font-comfortaa text-[12.25px] leading-[17.5px] font-bold text-[#8B6357]"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onSelect={(petId) => navigate(`/account/pets?pet=${petId}`)}
            />
          ))}
        </div>
      )}

      {isLoadingMemorializedPets ? (
        <div className="text-[#4A3C2A] text-sm py-4">Loading memorialized pets...</div>
      ) : memorializedPets.length > 0 ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setIsMemorializedOpen((value) => !value)}
            className="mb-3 flex w-full items-center justify-between font-comfortaa text-[14px] leading-[21px] font-medium text-[#4A3C2A]"
            aria-expanded={isMemorializedOpen}
          >
            <span>Memorialized</span>
            <Icon
              name="chevron-down"
              size={16}
              className={`text-[#8B6357] transition-transform duration-200 ${isMemorializedOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>
          {isMemorializedOpen ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {memorializedPets.map((pet) => (
                <MemorializedPetCard
                  key={`memorialized-${pet.id}`}
                  pet={pet}
                  onSelect={(petId) => navigate(`/account/pets/memorialized?pet=${petId}`)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
