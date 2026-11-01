"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SETTINGS_NAV_ITEMS } from "../constants/settings.constants";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-1 lg:flex-col lg:space-x-0 lg:space-y-1">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
            <div className="flex flex-col text-left">
              <span>{item.title}</span>
              <span
                className={cn(
                  "hidden text-[11px] lg:inline font-normal leading-tight mt-0.5",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {item.description}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

