import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PetForm } from "@/components/common/PetForm";
import type { WeightUnit, Gender, PetType, Behavior, CoatCondition } from "@/components/booking/bookingStore";
import type { PetBreedOut } from "@/lib/api";
import { createPet, getPetBreeds } from "@/lib/api";

export default function AddPet() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);

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
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [referencePhotoIds, setReferencePhotoIds] = useState<number[]>([]);
  const [referencePhotoUrls, setReferencePhotoUrls] = useState<string[]>([]);
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [referenceStyles, setReferenceStyles] = useState<File[]>([]);

  const loadPetBreeds = async () => {
    setIsLoadingBreeds(true);
    try {
      const breeds = await getPetBreeds();
      setPetBreeds(breeds);
    } catch (error) {
      console.error("Failed to load pet breeds:", error);
    } finally {
      setIsLoadingBreeds(false);
    }
  };

  const hasLoadedBreedsRef = useRef(false);

  useEffect(() => {
    if (hasLoadedBreedsRef.current) return;
    hasLoadedBreedsRef.current = true;
    loadPetBreeds();
  }, []);

  const handleSave = async () => {
    if (!petName.trim()) {
      toast.error("Please enter your pet's name.");
      return;
    }
    if (!petType) {
      toast.error("Please select a pet type.");
      return;
    }

    const weightValue = weight ? parseFloat(weight) : null;
    setIsSaving(true);
    try {
      await createPet(
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
      toast.success("Pet saved successfully.");
      if (location.state?.from === "my-pets") {
        navigate("/account/pets");
      } else {
        navigate("/account/dashboard");
      }
    } catch (error) {
      console.error("Failed to create pet:", error);
      toast.error("Failed to save pet. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-[60px] items-center pb-[60px] sm:pb-[100px] px-[calc(20*var(--px393))] sm:px-0 w-full min-h-full relative bg-[#f9f1e8]">
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full max-w-[780px]">
        <div className="h-[27px] flex items-center w-full">
          <nav
            aria-label="Breadcrumb"
            className="font-['Comfortaa:Bold',sans-serif] font-bold text-[20px] text-[#4A3C2A] flex items-center gap-[6px]"
          >
            {location.state?.from === "my-pets" ? (
              <>
                <Link to="/account/pets" className="hover:text-[#DE6A07] transition-colors">
                  My pets
                </Link>
                <span aria-hidden="true">{" > "}</span>
                <span>Add pet</span>
              </>
            ) : (
              <>
                <Link to="/account/dashboard" className="hover:text-[#DE6A07] transition-colors">
                  Dashboard
                </Link>
                <span aria-hidden="true">{" > "}</span>
                <span>Add pet</span>
              </>
            )}
          </nav>
        </div>
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
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
            isPrimaryActionLoading={isSaving}
            onPrimaryAction={handleSave}
            onBackAction={() => navigate("/account/pets")}
            showMobileStepHeader={false}
          />
        </div>
      </div>
    </div>
  );
}
