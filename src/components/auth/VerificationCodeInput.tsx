import { useRef, useEffect } from "react";

interface VerificationCodeInputProps {
  code: string[];
  onChange: (code: string[]) => void;
  error?: string;
}

export function VerificationCodeInput({
  code,
  onChange,
  error,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      return;
    }

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    onChange(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Only process if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      onChange(newCode);
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="content-stretch flex gap-[8px] items-end justify-center relative shrink-0 w-full">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className={`border border-solid rounded-[4px] shrink-0 size-[42px] text-center font-['Comfortaa:Medium',sans-serif] font-medium text-[16px] text-[#4a3c2a] focus:outline-none focus:ring-2 focus:ring-[#2374ff] focus:ring-offset-1 ${
            error
              ? "border-[#de1507]"
              : "border-[#de6a07] focus:border-[#2374ff]"
          }`}
        />
      ))}
    </div>
  );
}

