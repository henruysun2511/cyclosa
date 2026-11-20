import type {
  RewardType,
  ViolationCategory,
  DisciplineForm,
  DisciplineStatus,
  ComplaintCategory,
  ComplaintStatus,
} from "../types/reward.types";

export const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  MONETARY_BONUS: "Thưởng tiền mặt / Chuyển khoản",
  CERTIFICATE: "Bằng khen / Giấy khen",
  TROPHY: "Cúp / Kỷ niệm chương",
  PROMOTION_RECOMMENDATION: "Đề bạt thăng cấp / Nâng bậc",
  OTHER: "Hình thức khác",
};

export const REWARD_TYPE_OPTIONS = Object.entries(REWARD_TYPE_LABELS).map(
  ([value, label]) => ({
    value: value as RewardType,
    label,
  })
);

export const VIOLATION_CATEGORY_LABELS: Record<ViolationCategory, string> = {
  ATTENDANCE_BREACH: "Vi phạm thời giờ làm việc & chấm công",
  PROCESS_POLICY_VIOLATION: "Vi phạm quy trình, quy chuẩn nội bộ",
  INTERNAL_SECURITY_DISCLOSURE: "Tiết lộ thông tin, vi phạm bảo mật",
  FINANCIAL_ASSET_SECRET: "Xâm phạm tài sản, tài chính, bí mật KD",
  HARASSMENT_DISORDER: "Quấy rối, gây mất trật tự nơi làm việc",
  INSUBORDINATION_DEFIANCE: "Không chấp hành lệnh điều hành",
  OTHER: "Vi phạm nội quy khác",
};

export const VIOLATION_CATEGORY_OPTIONS = Object.entries(
  VIOLATION_CATEGORY_LABELS
).map(([value, label]) => ({
  value: value as ViolationCategory,
  label,
}));

export const DISCIPLINE_FORM_LABELS: Record<DisciplineForm, string> = {
  KHIEN_TRACH: "Khiển trách",
  KEO_DAI_NANG_LUONG: "Kéo dài thời hạn nâng lương",
  CACH_CHUC: "Cách chức",
  SA_THAI: "Sa thải",
};

export const DISCIPLINE_FORM_OPTIONS = Object.entries(DISCIPLINE_FORM_LABELS).map(
  ([value, label]) => ({
    value: value as DisciplineForm,
    label,
  })
);

export const DISCIPLINE_STATUS_LABELS: Record<DisciplineStatus, string> = {
  DRAFT: "Bản nháp / Chưa xử lý",
  PENDING_DISMISSAL_APPROVAL: "Chờ phê duyệt sa thải",
  DECIDED: "Đã ban hành quyết định",
  CANCELLED: "Đã hủy bỏ / Miễn trách nhiệm",
};

export const DISCIPLINE_STATUS_OPTIONS = Object.entries(
  DISCIPLINE_STATUS_LABELS
).map(([value, label]) => ({
  value: value as DisciplineStatus,
  label,
}));

export const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  SALARY_BENEFIT: "Tiền lương, phụ cấp & chế độ phúc lợi",
  COLLEAGUE_CONFLICT: "Mâu thuẫn đồng nghiệp, quản lý trực tiếp",
  HARASSMENT_BULLYING: "Quấy rối, bắt nạt hoặc phân biệt đối xử",
  WORKING_CONDITIONS: "Điều kiện làm việc, vệ sinh ATLD",
  APPRAISAL_PROMOTION: "Đánh giá KPI, xếp loại, đề bạt thăng tiến",
  OTHER: "Phản ánh & khiếu nại khác",
};

export const COMPLAINT_CATEGORY_OPTIONS = Object.entries(
  COMPLAINT_CATEGORY_LABELS
).map(([value, label]) => ({
  value: value as ComplaintCategory,
  label,
}));

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  OPEN: "Tiếp nhận mới",
  INVESTIGATING: "Đang điều tra / Xác minh",
  RESOLVED: "Đã giải quyết / Đưa ra kết luận",
  CLOSED: "Đã đóng hồ sơ",
};

export const COMPLAINT_STATUS_OPTIONS = Object.entries(
  COMPLAINT_STATUS_LABELS
).map(([value, label]) => ({
  value: value as ComplaintStatus,
  label,
}));

