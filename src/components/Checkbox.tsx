/**
 * Custom Checkbox Component
 *
 * Built from Figma designs with 5 distinct states:
 * 1. Default: Unchecked with gray border #717182, dark text #4a3c2a
 * 2. Hover: Unchecked with gray text #717182 (on hover)
 * 3. Focus: Checked with blue background #2374ff, white checkmark (no focus ring)
 * 4. Active: Checked with orange background #de6a07, gradient checkmark (when pressed)
 * 5. Checked: Checked with blue background #2374ff, white checkmark
 *
 * Features:
 * - Native checkbox functionality
 * - Accessible (proper ARIA attributes)
 * - Keyboard support
 * - Optional label
 * - Controlled or uncontrolled
 * - No visible focus ring (clean design)
 */

import { forwardRef, useState, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import svgPaths from '@/assets/icons/svg-1l4mtpqhh5';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text to display next to checkbox */
  label?: string;
  /** Whether checkbox is checked (for controlled component) */
  checked?: boolean;
  /** Default checked state (for uncontrolled component) */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Additional className for the container */
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked: controlledChecked,
      defaultChecked,
      onCheckedChange,
      onChange,
      className = '',
      containerClassName = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
    const [, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Determine if component is controlled
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;

      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      // Call callbacks
      onCheckedChange?.(newChecked);
      onChange?.(e);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleMouseDown = () => {
      if (!disabled && isChecked) {
        setIsActive(true);
      }
    };

    const handleMouseUp = () => {
      setIsActive(false);
    };

    // Determine text color based on state
    const getTextColor = () => {
      if (disabled) return 'text-[#717182]/50';
      // Hover state: gray text when hovering over unchecked checkbox
      if (isHovered && !isChecked) return 'text-[#717182]';
      // Default/Checked/Focus state: dark text
      return 'text-[#4a3c2a]';
    };

    // Determine checkbox background and border based on state
    const getCheckboxStyle = () => {
      // Disabled state
      if (disabled) {
        return {
          background: isChecked ? 'bg-[#2374ff]/50' : 'bg-white',
          border: 'border-[#717182]/30',
        };
      }

      // Active state (checked + pressed): Orange background, gradient checkmark
      if (isChecked && isActive) {
        return {
          background: 'bg-[#de6a07]',
          border: '',
          showGradientCheck: true,
        };
      }

      // Focus state (checked + focused): Blue background, white checkmark, focus ring
      // Checked state: Blue background, white checkmark
      if (isChecked) {
        return {
          background: 'bg-[#2374ff]',
          border: '',
          showGradientCheck: false,
        };
      }

      // Default/Hover state (unchecked): White background, gray border
      return {
        background: 'bg-white',
        border: 'border-[#717182]',
        showGradientCheck: false,
      };
    };

    const checkboxStyle = getCheckboxStyle();
    const showGradientCheck = checkboxStyle.showGradientCheck;

    return (
      <label
        className={`content-stretch flex gap-[8px] items-center relative cursor-pointer ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${containerClassName}`}
        data-name="Checkbox Label"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Hidden native checkbox for accessibility and functionality */}
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {/* Custom checkbox visual */}
        <div
          className={`relative shrink-0 size-[16px] transition-all duration-200 ${checkboxStyle.background} ${className}`}
          data-name="Checkbox"
        >
          {/* Border (only visible when unchecked) */}
          {!isChecked && checkboxStyle.border && (
            <div
              aria-hidden="true"
              className={`absolute border ${checkboxStyle.border} border-solid inset-0 pointer-events-none transition-colors duration-200`}
            />
          )}

          {/* Checkmark icon (only visible when checked) */}
          {isChecked && (
            <>
              {showGradientCheck ? (
                // Gradient checkmark for active state
                <svg
                  className="absolute inset-0 size-full"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <defs>
                    <linearGradient
                      id="checkGradient"
                      x1="2"
                      y1="4.25"
                      x2="8.8634"
                      y2="14.7739"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFF7ED" />
                      <stop offset="1" stopColor="#FFFBEB" />
                    </linearGradient>
                  </defs>
                  <path
                    d={svgPaths.p30de4580}
                    stroke="url(#checkGradient)"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                // White checkmark for checked/focus state
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}
            </>
          )}


        </div>

        {/* Label text */}
        {label && (
          <p
            className={`font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre select-none transition-colors duration-200 ${getTextColor()}`}
          >
            {label}
          </p>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * Checkbox without label (for use in custom layouts)
 */
export const CheckboxOnly = forwardRef<HTMLInputElement, Omit<CheckboxProps, 'label'>>(
  (props, ref) => {
    return <Checkbox ref={ref} {...props} />;
  }
);

CheckboxOnly.displayName = 'CheckboxOnly';
