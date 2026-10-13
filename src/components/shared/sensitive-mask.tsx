"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SensitiveMaskProps {
  value: string | number;
  maskType?: "salary" | "id_card" | "bank_account" | "general";
  canUnmask?: boolean;
  className?: string;
  currency?: string;
}

export function SensitiveMask({
  value,
  maskType = "general",
  canUnmask = true,
  className,
  currency = "₫",
}: SensitiveMaskProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getMaskedPlaceholder = () => {
    switch (maskType) {
      case "salary":
        return `•••••••• ${currency}`;
      case "id_card":
        return "•••••••••••";
      case "bank_account":
        return "••••••••••••";
      default:
        return "••••••••";
    }
  };

  const formatVisibleValue = () => {
    if (typeof value === "number" && maskType === "salary") {
      return `${value.toLocaleString("vi-VN")} ${currency}`;
    }
    return String(value);
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 font-mono text-sm", className)}>
      <span className={cn("transition-all", !isVisible && "select-none text-muted-foreground")}>
        {isVisible ? formatVisibleValue() : getMaskedPlaceholder()}
      </span>

      {canUnmask && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? "Ẩn thông tin nhạy cảm" : "Hiển thị thông tin"}
        >
          {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      )}
    </div>
  );
}
