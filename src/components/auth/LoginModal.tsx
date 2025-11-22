import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ModalContent } from "./LoginModalContent";

interface LoginModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginModal({ children, open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-fit [&>button]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] duration-300">
        <DialogTitle className="sr-only">登录或注册</DialogTitle>
        <DialogDescription className="sr-only">
          请输入您的邮箱地址以登录或注册账户
        </DialogDescription>
        <ModalContent onClose={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  );
}
