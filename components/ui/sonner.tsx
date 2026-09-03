"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "#ffffff",
          backgroundColor: "#ffffff",
          color: "#09090b",
          border: "1px solid #e4e4e7",
        },
        classNames: {
          toast:
            "group toast !bg-white group-[.toaster]:!bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans text-sm",
          description: "group-[.toast]:text-zinc-500",
          actionButton:
            "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
