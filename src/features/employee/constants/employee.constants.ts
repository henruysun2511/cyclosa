export const EMPLOYEE_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Chính thức (Active)" },
  { value: "PROBATION", label: "Thử việc (Probation)" },
  { value: "ON_LEAVE", label: "Nghỉ chế độ / Thai sản" },
  { value: "SUSPENDED", label: "Tạm đình chỉ / Hoãn HĐ" },
  { value: "TERMINATED", label: "Đã thôi việc" },
] as const;

export const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Chính thức",
  PROBATION: "Thử việc",
  ON_LEAVE: "Nghỉ chế độ",
  SUSPENDED: "Tạm đình chỉ",
  TERMINATED: "Đã thôi việc",
};

export const EMPLOYEE_STATUS_VARIANTS: Record<
  string,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Chính thức",
    className: "bg-emerald-600 text-white border-transparent",
  },
  PROBATION: {
    label: "Thử việc",
    className: "bg-amber-600 text-white border-transparent",
  },
  ON_LEAVE: {
    label: "Nghỉ chế độ",
    className: "bg-blue-600 text-white border-transparent",
  },
  SUSPENDED: {
    label: "Tạm đình chỉ",
    className: "bg-orange-600 text-white border-transparent",
  },
  TERMINATED: {
    label: "Đã thôi việc",
    className: "bg-rose-600 text-white border-transparent",
  },
};

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Toàn thời gian chính thức (Full-time)" },
  { value: "PART_TIME", label: "Bán thời gian (Part-time)" },
  { value: "INTERN", label: "Thực tập sinh (Intern)" },
  { value: "CONTRACTOR", label: "Cộng tác viên / Thuê ngoài (Contractor)" },
] as const;

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Chính thức (Full-time)",
  PART_TIME: "Bán thời gian (Part-time)",
  INTERN: "Thực tập sinh (Intern)",
  CONTRACTOR: "Cộng tác viên (Contractor)",
};

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
] as const;

export const GENDER_LABELS: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export const WORK_CHANGE_REASONS = [
  { value: "PROMOTION", label: "Bổ nhiệm thăng chức (Promotion)" },
  { value: "TRANSFER", label: "Luân chuyển điều động (Transfer)" },
  { value: "RESTRUCTURE", label: "Tái cơ cấu phòng ban (Restructure)" },
  { value: "HIRE", label: "Tiếp nhận ban đầu (Hire)" },
] as const;

