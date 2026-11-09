import type {
  ContractStatus,
  ContractType,
  SigningForm,
  TemplateKind,
  SignerStatus,
  CertificateValidity,
} from "../types/contract.types";

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  DRAFT: "Bản nháp",
  PENDING_APPROVAL: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  IN_SIGNING: "Đang ký số",
  ACTIVE: "Đang hiệu lực",
  EXPIRED: "Hết hạn",
  TERMINATED: "Đã chấm dứt",
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
  PENDING_APPROVAL: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  APPROVED: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  IN_SIGNING: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  ACTIVE: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  EXPIRED: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  TERMINATED: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
};

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  PROBATION: "Hợp đồng thử việc",
  FIXED_TERM: "Xác định thời hạn",
  INDEFINITE: "Không xác định thời hạn",
  SERVICE: "Hợp đồng dịch vụ",
  SEASONAL: "Theo mùa vụ / Công việc nhất định",
  APPRENTICESHIP: "Hợp đồng đào tạo / Học nghề",
  COLLABORATOR: "Hợp đồng cộng tác viên",
};

export const SIGNING_FORM_LABELS: Record<SigningForm, string> = {
  ELECTRONIC: "Ký điện tử (E-Contract)",
  WET_INK: "Ký giấy truyền thống",
  HYBRID: "Hỗn hợp (Điện tử & Giấy)",
};

export const TEMPLATE_KIND_LABELS: Record<TemplateKind, string> = {
  LABOR_CONTRACT: "Hợp đồng lao động chính thức",
  PROBATION_CONTRACT: "Hợp đồng thử việc",
  SEASONAL_CONTRACT: "Hợp đồng mùa vụ / Thời vụ",
  COLLABORATOR_AGREEMENT: "Thỏa thuận cộng tác viên",
  APPENDIX_ADJUSTMENT: "Phụ lục điều chỉnh hợp đồng",
  TERMINATION_AGREEMENT: "Biên bản thanh lý hợp đồng",
};

export const SIGNER_STATUS_LABELS: Record<SignerStatus, string> = {
  WAITING: "Chờ đến lượt ký",
  NOTIFIED: "Đã gửi thông báo",
  SIGNED: "Đã ký số thành công",
  REJECTED: "Từ chối ký",
  EXPIRED: "Quá hạn ký",
  CANCELLED: "Đã hủy yêu cầu",
};

export const SIGNER_STATUS_COLORS: Record<SignerStatus, { bg: string; text: string }> = {
  WAITING: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  NOTIFIED: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  SIGNED: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
  REJECTED: { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300" },
  EXPIRED: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
  CANCELLED: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-500 dark:text-gray-400" },
};

export const CERTIFICATE_VALIDITY_LABELS: Record<CertificateValidity, string> = {
  VALID: "Chứng thư số hợp lệ",
  REVOKED: "Chứng thư đã bị thu hồi",
  EXPIRED: "Chứng thư đã hết hạn",
  UNCHECKED: "Chưa kiểm tra chữ ký số",
};

