import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/components/ui/utils";
import { Icon } from "@/components/common/Icon";

export interface AutoCompleteProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: string[];
  disabled?: boolean;
  leftElement?: ReactNode;
  error?: string;
  noResultsText?: string;
  className?: string;
  noLeftRadius?: boolean;
}

export function AutoComplete({
  label,
  placeholder = "Select...",
  value = "",
  onValueChange,
  options,
  disabled,
  leftElement,
  error,
  noResultsText = "No results",
  className,
  noLeftRadius = false,
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) {
      return options;
    }
    return options.filter((option) =>
      option.toLowerCase().includes(query)
    );
  }, [options, value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [filteredOptions]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) {
      return;
    }
    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (nextValue: string) => {
    onValueChange?.(nextValue);
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    onValueChange?.(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-start gap-2",
        className?.includes("w-auto") ? "w-auto" : "w-full"
      )}
    >
      {label && (
        <div className="relative flex h-[12.25px] w-full items-center gap-[7px] shrink-0">
          <p
            className={cn(
              "font-comfortaa font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre",
              error ? "text-[#de1507]" : "text-[#4a3c2a]"
            )}
          >
            {label}
          </p>
        </div>
      )}

      <div
        className={cn(
          "relative h-9 shrink-0 bg-white group",
          className?.includes("w-auto") ? "w-auto" : "w-full",
          noLeftRadius
            ? "rounded-br-lg rounded-tr-lg rounded-bl-none rounded-tl-none"
            : "rounded-lg"
        )}
      >
        <div className="flex h-9 w-full flex-row items-center px-3 py-1">
          <div className="relative flex min-h-px min-w-px flex-1 items-center gap-2 shrink-0">
            {leftElement}
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              onChange={(event) => handleInputChange(event.target.value)}
              onFocus={() => !disabled && setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setIsOpen(true);
                  setHighlightedIndex((prev) => {
                    const next = prev + 1;
                    return next >= filteredOptions.length ? 0 : next;
                  });
                  return;
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setIsOpen(true);
                  setHighlightedIndex((prev) => {
                    const next = prev - 1;
                    return next < 0 ? filteredOptions.length - 1 : next;
                  });
                  return;
                }
                if (event.key === "Enter" && filteredOptions.length > 0) {
                  event.preventDefault();
                  const indexToSelect =
                    highlightedIndex >= 0 ? highlightedIndex : 0;
                  handleOptionSelect(filteredOptions[indexToSelect]);
                  return;
                }
                if (event.key === "Escape") {
                  setIsOpen(false);
                  inputRef.current?.blur();
                }
              }}
              className="w-full flex-1 border-none bg-transparent font-comfortaa text-[12.25px] font-normal leading-[normal] text-[#4a3c2a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (disabled) {
                return;
              }
              setIsOpen((prev) => !prev);
              inputRef.current?.focus();
            }}
            className="ml-2 flex items-center justify-center"
            aria-label={isOpen ? "Close options" : "Open options"}
            disabled={disabled}
          >
            <Icon
              name="chevron-down"
              className={cn(
                "size-4 text-[#717182] transition-transform duration-200 ease-in-out",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 border border-solid transition-colors duration-200",
            noLeftRadius
              ? "rounded-br-lg rounded-tr-lg rounded-bl-none rounded-tl-none"
              : "rounded-lg",
            error
              ? "border-[#de1507]"
              : isOpen
                ? "border-[#2374ff]"
                : "border-gray-200 group-hover:border-[#717182]"
          )}
        />

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 max-h-[240px] w-full overflow-y-auto rounded-lg border border-[#d6d6d6] bg-white p-1 shadow-md">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-2 font-comfortaa text-[14px] text-[#6b6b6b]">
                {noResultsText}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "flex h-9 w-full items-center rounded px-2 text-left font-comfortaa text-[14px] hover:bg-amber-50",
                    option === value ? "text-[#de6a07]" : "text-[#6b6b6b]",
                    index === highlightedIndex ? "bg-amber-50" : ""
                  )}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
