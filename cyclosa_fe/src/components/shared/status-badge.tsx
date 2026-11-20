"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SystemStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_ACTIVATION"
  | "LOCKED"
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "PROBATION"
  | "SUSPENDED"
  | "TERMINATED"
  | "OPEN"
  | "ON_HOLD"
  | "CLOSED"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "PRESENT"
  | "LATE"
  | "EARLY_LEAVE"
  | "ABSENT"
  | "ON_LEAVE"
  | "HOLIDAY"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "COMPLIANT"
  | "WARNING"
  | "NON_COMPLIANT"
  | "CRITICAL"
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "MAINTENANCE"
  | string;

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_DICTIONARY: Record<string, StatusConfig> = {
  // General / RBAC
  ACTIVE: { label: "Hoạt động", className: "bg-slate-900 text-white border-slate-900" },
  INACTIVE: { label: "Ngừng hoạt động", className: "bg-slate-100 text-slate-600 border-slate-200" },
  PENDING_ACTIVATION: { label: "Chờ kích hoạt", className: "bg-slate-100 text-slate-700 border-slate-300" },
  LOCKED: { label: "Đã khóa", className: "bg-red-50 text-primary border-red-200" },

  // Workflow / Approval
  DRAFT: { label: "Bản nháp", className: "bg-slate-100 text-slate-600 border-slate-200" },
  PENDING_APPROVAL: { label: "Chờ duyệt", className: "bg-slate-100 text-slate-700 border-slate-300" },
  APPROVED: { label: "Đã phê duyệt", className: "bg-slate-900 text-white border-slate-900 font-semibold" },
  REJECTED: { label: "Từ chối", className: "bg-red-50 text-primary border-red-200" },
  CANCELLED: { label: "Đã hủy", className: "bg-slate-100 text-slate-500 border-slate-200" },

  // Payroll Lifecycle (database.md)
  CALCULATED: { label: "Đã tính toán", className: "bg-slate-100 text-slate-700 border-slate-300" },
  PAYMENT_PROCESSING: { label: "Đang chi trả", className: "bg-slate-100 text-slate-800 border-slate-300" },
  DISBURSED: { label: "Đã giải ngân", className: "bg-slate-900 text-white border-slate-900 font-semibold" },

  // Employee Lifecycle
  PROBATION: { label: "Thử việc", className: "bg-slate-100 text-slate-700 border-slate-200" },
  SUSPENDED: { label: "Đình chỉ", className: "bg-red-50 text-primary border-red-200" },
  TERMINATED: { label: "Đã nghỉ việc", className: "bg-slate-100 text-slate-600 border-slate-200" },

  // Recruitment
  OPEN: { label: "Đang mở", className: "bg-slate-900 text-white border-slate-900" },
  ON_HOLD: { label: "Tạm dừng", className: "bg-slate-100 text-slate-600 border-slate-200" },
  CLOSED: { label: "Đã đóng", className: "bg-slate-100 text-slate-600 border-slate-200" },
  APPLIED: { label: "Mới ứng tuyển", className: "bg-slate-100 text-slate-700 border-slate-300" },
  SCREENING: { label: "Sàng lọc CV", className: "bg-slate-100 text-slate-700 border-slate-300" },
  INTERVIEW: { label: "Phỏng vấn", className: "bg-slate-100 text-slate-800 border-slate-300" },
  OFFER: { label: "Mời nhận việc", className: "bg-slate-900 text-white border-slate-900 font-semibold" },
  HIRED: { label: "Đã trúng tuyển", className: "bg-slate-900 text-white border-slate-900 font-semibold" },

  // Attendance
  PRESENT: { label: "Đúng giờ", className: "bg-slate-900 text-white border-slate-900" },
  LATE: { label: "Đi muộn", className: "bg-red-50 text-primary border-red-200" },
  EARLY_LEAVE: { label: "Về sớm", className: "bg-red-50 text-primary border-red-200" },
  ABSENT: { label: "Vắng mặt", className: "bg-red-50 text-primary border-red-200 font-semibold" },
  ON_LEAVE: { label: "Nghỉ phép", className: "bg-slate-100 text-slate-700 border-slate-200" },
  HOLIDAY: { label: "Nghỉ lễ", className: "bg-slate-100 text-slate-700 border-slate-200" },

  // Contracts / Documents
  EXPIRING_SOON: { label: "Sắp hết hạn", className: "bg-red-50 text-primary border-red-200" },
  EXPIRED: { label: "Hết hạn", className: "bg-red-50 text-primary border-red-200 font-semibold" },

  // Legal / Compliance
  COMPLIANT: { label: "Tuân thủ", className: "bg-slate-900 text-white border-slate-900 font-semibold" },
  WARNING: { label: "Cảnh báo", className: "bg-red-50 text-primary border-red-200" },
  NON_COMPLIANT: { label: "Vi phạm", className: "bg-red-50 text-primary border-red-200 font-semibold" },
  CRITICAL: { label: "Nghiêm trọng", className: "bg-primary text-white border-primary font-bold" },

  // Workplace
  AVAILABLE: { label: "Còn trống", className: "bg-slate-900 text-white border-slate-900" },
  OCCUPIED: { label: "Đang sử dụng", className: "bg-red-50 text-primary border-red-200" },
  RESERVED: { label: "Đã đặt trước", className: "bg-slate-100 text-slate-700 border-slate-300" },
  MAINTENANCE: { label: "Bảo trì", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export interface StatusBadgeProps {
  status: SystemStatus;
  customLabel?: string;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({
  status,
  customLabel,
  className,
  dot = true,
}: StatusBadgeProps) {
  const normalizedKey = status ? String(status).toUpperCase() : "DRAFT";
  const config = STATUS_DICTIONARY[normalizedKey] || {
    label: customLabel || status,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors border",
        config.className,
        className
      )}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
          aria-hidden="true"
        />
      )}
      <span>{customLabel || config.label}</span>
    </Badge>
  );
}
