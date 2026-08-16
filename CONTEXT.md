# Mutopia Pet Portal

This context defines key terms used by the Mutopia pet portal, including authentication and groomer health inspections.

## Language

**Remembered Credential**:
A locally encrypted password explicitly saved by a pet owner for the currently remembered email address. It is invalid once that email address changes.
_Avoid_: Saved login, cached password

## Groomer Health Inspection

**Local Inspection Draft**:
The unsubmitted health-inspection state stored only in the groomer's current browser. It is the sole source for resuming a draft inspection, includes image classifications such as AI Scan, and is removed after final submission succeeds.
_Avoid_: Server draft, saved inspection

**Health Report Draft**:
The generated health report awaiting groomer review. It is visible to groomers only and is not a client-facing report.
_Avoid_: Published report, preliminary client report

**Published Health Report**:
The groomer-approved health report available to the pet owner.
_Avoid_: Draft report, generated report
