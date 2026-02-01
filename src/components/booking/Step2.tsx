import { useEffect, useRef, useState } from "react";
import { PetForm } from "@/components/common/PetForm";
import { useBookingStore, type GroomingFrequency } from "./bookingStore";
import { useAccountStore } from "@/components/account/accountStore";
import { useAuthStore } from "@/components/auth/authStore";
import type { PetOut } from "@/lib/api";

export function Step2() {
  const [photoResetKey, setPhotoResetKey] = useState(0);
  const user = useAuthStore((state) => state.user);
  const {
    selectedPetId,
    petName,
    petType,
    breed,
    isMixedBreed,
    precisePetType,
    dateOfBirth,
    gender,
    weight,
    weightUnit,
    coatCondition,
    approveShave,
    behavior,
    groomingFrequency,
    specialNotes,
    petBreeds,
    isLoadingBreeds,
    photoIds,
    photoUrls,
    referencePhotoIds,
    referencePhotoUrls,
    petPhoto,
    referenceStyles,
    setPetName,
    setSelectedPetId,
    setPetType,
    setBreed,
    setIsMixedBreed,
    setPrecisePetType,
    setDateOfBirth,
    setGender,
    setWeight,
    setWeightUnit,
    setCoatCondition,
    setApproveShave,
    setBehavior,
    setGroomingFrequency,
    setSpecialNotes,
    setPhotoIds,
    setReferencePhotoIds,
    setPhotoUrls,
    setReferencePhotoUrls,
    setPetPhoto,
    setReferenceStyles,
    loadPetBreeds,
    previousStep,
    nextStep,
  } = useBookingStore();
  const { pets, fetchPets } = useAccountStore();

  const hasLoadedBreedsRef = useRef(false);

  useEffect(() => {
    if (hasLoadedBreedsRef.current) return;
    hasLoadedBreedsRef.current = true;
    loadPetBreeds();
  }, [loadPetBreeds]);

  useEffect(() => {
    if (!user) return;
    fetchPets();
  }, [user, fetchPets]);

  const handleSelectPet = (pet: PetOut) => {
    setPetName(pet.name || "");
    setPetType((pet.pet_type as typeof petType) || "dog");
    setBreed(pet.breed || "");
    setIsMixedBreed(Boolean(pet.mixed_breed));
    setPrecisePetType(pet.precise_type || "");
    setDateOfBirth(pet.birthday || "");
    setGender((pet.gender as typeof gender) || "");
    setWeight(pet.weight_value ? String(pet.weight_value) : "");
    setWeightUnit((pet.weight_unit as typeof weightUnit) || "lbs");
    setCoatCondition((pet.coat_condition as typeof coatCondition) || "");
    setApproveShave(pet.approve_shave ?? null);
    setBehavior((pet.behavior as typeof behavior) || "");
    setGroomingFrequency((pet.grooming_frequency as GroomingFrequency) || "");
    setSpecialNotes(pet.special_notes || "");
    setPhotoIds(pet.photo_ids || []);
    setReferencePhotoIds(pet.reference_photo_ids || []);
    setPhotoUrls(pet.photos || []);
    setReferencePhotoUrls(pet.reference_photos || []);
    setPetPhoto(null);
    setReferenceStyles([]);
  };

  const handleClearSelectedPet = (nextName: string) => {
    setSelectedPetId(null);
    setPetName(nextName);
    setPetType("dog");
    setBreed("");
    setIsMixedBreed(false);
    setPrecisePetType("");
    setDateOfBirth("");
    setGender("");
    setWeight("");
    setWeightUnit("lbs");
    setCoatCondition("");
    setApproveShave(null);
    setBehavior("");
    setGroomingFrequency("");
    setSpecialNotes("");
    setPhotoIds([]);
    setReferencePhotoIds([]);
    setPhotoUrls([]);
    setReferencePhotoUrls([]);
    setPetPhoto(null);
    setReferenceStyles([]);
    setPhotoResetKey((value) => value + 1);
  };

  return (
    <PetForm
      petOptions={user && pets.length > 0 ? pets : undefined}
      selectedPetId={selectedPetId}
      setSelectedPetId={setSelectedPetId}
      onPetSelect={handleSelectPet}
      onPetClear={handleClearSelectedPet}
      photoResetKey={photoResetKey}
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
      onPrimaryAction={nextStep}
      onBackAction={previousStep}
    />
  );
}
