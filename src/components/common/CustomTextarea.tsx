import * as React from "react";
import svgPaths from "../imports/svg-ub9blg1p12";

export interface CustomTextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
}

export function CustomTextarea({ 
  label = "Message", 
  placeholder = "Enter your message",
  className,
  ...props 
}: CustomTextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative w-full">
      {/* Label */}
      {label && (
        <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
          <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px] text-nowrap whitespace-pre">
            {label}
          </p>
        </div>
      )}
      
      {/* Textarea Container */}
      <div 
        className="bg-white h-[120px] max-h-[120px] relative rounded-[12px] shrink-0 w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="box-border content-stretch flex h-[120px] items-start max-h-inherit overflow-clip px-[16px] py-[12px] relative rounded-[inherit] w-full">
          {/* Textarea */}
          <textarea
            placeholder={placeholder}
            className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px] bg-transparent border-none outline-none resize-none w-full h-full placeholder:text-[#717182]"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Resize Icon */}
          <div className="absolute h-[17.5px] right-[16px] bottom-[12px] w-[15.5px] pointer-events-none">
            <div className="absolute inset-[-1.89%_-2.42%_-1.89%_-2.41%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 19">
                <path 
                  d={svgPaths.p34271f00} 
                  stroke={isFocused ? "#D6D6D6" : isHovered ? "#717182" : "#D6D6D6"} 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Border */}
        <div 
          aria-hidden="true" 
          className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] transition-colors ${
            isFocused ? 'border-[#2374ff]' : isHovered ? 'border-[#717182]' : 'border-gray-200'
          }`} 
        />
      </div>
    </div>
  );
}
