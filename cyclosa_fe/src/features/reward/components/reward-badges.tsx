import React from "react";
import type {
  RewardType,
  DisciplineStatus,
  DisciplineForm,
  ComplaintStatus,
} from "../types/reward.types";
import {
  REWARD_TYPE_LABELS,
  DISCIPLINE_STATUS_LABELS,
  DISCIPLINE_FORM_LABELS,
  COMPLAINT_STATUS_LABELS,
} from "../constants/reward.constants";

export function RewardTypeBadge({ type }: { type: RewardType }) {
  const label = REWARD_TYPE_LABELS[type] || type;
  if (type === "MONETARY_BONUS") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
        {label}
      </span>
    );
  }
  if (type === "CERTIFICATE" || type === "TROPHY") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600 text-white shadow-2xs">
        {label}
      </span>
    );
  }
  if (type === "PROMOTION_RECOMMENDATION") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-2xs">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
      {label}
    </span>
  );
}

export function DisciplineStatusBadge({
  status,
  isExpired,
}: {
  status: DisciplineStatus;
  isExpired?: boolean;
}) {
  if (isExpired) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500 text-white line-through shadow-2xs">
        Đã đương nhiên xóa kỷ luật
      </span>
    );
  }

  const label = DISCIPLINE_STATUS_LABELS[status] || status;
  switch (status) {
    case "DRAFT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
          {label}
        </span>
      );
    case "PENDING_DISMISSAL_APPROVAL":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white shadow-2xs">
          {label}
        </span>
      );
    case "DECIDED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
          {label}
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-white shadow-2xs">
          {label}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
          {label}
        </span>
      );
  }
}

export function DisciplineFormBadge({ form }: { form?: DisciplineForm }) {
  if (!form) return <span className="text-xs text-muted-foreground">—</span>;
  const label = DISCIPLINE_FORM_LABELS[form] || form;
  if (form === "SA_THAI") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
        {label}
      </span>
    );
  }
  if (form === "CACH_CHUC" || form === "KEO_DAI_NANG_LUONG") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600 text-white shadow-2xs">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
      {label}
    </span>
  );
}

export function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  const label = COMPLAINT_STATUS_LABELS[status] || status;
  switch (status) {
    case "OPEN":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600 text-white shadow-2xs">
          {label}
        </span>
      );
    case "INVESTIGATING":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white shadow-2xs">
          {label}
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
          {label}
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-white shadow-2xs">
          {label}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
          {label}
        </span>
      );
  }
}
