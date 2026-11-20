// ============================================================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU PHÂN HỆ NHẬT KÝ KIỂM TOÁN & TRUY VẾT (MOD-19)
// Khớp 100% với Backend DTOs: AuditLogResponse, AuditLogDetailResponse,
// AuditTrailTimelineResponse, AuditActionDefinitionResponse, AuditExportResponse
// ============================================================================

/**
 * 13 Hành động kiểm toán chuẩn hóa (Khớp với enum AuditAction.java)
 */
export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "OVERRIDE"
  | "EXPORT"
  | "VIEW"
  | "DOWNLOAD"
  | "LOGIN"
  | "LOCK"
  | "UNLOCK"
  | "PUBLISH";

/**
 * Thông tin tác nhân thực hiện thao tác (Khớp ActorInfoResponse.java)
 */
export interface ActorInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  jobTitle?: string | null;
  department?: string | null;
}

/**
 * Chi tiết trường dữ liệu có sự biến động (Khớp ChangedFieldResponse.java)
 */
export interface ChangedField {
  field: string;
  displayName: string;
  oldValue: unknown;
  newValue: unknown;
}

/**
 * Bản ghi nhật ký kiểm toán trong danh sách (Khớp AuditLogResponse.java)
 */
export interface AuditLog {
  id: string;
  actor: ActorInfo;
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityReference?: string | null;
  occurredAt: string; // ISO-8601
  ipAddress?: string | null;
  userAgent?: string | null;
  description?: string | null;
}

/**
 * Chi tiết bản ghi nhật ký kiểm toán kèm snapshot và danh sách trường biến động
 * (Khớp AuditLogDetailResponse.java)
 */
export interface AuditLogDetail extends AuditLog {
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  changedFields?: ChangedField[];
}

/**
 * Sự kiện kiểm toán trên trục thời gian (Khớp AuditTrailEventResponse.java)
 */
export interface AuditTrailEvent {
  logId: string;
  occurredAt: string; // ISO-8601
  action: AuditAction;
  actorName: string;
  description?: string | null;
}

/**
 * Lịch sử truy vết thực thể (Khớp AuditTrailTimelineResponse.java)
 */
export interface AuditTrailTimelineData {
  entityType: string;
  entityId: string;
  totalEvents: number;
  timeline: AuditTrailEvent[];
}

export type AuditTrailTimeline = AuditTrailTimelineData;

/**
 * Định nghĩa hành động kiểm toán chuẩn hóa phục vụ bộ lọc giao diện
 * (Khớp AuditActionDefinitionResponse.java)
 */
export interface AuditActionDefinition {
  code: string;
  name: string;
  badgeVariant: string;
}

/**
 * Phản hồi yêu cầu trích xuất nhật ký kiểm toán (Khớp AuditExportResponse.java)
 */
export interface AuditExportResponse {
  jobId: string;
  estimatedRecords: number;
  downloadUrl?: string | null;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
}

/**
 * Tham số bộ lọc danh sách nhật ký kiểm toán (Khớp AuditLogFilterRequest.java)
 */
export interface AuditLogFilters {
  page?: number;
  size?: number;
  search?: string;
  actorUserId?: string;
  action?: AuditAction | "";
  entityType?: string;
  entityId?: string;
  from?: string; // ISO-8601 datetime
  to?: string; // ISO-8601 datetime
  ipAddress?: string;
  format?: "XLSX" | "CSV";
}

