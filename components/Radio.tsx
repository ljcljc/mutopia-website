/**
 * Custom Radio Component
 * 
 * Built from Figma designs with distinct states:
 * 1. Default: Unchecked with gray border #717182, dark text #4a3c2a
 * 2. Hover: Unchecked with gray text #717182 (on hover)
 * 3. Active: Checked with gray border #717182, orange dot #de6a07 (when pressed)
 * 4. Checked: Checked with blue background #2374ff, orange dot #de6a07 (checked state takes priority over focus)
 * 5. Disabled: 50% opacity, non-interactive
 * 
 * Features:
 * - Native radio functionality
 * - Accessible (proper ARIA attributes)
 * - Keyboard support
 * - Optional label
 * - Controlled or uncontrolled
 * - No visible focus ring (clean design)
 */

import { forwardRef, useState, InputHTMLAttributes } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text to display next to radio */
  label?: string;
  /** Whether radio is checked (for controlled component) */
  checked?: boolean;
  /** Default checked state (for uncontrolled component) */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Additional className for the container */
  containerClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
    const [isFocused, setIsFocused] = useState(false);
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
      // Hover state: gray text when hovering over unchecked radio
      if (isHovered && !isChecked) return 'text-[#717182]';
      // Default/Checked/Focus state: dark text
      return 'text-[#4a3c2a]';
    };

    // Determine radio background and border based on state
    const getRadioStyle = () => {
      // Disabled state
      if (disabled) {
        return {
          showBlueFill: isChecked,
          blueFillOpacity: 0.5,
          showBorder: true,
          borderColor: '#717182',
          borderOpacity: 0.3,
          showDot: isChecked,
          dotColor: '#de6a07',
        };
      }

      // Active state (checked + pressed): Gray border, orange dot
      if (isChecked && isActive) {
        return {
          showBlueFill: false,
          blueFillOpacity: 1,
          showBorder: true,
          borderColor: '#717182',
          borderOpacity: 1,
          showDot: true,
          dotColor: '#de6a07',
        };
      }

      // Checked state: Blue background, orange dot (takes priority over focus)
      if (isChecked) {
        return {
          showBlueFill: true,
          blueFillOpacity: 1,
          showBorder: false,
          borderColor: '',
          borderOpacity: 1,
          showDot: true,
          dotColor: '#de6a07',
        };
      }

      // Default/Hover state (unchecked): White background, gray border
      return {
        showBlueFill: false,
        blueFillOpacity: 1,
        showBorder: true,
        borderColor: '#717182',
        borderOpacity: 1,
        showDot: false,
        dotColor: '',
      };
    };

    const radioStyle = getRadioStyle();

    return (
      <label
        className={`content-stretch flex gap-[8px] items-center relative cursor-pointer ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${containerClassName}`}
        data-name="Radio Label"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Hidden native radio for accessibility and functionality */}
        <input
          ref={ref}
          type="radio"
          checked={isChecked}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {/* Custom radio visual */}
        <div
          className={`relative shrink-0 size-[16px] transition-all duration-200 ${className}`}
          data-name="Radio"
        >
          <svg 
            className="block size-full" 
            fill="none" 
            preserveAspectRatio="none" 
            viewBox="0 0 16 16"
          >
            <g>
              {/* Background fill (blue when checked) */}
              {radioStyle.showBlueFill && (
                <rect 
                  fill="#2374FF" 
                  fillOpacity={radioStyle.blueFillOpacity}
                  height="15" 
                  rx="7.5" 
                  width="15" 
                  x="0.5" 
                  y="0.5" 
                />
              )}
              
              {/* Border stroke */}
              {radioStyle.showBorder && (
                <rect 
                  height="15" 
                  rx="7.5" 
                  stroke={radioStyle.borderColor} 
                  strokeOpacity={radioStyle.borderOpacity}
                  width="15" 
                  x="0.5" 
                  y="0.5" 
                  fill="none"
                />
              )}
              
              {/* Inner dot (when checked) */}
              {radioStyle.showDot && (
                <circle 
                  cx="8" 
                  cy="8" 
                  fill={radioStyle.dotColor} 
                  r="4" 
                />
              )}
            </g>
          </svg>
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

Radio.displayName = 'Radio';

/**
 * Radio without label (for use in custom layouts)
 */
export const RadioOnly = forwardRef<HTMLInputElement, Omit<RadioProps, 'label'>>(
  (props, ref) => {
    return <Radio ref={ref} {...props} />;
  }
);

RadioOnly.displayName = 'RadioOnly';
