import { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icon";
import { CustomInput, CustomSelect, CustomSelectItem, CustomRadio } from "@/components/common";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { DatePicker } from "@/components/common/DatePicker";
import { OrangeButton } from "@/components/common/OrangeButton";
import { Switch } from "@/components/ui/switch";
import { useBookingStore } from "./bookingStore";
import type { WeightUnit, Gender, PetType } from "./bookingStore";


// Breed options based on pet type
const DOG_BREEDS = [
  "Golden Retriever",
  "Labrador Retriever",
  "German Shepherd",
  "French Bulldog",
  "Bulldog",
  "Beagle",
  "Poodle",
  "Rottweiler",
  "Yorkshire Terrier",
  "Dachshund",
  "Siberian Husky",
  "Great Dane",
  "Boxer",
  "Shih Tzu",
  "Border Collie",
  "Chihuahua",
  "Australian Shepherd",
  "Cocker Spaniel",
  "Pomeranian",
  "Maltese",
];

const CAT_BREEDS = [
  "Persian",
  "Maine Coon",
  "British Shorthair",
  "Ragdoll",
  "Bengal",
  "Siamese",
  "American Shorthair",
  "Scottish Fold",
  "Sphynx",
  "Russian Blue",
  "Norwegian Forest Cat",
  "Abyssinian",
  "Exotic Shorthair",
  "Oriental",
  "Turkish Angora",
  "Birman",
  "Himalayan",
  "Manx",
  "Devon Rex",
  "Cornish Rex",
];

const OTHER_PET_BREEDS = [
  "Rabbit",
  "Guinea Pig",
  "Hamster",
  "Ferret",
  "Chinchilla",
  "Hedgehog",
  "Rat",
  "Mouse",
];

function getBreedOptions(petType: PetType): string[] {
  switch (petType) {
    case "dog":
      return DOG_BREEDS;
    case "cat":
      return CAT_BREEDS;
    case "other":
      return OTHER_PET_BREEDS;
    default:
      return [];
  }
}

export function Step2() {
  const {
    petName,
    petType,
    breed,
    isMixedBreed,
    dateOfBirth,
    gender,
    weight,
    weightUnit,
    coatCondition,
    behavior,
    groomingFrequency,
    specialNotes,
    setPetName,
    setPetType,
    setBreed,
    setIsMixedBreed,
    setDateOfBirth,
    setGender,
    setWeight,
    setWeightUnit,
    setCoatCondition,
    setBehavior,
    setGroomingFrequency,
    setSpecialNotes,
    previousStep,
    nextStep,
  } = useBookingStore();

  const [, setPetPhoto] = useState<File | null>(null);
  const [referenceStyles, setReferenceStyles] = useState<File[]>([]);

  const handlePetPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPetPhoto(e.target.files[0]);
    }
  };

  const handleReferenceStylesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReferenceStyles(Array.from(e.target.files));
    }
  };

  // Clear breed when pet type changes and current breed is not in the new options
  useEffect(() => {
    const breedOptions = getBreedOptions(petType);
    if (breed && !breedOptions.includes(breed)) {
      setBreed("");
    }
  }, [petType, breed, setBreed]);

  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative w-full">
      {/* Pet Information Card */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[14px] items-start relative w-full">
          {/* Section Header */}
          <div className="flex flex-col gap-[4px] items-start relative shrink-0">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
              Tell us about your furry friend
            </p>
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
              This helps groomers prepare and provide the best care possible
            </p>
          </div>

          <div className="flex flex-col gap-[16px] items-start relative shrink-0 w-[330px]">
            {/* Pet Name */}
            <div className="flex gap-[20px] items-start relative shrink-0 w-full">
              <div className="flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative shrink-0">
                <CustomInput
                  label="Pet name"
                  type="text"
                  placeholder="Duke"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                />
              </div>
            </div>

            {/* Pet Type */}
            <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                  Pet type
                </p>
              </div>
              <div className="flex gap-[8px] items-start relative shrink-0">
                <CustomRadio
                  label="Dog"
                  icon="dog"
                  isSelected={petType === "dog"}
                  onClick={() => setPetType("dog")}
                />
                <CustomRadio
                  label="Cat"
                  icon="cat"
                  isSelected={petType === "cat"}
                  onClick={() => setPetType("cat")}
                />
                <CustomRadio
                  label="Other"
                  icon="pet"
                  isSelected={petType === "other"}
                  onClick={() => setPetType("other")}
                />
              </div>
            </div>

            {/* Breed */}
            <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="flex h-[12.25px] items-center justify-between relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                  Breed
                </p>
                <div className="flex gap-[4px] items-center justify-end relative shrink-0">
                  <Switch 
                    checked={isMixedBreed} 
                    onCheckedChange={setIsMixedBreed}
                  />
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                    Mixed breed
                  </p>
                </div>
              </div>
              <CustomSelect
                placeholder="Select or type breed"
                value={breed}
                onValueChange={setBreed}
                leftElement={
                  <Icon
                    name="search"
                    className="relative shrink-0 w-[20px] h-[20px] text-[#717182]"
                  />
                }
              >
                {getBreedOptions(petType).map((breedOption) => (
                  <CustomSelectItem key={breedOption} value={breedOption}>
                    {breedOption}
                  </CustomSelectItem>
                ))}
              </CustomSelect>
            </div>

            {/* Date of Birth and Gender */}
            <div className="flex gap-[16px] items-start relative shrink-0 w-full">
              <div className="flex flex-col items-start relative shrink-0 w-[140px]">
                <DatePicker
                  label="Date of birth"
                  placeholder="YYYY-MM"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  mode="month"
                />
              </div>
              <div className="flex flex-col items-start relative shrink-0 w-[140px]">
                <CustomSelect
                  label="Gender"
                  placeholder="Select"
                  value={gender}
                  onValueChange={(value) => setGender(value as Gender)}
                >
                  <CustomSelectItem value="male">Male</CustomSelectItem>
                  <CustomSelectItem value="female">Female</CustomSelectItem>
                  <CustomSelectItem value="neutered">Neutered</CustomSelectItem>
                  <CustomSelectItem value="spayed">Spayed</CustomSelectItem>
                </CustomSelect>
              </div>
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                  Weight (lbs or kg)
                </p>
              </div>
              <div className="flex items-start relative shrink-0 w-[200px] group">
                <div className="bg-white flex-1 h-[36px] relative rounded-bl-[12px] rounded-tl-[12px] shrink-0">
                  <div className="box-border flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-full">
                    <input
                      type="text"
                      placeholder="3"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[12.25px] bg-transparent border-none outline-none placeholder:text-[#717182]"
                    />
                  </div>
                  {/* Border with states */}
                  <div
                    aria-hidden="true"
                    className="absolute border border-solid inset-0 pointer-events-none rounded-bl-[12px] rounded-tl-[12px] transition-colors duration-200 border-gray-200 group-hover:border-[#717182] group-focus-within:border-[#2374ff]!"
                  />
                </div>
                <div className="relative shrink-0 opacity-80">
                  <CustomSelect
                    placeholder="Select"
                    value={weightUnit}
                    onValueChange={(value) => setWeightUnit(value as WeightUnit)}
                    className="w-auto"
                    noLeftRadius={true}
                  >
                    <CustomSelectItem value="lbs">lbs</CustomSelectItem>
                    <CustomSelectItem value="kg">kg</CustomSelectItem>
                  </CustomSelect>
                </div>
              </div>
            </div>

            {/* Coat Condition and Behavior - Same Row */}
              {/* Coat Condition */}
              <div className="flex flex-col gap-[8px] items-start relative shrink-0">
                <div className="flex gap-[7px] h-[12.25px] items-center relative shrink-0">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                    Coat condition
                  </p>
                </div>
                <div className="flex gap-[8px] items-stretch relative shrink-0">
                  <CustomRadio
                    label="Not matted"
                    isSelected={coatCondition === "not-matted"}
                    onClick={() => setCoatCondition("not-matted")}
                    className="self-stretch"
                  />
                  <CustomRadio
                    label="Matted"
                    isSelected={coatCondition === "matted"}
                    onClick={() => setCoatCondition("matted")}
                    className="self-stretch"
                  />
                  <CustomRadio
                    label="Severely matted"
                    isSelected={coatCondition === "severely-matted"}
                    onClick={() => setCoatCondition("severely-matted")}
                    className="self-stretch"
                  />
                </div>
              </div>

              {/* Behavior */}
              <div className="flex flex-col gap-[8px] items-start relative shrink-0">
                <div className="flex gap-[7px] h-[12.25px] items-center relative shrink-0">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                    Behavior
                  </p>
                </div>
                <div className="flex gap-[8px] items-stretch relative shrink-0">
                  <CustomRadio
                    label="Friendly"
                    isSelected={behavior === "friendly"}
                    onClick={() => setBehavior("friendly")}
                    className="self-stretch"
                  />
                  <CustomRadio
                    label="Anxious"
                    isSelected={behavior === "anxious"}
                    onClick={() => setBehavior("anxious")}
                    className="self-stretch"
                  />
                  <CustomRadio
                    label="Hard to handle"
                    isSelected={behavior === "hard-to-handle"}
                    onClick={() => setBehavior("hard-to-handle")}
                    className="self-stretch"
                  />
                  <CustomRadio
                    label="Senior pets"
                    isSelected={behavior === "senior-pets"}
                    onClick={() => setBehavior("senior-pets")}
                    className="self-stretch"
                  />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grooming Frequency Card */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[14px] items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-[3.5px] items-start relative shrink-0">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
              How often would you like grooming?
            </p>
            {/* Info Alert */}
            <div className="bg-blue-50 border border-[#bedbff] border-solid relative rounded-[8px] shrink-0 w-full">
              <div className="box-border flex items-center overflow-clip px-[16px] py-[8px] relative rounded-[inherit]">
                <div className="flex gap-[8px] items-start relative shrink-0">
                  <Icon
                    name="alert-info"
                    className="relative shrink-0 size-[12px] text-[#ffffff]"
                  />
                  <div className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#193cb8] text-[10px] whitespace-nowrap">
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold mb-0">
                      Professional Tip:
                    </p>
                    <p>
                      Regular grooming every 2-4 weeks keeps your pet's coat healthy, reduces shedding, and helps detect health issues early.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="gap-[16px] grid grid-cols-2 grid-rows-2 h-[166px] relative shrink-0 w-full">
            <CustomRadio
              label="Weekly"
              description="Once a week"
              isSelected={groomingFrequency === "weekly"}
              onClick={() => setGroomingFrequency("weekly")}
              variant="with-description"
            />
            <CustomRadio
              label="Bi-weekly"
              description="Every 2 weeks"
              isSelected={groomingFrequency === "bi-weekly"}
              onClick={() => setGroomingFrequency("bi-weekly")}
              variant="with-description"
            />
            <CustomRadio
              label="Monthly"
              description="Once a month"
              isSelected={groomingFrequency === "monthly"}
              onClick={() => setGroomingFrequency("monthly")}
              variant="with-description"
            />
            <CustomRadio
              label="Occasionally"
              description="As needed"
              isSelected={groomingFrequency === "occasionally"}
              onClick={() => setGroomingFrequency("occasionally")}
              variant="with-description"
            />
          </div>
        </div>
      </div>

      {/* Upload Pet Photo Card */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[14px] items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-black w-[370px] whitespace-pre-wrap">
              Upload pet photo (optional but helpful)
            </p>
            <div className="flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full">
              <div className="bg-neutral-50 border-[#de6a07] border-[1.5px] border-dashed box-border flex flex-col gap-[12px] items-center justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                <div className="flex flex-col gap-[18px] items-center justify-center relative shrink-0">
                  <div className="overflow-clip relative shrink-0 size-[48px]">
                    <Icon
                      name="pet"
                      className="block size-full text-[#A3A3A3]"
                    />
                  </div>
                  <div className="flex flex-col gap-[3px] items-center justify-center relative shrink-0">
                    <div className="flex gap-[9px] items-center justify-center relative shrink-0">
                      <label className="border-2 border-[#8b6357] border-solid box-border flex gap-[8px] h-[28px] items-center justify-center px-[26px] py-[18px] relative rounded-[32px] shrink-0 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePetPhotoChange}
                          className="hidden"
                        />
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
                          Book Now
                        </p>
                        <Icon
                          name="button-arrow"
                          className="relative shrink-0 size-[14px] text-[#8b6357]"
                        />
                      </label>
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-neutral-600">
                        or drag and drop
                      </p>
                    </div>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16.5px] text-neutral-400">
                      JPG, JPEG, PNG less than 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Reference Styles Card */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[14px] items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="flex flex-col items-start relative shrink-0">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-black">
                Upload reference styles (optional)
              </p>
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
                This helps groomers prepare and provide the best care possible
              </p>
            </div>
            <div className="flex gap-[12px] items-start overflow-clip relative shrink-0 w-full">
              <div className="bg-neutral-50 border-[#de6a07] border-[1.5px] border-dashed box-border flex flex-1 gap-[12px] items-end p-[24px] relative rounded-[16px] shrink-0">
                <div className="flex flex-1 flex-col gap-[12px] items-center justify-end relative shrink-0">
                  <div className="flex gap-[12px] items-center relative shrink-0">
                    {referenceStyles.slice(0, 2).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white border border-dashed border-neutral-300 h-[120px] relative rounded-[8px] shrink-0 w-[144px]"
                      >
                        <div className="h-[120px] overflow-clip relative rounded-[inherit] w-[144px]">
                          <div className="absolute bg-[rgba(222,106,7,0.5)] inset-0 rounded-[8px]" />
                        </div>
                      </div>
                    ))}
                    <div className="bg-white border border-dashed border-neutral-300 h-[120px] relative rounded-[8px] shrink-0 w-[144px]">
                      <div className="h-[120px] overflow-clip relative rounded-[inherit] w-[144px]">
                        <div className="absolute bg-neutral-100 inset-0 rounded-[8px]" />
                        <label className="absolute left-1/2 size-[48px] top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleReferenceStylesChange}
                            className="hidden"
                          />
                          <Icon
                            name="pet"
                            className="block size-full text-[#A3A3A3]"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[3px] items-center justify-center relative shrink-0">
                    <div className="flex gap-[9px] items-center justify-center relative shrink-0">
                      <label className="border-2 border-[#8b6357] border-solid box-border flex gap-[8px] h-[28px] items-center justify-center px-[26px] py-[18px] relative rounded-[32px] shrink-0 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleReferenceStylesChange}
                          className="hidden"
                        />
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
                          Book Now
                        </p>
                        <Icon
                          name="button-arrow"
                          className="relative shrink-0 size-[14px] text-[#8b6357]"
                        />
                      </label>
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-neutral-600">
                        or drag and drop
                      </p>
                    </div>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16.5px] text-neutral-400">
                      JPG, JPEG, PNG less than 1MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Notes Card */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <CustomTextarea
              label="Special instruments or notes (optional)"
              placeholder="e.g., 'My dog is nervous around clippers', 'Has sensitive skin', 'I have 2 pets and prefer to groom together..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              helperText="Include any health conditions, behavioral notes, or grooming preferences"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[20px] items-start relative shrink-0 w-full">
        <div className="flex gap-[20px] items-center relative shrink-0">
          <OrangeButton size="medium" onClick={nextStep}>
            <div className="flex gap-[4px] items-center">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-white">
                Continue
              </p>
              <Icon
                name="button-arrow"
                aria-label="Arrow"
                className="size-[14px] text-white"
              />
            </div>
          </OrangeButton>
          <button
            type="button"
            onClick={previousStep}
            className="border-2 border-[#de6a07] border-solid box-border flex gap-[8px] h-[36px] items-center justify-center px-[30px] py-[18px] relative rounded-[32px] shrink-0 cursor-pointer hover:bg-[rgba(222,106,7,0.1)] transition-colors"
          >
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[14px] text-[#de6a07]">
              Back
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
