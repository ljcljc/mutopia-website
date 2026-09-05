import { useState } from "react";
import { Plus, X } from "lucide-react";
import { LIFESTYLE_OPTIONS } from "../questionnaire";
import type { BookingHealthStepProps } from "../types";
import { FieldTitle, InlineStepperRow, OptionGrid, QuestionGroup, QuestionStepShell } from "../components/QuestionnairePrimitives";

function toggleSingleValue(list: string[], value: string): string[] {
  return list.includes(value) ? [] : [value];
}

export function LifestyleEnvironmentStep({
  value,
  onChange,
  petName,
}: BookingHealthStepProps & { petName: string }) {
  const lifestyle = value.lifestyle;
  const [isAddingNeighborhood, setIsAddingNeighborhood] = useState(false);
  const showNeighborhoodInput = isAddingNeighborhood || lifestyle.neighborhoods.length === 0;

  const commitNeighborhoodDraft = () => {
    const next = lifestyle.neighborhoodDraft.trim();
    onChange((current) => ({
      ...current,
      lifestyle: {
        ...current.lifestyle,
        neighborhoods: next && !current.lifestyle.neighborhoods.includes(next)
          ? [...current.lifestyle.neighborhoods, next]
          : current.lifestyle.neighborhoods,
        neighborhoodDraft: "",
      },
    }));
    setIsAddingNeighborhood(false);
  };

  return (
    <QuestionStepShell
      title="Lifestyle & Environment"
      subtitle={`Share ${petName}'s daily routine so we can tailor a calm, stress-free environment.`}
    >
          <div className="space-y-[14px]">
            <div className="flex items-center justify-between gap-3">
              <FieldTitle>Living neighborhood</FieldTitle>
              <button
                type="button"
                onClick={() => setIsAddingNeighborhood(true)}
                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full px-2 py-1 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8b6357] hover:bg-[rgba(139,99,87,0.10)]"
              >
                <Plus className="size-4" />
                Add more
              </button>
            </div>
            <div className="grid gap-[10px] sm:grid-cols-2 sm:gap-[10.5px]">
              {lifestyle.neighborhoods.map((item) => (
                <div
                  key={item}
                  className="flex min-h-[53px] items-center rounded-full border-2 border-[#00d492] bg-[#ecfdf5] px-5 py-3 sm:px-6"
                >
                  <span className="min-w-0 flex-1 truncate text-center font-comfortaa text-[14px] font-medium text-[#007a55]">{item}</span>
                  <button
                    type="button"
                    aria-label={`Remove neighborhood ${item}`}
                    onClick={() =>
                      onChange((current) => ({
                        ...current,
                        lifestyle: {
                          ...current.lifestyle,
                          neighborhoods: current.lifestyle.neighborhoods.filter((entry) => entry !== item),
                        },
                      }))
                    }
                    className="ml-4 shrink-0 cursor-pointer rounded-full text-[#7b869b] hover:bg-[rgba(123,134,155,0.10)]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              {showNeighborhoodInput ? (
                <div className="flex min-h-[53px] items-center rounded-full border-2 border-[#00ce8d] bg-[#ecfdf5] px-5 py-3 sm:px-8">
                  <input
                    aria-label="Add neighborhood"
                    value={lifestyle.neighborhoodDraft}
                    onChange={(event) =>
                      onChange((current) => ({
                        ...current,
                        lifestyle: { ...current.lifestyle, neighborhoodDraft: event.target.value },
                      }))
                    }
                    onBlur={commitNeighborhoodDraft}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        commitNeighborhoodDraft();
                      }
                    }}
                    placeholder=""
                    autoFocus
                    className="w-full border-b border-[#8f9bb3] bg-transparent pb-1 font-comfortaa text-[14px] font-medium leading-[21px] text-[#314158] outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Cancel neighborhood input"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onChange((current) => ({
                        ...current,
                        lifestyle: { ...current.lifestyle, neighborhoodDraft: "" },
                      }));
                      setIsAddingNeighborhood(false);
                    }}
                    className="ml-4 shrink-0 cursor-pointer rounded-full text-[#7b869b] hover:bg-[rgba(123,134,155,0.10)]"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <QuestionGroup label="Living arrangement">
            <OptionGrid
              columns={2}
              options={LIFESTYLE_OPTIONS.livingArrangement}
              values={lifestyle.livingArrangement}
              onToggle={(option) =>
                onChange((current) => ({
                  ...current,
                  lifestyle: { ...current.lifestyle, livingArrangement: toggleSingleValue(current.lifestyle.livingArrangement, option) },
                }))
              }
            />
          </QuestionGroup>

          <QuestionGroup label="Local environment">
            <OptionGrid
              columns={3}
              options={LIFESTYLE_OPTIONS.localEnvironmentPrimary}
              values={lifestyle.localEnvironment}
              onToggle={(option) =>
                onChange((current) => ({
                  ...current,
                  lifestyle: { ...current.lifestyle, localEnvironment: toggleSingleValue(current.lifestyle.localEnvironment, option) },
                }))
              }
            />
            <OptionGrid
              columns={3}
              options={LIFESTYLE_OPTIONS.localEnvironmentSecondary}
              values={lifestyle.localEnvironment}
              onToggle={(option) =>
                onChange((current) => ({
                  ...current,
                  lifestyle: { ...current.lifestyle, localEnvironment: toggleSingleValue(current.lifestyle.localEnvironment, option) },
                }))
              }
            />
          </QuestionGroup>

          <QuestionGroup label="Household setup">
            <OptionGrid
              columns={3}
              options={LIFESTYLE_OPTIONS.householdSetup}
              values={lifestyle.householdSetup}
              getOptionClassName={(option) => (option === "Multi-pet household" ? "whitespace-nowrap" : undefined)}
              onToggle={(option) =>
                onChange((current) => ({
                  ...current,
                  lifestyle: { ...current.lifestyle, householdSetup: toggleSingleValue(current.lifestyle.householdSetup, option) },
                }))
              }
            />
          </QuestionGroup>

          <QuestionGroup label="Your pet care experience">
            <OptionGrid
              columns={2}
              options={LIFESTYLE_OPTIONS.careExperience}
              values={lifestyle.careExperience}
              onToggle={(option) =>
                onChange((current) => ({
                  ...current,
                  lifestyle: { ...current.lifestyle, careExperience: toggleSingleValue(current.lifestyle.careExperience, option) },
                }))
              }
            />
          </QuestionGroup>

          <QuestionGroup label="Grooming routine">
            <div className="space-y-5">
              <InlineStepperRow
                label="Bathing: Every"
                value={lifestyle.bathingIntervalDays}
                suffix="days"
                onChange={(next) => onChange((current) => ({ ...current, lifestyle: { ...current.lifestyle, bathingIntervalDays: next } }))}
              />
              <InlineStepperRow
                label="Grooming: Every"
                value={lifestyle.groomingIntervalDays}
                suffix="days"
                onChange={(next) => onChange((current) => ({ ...current, lifestyle: { ...current.lifestyle, groomingIntervalDays: next } }))}
              />
            </div>
          </QuestionGroup>
    </QuestionStepShell>
  );
}
