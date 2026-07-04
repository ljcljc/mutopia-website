import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/components/ui/utils";

interface AccountContentContainerProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children: ReactNode;
}

export default function AccountContentContainer({ children, className, ...props }: AccountContentContainerProps) {
  return (
    <div {...props} className={cn("mx-auto w-full max-w-none sm:max-w-[944px]", className)}>
      {children}
    </div>
  );
}
