"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HierarchicalCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
}

export function HierarchicalCheckbox({
  checked,
  indeterminate = false,
  onChange,
  className,
  disabled = false,
  title,
}: HierarchicalCheckboxProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      className={cn(
        "h-4 w-4 rounded flex items-center justify-center transition-colors shrink-0 outline-none select-none disabled:cursor-not-allowed disabled:opacity-50",
        checked || indeterminate
          ? "bg-primary text-primary-foreground border border-primary shadow-2xs"
          : "border border-input bg-background hover:border-primary/50",
        className
      )}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3 stroke-[3]" />
      ) : checked ? (
        <Check className="h-3 w-3 stroke-[3]" />
      ) : null}
    </button>
  );
}

