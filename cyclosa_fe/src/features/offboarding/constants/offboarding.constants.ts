import {
  OffboardingType,
  OffboardingStatus,
  ResignationReason,
  TerminationReason,
  ClearanceType,
  ClearanceStatus,
} from "../types/offboarding.types";

export const OFFBOARDING_TYPE_LABELS: Record<OffboardingType, string> = {
  RESIGNATION: "Thôi việc tự nguyện",
  TERMINATION: "Quyết định chấm dứt HĐLĐ",
};

export const OFFBOARDING_STATUS_CONFIG: Record<
  OffboardingStatus,
  { label: string; variant: "warning" | "info" | "primary" | "success" | "danger" | "muted" }
> = {
  PENDING: { label: "Chờ phê duyệt", variant: "warning" },
  APPROVED: { label: "Đã phê duyệt", variant: "info" },
  PROCESSING: { label: "Đang bàn giao", variant: "primary" },
  COMPLETED: { label: "Đã hoàn tất", variant: "success" },
  REJECTED: { label: "Đã từ chối", variant: "danger" },
  CANCELLED: { label: "Đã hủy bỏ", variant: "muted" },
};

export const RESIGNATION_REASON_LABELS: Record<ResignationReason, string> = {
  BETTER_OPPORTUNITY: "Cơ hội phát triển mới",
  PERSONAL_FAMILY: "Lý do cá nhân / Gia đình",
  HEALTH: "Lý do sức khỏe",
  RELOCATION: "Thay đổi nơi cư trú",
  CAREER_CHANGE: "Chuyển đổi định hướng nghề nghiệp",
  WORK_ENVIRONMENT: "Không phù hợp môi trường",
  COMPENSATION: "Chế độ đãi ngộ & Thu nhập",
  OTHER: "Lý do khác",
};

export const TERMINATION_REASON_LABELS: Record<TerminationReason, string> = {
  PERFORMANCE: "Không đạt yêu cầu công việc",
  DISCIPLINARY_DISMISSAL: "Sa thải kỷ luật lao động",
  RESTRUCTURING_DOWNSIZING: "Tái cơ cấu / Thu hẹp hoạt động",
  CONTRACT_EXPIRED_NOT_RENEWED: "Hết hạn HĐLĐ không tái ký",
  MUTUAL_AGREEMENT: "Thỏa thuận chấm dứt HĐLĐ",
  PROBATION_FAILED: "Không đạt đánh giá thử việc",
  OTHER: "Lý do khác theo luật định",
};

export const CLEARANCE_TYPE_CONFIG: Record<
  ClearanceType,
  { label: string; description: string; step: number }
> = {
  JOB_HANDOVER: {
    label: "Bàn giao công việc",
    description: "Bàn giao các đầu việc dở dang, dự án, tài liệu và dữ liệu bàn giao cho nhân sự kế nhiệm",
    step: 1,
  },
  ASSET: {
    label: "Thu hồi tài sản",
    description: "Hoàn trả laptop, thiết bị văn phòng, thẻ ra vào, chìa khóa văn phòng cho bộ phận Hành chính",
    step: 2,
  },
  IT_ACCOUNT: {
    label: "Thu hồi tài khoản CNTT",
    description: "Vô hiệu hóa email công ty, tài khoản Git, Jira, AWS, Slack/Teams, VPN và ERP",
    step: 3,
  },
  FINANCE: {
    label: "Quyết toán tài chính",
    description: "Quyết toán công nợ nội bộ, hoàn ứng tạm ứng và chốt ngày công tính trợ cấp thôi việc",
    step: 4,
  },
  DOCUMENT: {
    label: "Bàn giao hồ sơ & Giấy tờ",
    description: "Chốt sổ BHXH, bàn giao giấy xác nhận thôi việc và trả lại hồ sơ gốc cho nhân sự",
    step: 5,
  },
};

export const CLEARANCE_STATUS_CONFIG: Record<
  ClearanceStatus,
  { label: string; variant: "warning" | "success" | "danger" }
> = {
  PENDING: { label: "Chờ bàn giao", variant: "warning" },
  CLEARED: { label: "Đã hoàn tất", variant: "success" },
  REJECTED: { label: "Chưa đạt yêu cầu", variant: "danger" },
};
