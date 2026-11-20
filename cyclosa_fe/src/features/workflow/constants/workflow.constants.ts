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
    className: "bg-emerald-600 text-white border-transparent",
  },
  REJECTED: {
    label: "Từ chối",
    className: "bg-red-600 text-white border-transparent",
  },
  SKIPPED: {
    label: "Bỏ qua",
    className: "bg-slate-500 text-white border-transparent",
  },
};

export const OVERALL_STATUS_CONFIG: Record<
  WorkflowOverallStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chờ phê duyệt",
    className: "bg-amber-600 text-white border-transparent",
  },
  APPROVED: {
    label: "Đã hoàn tất",
    className: "bg-emerald-600 text-white border-transparent",
  },
  REJECTED: {
    label: "Đã từ chối",
    className: "bg-red-600 text-white border-transparent",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-slate-600 text-white border-transparent",
  },
};

