import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface CustomInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, rightElement, ...props }, ref) => {
    return (
      <div className="content-stretch flex flex-col gap-[8px] items-start relative w-full">
        {/* Label */}
        {label && (
          <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
            <p
              className={`font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre ${error ? "text-[#de1507]" : "text-[#4a3c2a]"}`}
            >
              {label}
            </p>
          </div>
        )}

        {/* Input Container */}
        <div className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full group">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
              <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                <input
                  ref={ref}
                  {...props}
                  className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#4a3c2a] text-[12.25px] bg-transparent border-none outline-none placeholder:text-[#717182] w-full"
                />
                {rightElement}
              </div>
            </div>
          </div>
          {/* Border with states */}
          <div
            aria-hidden="true"
            className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] transition-colors duration-200 ${
              error
                ? "border-[#de1507]"
                : "border-gray-200 group-hover:border-[#717182] group-focus-within:!border-[#2374ff]"
            }`}
          />
        </div>
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
