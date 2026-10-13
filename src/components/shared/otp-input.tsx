"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const valArray = value.split("");
    while (valArray.length < length) valArray.push("");
    valArray[idx] = char;
    const newVal = valArray.join("").slice(0, length);
    onChange(newVal);

    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[idx] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={cn(
            "w-11 h-13 text-center text-xl font-bold font-mono rounded-lg border border-input bg-white shadow-2xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
            value[idx] ? "border-primary/60 bg-primary/5 text-primary" : "text-foreground",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50"
          )}
        />
      ))}
    </div>
  );
}
