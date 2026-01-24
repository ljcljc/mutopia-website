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
        "content-stretch flex flex-col gap-[8px] items-start relative",
        className?.includes("w-auto") ? "w-auto" : "w-full"
      )}
    >
      {label && (
        <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
          <p
            className={cn(
              "font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre",
              error ? "text-[#de1507]" : "text-[#4a3c2a]"
            )}
          >
            {label}
          </p>
        </div>
      )}

      <div
        className={cn(
          "bg-white h-[36px] relative shrink-0 group",
          className?.includes("w-auto") ? "w-auto" : "w-full",
          noLeftRadius
            ? "rounded-br-[8px] rounded-tr-[8px] rounded-bl-none rounded-tl-none"
            : "rounded-[8px]"
        )}
      >
        <div className="flex flex-row items-center h-[36px] px-[12px] py-[4px] w-full">
          <div className="flex flex-1 gap-[8px] items-center min-h-px min-w-px relative shrink-0">
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
              className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] text-[12.25px] text-[#4a3c2a] bg-transparent border-none outline-none placeholder:text-[#717182] w-full disabled:cursor-not-allowed"
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
            className="ml-[8px] flex items-center justify-center"
            aria-label={isOpen ? "Close options" : "Open options"}
            disabled={disabled}
          >
            <Icon
              name="chevron-down"
              className={cn(
                "h-[16px] w-[16px] text-[#717182] transition-transform duration-200 ease-in-out",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "absolute border border-solid inset-0 pointer-events-none transition-colors duration-200",
            noLeftRadius
              ? "rounded-br-[8px] rounded-tr-[8px] rounded-bl-none rounded-tl-none"
              : "rounded-[8px]",
            error
              ? "border-[#de1507]"
              : isOpen
                ? "border-[#2374ff]"
                : "border-gray-200 group-hover:border-[#717182]"
          )}
        />

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-[4px] w-full rounded-[8px] border border-[#d6d6d6] bg-white p-[4px] shadow-md max-h-[240px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-[8px] py-[8px] font-['Comfortaa:Regular',sans-serif] text-[14px] text-[#6b6b6b]">
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
                    "flex w-full items-center px-[8px] h-[36px] rounded-[4px] text-left font-['Comfortaa:Regular',sans-serif] text-[14px] hover:bg-amber-50",
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
