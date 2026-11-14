import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginModal } from "@/components/auth/LoginModal";
import { PetForm } from "@/components/common/PetForm";
import { CarePassportCard } from "@/components/common/CarePassportCard";
import { useBookingStore, type GroomingFrequency } from "./bookingStore";
import { useAccountStore } from "@/components/account/accountStore";
import { useAuthStore } from "@/components/auth/authStore";
import { createPet, getPets, type PetOut } from "@/lib/api";

export function Step2() {
  const navigate = useNavigate();
  const [passportLoginOpen, setPassportLoginOpen] = useState(false);
  const [pendingPassport, setPendingPassport] = useState(false);
  const [matchingPets, setMatchingPets] = useState<PetOut[]>([]);
  const [photoResetKey, setPhotoResetKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

  useEffect(() => {
    if (user && pendingPassport) {
      setPendingPassport(false);
      setPassportLoginOpen(false);
      void openPassport();
    }
  }, [user, pendingPassport]);

  const openPassport = async () => {
    if (!user) {
      setPendingPassport(true);
      setPassportLoginOpen(true);
      return;
    }
    if (selectedPetId) {
      navigate(`/care-passport/${selectedPetId}`, { state: { returnTo: "/booking" } });
      return;
    }
    if (!petName.trim()) {
      toast.error("Enter your pet's name before opening the Care Passport.");
      return;
    }
    try {
      const allPets: PetOut[] = [];
      for (let page = 1; ; page += 1) {
        const result = await getPets({ page, page_size: 100 });
        allPets.push(...result.items);
        if (allPets.length >= result.total || result.items.length === 0) break;
      }
      const normalizedName = petName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const candidates = allPets.filter((pet) => {
        const existingName = pet.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        return existingName === normalizedName || (normalizedName.length >= 3 && (existingName.includes(normalizedName) || normalizedName.includes(existingName)));
      });
      if (candidates.length) { setMatchingPets(candidates); return; }
      await createAndOpenPassport();
    } catch {
      toast.error("Could not check My Pets. Please try again.");
    }
  };

  const createAndOpenPassport = async () => {
    try {
      const pet = await createPet({
        name: petName.trim(), pet_type: petType, breed, mixed_breed: isMixedBreed,
        precise_type: precisePetType, birthday: dateOfBirth || null, gender: gender || undefined,
        weight_value: weight ? Number(weight) : null, weight_unit: weightUnit,
        coat_condition: coatCondition || undefined, approve_shave: approveShave ?? undefined,
        behavior: behavior || undefined, grooming_frequency: groomingFrequency || undefined, special_notes: specialNotes,
      }, { photo_ids: photoIds, reference_photo_ids: referencePhotoIds });
      setSelectedPetId(pet.id);
      await fetchPets();
      navigate(`/care-passport/${pet.id}`, { state: { returnTo: "/booking" } });
    } catch {
      toast.error("Could not save this pet. Please try again.");
    }
  };

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

  const isCoatConditionComplete =
    coatCondition !== "" &&
    (coatCondition === "not_matted" || approveShave !== null);
  const isBreedComplete =
    petType === "other" ? precisePetType.trim().length > 0 : breed.trim().length > 0;
  const isWeightValid = Number.isFinite(Number(weight)) && Number(weight) > 0;
  const isStep2Valid =
    petName.trim().length > 0 &&
    isBreedComplete &&
    dateOfBirth.trim().length > 0 &&
    gender !== "" &&
    isWeightValid &&
    isCoatConditionComplete &&
    behavior !== "" &&
    groomingFrequency !== "";

  useEffect(() => {
    setValidationErrors((current) => {
      const next = { ...current };
      if (petName.trim()) delete next.petName;
      if (isBreedComplete) { delete next.breed; delete next.precisePetType; }
      if (dateOfBirth.trim()) delete next.dateOfBirth;
      if (gender) delete next.gender;
      if (isWeightValid) delete next.weight;
      if (isCoatConditionComplete) delete next.coatCondition;
      if (behavior) delete next.behavior;
      if (groomingFrequency) delete next.groomingFrequency;
      return next;
    });
  }, [behavior, dateOfBirth, gender, groomingFrequency, isBreedComplete, isCoatConditionComplete, isWeightValid, petName]);

  const handleContinue = () => {
    if (isStep2Valid) {
      setValidationErrors({});
      nextStep();
      return;
    }
    const errors: Record<string, string> = {
      ...(petName.trim() ? {} : { petName: "Pet name is required" }),
      ...(isBreedComplete ? {} : petType === "other" ? { precisePetType: "Pet type is required" } : { breed: "Breed is required" }),
      ...(dateOfBirth.trim() ? {} : { dateOfBirth: "Date of birth is required" }),
      ...(gender ? {} : { gender: "Gender is required" }),
      ...(isWeightValid ? {} : { weight: weight.trim() ? "Enter a weight greater than 0" : "Weight is required" }),
      ...(isCoatConditionComplete ? {} : { coatCondition: coatCondition === "" ? "Coat condition is required" : "Please confirm the shaving option" }),
      ...(behavior ? {} : { behavior: "Behavior is required" }),
      ...(groomingFrequency ? {} : { groomingFrequency: "Grooming frequency is required" }),
    };
    setValidationErrors(errors);
    const firstField = Object.keys(errors)[0];
    requestAnimationFrame(() => {
      const field = document.querySelector<HTMLElement>(`[data-booking-pet-field="${firstField}"]`);
      field?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      field?.querySelector<HTMLElement>("input, button")?.focus();
    });
  };

  return (
    <div className="w-full px-5 sm:px-0" data-booking-pet-form>
    <PetForm
      carePassportSlot={<>
        <CarePassportCard petId={selectedPetId} petName={petName} onOpen={() => void openPassport()} />
        <LoginModal open={passportLoginOpen} onOpenChange={(open) => { setPassportLoginOpen(open); if (!open && !user) setPendingPassport(false); }}><span /></LoginModal>
        {matchingPets.length > 0 && <div role="dialog" aria-modal="true" aria-label="Possible existing pets" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Is this pet already in My Pets?</h3>
            {matchingPets.map((pet) => <button key={pet.id} type="button" onClick={() => { setMatchingPets([]); handleSelectPet(pet); setSelectedPetId(pet.id); navigate(`/care-passport/${pet.id}`, { state: { returnTo: "/booking" } }); }} className="mb-2 block w-full rounded-lg border p-3 text-left">{pet.name} · {pet.breed || pet.precise_type || pet.pet_type} · {pet.birthday || "Birthday unknown"}</button>)}
            <button type="button" onClick={() => { setMatchingPets([]); void createAndOpenPassport(); }} className="mt-2 rounded-full bg-[#B97829] px-5 py-2 text-white">None of these — add a new pet</button>
            <button type="button" onClick={() => setMatchingPets([])} className="ml-3 rounded-full border border-[#8B6357] px-5 py-2 text-[#8B6357]">Cancel</button>
          </div>
        </div>}
      </>}
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
      validationErrors={validationErrors}
      onPrimaryAction={handleContinue}
      onBackAction={previousStep}
    />
    </div>
  );
}
