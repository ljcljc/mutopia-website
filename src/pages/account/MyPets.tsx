import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAccountStore } from "@/components/account/accountStore";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common/OrangeButton";
import { FileUpload, type FileUploadItem } from "@/components/common/FileUpload";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { PetForm } from "@/components/common/PetForm";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useBookingStore } from "@/components/booking/bookingStore";
import type { Behavior, CoatCondition, Gender, PetType, WeightUnit, GroomingFrequency } from "@/components/booking/bookingStore";
import { buildImageUrl, getPetBreeds, updatePet, deletePet, memorializePet, uploadPetPhoto, uploadReferencePhoto, type PetBreedOut, type PetOut } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pets, isLoadingPets, fetchPets } = useAccountStore();
  const [activePetId, setActivePetId] = useState<number | null>(null);
  const [petPhotoItems, setPetPhotoItems] = useState<FileUploadItem[]>([]);
  const [referencePhotoItems, setReferencePhotoItems] = useState<FileUploadItem[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMemorializing, setIsMemorializing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPet, setIsUpdatingPet] = useState(false);
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);
  const hasFetchedPetsRef = useRef(false);
  const petPhotoInputFilesRef = useRef<File[]>([]);
  const referencePhotoInputFilesRef = useRef<File[]>([]);
  const petPhotoIdsRef = useRef<number[]>([]);
  const referencePhotoIdsRef = useRef<number[]>([]);
  const petPhotoUrlsRef = useRef<string[]>([]);
  const referencePhotoUrlsRef = useRef<string[]>([]);
  const photoSaveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingPhotoSavesRef = useRef(0);

  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState<PetType>("dog");
  const [breed, setBreed] = useState("");
  const [isMixedBreed, setIsMixedBreed] = useState(false);
  const [precisePetType, setPrecisePetType] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lbs");
  const [coatCondition, setCoatCondition] = useState<CoatCondition | "">("");
  const [approveShave, setApproveShave] = useState<boolean | null>(null);
  const [behavior, setBehavior] = useState<Behavior | "">("");
  const [groomingFrequency, setGroomingFrequency] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [petBreeds, setPetBreeds] = useState<PetBreedOut[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [photoIds, setPhotoIds] = useState<number[]>([]);
  const [referencePhotoIds, setReferencePhotoIds] = useState<number[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [referencePhotoUrls, setReferencePhotoUrls] = useState<string[]>([]);
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [referenceStyles, setReferenceStyles] = useState<File[]>([]);
  const {
    reset: resetBookingStore,
    setPetName: setBookingPetName,
    setPetType: setBookingPetType,
    setBreed: setBookingBreed,
    setIsMixedBreed: setBookingIsMixedBreed,
    setPrecisePetType: setBookingPrecisePetType,
    setDateOfBirth: setBookingDateOfBirth,
    setGender: setBookingGender,
    setWeight: setBookingWeight,
    setWeightUnit: setBookingWeightUnit,
    setCoatCondition: setBookingCoatCondition,
    setApproveShave: setBookingApproveShave,
    setBehavior: setBookingBehavior,
    setGroomingFrequency: setBookingGroomingFrequency,
    setSpecialNotes: setBookingSpecialNotes,
    setPhotoIds: setBookingPhotoIds,
    setReferencePhotoIds: setBookingReferencePhotoIds,
    setPhotoUrls: setBookingPhotoUrls,
    setReferencePhotoUrls: setBookingReferencePhotoUrls,
    setPetPhoto: setBookingPetPhoto,
    setReferenceStyles: setBookingReferenceStyles,
    setCurrentStep: setBookingCurrentStep,
  } = useBookingStore();

  useEffect(() => {
    resetBookingStore();
  }, [resetBookingStore]);

  const petIdFromUrl = searchParams.get("pet");

  useEffect(() => {
    if (hasFetchedPetsRef.current) return;
    hasFetchedPetsRef.current = true;
    fetchPets();
  }, [fetchPets]);

  const hasLoadedBreedsRef = useRef(false);
  useEffect(() => {
    if (hasLoadedBreedsRef.current) return;
    hasLoadedBreedsRef.current = true;
    setIsLoadingBreeds(true);
    getPetBreeds()
      .then((breeds) => setPetBreeds(breeds))
      .catch((error) => {
        console.error("Failed to load pet breeds:", error);
      })
      .finally(() => setIsLoadingBreeds(false));
  }, []);

  useEffect(() => {
    if (pets.length === 0) {
      setActivePetId(null);
      return;
    }
    // 优先使用 URL 中的 pet id（从 Dashboard My pets 跳转过来时打开对应条目）
    if (petIdFromUrl) {
      const id = Number.parseInt(petIdFromUrl, 10);
      if (Number.isFinite(id) && pets.some((p) => p.id === id)) {
        setActivePetId(id);
        return;
      }
    }
    if (activePetId === null) {
      setActivePetId(pets[0].id);
    } else {
      const activePetExists = pets.some((pet) => pet.id === activePetId);
      if (!activePetExists) {
        setActivePetId(pets[0].id);
      }
    }
  }, [pets, petIdFromUrl, activePetId]);

  useEffect(() => {
    setIsEditing(false);
  }, [activePetId]);

  // 切换宠物时若 URL 带有 ?pet=，可选择性清除（避免与当前选中不一致）
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

  const activePet = useMemo(() => pets.find((pet) => pet.id === activePetId) || null, [pets, activePetId]);
  const isMemorialized = Boolean(activePet?.is_memorialized);
  const isPetSelectDropdown = pets.length > 3;

  const applyPetToForm = (pet: PetOut) => {
    setPetName(pet.name || "");
    setPetType((pet.pet_type as PetType) || "dog");
    setBreed(pet.breed || "");
    setIsMixedBreed(Boolean(pet.mixed_breed));
    setPrecisePetType(pet.precise_type || "");
    setDateOfBirth(pet.birthday || "");
    setGender((pet.gender as Gender) || "");
    setWeight(pet.weight_value ? String(pet.weight_value) : "");
    setWeightUnit((pet.weight_unit as WeightUnit) || "lbs");
    setCoatCondition((pet.coat_condition as CoatCondition) || "");
    setApproveShave(pet.approve_shave ?? null);
    setBehavior((pet.behavior as Behavior) || "");
    setGroomingFrequency(pet.grooming_frequency || "");
    setSpecialNotes(pet.special_notes || "");
    setPhotoIds(pet.photo_ids || []);
    setReferencePhotoIds(pet.reference_photo_ids || []);
    setPhotoUrls(pet.photos || []);
    setReferencePhotoUrls(pet.reference_photos || []);
    setPetPhoto(null);
    setReferenceStyles([]);
  };

  const handleBookForPet = (pet: PetOut) => {
    setBookingPetName(pet.name || "");
    setBookingPetType((pet.pet_type as PetType) || "dog");
    setBookingBreed(pet.breed || "");
    setBookingIsMixedBreed(Boolean(pet.mixed_breed));
    setBookingPrecisePetType(pet.precise_type || "");
    setBookingDateOfBirth(pet.birthday || "");
    setBookingGender((pet.gender as Gender) || "");
    setBookingWeight(pet.weight_value ? String(pet.weight_value) : "");
    setBookingWeightUnit((pet.weight_unit as WeightUnit) || "lbs");
    setBookingCoatCondition((pet.coat_condition as CoatCondition) || "");
    setBookingApproveShave(pet.approve_shave ?? null);
    setBookingBehavior((pet.behavior as Behavior) || "");
    setBookingGroomingFrequency((pet.grooming_frequency as GroomingFrequency) || "");
    setBookingSpecialNotes(pet.special_notes || "");
    setBookingPhotoIds(pet.photo_ids || []);
    setBookingReferencePhotoIds(pet.reference_photo_ids || []);
    setBookingPhotoUrls(pet.photos || []);
    setBookingReferencePhotoUrls(pet.reference_photos || []);
    setBookingPetPhoto(null);
    setBookingReferenceStyles([]);
    setBookingCurrentStep(1);
    navigate("/booking");
  };

  useEffect(() => {
    if (!activePet) {
      setPetPhotoItems([]);
      setReferencePhotoItems([]);
      setNotes("");
      petPhotoInputFilesRef.current = [];
      referencePhotoInputFilesRef.current = [];
      return;
    }

    const petPhotos = activePet.photos || [];
    const referencePhotos = activePet.reference_photos || [];

    const buildItems = (photos: string[], photoIds: number[]): FileUploadItem[] =>
      photos.map((photoUrl, index) => ({
        file: new File([], `pet-photo-${activePet.id}-${index}.jpg`, { type: "image/jpeg" }),
        previewUrl: buildImageUrl(photoUrl),
        uploadStatus: "uploaded",
        uploadProgress: 100,
        photoId: photoIds[index],
        serverUrl: photoUrl,
      }));

    setPetPhotoItems(buildItems(petPhotos, activePet.photo_ids || []));
    setReferencePhotoItems(buildItems(referencePhotos, activePet.reference_photo_ids || []));
    setNotes(activePet.special_notes || "");
    petPhotoInputFilesRef.current = [];
    referencePhotoInputFilesRef.current = [];

    applyPetToForm(activePet);
  }, [activePet]);

  useEffect(() => {
    petPhotoIdsRef.current = petPhotoItems
      .map((item) => item.photoId)
      .filter((id): id is number => id !== undefined);
    petPhotoUrlsRef.current = petPhotoItems
      .map((item) => item.serverUrl)
      .filter((url): url is string => Boolean(url));
  }, [petPhotoItems]);

  useEffect(() => {
    referencePhotoIdsRef.current = referencePhotoItems
      .map((item) => item.photoId)
      .filter((id): id is number => id !== undefined);
    referencePhotoUrlsRef.current = referencePhotoItems
      .map((item) => item.serverUrl)
      .filter((url): url is string => Boolean(url));
  }, [referencePhotoItems]);

  const enqueuePhotoSave = (petId: number, nextPhotoIds: number[], nextReferencePhotoIds: number[]) => {
    const payload = {
      photo_ids: nextPhotoIds.length > 0 ? nextPhotoIds : null,
      reference_photo_ids: nextReferencePhotoIds.length > 0 ? nextReferencePhotoIds : null,
    };
    pendingPhotoSavesRef.current += 1;
    setIsSavingPhotos(true);
    photoSaveQueueRef.current = photoSaveQueueRef.current.then(async () => {
      try {
        await updatePet(petId, {}, payload);
      } catch (error) {
        console.error("Failed to save photos:", error);
        toast.error("Failed to save photos. Please try again.");
      }
    }).finally(() => {
      pendingPhotoSavesRef.current = Math.max(0, pendingPhotoSavesRef.current - 1);
      if (pendingPhotoSavesRef.current === 0) {
        setIsSavingPhotos(false);
      }
    });
    return photoSaveQueueRef.current;
  };

  const isSameFile = (a: File, b: File) =>
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

  const handlePetPhotoUpload = async (file: File) => {
    if (!activePet) return;
    try {
      const response = await uploadPetPhoto(file, (progress) => {
        setPetPhotoItems((prev) =>
          prev.map((item) =>
            item.file === file ? { ...item, uploadProgress: progress } : item
          )
        );
      });

      const previewUrl = buildImageUrl(response.url);
      setPetPhotoItems((prev) =>
        prev.map((item) =>
          item.file === file
            ? {
                ...item,
                uploadStatus: "uploaded",
                uploadProgress: 100,
                photoId: response.id,
                serverUrl: response.url,
                previewUrl,
              }
            : item
        )
      );

      const nextPhotoIds = petPhotoIdsRef.current.includes(response.id)
        ? petPhotoIdsRef.current
        : [...petPhotoIdsRef.current, response.id];
      const nextPhotoUrls = petPhotoUrlsRef.current.includes(response.url)
        ? petPhotoUrlsRef.current
        : [...petPhotoUrlsRef.current, response.url];
      setPhotoIds(nextPhotoIds);
      setPhotoUrls(nextPhotoUrls);
      await enqueuePhotoSave(activePet.id, nextPhotoIds, referencePhotoIdsRef.current);
    } catch (error) {
      console.error("Failed to upload pet photo:", error);
      setPetPhotoItems((prev) =>
        prev.map((item) =>
          item.file === file ? { ...item, uploadStatus: "error", errorType: "upload" } : item
        )
      );
      toast.error("Failed to upload pet photo. Please try again.");
    }
  };

  const handleReferencePhotoUpload = async (file: File) => {
    if (!activePet) return;
    try {
      const response = await uploadReferencePhoto(file, (progress) => {
        setReferencePhotoItems((prev) =>
          prev.map((item) =>
            item.file === file ? { ...item, uploadProgress: progress } : item
          )
        );
      });

      const previewUrl = buildImageUrl(response.url);
      setReferencePhotoItems((prev) =>
        prev.map((item) =>
          item.file === file
            ? {
                ...item,
                uploadStatus: "uploaded",
                uploadProgress: 100,
                photoId: response.id,
                serverUrl: response.url,
                previewUrl,
              }
            : item
        )
      );

      const nextReferenceIds = referencePhotoIdsRef.current.includes(response.id)
        ? referencePhotoIdsRef.current
        : [...referencePhotoIdsRef.current, response.id];
      const nextReferenceUrls = referencePhotoUrlsRef.current.includes(response.url)
        ? referencePhotoUrlsRef.current
        : [...referencePhotoUrlsRef.current, response.url];
      setReferencePhotoIds(nextReferenceIds);
      setReferencePhotoUrls(nextReferenceUrls);
      await enqueuePhotoSave(activePet.id, petPhotoIdsRef.current, nextReferenceIds);
    } catch (error) {
      console.error("Failed to upload reference photo:", error);
      setReferencePhotoItems((prev) =>
        prev.map((item) =>
          item.file === file ? { ...item, uploadStatus: "error", errorType: "upload" } : item
        )
      );
      toast.error("Failed to upload reference photo. Please try again.");
    }
  };

  const handlePetPhotoChange = (files: File[]) => {
    if (!activePet) return;
    const incomingFiles = files;
    const previousFiles = petPhotoInputFilesRef.current;
    const newFiles = incomingFiles.filter((file) => !previousFiles.some((prev) => isSameFile(prev, file)));
    petPhotoInputFilesRef.current = incomingFiles;
    if (newFiles.length === 0) return;

    const newItems = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploading" as const,
      uploadProgress: 0,
    }));
    setPetPhotoItems((prev) => [...prev, ...newItems]);
    newFiles.forEach((file) => {
      handlePetPhotoUpload(file);
    });
  };

  const handleReferencePhotoChange = (files: File[]) => {
    if (!activePet) return;
    const incomingFiles = files;
    const previousFiles = referencePhotoInputFilesRef.current;
    const newFiles = incomingFiles.filter((file) => !previousFiles.some((prev) => isSameFile(prev, file)));
    referencePhotoInputFilesRef.current = incomingFiles;
    if (newFiles.length === 0) return;

    const newItems = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploading" as const,
      uploadProgress: 0,
    }));
    setReferencePhotoItems((prev) => [...prev, ...newItems]);
    newFiles.forEach((file) => {
      handleReferencePhotoUpload(file);
    });
  };

  const handleRemovePetPhotoItem = (index: number) => {
    if (!activePet) return;
    const currentItems = petPhotoItems;
    const item = currentItems[index];
    if (item?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
    const nextItems = currentItems.filter((_, i) => i !== index);
    const nextPhotoIds = nextItems
      .map((nextItem) => nextItem.photoId)
      .filter((id): id is number => id !== undefined);
    const nextPhotoUrls = nextItems
      .map((nextItem) => nextItem.serverUrl)
      .filter((url): url is string => Boolean(url));
    setPetPhotoItems(nextItems);
    setPhotoIds(nextPhotoIds);
    setPhotoUrls(nextPhotoUrls);
    enqueuePhotoSave(activePet.id, nextPhotoIds, referencePhotoIdsRef.current);
  };

  const handleRemoveReferencePhotoItem = (index: number) => {
    if (!activePet) return;
    const currentItems = referencePhotoItems;
    const item = currentItems[index];
    if (item?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
    const nextItems = currentItems.filter((_, i) => i !== index);
    const nextReferenceIds = nextItems
      .map((nextItem) => nextItem.photoId)
      .filter((id): id is number => id !== undefined);
    const nextReferenceUrls = nextItems
      .map((nextItem) => nextItem.serverUrl)
      .filter((url): url is string => Boolean(url));
    setReferencePhotoItems(nextItems);
    setReferencePhotoIds(nextReferenceIds);
    setReferencePhotoUrls(nextReferenceUrls);
    enqueuePhotoSave(activePet.id, petPhotoIdsRef.current, nextReferenceIds);
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

  const handleMemorializePet = async () => {
    if (!activePet || isMemorialized) return;
    setIsMemorializing(true);
    try {
      await memorializePet(activePet.id);
      toast.success("Pet has been memorialized.");
      await fetchPets();
    } catch (error) {
      console.error("Failed to memorialize pet:", error);
      toast.error("Failed to memorialize. Please try again.");
    } finally {
      setIsMemorializing(false);
    }
  };

  const handleSavePet = async () => {
    if (!activePet) return;
    if (!petName.trim()) {
      toast.error("Please enter your pet's name.");
      return;
    }
    if (!petType) {
      toast.error("Please select a pet type.");
      return;
    }

    const weightValue = weight ? parseFloat(weight) : null;
    setIsUpdatingPet(true);
    try {
      await updatePet(
        activePet.id,
        {
          name: petName.trim(),
          pet_type: petType,
          breed: breed || undefined,
          mixed_breed: isMixedBreed,
          precise_type: precisePetType || undefined,
          birthday: dateOfBirth || null,
          gender: gender || undefined,
          weight_value: Number.isNaN(weightValue) ? null : weightValue,
          weight_unit: weightUnit || undefined,
          coat_condition: coatCondition || undefined,
          approve_shave: approveShave ?? undefined,
          behavior: behavior || undefined,
          grooming_frequency: groomingFrequency || undefined,
          special_notes: specialNotes || undefined,
        },
        {
          photo_ids: photoIds.length > 0 ? photoIds : null,
          reference_photo_ids: referencePhotoIds.length > 0 ? referencePhotoIds : null,
        }
      );
      toast.success("Pet updated successfully.");
      await fetchPets();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update pet:", error);
      toast.error("Failed to update pet. Please try again.");
    } finally {
      setIsUpdatingPet(false);
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col">
      <div className="mx-auto flex w-full max-w-none flex-1 px-5 pb-5 sm:max-w-[944px] sm:px-6 sm:pb-8">
        <div className="mb-[-2px] flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h1 className="font-comfortaa font-bold text-[20px] text-[#4A3C2A]">
              My pets
            </h1>
            {isLoadingPets ? null : (
              isPetSelectDropdown ? (
                <Select
                  value={activePetId ? String(activePetId) : ""}
                  onValueChange={(value) => {
                    if (value === "__add__") {
                      navigate("/account/pets/new", { state: { from: "my-pets" } });
                      return;
                    }
                    const nextId = Number.parseInt(value, 10);
                    if (Number.isFinite(nextId)) {
                      handleSelectPet(nextId);
                    }
                  }}
                >
                  <SelectTrigger
                    className="h-10 w-40 min-w-40 rounded-tl-[14px] rounded-tr-[14px] border-2 border-[#DE6A07] bg-white px-4 py-2 text-[#DE6A07] [&_svg]:text-[#DE6A07]"
                  >
                    <div className="flex items-center gap-1">
                      <Icon
                        name={activePet?.pet_type === "cat" ? "cat" : "dog"}
                        className="text-[#DE6A07]"
                        size={24}
                      />
                      <span className="font-comfortaa font-bold text-[14px] leading-[21px]">
                        {activePet?.name ?? "Select pet"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-t-lg rounded-b-none border border-[#D6D6D6] bg-white p-2"
                    position="popper"
                  >
                    {pets.map((pet) => (
                      <SelectItem
                        key={pet.id}
                        value={String(pet.id)}
                        className="h-9 rounded px-3 py-3 font-poppins text-[14px] leading-[20px] text-[#6B6B6B] data-highlighted:bg-[#FFFBEB] data-[state=checked]:bg-white data-[state=checked]:text-[#DE6A07] [&_svg]:text-[#6B6B6B] data-[state=checked]:[&_svg]:text-[#DE6A07] [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Icon name={pet.pet_type === "cat" ? "cat" : "dog"} size={20} className="text-[#DE6A07]" />
                          <span>{pet.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="__add__"
                      className="h-9 rounded px-3 py-3 font-poppins text-[14px] leading-[20px] text-[#6B6B6B] data-highlighted:bg-[#FFFBEB] [&>span:first-child]:hidden [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name="add-2" size={20} className="text-[#DE6A07]" />
                        <span>Add pet</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex max-w-[520px] items-center justify-end overflow-x-auto pl-0.5">
                  {pets.map((pet) => {
                    const isActive = pet.id === activePetId;
                    return (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => handleSelectPet(pet.id)}
                        className={`flex min-w-[88px] shrink-0 items-center gap-1 rounded-tl-[14px] rounded-tr-[14px] border-2 px-4 py-2 sm:min-w-[120px] ${
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
                        <span className="font-comfortaa font-bold text-[14px] leading-[21px]">
                          {pet.name}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => navigate("/account/pets/new", { state: { from: "my-pets" } })}
                    className="flex min-w-[88px] shrink-0 items-center gap-1 rounded-tl-[14px] rounded-tr-[14px] border-2 border-[#E5E7EB] px-4 py-2 text-[#8B6357] cursor-pointer"
                  >
                    <Icon name="add-2" className="text-[#8B6357]" size={20} />
                    <span className="font-comfortaa font-bold text-[14px] leading-[21px]">
                      Add pet
                    </span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="relative z-1 flex flex-col gap-[21px]">
          {isEditing ? (
            <PetForm
              petName={petName}
              petType={petType}
              breed={breed}
              isMixedBreed={isMixedBreed}
              precisePetType={precisePetType}
              dateOfBirth={dateOfBirth}
              gender={gender}
              weight={weight}
              weightUnit={weightUnit}
              coatCondition={coatCondition}
              approveShave={approveShave}
              behavior={behavior}
              groomingFrequency={groomingFrequency}
              specialNotes={specialNotes}
              petBreeds={petBreeds}
              isLoadingBreeds={isLoadingBreeds}
              photoIds={photoIds}
              photoUrls={photoUrls}
              referencePhotoIds={referencePhotoIds}
              referencePhotoUrls={referencePhotoUrls}
              petPhoto={petPhoto}
              referenceStyles={referenceStyles}
              setPetName={setPetName}
              setPetType={setPetType}
              setBreed={setBreed}
              setIsMixedBreed={setIsMixedBreed}
              setPrecisePetType={setPrecisePetType}
              setDateOfBirth={setDateOfBirth}
              setGender={setGender}
              setWeight={setWeight}
              setWeightUnit={setWeightUnit}
              setCoatCondition={setCoatCondition}
              setApproveShave={setApproveShave}
              setBehavior={setBehavior}
              setGroomingFrequency={setGroomingFrequency}
              setSpecialNotes={setSpecialNotes}
              setPhotoIds={setPhotoIds}
              setReferencePhotoIds={setReferencePhotoIds}
              setPhotoUrls={setPhotoUrls}
              setReferencePhotoUrls={setReferencePhotoUrls}
              setPetPhoto={setPetPhoto}
              setReferenceStyles={setReferenceStyles}
              primaryActionLabel="Save"
              isPrimaryActionLoading={isUpdatingPet}
              onPrimaryAction={handleSavePet}
              backLabel="Cancel"
              petInfoCardClassName="border-2 border-[#DE6A07] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[22px] sm:p-[24px]"
              mergeGroomingIntoInfoCard
              alignActionsRight
              actionsOrder="primary-first"
              actionsPlacement="inside-pet-info"
              primaryActionShowArrow={false}
              hideAfterPetInfo
              showMobileStepHeader={false}
              onBackAction={() => {
                if (activePet) applyPetToForm(activePet);
                setIsEditing(false);
              }}
            />
          ) : (
            <div className="rounded-xl rounded-tr-none border-2 border-[#DE6A07] bg-white p-[22px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:p-5">
              {isLoadingPets ? (
                <div className="text-[#4A3C2A] text-sm">Loading pets...</div>
              ) : activePet ? (
                <div className="flex gap-4">
                  {/* 左侧：头像 */}
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-[#8B6357]">
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
                  <div className="flex flex-1 flex-col gap-2">
                    {/* 上方：信息和编辑icon左右结构 */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <p className="font-comfortaa font-normal text-[14px] leading-[22.75px] text-[#4A3C2A]">
                          {activePet.name}
                        </p>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-[#4A3C2A]">
                          <div className="w-20">
                            <p className="font-comfortaa text-[10px] leading-[12px]">Pet type</p>
                            <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                              {formatLabel(activePet.pet_type)}
                            </p>
                          </div>
                          <div className="min-w-20 max-w-40">
                            <p className="font-comfortaa text-[10px] leading-[12px]">Breed</p>
                            <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                              {activePet.breed || "-"}
                            </p>
                          </div>
                          <div className="w-20">
                            <p className="font-comfortaa text-[10px] leading-[12px]">Weight</p>
                            <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                              {formatWeight(activePet.weight_value, activePet.weight_unit)}
                            </p>
                          </div>
                          <div className="w-20">
                            <p className="font-comfortaa text-[10px] leading-[12px]">Date of birth</p>
                            <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                              {formatBirthday(activePet.birthday)}
                            </p>
                          </div>
                          <div className="w-20">
                            <p className="font-comfortaa text-[10px] leading-[12px]">Coat condition</p>
                            <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                              {formatLabel(activePet.coat_condition)}
                            </p>
                          </div>
                          <div className="w-20">
                            <p className="font-comfortaa text-[10px] leading-[12px]">Behavior</p>
                            <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                              {formatBehavior(activePet.behavior)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-[#8B6357] hover:text-[#DE6A07] cursor-pointer"
                        onClick={() => setIsEditing(true)}
                      >
                        <Icon name="pencil" size={20} />
                      </button>
                    </div>
                    
                    {/* 分割线 */}
                    <div className="border-t border-[#E5E7EB] w-full" />
                    
                    {/* 下方：移动端换行，PC 端同一行 */}
                    <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
                      <div className="w-20">
                        <p className="font-comfortaa text-[10px] leading-[12px]">Frequency</p>
                        <p className="mt-1 font-comfortaa text-[12px] leading-[16px] font-bold">
                          {formatLabel(activePet.grooming_frequency)}
                        </p>
                      </div>
                      <OrangeButton
                        size="compact"
                        showArrow
                        className="mt-3 h-7 px-7 sm:mt-0"
                        onClick={() => activePet && handleBookForPet(activePet)}
                      >
                        <span className="text-white text-[12px] leading-[17.5px] font-bold">Book for {activePet.name}</span>
                      </OrangeButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[#4A3C2A] text-sm">No pets yet.</div>
              )}
            </div>
          )}

          <div className="rounded-xl bg-white p-3.5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                    Photos
                  </p>
                  {isSavingPhotos ? (
                    <span className="text-[12px] leading-[17.5px] text-[#8B6357]">
                      Saving...
                    </span>
                  ) : null}
                </div>
                <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                  Pet photos
                </p>
                <FileUpload
                  accept="image/*"
                  multiple
                  maxSizeMB={10}
                  uploadItems={petPhotoItems}
                  onChange={handlePetPhotoChange}
                  onRemove={handleRemovePetPhotoItem}
                  buttonText="Click to upload"
                  fileTypeHint="JPG, JPEG, PNG less than 10MB"
                  showDragHint
                />
              </div>

              <div className="border-t border-[#E5E7EB]" />

              <div className="flex flex-col gap-2">
                <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
                  Reference photos
                </p>
                <FileUpload
                  accept="image/*"
                  multiple
                  maxSizeMB={10}
                  uploadItems={referencePhotoItems}
                  onChange={handleReferencePhotoChange}
                  onRemove={handleRemoveReferencePhotoItem}
                  buttonText="Click to upload"
                  fileTypeHint="JPG, JPEG, PNG less than 10MB"
                  showDragHint
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-3 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:p-5">
            <div className="flex flex-col gap-3">
              <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Health report
              </p>
              <div className="flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] px-[15px] py-[13px]">
                <div>
                  <p className="font-comfortaa font-normal text-[16px] leading-[28px] text-[#DE6A07]">
                    {activePet?.name || "-"}
                  </p>
                  <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                    2026-04-03 at 10H
                  </p>
                </div>
                <div className="flex items-center gap-[7px]">
                  <div className="flex h-6 items-center rounded-xl bg-[#DCFCE7] px-4 py-1">
                    <span className="font-comfortaa font-bold text-[10px] leading-[14px] text-[#016630]">
                      Ready
                    </span>
                  </div>
                  <Icon name="nav-next" className="text-[#8B6357]" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-3 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:p-5">
            <div className="flex flex-col gap-3">
              <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Special instruments or notes
              </p>
              <CustomTextarea
                label=""
                placeholder="Enter your message"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
              <OrangeButton
                size="compact"
                onClick={handleSaveNotes}
                loading={isSaving}
                className="w-24 self-end"
              >
                Save
              </OrangeButton>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <OrangeButton
              variant="outlineMuted"
              size="compact"
              className={`px-7 ${isMemorialized ? "border-[#E5E7EB] hover:bg-transparent active:bg-transparent" : ""}`}
              onClick={handleMemorializePet}
              loading={isMemorializing}
              disabled={!activePet || isMemorialized}
            >
              {isMemorialized ? <span className="text-[#9CA3AF]">Memorialized</span> : "Memorialize"}
            </OrangeButton>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              disabled={!activePet}
              className="flex cursor-pointer items-center gap-2 font-comfortaa text-[12px] leading-[17.5px] text-[#8B6357] transition-colors hover:text-[#DE6A07] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="trash" size={16} />
              Delete pet
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] px-0 py-0 sm:max-w-[520px]">
          <div className="flex flex-col gap-4 pb-8 pt-3">
            <AlertDialogHeader className="px-3">
              <div className="flex items-center justify-between w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    className="size-4 border-0 bg-transparent p-0 text-[#4A3C2A] opacity-70 hover:opacity-100"
                  >
                    <Icon name="close-arrow" size={16} className="text-[#4A3C2A]" />
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogTitle className="flex-1 text-center font-comfortaa font-normal text-[14px] leading-[22.75px] text-[#4C4C4C]">
                  Delete {activePet?.name || "pet"}
                </AlertDialogTitle>
                <span className="size-4" />
              </div>
            </AlertDialogHeader>
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />
            <div className="px-6">
              <AlertDialogDescription className="font-comfortaa font-bold text-[14px] leading-[22px] text-[#4A5565] m-0">
                By deleting this pet’s profile, it will no longer appear in your app. Are you sure you want to continue?
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter className="px-6">
              <div className="flex w-full items-center justify-end gap-2.5">
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
