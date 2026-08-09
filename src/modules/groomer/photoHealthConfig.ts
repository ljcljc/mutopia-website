import type { InspectionArea } from "@/lib/api";

export interface InspectionAreaConfig {
  area: InspectionArea;
  label: string;
  hints: Array<{ value: string; label: string }>;
}

export const INSPECTION_STEPS: Record<number, { title: string; areas: InspectionAreaConfig[] }> = {
  1: {
    title: "Skin inspection",
    areas: [{
      area: "skin",
      label: "Skin photo",
      hints: ["Redness", "Itching", "Odor", "Dry Patches", "Parasites", "Inflammation"].map((label) => ({
        label,
        value: label.toLowerCase().replace(/ /g, "_"),
      })),
    }],
  },
  2: {
    title: "Ear inspection",
    areas: ["left_ear", "right_ear"].map((area) => ({
      area: area as InspectionArea,
      label: area === "left_ear" ? "Left ear" : "Right ear",
      hints: [
        { value: "redness", label: "Redness" },
        { value: "odor", label: "Odor" },
        { value: "scratching_shaking", label: "Scratching/Shaking" },
        { value: "discharge", label: "Discharge" },
      ],
    })),
  },
  3: {
    title: "Mouth inspection",
    areas: [{
      area: "mouth",
      label: "Mouth photo",
      hints: [
        { value: "bleeding_redness", label: "Bleeding/Redness" },
        { value: "odor", label: "Odor" },
        { value: "missing_teeth", label: "Missing Teeth" },
        { value: "severe_tartar", label: "Severe Tartar" },
      ],
    }],
  },
  4: {
    title: "Eye inspection",
    areas: ["left_eye", "right_eye"].map((area) => ({
      area: area as InspectionArea,
      label: area === "left_eye" ? "Left eye" : "Right eye",
      hints: [
        { value: "ingrown_lashes", label: "Ingrown Lashes" },
        { value: "tear_stains", label: "Tear Stains" },
        { value: "discharge", label: "Discharge" },
        { value: "redness_cloudiness", label: "Redness/Cloudiness" },
      ],
    })),
  },
  5: {
    title: "Posture",
    areas: [{ area: "posture", label: "Posture photo", hints: [] }],
  },
};

export const OBSERVATION_GROUPS = [
  {
    label: "Behavioural issues",
    tags: [
      { value: "paw_licking", label: "Paw licking" },
      { value: "chewing_on_self", label: "Chewing on self" },
      { value: "severe_scratching", label: "Severe scratching" },
      { value: "parasites", label: "Parasites" },
    ],
  },
  {
    label: "Health alerts",
    tags: [
      { value: "lethargic_sluggish", label: "Lethargic / Sluggish" },
      { value: "coughing", label: "Coughing" },
      { value: "unusually_restless", label: "Unusually Restless" },
    ],
  },
];
