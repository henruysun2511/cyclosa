"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group font-sans"
      richColors
      position="top-right"
      closeButton={false}
      duration={3500}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        info: <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        error: <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
        loading: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:border font-sans transition-all",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold tracking-tight text-foreground",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs font-normal mt-1 leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:border group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          success:
            "!bg-emerald-50/95 !text-emerald-950 !border-emerald-200/80 dark:!bg-emerald-950/70 dark:!text-emerald-100 dark:!border-emerald-800/60 shadow-emerald-500/5",
          error:
            "!bg-rose-50/95 !text-rose-950 !border-rose-200/80 dark:!bg-rose-950/70 dark:!text-rose-100 dark:!border-rose-800/60 shadow-rose-500/5",
          warning:
            "!bg-amber-50/95 !text-amber-950 !border-amber-200/80 dark:!bg-amber-950/70 dark:!text-amber-100 dark:!border-amber-800/60 shadow-amber-500/5",
          info:
            "!bg-sky-50/95 !text-sky-950 !border-sky-200/80 dark:!bg-sky-950/70 dark:!text-sky-100 dark:!border-sky-800/60 shadow-sky-500/5",
        },
      }}
      {...props}
    />
  );
}
