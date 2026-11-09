import type {
  RequestType,
  ApproverType,
  StepConditionType,
  StepDecision,
  WorkflowOverallStatus,
} from "../types/workflow.types";

export const REQUEST_TYPE_OPTIONS: { value: RequestType; label: string }[] = [
  { value: "CONTRACT", label: "Hợp đồng lao động" },
  { value: "RESIGNATION", label: "Nghỉ việc / Thôi việc" },
  { value: "OVERTIME", label: "Làm thêm giờ (OT)" },
  { value: "LEAVE", label: "Nghỉ phép" },
  { value: "SALARY_ADJUSTMENT", label: "Điều chỉnh lương" },
];

export const REQUEST_TYPE_MAP: Record<RequestType, string> = {
  CONTRACT: "Hợp đồng lao động",
  RESIGNATION: "Nghỉ việc / Thôi việc",
  OVERTIME: "Làm thêm giờ (OT)",
  LEAVE: "Nghỉ phép",
  SALARY_ADJUSTMENT: "Điều chỉnh lương",
};

export const APPROVER_TYPE_OPTIONS: { value: ApproverType; label: string; description: string }[] = [
  {
    value: "DIRECT_MANAGER",
    label: "Quản lý trực tiếp",
    description: "Tự động phân công cho người quản lý trực tiếp của nhân sự",
  },
  {
    value: "DEPARTMENT_HEAD",
    label: "Trưởng phòng ban",
    description: "Tự động phân công cho trưởng đơn vị/phòng ban của nhân sự",
  },
  {
    value: "ROLE",
    label: "Theo vai trò / Nhóm quyền",
    description: "Bất kỳ nhân sự nào thuộc vai trò được chọn đều có quyền duyệt",
  },
  {
    value: "SPECIFIC_EMPLOYEE",
    label: "Chỉ định nhân viên",
    description: "Gán đích danh một nhân sự cụ thể chịu trách nhiệm bước duyệt",
  },
];

export const APPROVER_TYPE_MAP: Record<ApproverType, string> = {
  DIRECT_MANAGER: "Quản lý trực tiếp",
  DEPARTMENT_HEAD: "Trưởng phòng ban",
  ROLE: "Theo vai trò / Nhóm quyền",
  SPECIFIC_EMPLOYEE: "Chỉ định nhân viên",
};

export const CONDITION_TYPE_OPTIONS: { value: StepConditionType; label: string }[] = [
  { value: "ALWAYS", label: "Luôn luôn thực hiện bước này" },
  { value: "AMOUNT_ABOVE_THRESHOLD", label: "Chỉ thực hiện khi số tiền / mức lương vượt ngưỡng" },
  { value: "SALARY_ABOVE_BAND", label: "Chỉ thực hiện khi mức lương vượt khung ngạch bậc" },
];

export const CONDITION_TYPE_MAP: Record<StepConditionType, string> = {
  ALWAYS: "Luôn luôn",
  AMOUNT_ABOVE_THRESHOLD: "Mức lương / số tiền vượt ngưỡng",
  SALARY_ABOVE_BAND: "Lương vượt khung ngạch bậc",
};

export const DECISION_CONFIG: Record<
  StepDecision,
  { label: string; className: string }
> = {
  APPROVED: {
    label: "Đã duyệt",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  REJECTED: {
    label: "Từ chối",
    className: "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
  },
  SKIPPED: {
    label: "Bỏ qua",
    className: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
};

export const OVERALL_STATUS_CONFIG: Record<
  WorkflowOverallStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chờ phê duyệt",
    className: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  APPROVED: {
    label: "Đã hoàn tất",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  REJECTED: {
    label: "Đã từ chối",
    className: "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
};

