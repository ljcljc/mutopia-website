/**
 * Custom Accordion Component
 *
 * Built from Figma designs with 3 distinct states for both collapsed and expanded:
 * 1. Default: Gray border (#E5E7EB), gray icon (#717182)
 * 2. Hover: Orange border (#DE6A07), orange icon (#DE6A07)
 * 3. Focus: Blue border (#2374FF), blue icon (#2374FF)
 *
 * Features:
 * - Smooth expand/collapse animation
 * - Accessible (keyboard support, ARIA attributes)
 * - Icon rotation on expand
 * - Consistent styling across states
 */

import { useState, useRef, useEffect } from "react";

interface CustomAccordionItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CustomAccordionItem({
  question,
  answer,
  isOpen = false,
  onToggle,
}: CustomAccordionItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      // Use requestAnimationFrame to ensure accurate measurement
      requestAnimationFrame(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
    }
  }, [answer, isOpen]);

  // Determine border and icon color based on state
  const getBorderColor = () => {
    if (isFocused) return "#2374FF"; // Focus: blue
    if (isHovered) return "#DE6A07"; // Hover: orange
    return "#E5E7EB"; // Default: gray-200
  };

  const getIconColor = () => {
    if (isFocused) return "#2374FF"; // Focus: blue
    if (isHovered) return "#DE6A07"; // Hover: orange
    return "#717182"; // Default: gray
  };

  return (
    <div
      className="bg-[rgba(255,255,255,0.8)] relative rounded-[16px] w-full transition-all duration-200"
      data-name="Accordion"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Border overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[16px] border border-solid transition-colors duration-200"
        style={{ borderColor: getBorderColor() }}
      />

      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[24px] py-0 relative size-full">
          {/* Trigger Button */}
          <button
            className="box-border content-stretch flex w-full items-center justify-between px-0 relative rounded-[12px] shrink-0 outline-none focus:outline-none transition-[padding-bottom] duration-300 ease-in-out"
            style={{
              paddingTop: "21px",
              paddingBottom: isOpen ? "0px" : "21px",
            }}
            data-name="Primitive.button"
            onClick={onToggle}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-expanded={isOpen}
          >
            {/* Question */}
            <div className="flex-1 pr-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] text-[#4a3c2a] text-[12.25px] text-left">
                {question}
              </p>
            </div>

            {/* Icon */}
            <div
              className="relative shrink-0 size-[14px]"
              data-name="Icon"
            >
              <svg
                className="block size-full transition-transform duration-300"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14 14"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <g>
                  <path
                    d="M3.5 5.25L7 8.75L10.5 5.25"
                    stroke={getIconColor()}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.16667"
                    className="transition-colors duration-200"
                  />
                </g>
              </svg>
            </div>
          </button>

          {/* Content */}
          <div
            style={{
              height: isOpen && contentHeight > 0 ? `${contentHeight}px` : "0px",
              overflow: "hidden",
              transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div ref={contentRef} className="pb-[21px] pt-[12px]">
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[12.25px] text-[rgba(74,60,42,0.7)]">
                {answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CustomAccordionProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
}

export default function CustomAccordion({
  items,
  className = "",
  defaultOpenIndex,
  allowMultiple = false,
}: CustomAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div
      className={`content-stretch flex flex-col gap-[16px] items-center w-full ${className}`}
    >
      {items.map((item, index) => (
        <CustomAccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndexes.includes(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
