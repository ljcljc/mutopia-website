import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common/OrangeButton";
import { CLINICAL_OPTIONS } from "../questionnaire";
import type { BookingHealthStepProps } from "../types";
import { InlineStepperRow, OptionGrid, QuestionGroup, QuestionStepShell, UnderlinedFieldRow } from "../components/QuestionnairePrimitives";

const RECENT_MEDICAL_MANAGEMENT_OPTIONS = [
  "Not apply",
  "Current topical medications",
  "Current oral medications",
  "Known food allergies",
] as const;

const KNOWN_FOOD_ALLERGY_OPTIONS = ["Chicken", "Beef", "Dairy", "Grains"] as const;

interface ClinicalHistoryStepProps extends BookingHealthStepProps {
  onSkipSubmit?: () => void;
  isSubmitting?: boolean;
}

function setSingleArray(list: string[], value: string): string[] {
  return list.includes(value) ? [] : [value];
}

export function ClinicalHistoryStep({ value, onChange, onSkipSubmit, isSubmitting = false }: ClinicalHistoryStepProps) {
  const medical = value.medical;
  const clinical = value.clinical;
  const selectedMedicalManagement = medical.recentMedicalManagement;
  const isNotApply = selectedMedicalManagement.includes("Not apply");
  const showTopical = selectedMedicalManagement.includes("Current topical medications");
  const showOral = selectedMedicalManagement.includes("Current oral medications");
  const showAllergies = selectedMedicalManagement.includes("Known food allergies");

  return (
    <QuestionStepShell
      title="Clinical History & Behaviors"
      subtitle="Finish with longer-term medical patterns and behavioral cues your groomer should know before service day."
    >
      <QuestionGroup label="Recent medical management">
        <OptionGrid
          options={RECENT_MEDICAL_MANAGEMENT_OPTIONS}
          values={selectedMedicalManagement}
          columns={2}
          onToggle={(option) =>
            onChange((current) => {
              const nextValues = current.medical.recentMedicalManagement.includes(option) ? [] : [option];

              return {
                ...current,
                medical: {
                  ...current.medical,
                  recentMedicalManagement: nextValues,
                  topicalMedications: nextValues.includes("Current topical medications") ? current.medical.topicalMedications : "",
                  oralMedications: nextValues.includes("Current oral medications") ? current.medical.oralMedications : "",
                  knownFoodAllergies: nextValues.includes("Known food allergies") ? current.medical.knownFoodAllergies : [],
                  otherAllergies: "",
                },
              };
            })
          }
        />
      </QuestionGroup>

      {isNotApply ? (
        <>
          <Divider />
          <InlineStepperRow
            label="Vet visit frequency:"
            value={medical.vetVisitFrequencyPerYear}
            suffix="times per year"
            onChange={(next) => onChange((current) => ({ ...current, medical: { ...current.medical, vetVisitFrequencyPerYear: next } }))}
          />
          <UnderlinedFieldRow
            label="Recent vet visits:"
            ariaLabel="Recent vet visit"
            value={medical.recentVetVisitDate}
            onChange={(next) => onChange((current) => ({ ...current, medical: { ...current.medical, recentVetVisitDate: next } }))}
            calendar
            className="flex-row flex-nowrap items-end gap-3"
            labelClassName="shrink-0 whitespace-nowrap font-comfortaa text-[14px] font-medium leading-[24.5px] text-[#0f172b]"
            fieldWrapClassName="flex min-w-0 flex-1 items-center gap-2 border-b border-[#9ca3af] pb-[3px] sm:min-w-[182px]"
            inputClassName="leading-[21px]"
          />
          <UnderlinedFieldRow
            label="Reason:"
            ariaLabel="Reason"
            value={medical.recentVetVisitReason}
            onChange={(next) => onChange((current) => ({ ...current, medical: { ...current.medical, recentVetVisitReason: next } }))}
          />
          <Divider />
        </>
      ) : (
        <>
          {showTopical && !showAllergies ? (
            <UnderlinedFieldRow
              label="Topical medications:"
              ariaLabel="Topical medications"
              value={medical.topicalMedications}
              onChange={(next) => onChange((current) => ({ ...current, medical: { ...current.medical, topicalMedications: next } }))}
              className="flex-row flex-nowrap items-end gap-3"
              labelClassName="shrink-0 whitespace-nowrap"
              fieldWrapClassName="min-w-0 flex-1"
            />
          ) : null}

          {showOral && !showAllergies ? (
            <UnderlinedFieldRow
              label="Oral medications:"
              ariaLabel="Oral medications"
              value={medical.oralMedications}
              onChange={(next) => onChange((current) => ({ ...current, medical: { ...current.medical, oralMedications: next } }))}
              className="flex-row flex-nowrap items-end gap-3"
              labelClassName="shrink-0 whitespace-nowrap"
              fieldWrapClassName="min-w-0 flex-1"
            />
          ) : null}

          {showAllergies ? (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-[22px]">
              <QuestionGroup label="Known food allergies?" compact>
                <OptionGrid
                  options={KNOWN_FOOD_ALLERGY_OPTIONS}
                  values={medical.knownFoodAllergies}
                  columns={2}
                  compact
                  onToggle={(option) =>
                    onChange((current) => ({
                      ...current,
                      medical: {
                        ...current.medical,
                        knownFoodAllergies: setSingleArray(current.medical.knownFoodAllergies, option),
                        otherAllergies: "",
                      },
                    }))
                  }
                />
              </QuestionGroup>
              <div className="pt-[22px]">
                <UnderlinedFieldRow
                  label="Other allergies:"
                  ariaLabel="Other allergies"
                  value={medical.otherAllergies}
                  onChange={(next) => onChange((current) => ({ ...current, medical: { ...current.medical, otherAllergies: next } }))}
                  className="flex-row flex-nowrap items-end gap-3"
                  labelClassName="shrink-0 whitespace-nowrap"
                  fieldWrapClassName="min-w-0 flex-1"
                />
              </div>
            </div>
          ) : null}
        </>
      )}

      <OrangeButton
        onClick={onSkipSubmit}
        loading={isSubmitting}
        fullWidth
        className="h-auto w-full bg-[#00a63e] px-6 py-[12px] text-[14px] font-bold leading-6 text-white shadow-[0px_4px_6px_rgba(0,166,62,0.3)] hover:bg-[#00a63e] active:bg-[#00a63e] focus-visible:bg-[#00a63e] sm:max-w-[481px]"
      >
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Icon name="target" className="size-4 shrink-0 text-white" aria-hidden="true" />
          <span>No known medical conditions, skip all and submit</span>
        </span>
      </OrangeButton>

      <QuestionGroup label="Eating habits & Behaviors">
        <OptionGrid
          options={CLINICAL_OPTIONS.eatingHabitsAndBehaviors}
          values={clinical.eatingHabitsAndBehaviors}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              clinical: {
                ...current.clinical,
                noKnownMedicalConditions: false,
                eatingHabitsAndBehaviors: setSingleArray(current.clinical.eatingHabitsAndBehaviors, option),
              },
            }))
          }
        />
      </QuestionGroup>

      <Divider />

      <QuestionGroup label="Metabolic & General Health">
        <OptionGrid
          options={CLINICAL_OPTIONS.metabolicAndGeneralHealth}
          values={clinical.metabolicAndGeneralHealth}
          columns={2}
          getOptionClassName={(option) => (option === "Low energy, exercise intolerance" ? "whitespace-nowrap" : undefined)}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              clinical: {
                ...current.clinical,
                noKnownMedicalConditions: false,
                metabolicAndGeneralHealth: setSingleArray(current.clinical.metabolicAndGeneralHealth, option),
              },
            }))
          }
        />
      </QuestionGroup>

      <Divider />

      <QuestionGroup label="Pre-existing health conditions">
        <OptionGrid
          options={CLINICAL_OPTIONS.preExistingHealthConditions}
          values={clinical.preExistingHealthConditions}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              clinical: {
                ...current.clinical,
                noKnownMedicalConditions: false,
                preExistingHealthConditions: setSingleArray(current.clinical.preExistingHealthConditions, option),
              },
            }))
          }
        />
      </QuestionGroup>

      <Divider />

      <QuestionGroup label="Chronic conditions">
        <OptionGrid
          options={CLINICAL_OPTIONS.chronicConditions}
          values={clinical.chronicConditions}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              clinical: {
                ...current.clinical,
                noKnownMedicalConditions: false,
                chronicConditions: setSingleArray(current.clinical.chronicConditions, option),
              },
            }))
          }
        />
      </QuestionGroup>

      <Divider />

      <QuestionGroup label="Surgery history">
        <OptionGrid
          options={CLINICAL_OPTIONS.surgeryHistory}
          values={clinical.surgeryHistory}
          columns={2}
          onToggle={(option) =>
            onChange((current) => ({
              ...current,
              clinical: {
                ...current.clinical,
                noKnownMedicalConditions: false,
                surgeryHistory: setSingleArray(current.clinical.surgeryHistory, option),
              },
            }))
          }
        />
      </QuestionGroup>
    </QuestionStepShell>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#e5e7eb]" />;
}
