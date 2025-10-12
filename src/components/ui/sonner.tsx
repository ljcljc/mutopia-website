"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-card-foreground)',
          border: '1px solid var(--color-border)',
          borderRadius: '1rem',
          fontFamily: 'Comfortaa, cursive',
        },
        className: 'rounded-2xl',
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };