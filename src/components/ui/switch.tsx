"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base styles - match Figma design
        "peer inline-flex h-[20px] w-[36px] shrink-0 items-center rounded-full transition-all outline-none",
        // Track colors - Light theme
        "data-[state=checked]:bg-[#8b6357] data-[state=unchecked]:bg-[rgba(60,60,67,0.18)]",
        // Border
        "border border-transparent data-[state=checked]:border-[#8b6357] data-[state=unchecked]:border-[rgba(0,0,0,0.12)]",
        // Focus states
        "focus-visible:ring-[#2374ff] focus-visible:ring-2 focus-visible:ring-offset-2",
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb styles - white circle matching Figma design
          "pointer-events-none block size-[20px] rounded-full bg-white",
          // Shadow for depth
          "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]",
          // Transition
          "transition-transform duration-200 ease-in-out",
          // Position - checked: right, unchecked: left
          "data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
