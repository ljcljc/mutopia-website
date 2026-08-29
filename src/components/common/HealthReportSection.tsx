import { ChevronRight } from "lucide-react";
import { Icon } from "./Icon";

export type HealthReportStatus = "ready";

export interface HealthReportItem {
  petId: number;
  petName: string;
  updatedAt: string;
  status: HealthReportStatus;
  reportId: number;
}

export interface HealthReportSectionProps {
  reports: HealthReportItem[];
  onOpenPdf: (report: HealthReportItem) => void;
}

function statusLabel(status: HealthReportStatus): string {
  return status === "ready" ? "Ready" : status;
}

export function HealthReportSection({ reports, onOpenPdf }: HealthReportSectionProps) {
  if (reports.length === 0) return null;

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-[12px] shadow-[0px_8px_6px_rgba(0,0,0,0.08)] sm:p-[20px]">
      <p className="font-comfortaa text-[16px] font-semibold leading-[28px] text-[#4A3C2A]">Health report</p>
      <div className="mt-2 grid gap-3 lg:grid-cols-2">
        {reports.map((report) => (
          <button
            key={report.reportId}
            type="button"
            onClick={() => onOpenPdf(report)}
            className="w-full cursor-pointer rounded-[12px] border border-[#E5E7EB] bg-white px-[15px] py-[13px] text-left transition-[border-color,background-color,box-shadow] hover:border-[#DE6A07]/40 hover:bg-[#FFF9F3] hover:shadow-[0px_8px_18px_rgba(222,106,7,0.08)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-comfortaa text-[16px] leading-[28px] text-[#DE6A07]">{report.petName}</p>
                <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">{report.updatedAt}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="inline-flex h-6 items-center gap-1 rounded-[12px] bg-[#DCFCE7] px-3 py-1 font-comfortaa text-[10px] font-bold leading-[14px] text-[#27AE60]">
                  <Icon name="check" className="size-[14px]" aria-hidden="true" />
                  {statusLabel(report.status)}
                </div>
                <ChevronRight className="size-4 shrink-0 text-[#8B6357]" strokeWidth={1.8} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
