import { useMemo, useState, type ReactNode } from "react";
import { CalendarDays, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Calendar } from "@/components/common/Calendar";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/components/ui/utils";

interface QuestionStepShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function QuestionStepShell({ title, subtitle, children }: QuestionStepShellProps) {
  return (
    <div className="mx-auto w-full max-w-[588px] px-0 py-0 sm:px-[21px] sm:py-[28px]">
      <div className="space-y-7 sm:space-y-[35px]">
        <header className="space-y-[10px]">
          <h2 className="font-comfortaa text-[22px] font-semibold leading-[1.25] text-[#0f172b] sm:text-[26px] sm:leading-[31.5px]">{title}</h2>
          <p className="max-w-[546px] font-comfortaa text-[14px] font-normal leading-[22px] text-[#45556c] sm:text-[15.75px] sm:leading-[25.6px]">
            {subtitle}
          </p>
        </header>
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}

export function SectionBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-[24px] border border-[#eadfd2] bg-white p-5 shadow-[0_12px_32px_rgba(74,60,42,0.05)] sm:p-6">
      <div className="space-y-1">
        <h3 className="font-comfortaa text-[18px] font-bold text-[#4a3c2a]">{title}</h3>
        {subtitle ? <p className="font-ubuntu text-[14px] leading-6 text-[#7a6d5d]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function FieldTitle({ children, optional = false }: { children: ReactNode; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <p className="font-comfortaa text-[15px] font-medium leading-[23px] text-[#0f172b] sm:text-[15.75px] sm:leading-[24.5px]">{children}</p>
      {optional ? <span className="font-comfortaa text-[12px] font-normal text-[#7b869b]">Optional</span> : null}
    </div>
  );
}

export function QuestionGroup({
  label,
  children,
  divider = false,
  compact = false,
}: {
  label: string;
  children: ReactNode;
  divider?: boolean;
  compact?: boolean;
}) {
  return (
    <section className={cn("space-y-[14px]", divider && "border-b border-[#e5e7eb] pb-5", compact && "space-y-3")}>
      <FieldTitle>{label}</FieldTitle>
      {children}
    </section>
  );
}

export function OptionPill({
  label,
  selected,
  onClick,
  compact = false,
  className,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center justify-center whitespace-normal rounded-full border-2 px-4 text-center font-comfortaa font-medium transition-colors",
        compact ? "min-h-[42.5px] py-[10px] text-[12.25px] leading-[17.5px]" : "min-h-[53px] py-3 text-[14px] leading-[21px]",
        selected ? "border-[#00d492] bg-[#ecfdf5] text-[#007a55]" : "border-[#e5e7eb] bg-white text-[#314158]",
        className
      )}
    >
      {label}
    </button>
  );
}

export function OptionGrid({
  options,
  values,
  onToggle,
  columns,
  compact = false,
  className,
  getOptionClassName,
}: {
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
  columns: 2 | 3;
  compact?: boolean;
  className?: string;
  getOptionClassName?: (option: string) => string | undefined;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-[11px] gap-y-[10px]",
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        compact && "gap-x-[8px] gap-y-[8px]",
        className
      )}
    >
      {options.map((option) => (
        <OptionPill
          key={option}
          label={option}
          selected={values.includes(option)}
          onClick={() => onToggle(option)}
          compact={compact}
          className={getOptionClassName?.(option)}
        />
      ))}
    </div>
  );
}

export function AddMoreButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8b6357]",
        className
      )}
    >
      <Plus className="size-4" />
      {label}
    </button>
  );
}

export function ChipGroup({
  label,
  options,
  values,
  onToggle,
  multiple = true,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
  multiple?: boolean;
}) {
  return (
    <div className="space-y-3">
      <FieldTitle>{label}</FieldTitle>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(option)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 font-comfortaa text-[13px] transition-colors",
                selected
                  ? "border-[#8b6357] bg-[#8b6357] text-[#fff7ed]"
                  : "border-[#e6d6c5] bg-[#fffaf5] text-[#6d5b49] hover:border-[#c7aa8b]"
              )}
            >
              {option}
              {!multiple && selected ? " selected" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BooleanChoice({
  label,
  value,
  trueLabel,
  falseLabel,
  onChange,
}: {
  label: string;
  value: boolean | null;
  trueLabel: string;
  falseLabel: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldTitle>{label}</FieldTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {[{ key: true, label: trueLabel }, { key: false, label: falseLabel }].map((item) => {
          const selected = value === item.key;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "cursor-pointer rounded-[18px] border px-4 py-3 text-left font-comfortaa text-[13px] transition-colors",
                selected ? "border-[#8b6357] bg-[#f1e5d9] text-[#4a3c2a]" : "border-[#eadfd2] bg-[#fffdfb] text-[#7a6d5d]"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LineInput({
  label,
  value,
  onChange,
  placeholder,
  icon = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: boolean;
}) {
  if (icon) {
    return <DateLineInput label={label} value={value} onChange={onChange} placeholder={placeholder} />;
  }

  return (
    <label className="block space-y-2">
      <FieldTitle>{label}</FieldTitle>
      <div className="flex items-center gap-2 border-b border-[#ccb8a0] pb-2">
        <input
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-ubuntu text-[14px] text-[#4a3c2a] outline-none placeholder:text-[#b5a28d]"
        />
      </div>
    </label>
  );
}

function parseDateValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DateLineInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const currentDate = selectedDate ?? new Date();

  return (
    <label className="block space-y-2">
      <FieldTitle>{label}</FieldTitle>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="flex items-center gap-2 border-b border-[#ccb8a0] pb-2">
            <input
              aria-label={label}
              value={value}
              onClick={() => setOpen(true)}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent font-ubuntu text-[14px] text-[#4a3c2a] outline-none placeholder:text-[#b5a28d]"
            />
            <button
              type="button"
              aria-label={`${label} calendar`}
              onClick={() => setOpen((current) => !current)}
              className="cursor-pointer text-[#9f8d79]"
            >
              <CalendarDays className="size-4" />
            </button>
          </div>
        </PopoverAnchor>
        <PopoverContent align="end" sideOffset={8} className="w-auto rounded-[16px] border border-[#eadfd2] p-0 shadow-[0_16px_40px_rgba(74,60,42,0.12)]">
          <Calendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateChange={(date) => {
              onChange(formatDateValue(date));
              setOpen(false);
            }}
            className="gap-3 rounded-[16px] p-4"
            variant="compact"
          />
        </PopoverContent>
      </Popover>
    </label>
  );
}

export function MultilineInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <FieldTitle>{label}</FieldTitle>
      <textarea
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-[18px] border border-[#eadfd2] bg-[#fffaf5] px-4 py-3 font-ubuntu text-[14px] text-[#4a3c2a] outline-none placeholder:text-[#b5a28d]"
      />
    </label>
  );
}

export function StepperField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldTitle>{label}</FieldTitle>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-[53px] w-[90px] items-center justify-center gap-3 rounded-[20px] border-2 border-[#e5e7eb] bg-white">
          <input
            aria-label={label}
            inputMode="numeric"
            value={value > 0 ? String(value) : ""}
            onChange={(event) => {
              const digitsOnly = event.target.value.replace(/\D/g, "");
              onChange(digitsOnly ? Number(digitsOnly) : 0);
            }}
            className="w-8 bg-transparent text-center font-comfortaa text-[16px] font-normal leading-[28px] text-[#8b6357] outline-none"
          />
          <div className="flex flex-col">
            <button
              type="button"
              aria-label={`${label} increase`}
              onClick={() => onChange(value + 1)}
              className="cursor-pointer text-[#8b6357]"
            >
              <ChevronUp className="size-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label={`${label} decrease`}
              onClick={() => onChange(Math.max(0, value - 1))}
              className="cursor-pointer text-[#8b6357]"
            >
              <ChevronDown className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#314158]">{suffix}</p>
      </div>
    </div>
  );
}

export function InlineStepperRow({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#314158]">{label}</p>
      <div className="flex h-[53px] w-[90px] shrink-0 items-center justify-center gap-3 rounded-[20px] border-2 border-[#e5e7eb] bg-white">
        <input
          aria-label={label}
          inputMode="numeric"
          value={value > 0 ? String(value) : ""}
          onChange={(event) => {
            const digitsOnly = event.target.value.replace(/\D/g, "");
            onChange(digitsOnly ? Number(digitsOnly) : 0);
          }}
          className="w-8 bg-transparent text-center font-comfortaa text-[16px] font-normal leading-[28px] text-[#8b6357] outline-none"
        />
        <div className="flex flex-col">
          <button type="button" aria-label={`${label} increase`} onClick={() => onChange(value + 1)} className="cursor-pointer text-[#8b6357]">
            <ChevronUp className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label={`${label} decrease`}
            onClick={() => onChange(Math.max(0, value - 1))}
            className="cursor-pointer text-[#8b6357]"
          >
            <ChevronDown className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#314158]">{suffix}</p>
    </div>
  );
}

export function UnderlinedFieldRow({
  label,
  value,
  onChange,
  ariaLabel,
  placeholder,
  calendar = false,
  maxDate,
  className,
  labelClassName,
  fieldWrapClassName,
  inputClassName,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  placeholder?: string;
  calendar?: boolean;
  maxDate?: string;
  className?: string;
  labelClassName?: string;
  fieldWrapClassName?: string;
  inputClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => (calendar ? parseDateValue(value) : null), [calendar, value]);
  const currentDate = selectedDate ?? new Date();
  const inputId = ariaLabel ?? label;
  const labelClasses = cn(
    "font-comfortaa text-[15px] font-medium leading-[23px] text-[#0f172b] sm:text-[15.75px] sm:leading-[24.5px]",
    labelClassName
  );

  if (calendar) {
    return (
      <div className={cn("flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-end", className)}>
        <label className={labelClasses}>{label}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div className={cn("flex w-full items-end gap-2 border-b border-[#9ca3af] pb-1", fieldWrapClassName)}>
              <input
                aria-label={inputId}
                value={value}
                onClick={() => setOpen(true)}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={cn(
                  "w-full bg-transparent font-comfortaa text-[14px] leading-[21px] text-[#314158] outline-none placeholder:text-[#94a3b8]",
                  inputClassName
                )}
              />
              <button
                type="button"
                aria-label={`${inputId} calendar`}
                onClick={() => setOpen((current) => !current)}
                className="cursor-pointer text-[#8b6357]"
              >
                <CalendarDays className="size-[18px]" strokeWidth={1.8} />
              </button>
            </div>
          </PopoverAnchor>
          <PopoverContent align="end" sideOffset={8} className="w-auto max-w-[calc(100vw-32px)] rounded-[16px] border border-[#eadfd2] p-0 shadow-[0_16px_40px_rgba(74,60,42,0.12)]">
            <Calendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateChange={(date) => {
                onChange(formatDateValue(date));
                setOpen(false);
              }}
              maxDate={maxDate ? parseDateValue(maxDate) ?? undefined : undefined}
              className="gap-3 rounded-[16px] p-4"
              variant="compact"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5", className)}>
      <label className={labelClasses}>{label}</label>
      <div className={cn("w-full border-b border-[#9ca3af] pb-1", fieldWrapClassName)}>
        <input
          aria-label={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent font-comfortaa text-[14px] leading-[21px] text-[#314158] outline-none placeholder:text-[#94a3b8]",
            inputClassName
          )}
        />
      </div>
    </div>
  );
}

export function TimelineFields({
  title,
  entries,
  onChange,
  onAdd,
}: {
  title: string;
  entries: Array<{ id: string; date: string; type: string }>;
  onChange: (id: string, field: "date" | "type", value: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      <FieldTitle>{title}</FieldTitle>
      {entries.map((entry, index) => (
        <div key={entry.id} className="grid gap-4 rounded-[18px] border border-dashed border-[#d8c5b1] bg-[#fffaf5] p-4 sm:grid-cols-2">
          <LineInput
            label={`${title} date ${index + 1}`}
            value={entry.date}
            onChange={(value) => onChange(entry.id, "date", value)}
            placeholder="MM/DD/YYYY"
            icon
          />
          <LineInput
            label={`${title} type ${index + 1}`}
            value={entry.type}
            onChange={(value) => onChange(entry.id, "type", value)}
            placeholder="Type or notes"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d8c5b1] px-4 py-2 font-comfortaa text-[12px] font-bold text-[#8b6357]"
      >
        <Plus className="size-4" />
        Add more
      </button>
    </div>
  );
}
