import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccountStore } from "@/components/account/accountStore";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common/OrangeButton";
import { FileUpload, type FileUploadItem } from "@/components/common/FileUpload";
import { CustomTextarea } from "@/components/common/CustomTextarea";
  import { buildImageUrl, updatePet, deletePet } from "@/lib/api";
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

export default function MyPets() {
  const { pets, isLoadingPets, fetchPets } = useAccountStore();
  const [activePetId, setActivePetId] = useState<number | null>(null);
  const [petPhotoItems, setPetPhotoItems] = useState<FileUploadItem[]>([]);
  const [referencePhotoItems, setReferencePhotoItems] = useState<FileUploadItem[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    if (pets.length > 0 && activePetId === null) {
      setActivePetId(pets[0].id);
    } else if (pets.length > 0 && activePetId !== null) {
      // 如果当前激活的宠物不在列表中（被删除了），切换到第一个
      const activePetExists = pets.some((pet) => pet.id === activePetId);
      if (!activePetExists) {
        setActivePetId(pets[0].id);
      }
    } else if (pets.length === 0) {
      // 如果没有宠物了，清空激活状态
      setActivePetId(null);
    }
  }, [pets, activePetId]);

  const activePet = useMemo(() => pets.find((pet) => pet.id === activePetId) || null, [pets, activePetId]);

  useEffect(() => {
    if (!activePet) {
      setPetPhotoItems([]);
      setReferencePhotoItems([]);
      setNotes("");
      return;
    }

    const petPhotos = activePet.photos || [];
    const referencePhotos = activePet.reference_photos || [];

    const buildItems = (photos: string[]): FileUploadItem[] =>
      photos.map((photoUrl, index) => ({
        file: new File([], `pet-photo-${activePet.id}-${index}.jpg`, { type: "image/jpeg" }),
        previewUrl: buildImageUrl(photoUrl),
        uploadStatus: "uploaded",
        uploadProgress: 100,
      }));

    setPetPhotoItems(buildItems(petPhotos));
    setReferencePhotoItems(buildItems(referencePhotos));
    setNotes(activePet.special_notes || "");
  }, [activePet]);

  const handlePetPhotoChange = (files: File[]) => {
    const newItems = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploaded" as const,
      uploadProgress: 100,
    }));
    setPetPhotoItems((prev) => [...prev, ...newItems]);
  };

  const handleReferencePhotoChange = (files: File[]) => {
    const newItems = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploaded" as const,
      uploadProgress: 100,
    }));
    setReferencePhotoItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<FileUploadItem[]>>, index: number) => {
    setter((prev) => {
      const item = prev[index];
      if (item?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSaveNotes = async () => {
    if (!activePet) return;
    setIsSaving(true);
    try {
      await updatePet(activePet.id, { special_notes: notes || null });
      toast.success("Saved successfully.");
    } catch (error) {
      console.error("Failed to save notes:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePet = async () => {
    if (!activePet) return;

    const deletedPetId = activePet.id;
    const deletedPetName = activePet.name;
    const currentPets = [...pets];
    setIsDeleting(true);
    try {
      await deletePet(deletedPetId);
      toast.success(`${deletedPetName} has been deleted successfully.`);
      
      // 刷新宠物列表（useEffect 会自动处理激活宠物的切换）
      await fetchPets();
      if (currentPets.length > 1) {
        const currentIndex = currentPets.findIndex((pet) => pet.id === deletedPetId);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % currentPets.length : 0;
        const nextPet = currentPets.find((pet) => pet.id !== deletedPetId) || currentPets[nextIndex];
        if (nextPet) {
          setActivePetId(nextPet.id);
        }
      } else {
        setActivePetId(null);
      }
    } catch (error) {
      console.error("Failed to delete pet:", error);
      toast.error("Failed to delete pet. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="w-full max-w-[944px] mx-auto px-6 pb-8 flex-1">
        <div className="flex flex-col gap-[21px]">
          <div className="flex justify-between">
            <h1 className="font-['Comfortaa:Bold',sans-serif] font-bold text-[20px] text-[#4A3C2A]">
              Me pets
            </h1>
            <div className="flex items-center gap-[8px] overflow-x-auto max-w-[520px] pl-[2px] pr-[2px]">
              {pets.map((pet) => {
                const isActive = pet.id === activePetId;
                return (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setActivePetId(pet.id)}
                    className={`border-2 rounded-tl-[14px] rounded-tr-[14px] px-[16px] py-[8px] min-w-[120px] flex items-center gap-[4px] shrink-0 ${
                      isActive
                        ? "border-[#DE6A07] text-[#DE6A07]"
                        : "border-[#E5E7EB] text-[#8B6357]"
                    }`}
                  >
                    <Icon
                      name={pet.pet_type === "cat" ? "cat" : "dog"}
                      className={isActive ? "text-[#DE6A07]" : "text-[#8B6357]"}
                      size={24}
                    />
                    <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[21px]">
                      {pet.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
            {isLoadingPets ? (
              <div className="text-[#4A3C2A] text-sm">Loading pets...</div>
            ) : activePet ? (
              <div className="flex gap-[16px]">
                {/* 左侧：头像 */}
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
                
                {/* 右侧：其他所有模块 */}
                <div className="flex flex-col gap-[8px] flex-1">
                  {/* 上方：信息和编辑icon左右结构 */}
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
                    <button type="button" className="text-[#8B6357] hover:text-[#DE6A07] cursor-pointer">
                      <Icon name="pencil" size={20} />
                    </button>
                  </div>
                  
                  {/* 分割线 */}
                  <div className="border-t border-[#E5E7EB] w-full" />
                  
                  {/* 下方：按钮和Frequency Monthly space-between */}
                  <div className="flex items-center justify-between">
                    <div className="w-[80px]">
                      <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] leading-[12px]">Frequency</p>
                      <p className="mt-1 font-['Comfortaa:Bold',sans-serif] text-[12px] leading-[16px] font-bold">
                        {formatLabel(activePet.grooming_frequency)}
                      </p>
                    </div>
                    <OrangeButton size="compact" showArrow className="px-[28px] h-[28px]">
                      <span className="text-white text-[12px] leading-[17.5px] font-bold">Book for {activePet.name}</span>
                    </OrangeButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[#4A3C2A] text-sm">No pets yet.</div>
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
                <FileUpload
                  accept="image/*"
                  multiple
                  maxSizeMB={10}
                  uploadItems={petPhotoItems}
                  onChange={handlePetPhotoChange}
                  onRemove={(index) => handleRemoveItem(setPetPhotoItems, index)}
                  buttonText="Click to upload"
                  fileTypeHint="JPG, JPEG, PNG less than 10MB"
                  showDragHint
                />
              </div>

              <div className="border-t border-[#E5E7EB]" />

              <div className="flex flex-col gap-[8px]">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4A3C2A]">
                  Reference photos
                </p>
                <FileUpload
                  accept="image/*"
                  multiple
                  maxSizeMB={10}
                  uploadItems={referencePhotoItems}
                  onChange={handleReferencePhotoChange}
                  onRemove={(index) => handleRemoveItem(setReferencePhotoItems, index)}
                  buttonText="Click to upload"
                  fileTypeHint="JPG, JPEG, PNG less than 10MB"
                  showDragHint
                />
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
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
              <OrangeButton size="compact" onClick={handleSaveNotes} loading={isSaving} className="w-[96px]">
                Save
              </OrangeButton>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <OrangeButton size="compact" className="px-[28px]" showArrow>
              Memorized
            </OrangeButton>
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
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-[20px] px-0 py-0 max-w-[520px]">
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
                  <OrangeButton
                    variant="outline"
                    size="medium"
                  >
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
