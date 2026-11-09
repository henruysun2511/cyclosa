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
  DRAFT: { bg: "bg-slate-600", text: "text-white", border: "border-transparent" },
  PENDING_APPROVAL: { bg: "bg-amber-600", text: "text-white", border: "border-transparent" },
  APPROVED: { bg: "bg-blue-600", text: "text-white", border: "border-transparent" },
  IN_SIGNING: { bg: "bg-purple-600", text: "text-white", border: "border-transparent" },
  ACTIVE: { bg: "bg-emerald-600", text: "text-white", border: "border-transparent" },
  EXPIRED: { bg: "bg-orange-600", text: "text-white", border: "border-transparent" },
  TERMINATED: { bg: "bg-rose-600", text: "text-white", border: "border-transparent" },
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
  WAITING: { bg: "bg-slate-500", text: "text-white" },
  NOTIFIED: { bg: "bg-blue-600", text: "text-white" },
  SIGNED: { bg: "bg-emerald-600", text: "text-white" },
  REJECTED: { bg: "bg-rose-600", text: "text-white" },
  EXPIRED: { bg: "bg-amber-600", text: "text-white" },
  CANCELLED: { bg: "bg-gray-600", text: "text-white" },
};

export const CERTIFICATE_VALIDITY_LABELS: Record<CertificateValidity, string> = {
  VALID: "Chứng thư số hợp lệ",
  REVOKED: "Chứng thư đã bị thu hồi",
  EXPIRED: "Chứng thư đã hết hạn",
  UNCHECKED: "Chưa kiểm tra chữ ký số",
};

