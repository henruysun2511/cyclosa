import type {
  PayrollPeriodStatus,
  SalaryAdvanceStatus,
  SalaryComponentCategory,
  ComponentFrequency,
  PaymentStatus,
} from "../types/payroll.types";

export const PAYROLL_PERIOD_STATUS_LABELS: Record<PayrollPeriodStatus, string> = {
  OPEN: "Đang mở",
  CALCULATING: "Đang tính toán",
  CALCULATED: "Đã tính lương",
  PENDING_APPROVAL: "Chờ phê duyệt",
  APPROVED: "Đã phê duyệt",
  PAYMENT_PROCESSING: "Đang chi trả",
  PAID: "Đã thanh toán",
  LOCKED: "Đã khóa sổ",
  REJECTED: "Bị từ chối",
};

export const PAYROLL_PERIOD_STATUS_VARIANTS: Record<
  PayrollPeriodStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  OPEN: "secondary",
  CALCULATING: "secondary",
  CALCULATED: "default",
  PENDING_APPROVAL: "secondary",
  APPROVED: "default",
  PAYMENT_PROCESSING: "secondary",
  PAID: "default",
  LOCKED: "outline",
  REJECTED: "destructive",
};

export const SALARY_ADVANCE_STATUS_LABELS: Record<SalaryAdvanceStatus, string> = {
  DRAFT: "Bản nháp",
  PENDING_APPROVAL: "Chờ phê duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  DISBURSED: "Đã giải ngân",
};

export const SALARY_ADVANCE_STATUS_VARIANTS: Record<
  SalaryAdvanceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "secondary",
  PENDING_APPROVAL: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  DISBURSED: "default",
};

export const SALARY_COMPONENT_CATEGORY_LABELS: Record<SalaryComponentCategory, string> = {
  BASIC: "Lương cơ bản",
  ALLOWANCE: "Phụ cấp",
  BONUS: "Thưởng",
  OVERTIME: "Làm thêm giờ",
  DEDUCTION: "Khấu trừ",
  OTHER: "Khoản khác",
};

export const COMPONENT_FREQUENCY_LABELS: Record<ComponentFrequency, string> = {
  MONTHLY: "Hàng tháng",
  ONE_TIME: "Một lần",
  QUARTERLY: "Hàng quý",
  YEARLY: "Hàng năm",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Chờ chi trả",
  PROCESSING: "Đang chuyển khoản",
  PAID: "Thành công",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_STATUS_VARIANTS: Record<
  PaymentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  PROCESSING: "secondary",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "outline",
};
