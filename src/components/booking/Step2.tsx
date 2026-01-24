import { useEffect, useRef } from "react";
import { PetForm } from "@/components/common/PetForm";
import { useBookingStore } from "./bookingStore";

export function Step2() {
  const {
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

  const hasLoadedBreedsRef = useRef(false);

  useEffect(() => {
    if (hasLoadedBreedsRef.current) return;
    hasLoadedBreedsRef.current = true;
    loadPetBreeds();
  }, [loadPetBreeds]);

  return (
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
      onPrimaryAction={nextStep}
      onBackAction={previousStep}
    />
  );
}
