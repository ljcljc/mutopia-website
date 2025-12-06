import { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";
import { CustomInput, CustomSelect, CustomSelectItem, CustomRadio, OrangeButton, FileUpload } from "@/components/common";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { DatePicker } from "@/components/common/DatePicker";
import { Switch } from "@/components/ui/switch";
import { useBookingStore } from "./bookingStore";
import type { WeightUnit, Gender, PetType } from "./bookingStore";
import { ReferenceStylesUpload } from "./ReferenceStylesUpload";
import type { PetBreedOut } from "@/lib/api";

function getBreedOptions(petType: PetType, breeds: PetBreedOut[]): string[] {
  return breeds
    .filter((breed) => breed.pet_type === petType)
    .map((breed) => breed.breed)
    .sort();
}

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
    behavior,
    groomingFrequency,
    specialNotes,
    petBreeds,
    isLoadingBreeds,
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
    setBehavior,
    setGroomingFrequency,
    setSpecialNotes,
    loadPetBreeds,
    previousStep,
    nextStep,
  } = useBookingStore();

  // 计算日期限制：最多20年前的今天，不能超过今天
  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
  const minDateObj = new Date(today);
  minDateObj.setFullYear(today.getFullYear() - 20);
  const minDate = `${minDateObj.getFullYear()}-${String(minDateObj.getMonth() + 1).padStart(2, "0")}`;

  const [, setPetPhoto] = useState<File | null>(null);
  const hasLoadedBreeds = useRef(false);

  // 获取 breeds 数据（只加载一次）
  useEffect(() => {
    if (!hasLoadedBreeds.current) {
      hasLoadedBreeds.current = true;
      loadPetBreeds();
    }
  }, [loadPetBreeds]);

  const handlePetPhotoChange = (files: File[]) => {
    if (files.length > 0) {
      setPetPhoto(files[0]);
    }
  };

  const handleReferenceStylesChange = (files: File[]) => {
    // 可以在这里添加额外的处理逻辑
    console.log("Reference styles changed:", files);
  };

  // Clear breed when pet type changes and current breed is not in the new options
  useEffect(() => {
    const breedOptions = getBreedOptions(petType, petBreeds);
    if (breed && !breedOptions.includes(breed)) {
      setBreed("");
    }
  }, [petType, breed, petBreeds, setBreed]);

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

            {/* Breed - Hidden when pet type is cat or other */}
            {petType !== "cat" && petType !== "other" && (
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
                placeholder={isLoadingBreeds ? "Loading breeds..." : "Select or type breed"}
                value={breed}
                onValueChange={setBreed}
                disabled={isLoadingBreeds}
                leftElement={
                  <Icon
                    name="search"
                    className="relative shrink-0 w-[20px] h-[20px] text-[#717182]"
                  />
                }
              >
                {getBreedOptions(petType, petBreeds).map((breedOption) => (
                  <CustomSelectItem key={breedOption} value={breedOption}>
                    {breedOption}
                  </CustomSelectItem>
                ))}
              </CustomSelect>
            </div>
            )}

            {/* Precise pet type - Only shown when pet type is other */}
            {petType === "other" && (
              <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                <div className="flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                    Precise pet type
                  </p>
                </div>
                <CustomInput
                  label=""
                  type="text"
                  placeholder="Enter pet type"
                  value={precisePetType}
                  onChange={(e) => setPrecisePetType(e.target.value)}
                />
              </div>
            )}

            {/* Date of Birth and Gender */}
            <div className="flex gap-[16px] items-start relative shrink-0 w-full">
              <div className="flex flex-col items-start relative shrink-0 w-[140px]">
                <DatePicker
                  label="Date of birth"
                  placeholder="YYYY-MM"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  mode="month"
                  minDate={minDate}
                  maxDate={maxDate}
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
                  <CustomSelectItem value="unknown">Unknown</CustomSelectItem>
                </CustomSelect>
              </div>
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                  Weight (lb or kg)
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
                    <CustomSelectItem value="kg">kg</CustomSelectItem>
                    <CustomSelectItem value="lb">lb</CustomSelectItem>
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
                    isSelected={coatCondition === "not_matted"}
                    onClick={() => setCoatCondition("not_matted")}
                    className="self-stretch h-[53px]"
                  />
                  <CustomRadio
                    label="Matted"
                    isSelected={coatCondition === "matted"}
                    onClick={() => setCoatCondition("matted")}
                    className="self-stretch h-[53px]"
                  />
                  <CustomRadio
                    label="Severely matted"
                    isSelected={coatCondition === "severely_matted"}
                    onClick={() => setCoatCondition("severely_matted")}
                    className="self-stretch h-[53px]"
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
                    className="self-stretch h-[53px]"
                  />
                  <CustomRadio
                    label="Anxious"
                    isSelected={behavior === "anxious"}
                    onClick={() => setBehavior("anxious")}
                    className="self-stretch h-[53px]"
                  />
                  <CustomRadio
                    label="Hard to handle"
                    isSelected={behavior === "hard_to_handle"}
                    onClick={() => setBehavior("hard_to_handle")}
                    className="self-stretch h-[53px]"
                  />
                  <CustomRadio
                    label="Senior pets"
                    isSelected={behavior === "senior_pets"}
                    onClick={() => setBehavior("senior_pets")}
                    className="self-stretch h-[53px]"
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
              isSelected={groomingFrequency === "bi_weekly"}
              onClick={() => setGroomingFrequency("bi_weekly")}
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
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-black whitespace-pre-wrap">
              Upload pet photo (optional but helpful)
            </p>
            <div className="flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full">
              <FileUpload
                accept="image/*"
                multiple={false}
                maxSizeMB={10}
                onChange={handlePetPhotoChange}
                buttonText="Click to upload"
                fileTypeHint="JPG, JPEG, PNG less than 10MB"
                showDragHint={true}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload Reference Styles Card */}
      <ReferenceStylesUpload onChange={handleReferenceStylesChange} />

      {/* Special Notes Card */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <CustomTextarea
              label="Special instruments or notes (optional)"
              placeholder="e.g., 'My dog is nervous around clippers', 'Has sensitive skin', 'I have 2 pets and prefer to groom together..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              helperText="Include any health conditions, behavioral notes, or grooming preferences"
            labelClassName="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] text-[16px]"
            />
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
            className="border-2 border-[#de6a07] border-solid box-border flex gap-[8px] h-[36px] items-center justify-center px-[30px] relative rounded-[32px] shrink-0 cursor-pointer hover:bg-[rgba(222,106,7,0.1)] transition-colors"
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
