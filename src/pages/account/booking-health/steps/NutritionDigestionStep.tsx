import type { BookingHealthStepProps } from "../types";
import { InlineStepperRow, OptionGrid, OptionPill, QuestionGroup, QuestionStepShell, UnderlinedFieldRow } from "../components/QuestionnairePrimitives";

const PRIMARY_DIET_OPTIONS = ["Dry kibble", "Wet food", "Raw diet", "Home-cooked"] as const;
const FEEDING_HABIT_OPTIONS = ["Portion-controlled", "Free-feeding (Always available)"] as const;
const WATER_INTAKE_OPTIONS = ["Very little", "Normal", "Excessively"] as const;
const STOOL_CONDITION_OPTIONS = ["Firm", "Soft", "Loose", "Diarrhea", "Constipated", "Varies"] as const;
const VOMITING_OPTIONS = ["Never", "Occasionally", "Frequently"] as const;
const FOOD_SENSITIVITY_OPTIONS = ["Chicken", "Beef", "Dairy", "Grains"] as const;
const TREAT_FREQUENCY_OPTIONS = ["Portion-controlled", "Unrestricted"] as const;
const TREAT_TYPE_OPTIONS = [
  "Freeze-Dried meat",
  "Jerky & Air-Dried",
  "Dental & Chew sticks",
  "Wet food pouches",
  "Biscuits & Cookies",
  "Dairy treats",
  "Fruit & Veggie snacks",
  "Prescription treats",
] as const;
const DAILY_SUPPLEMENT_OPTIONS = [
  "Joint & Mobility",
  "Digestive & Gut Health",
  "Skin & Coat",
  "Immune & Antioxidant",
  "Dental & Oral Health",
  "Calming & Anxiety",
  "Multivitamin & Minerals",
  "Weight & Metabolism",
] as const;

function setSingleArray(list: string[], value: string): string[] {
  return list.includes(value) ? [] : [value];
}

function setSingleValue(currentValue: string, value: string): string {
  return currentValue === value ? "" : value;
}

export function NutritionDigestionStep({ value, onChange }: BookingHealthStepProps) {
  const nutrition = value.nutrition;
  const shouldShowCurrentBrand = !nutrition.primaryDiet.includes("Home-cooked");
  const shouldShowFoodSensitivities = nutrition.vomitingFrequency !== "Never";

  return (
    <QuestionStepShell
      title="Nutrition & Digestion"
      subtitle="Help us understand your pet's daily diet and digestive health to create the best care plan."
    >
      <QuestionGroup label="What is your pet&apos;s primary diet?">
        <OptionGrid
          options={PRIMARY_DIET_OPTIONS}
          values={nutrition.primaryDiet}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: { ...current.nutrition, primaryDiet: setSingleArray(current.nutrition.primaryDiet, option) },
            }))
          }
        />
      </QuestionGroup>

      {shouldShowCurrentBrand ? (
        <UnderlinedFieldRow
          label="Current brand (optional)"
          value={nutrition.currentBrand}
          onChange={(next) => onChange((current) => ({ ...current, nutrition: { ...current.nutrition, currentBrand: next } }))}
          className="border-b border-[#e5e7eb] pb-5"
          labelClassName="whitespace-nowrap"
        />
      ) : null}

      <QuestionGroup label="Feeding habits" divider>
        <OptionRow
          options={FEEDING_HABIT_OPTIONS}
          values={nutrition.feedingHabits}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: {
                ...current.nutrition,
                feedingHabits: setSingleArray(current.nutrition.feedingHabits, option),
              },
            }))
          }
        />
        <InlineStepperRow
          label="Frequency:"
          value={nutrition.feedingFrequencyPerDay}
          suffix="times per day"
          onChange={(next) => onChange((current) => ({ ...current, nutrition: { ...current.nutrition, feedingFrequencyPerDay: next } }))}
        />
      </QuestionGroup>

      <QuestionGroup label="Water intake" divider>
        <OptionGrid
          options={WATER_INTAKE_OPTIONS}
          values={nutrition.waterIntake}
          columns={3}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: { ...current.nutrition, waterIntake: setSingleArray(current.nutrition.waterIntake, option) },
            }))
          }
        />
      </QuestionGroup>

      <QuestionGroup label="How is your pet&apos;s usual stool condition?">
        <OptionGrid
          options={STOOL_CONDITION_OPTIONS}
          values={nutrition.stoolCondition}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: {
                ...current.nutrition,
                stoolCondition: setSingleArray(current.nutrition.stoolCondition, option),
              },
            }))
          }
        />
      </QuestionGroup>

      <QuestionGroup label="Does your pet experience vomiting?">
        <OptionGrid
          options={VOMITING_OPTIONS}
          values={nutrition.vomitingFrequency ? [nutrition.vomitingFrequency] : []}
          columns={3}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: {
                ...current.nutrition,
                vomitingFrequency: setSingleValue(current.nutrition.vomitingFrequency, option),
              },
            }))
          }
        />
      </QuestionGroup>

      {shouldShowFoodSensitivities ? (
        <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-[22px]">
          <QuestionGroup label="Known food sensitivities?" compact>
            <OptionGrid
              options={FOOD_SENSITIVITY_OPTIONS}
              values={nutrition.foodSensitivities}
              columns={2}
              compact
              onToggle={(option) =>
                onChange((current) => ({
                    ...current,
                    nutrition: {
                      ...current.nutrition,
                      foodSensitivities: setSingleArray(current.nutrition.foodSensitivities, option),
                      otherFoodSensitivity: "",
                    },
                  }))
              }
            />
          </QuestionGroup>
        </div>
      ) : null}

      <QuestionGroup label="Treat frequency">
        <OptionRow
          options={TREAT_FREQUENCY_OPTIONS}
          values={nutrition.treatFrequency ? [nutrition.treatFrequency] : []}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: {
                ...current.nutrition,
                treatFrequency: setSingleValue(current.nutrition.treatFrequency, option),
              },
            }))
          }
        />
        <InlineStepperRow
          label="Frequency:"
          value={nutrition.treatTimesPerDay}
          suffix="times per day"
          onChange={(next) => onChange((current) => ({ ...current, nutrition: { ...current.nutrition, treatTimesPerDay: next } }))}
        />
      </QuestionGroup>

      <QuestionGroup label="Types of treats" divider>
        <OptionGrid
          options={TREAT_TYPE_OPTIONS}
          values={nutrition.treatTypes}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: { ...current.nutrition, treatTypes: setSingleArray(current.nutrition.treatTypes, option) },
            }))
          }
        />
      </QuestionGroup>

      <QuestionGroup label="Daily supplements">
        <OptionGrid
          options={DAILY_SUPPLEMENT_OPTIONS}
          values={nutrition.dailySupplements}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              nutrition: {
                ...current.nutrition,
                dailySupplements: setSingleArray(current.nutrition.dailySupplements, option),
              },
            }))
          }
        />
      </QuestionGroup>
    </QuestionStepShell>
  );
}

function OptionRow({
  options,
  values,
  onToggle,
}: {
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 sm:gap-[10.5px]">
      {options.map((option) => (
        <OptionPill key={option} label={option} selected={values.includes(option)} onClick={() => onToggle(option)} />
      ))}
    </div>
  );
}
