// Progress step components for the booking flow

export function ProgressStepCompleted() {
    return (
      <div className="relative shrink-0 size-[36px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
          <g>
            <rect height="34" rx="11" stroke="#8B6357" strokeWidth="2" width="34" x="1" y="1" />
            <circle cx="18" cy="18" fill="#8B6357" r="9" />
            <path d="M13 18L16 21L23 14" stroke="url(#paint0_linear)" strokeLinecap="round" strokeWidth="2" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="13" x2="19.0585" y1="15.5" y2="24.3547">
              <stop stopColor="#FFF7ED" />
              <stop offset="1" stopColor="#FFFBEB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
  
  export function ProgressStepActive({ number }: { number: number }) {
    return (
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="[grid-area:1_/_1] bg-[#8b6357] ml-0 mt-0 relative rounded-[12px] size-[36px]">
          <div aria-hidden="true" className="absolute border-2 border-[#8b6357] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
        <p className="[grid-area:1_/_1] font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] ml-[14px] mt-[9px] relative text-[16px] text-nowrap text-white whitespace-pre">
          {number}
        </p>
      </div>
    );
  }
  
  export function ProgressStepInactive({ number }: { number: number }) {
    return (
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="[grid-area:1_/_1] bg-gray-200 ml-0 mt-0 relative rounded-[12px] size-[36px]">
          <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
        <p className="[grid-area:1_/_1] font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] ml-[14px] mt-[9px] relative text-[#1b1b1b] text-[16px] text-nowrap whitespace-pre">
          {number}
        </p>
      </div>
    );
  }
  
  export function ProgressLine({ active }: { active: boolean }) {
    return (
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div
          className="absolute bottom-[-1px] left-0 right-0 top-[-1px]"
          style={
            {
              "--stroke-0": active ? "rgba(139, 99, 87, 1)" : "rgba(229, 231, 235, 1)",
            } as React.CSSProperties
          }
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 95 2"
          >
            <path
              d="M0 1H94.1667"
              stroke="var(--stroke-0)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  }
  
  interface ProgressStepsProps {
    currentStep: number;
    totalSteps?: number;
    title?: string;
    subtitle?: string;
  }
  
  export function ProgressSteps({ 
    currentStep, 
    totalSteps = 6,
    title,
    subtitle 
  }: ProgressStepsProps) {
    return (
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full max-w-[781px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium h-[19px] leading-[17.5px] relative shrink-0 text-[12px] text-black w-full whitespace-pre-wrap">
          Book your appointment
        </p>
        
        {/* Progress bar */}
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;
            
            return (
              <div 
                key={step} 
                className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0"
              >
                {isCompleted ? (
                  <ProgressStepCompleted />
                ) : isActive ? (
                  <ProgressStepActive number={step} />
                ) : (
                  <ProgressStepInactive number={step} />
                )}
                <ProgressLine active={isCompleted || isActive} />
              </div>
            );
          })}
        </div>
  
        {/* Step badge */}
        <div className="h-[24px] relative rounded-[12px] shrink-0">
          <div className="box-border content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[17px] py-[5px] relative rounded-[inherit]">
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#4c4c4c] text-[10px] text-nowrap whitespace-pre">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div aria-hidden="true" className="absolute border border-[#4c4c4c] border-solid inset-0 pointer-events-none rounded-[12px]" />
        </div>
  
        {/* Step title */}
        {(title || subtitle) && (
          <div className="w-full">
            {title && (
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[16px] w-[min-content]">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
  