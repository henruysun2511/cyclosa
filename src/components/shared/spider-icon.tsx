import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SpiderIconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
  solidBody?: boolean;
}

/**
 * Biểu tượng con nhện Cyclosa (Orb-weaver Spider Icon)
 * Thiết kế tỉ lệ vàng 24x24 tiêu chuẩn Lucide/Feather, 8 chân đối xứng thanh thoát.
 */
export function SpiderIcon({
  className = "h-5 w-5",
  solidBody = true,
  ...props
}: SpiderIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-label="Cyclosa Spider Icon"
      {...props}
    >
      {/* Thân sau (Abdomen) */}
      <ellipse
        cx="12"
        cy="14.5"
        rx="3.5"
        ry="4.5"
        fill={solidBody ? "currentColor" : "none"}
        stroke={solidBody ? "none" : "currentColor"}
      />
      {/* Đầu / Ngực (Cephalothorax) */}
      <circle
        cx="12"
        cy="7"
        r="2"
        fill={solidBody ? "currentColor" : "none"}
        stroke={solidBody ? "none" : "currentColor"}
      />
      {/* Cặp chân 1 - Hướng lên phía trước */}
      <path d="M10 6.5 5 4 3 7" />
      <path d="M14 6.5 19 4 21 7" />
      {/* Cặp chân 2 - Giữa trên hướng ngang lên */}
      <path d="M8.8 11 3.5 10 2 13.5" />
      <path d="M15.2 11 20.5 10 22 13.5" />
      {/* Cặp chân 3 - Giữa dưới hướng ngang xuống */}
      <path d="M8.8 15 3.5 16 2.5 19.5" />
      <path d="M15.2 15 20.5 16 21.5 19.5" />
      {/* Cặp chân 4 - Hướng lùi xuống phía sau */}
      <path d="M10 18 6.5 21.5 9 22" />
      <path d="M14 18 17.5 21.5 15 22" />
    </svg>
  );
}

export interface CyclosaLogoProps {
  className?: string;
  iconClassName?: string;
  badgeClassName?: string;
  collapsed?: boolean;
  href?: string;
  variant?: "primary" | "white" | "dark";
  showText?: boolean;
  subText?: string;
}

export function CyclosaLogo({
  className,
  iconClassName = "h-5 w-5",
  badgeClassName,
  collapsed = false,
  href,
  variant = "primary",
  showText = true,
  subText,
}: CyclosaLogoProps) {
  const badgeColors = {
    primary: "bg-primary text-white shadow-xs",
    white: "bg-white text-primary shadow-md shadow-black/10",
    dark: "bg-slate-900 text-white shadow-xs",
  };

  const textColors = {
    primary: {
      brand: "text-foreground",
      accent: "text-primary",
      sub: "text-muted-foreground",
    },
    white: {
      brand: "text-white",
      accent: "text-red-200",
      sub: "text-red-200/90",
    },
    dark: {
      brand: "text-white",
      accent: "text-red-400",
      sub: "text-slate-400",
    },
  };

  const currentTheme = textColors[variant];

  const content = (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div
        className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center font-bold shrink-0 transition-transform duration-200 hover:scale-105",
          badgeColors[variant],
          badgeClassName
        )}
      >
        <SpiderIcon className={iconClassName} />
      </div>

      {showText && !collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                "text-lg font-bold tracking-tight font-sans",
                currentTheme.brand
              )}
            >
              Cyclo
              <span className={cn("font-bold", currentTheme.accent)}>sa</span>
            </span>
            {subText && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  variant === "white"
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                )}
              >
                {subText}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline hover:no-underline flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
