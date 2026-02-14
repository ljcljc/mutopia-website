import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAccountStore } from "@/components/account/accountStore";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common/OrangeButton";
import { buildImageUrl, deletePet } from "@/lib/api";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

function formatBirthday(birthday?: string | null): string {
  if (!birthday) return "-";
  try {
    const date = new Date(birthday);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  } catch {
    if (birthday.match(/^\d{4}-\d{2}$/)) {
      return birthday;
    }
    return birthday;
  }
}

function formatWeight(weightValue?: number | string | null, weightUnit?: string | null): string {
  if (!weightValue) return "-";
  const unit = weightUnit || "lbs";
  return `${weightValue} ${unit}`;
}

function formatBehavior(behavior?: string | null): string {
  if (!behavior) return "-";
  return behavior
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatLabel(value?: string | null): string {
  if (!value) return "-";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ReadonlyPhotoGrid({ urls }: { urls: string[] }) {
  if (!urls.length) {
    return (
      <div className="text-[#4A3C2A] text-sm py-2">No photos yet.</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-[12px]">
      {urls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="h-[80px] w-[96px] overflow-hidden rounded-[8px] border border-neutral-200 bg-neutral-100"
        >
          <img
            alt="Pet"
            className="size-full object-cover object-center"
            src={buildImageUrl(url)}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default function MemorializedPets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { memorializedPets, isLoadingMemorializedPets, fetchMemorializedPets } = useAccountStore();
  const [activePetId, setActivePetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const petIdFromUrl = searchParams.get("pet");

  useEffect(() => {
    fetchMemorializedPets();
  }, [fetchMemorializedPets]);

  useEffect(() => {
    if (memorializedPets.length === 0) {
      setActivePetId(null);
      return;
    }
    if (petIdFromUrl) {
      const id = Number.parseInt(petIdFromUrl, 10);
      if (Number.isFinite(id) && memorializedPets.some((p) => p.id === id)) {
        setActivePetId(id);
        return;
      }
    }
    if (activePetId === null) {
      setActivePetId(memorializedPets[0].id);
    } else if (!memorializedPets.some((pet) => pet.id === activePetId)) {
      setActivePetId(memorializedPets[0].id);
    }
  }, [memorializedPets, petIdFromUrl, activePetId]);

  const handleSelectPet = (id: number) => {
    setActivePetId(id);
    if (petIdFromUrl && Number.parseInt(petIdFromUrl, 10) !== id) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("pet");
        return next;
      });
    }
  };

  const activePet = useMemo(
    () => memorializedPets.find((pet) => pet.id === activePetId) || null,
    [memorializedPets, activePetId]
  );

  const handleDeletePet = async () => {
    if (!activePet) return;
    const deletedPetId = activePet.id;
    const deletedPetName = activePet.name;
    setIsDeleting(true);
    try {
      await deletePet(deletedPetId);
      toast.success(`${deletedPetName} has been deleted successfully.`);
      await fetchMemorializedPets();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete pet:", error);
      toast.error("Failed to delete pet. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="w-full max-w-[944px] mx-auto px-6 flex-1">
      <div className="flex flex-col gap-[8px] mb-[-2px]">
            <div className="flex justify-between">
            <nav
            aria-label="Breadcrumb"
            className="font-['Comfortaa:Bold',sans-serif] font-bold text-[20px] text-[#4A3C2A] flex gap-[6px]"
          >
            <Link to="/account/pets" className="hover:text-[#DE6A07] transition-colors">
            My pets
            </Link>
            <span aria-hidden="true">{" > "}</span>
            <span>Memorialized pets</span>
          </nav>
              <div className="flex items-center gap-[8px] overflow-x-auto max-w-[520px] pl-[2px] pr-[2px]">
                {memorializedPets.map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => handleSelectPet(pet.id)}
                      className="bg-white border-2 border-[rgba(0,0,0,0.12)] rounded-tl-[14px] rounded-tr-[14px] px-[16px] py-[8px] min-w-[120px] flex items-center gap-[4px] shrink-0 text-[rgba(0,0,0,0.12)] cursor-default"
                    >
                      <Icon
                        name={pet.pet_type === "cat" ? "cat" : "dog"}
                        className="text-[rgba(0,0,0,0.12)]"
                        size={24}
                      />
                      <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[21px]">
                        {pet.name}
                      </span>
                    </button>
                ))}
              </div>
            </div>
          </div>
        <div className="flex flex-col gap-[21px]">
          <div className="bg-white rounded-[12px] rounded-tr-none border-2 border-[rgba(0, 0, 0, 0.12)] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
            {isLoadingMemorializedPets ? (
              <div className="text-[#4A3C2A] text-sm">Loading memorialized pets...</div>
            ) : activePet ? (
              <div className="flex gap-[16px]">
                <div className="size-[56px] rounded-full overflow-hidden border border-[#E5E7EB] bg-[#8B6357] flex items-center justify-center shrink-0">
                  {activePet.primary_photo ? (
                    <img
                      alt={activePet.name}
                      className="size-full object-cover"
                      src={buildImageUrl(activePet.primary_photo)}
                    />
                  ) : (
                    <Icon name="pet" className="size-6 text-white" />
                  )}
                </div>
                <div className="flex flex-col gap-[8px] flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-[8px]">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4A3C2A]">
                        {activePet.name}
                      </p>
                      <div className="grid grid-cols-3 gap-y-[16px] gap-x-[40px] text-[#4A3C2A]">
                        <div className="w-[80px]">
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Pet type</p>
                          <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                            {formatLabel(activePet.pet_type)}
                          </p>
                        </div>
                        <div className="w-[80px]">
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Breed</p>
                          <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                            {activePet.breed || "-"}
                          </p>
                        </div>
                        <div className="w-[80px]">
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Date of birth</p>
                          <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                            {formatBirthday(activePet.birthday)}
                          </p>
                        </div>
                        <div className="w-[80px]">
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Weight</p>
                          <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                            {formatWeight(activePet.weight_value, activePet.weight_unit)}
                          </p>
                        </div>
                        <div className="w-[80px]">
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Coat condition</p>
                          <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                            {formatLabel(activePet.coat_condition)}
                          </p>
                        </div>
                        <div className="w-[80px]">
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Behavior</p>
                          <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                            {formatBehavior(activePet.behavior)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E5E7EB] w-full" />
                  <div className="flex items-center justify-between">
                    <div className="w-[80px]">
                      <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Frequency</p>
                      <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                        {formatLabel(activePet.grooming_frequency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[#4A3C2A] text-sm">No memorialized pets yet.</div>
            )}
          </div>

          <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[24px]">
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                  Photos
                </p>
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4A3C2A]">
                  Pet photos
                </p>
                <ReadonlyPhotoGrid urls={activePet?.photos || []} />
              </div>

              <div className="border-t border-[#E5E7EB]" />

              <div className="flex flex-col gap-[8px]">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4A3C2A]">
                  Reference photos
                </p>
                <ReadonlyPhotoGrid urls={activePet?.reference_photos || []} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
            <div className="flex flex-col gap-[12px]">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Health report
              </p>
              <div className="border border-[#E5E7EB] rounded-[14px] px-[15px] py-[13px] flex items-center justify-between max-w-[280px]">
                <div>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[16px] leading-[28px] text-[#DE6A07]">
                    {activePet?.name || "-"}
                  </p>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                    2026-04-03 at 10H
                  </p>
                </div>
                <div className="flex items-center gap-[7px]">
                  <div className="bg-[#DCFCE7] h-[24px] px-[16px] py-[4px] rounded-[12px] flex items-center">
                    <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#016630]">
                      Ready
                    </span>
                  </div>
                  <Icon name="nav-next" className="text-[#8B6357]" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
            <div className="flex flex-col gap-[12px]">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Special instruments or notes
              </p>
              <CustomTextarea
                label=""
                placeholder="Enter your message"
                value={activePet?.special_notes || ""}
                disabled
                showResizeHandle={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[944px] mx-auto px-6 pb-8 pt-5">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            disabled={!activePet}
            className="flex items-center gap-[8px] text-[#8B6357] text-[12px] leading-[17.5px] font-['Comfortaa:Bold',sans-serif] hover:text-[#DE6A07] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Icon name="trash" size={16} />
            Delete pet
          </button>
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-[20px] px-0 py-0 max-w-[calc(100%-32px)] sm:max-w-[520px]">
          <div className="flex flex-col gap-[16px] pb-[32px] pt-[12px]">
            <AlertDialogHeader className="px-[12px]">
              <div className="flex items-center justify-between w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    className="h-[16px] w-[16px] p-0 border-0 bg-transparent text-[#4A3C2A] opacity-70 hover:opacity-100"
                  >
                    <Icon name="close-arrow" size={16} className="text-[#4A3C2A]" />
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogTitle className="flex-1 text-center font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4C4C4C]">
                  Delete {activePet?.name || "pet"}
                </AlertDialogTitle>
                <span className="w-[16px]" />
              </div>
            </AlertDialogHeader>
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />
            <div className="px-[24px]">
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[22px] text-[#4A5565]">
                By deleting this pet’s profile, it will no longer appear in your app. Are you sure you want to continue?
              </p>
            </div>
            <AlertDialogFooter className="px-[24px]">
              <div className="flex items-center justify-end gap-[10px] w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <OrangeButton variant="outline" size="medium">
                    No, Keep {activePet?.name || "pet"}
                  </OrangeButton>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogPrimitive.Action asChild>
                  <OrangeButton
                    variant="primary"
                    size="medium"
                    onClick={handleDeletePet}
                    loading={isDeleting}
                  >
                    Yes, Delete
                  </OrangeButton>
                </AlertDialogPrimitive.Action>
              </div>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
