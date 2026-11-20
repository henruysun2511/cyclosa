// ============================================================================
// RTK QUERY API — PHÂN HỆ NHẬT KÝ KIỂM TOÁN & TRUY VẾT (MOD-19)
// 5 endpoints kết nối Backend /api/v1/audit-logs/**
// Tuân thủ Quy chuẩn §4.2 (0-based / 1-based) và §11.1 (Không lặp /api/v1)
// ============================================================================

import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  AuditLog,
  AuditLogDetail,
  AuditLogFilters,
  AuditTrailTimelineData,
  AuditActionDefinition,
  AuditExportResponse,
} from "../types/audit.types";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── 1. Tra cứu danh sách nhật ký kiểm toán (Phân trang đa chiều) ─────
    getAuditLogs: builder.query<
      ApiResponse<PageData<AuditLog>>,
      AuditLogFilters | void
    >({
      query: (params) => {
        const p = params || {};
        const queryParams: Record<string, unknown> = {};

        // Quy chuẩn §4.2: 1-based UI → 0-based Backend
        queryParams.page = p.page && p.page > 0 ? p.page - 1 : 0;
        if (p.size) queryParams.size = p.size;

        // Backend Spring Boot BaseFilterRequest dùng param "keyword", frontend có thể truyền search
        if (p.search?.trim()) {
          queryParams.keyword = p.search.trim();
          queryParams.search = p.search.trim();
        }

        if (p.action) queryParams.action = p.action;
        if (p.entityType) queryParams.entityType = p.entityType;
        if (p.entityId) queryParams.entityId = p.entityId;

        // Backend @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) yêu cầu chuẩn ISO có time
        if (p.from) {
          queryParams.from = p.from.includes("T") ? p.from : `${p.from}T00:00:00`;
        }
        if (p.to) {
          queryParams.to = p.to.includes("T") ? p.to : `${p.to}T23:59:59`;
        }

        if (p.ipAddress?.trim()) queryParams.ipAddress = p.ipAddress.trim();
        if (p.actorUserId) queryParams.actorUserId = p.actorUserId;

        // Mặc định sắp xếp theo mốc thời gian thao tác mới nhất
        queryParams.sortBy = "occurredAt";
        queryParams.direction = "desc";

        return {
          url: "/audit-logs",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "AuditLog" as const,
                id,
              })),
              { type: "AuditLog" as const, id: "LIST" },
            ]
          : [{ type: "AuditLog" as const, id: "LIST" }],
    }),

    // ── 2. Lấy chi tiết một bản ghi nhật ký kiểm toán kèm snapshot + diff ──
    getAuditLogById: builder.query<ApiResponse<AuditLogDetail>, string>({
      query: (id) => ({
        url: `/audit-logs/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "AuditLog" as const, id },
      ],
    }),

    // ── 3. Lấy dòng thời gian truy vết (Audit Trail) của một thực thể ─────
    getEntityAuditTrail: builder.query<
      ApiResponse<AuditTrailTimelineData>,
      { entityType: string; entityId: string }
    >({
      query: ({ entityType, entityId }) => ({
        url: `/audit-logs/entity/${entityType}/${entityId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { entityType, entityId }) => [
        { type: "AuditLog" as const, id: `TRAIL-${entityType}-${entityId}` },
      ],
    }),

    // ── 4. Lấy danh mục 13 hành động kiểm toán chuẩn hóa (cho Dropdown lọc) ──
    getAuditActionDefinitions: builder.query<
      ApiResponse<AuditActionDefinition[]>,
      void
    >({
      query: () => ({
        url: "/audit-logs/actions",
        method: "GET",
      }),
      providesTags: [{ type: "AuditLog" as const, id: "ACTIONS" }],
    }),

    // ── 5. Yêu cầu trích xuất dữ liệu Excel/CSV kèm tự ghi audit EXPORT ──
    exportAuditLogs: builder.mutation<
      ApiResponse<AuditExportResponse>,
      AuditLogFilters
    >({
      query: (params) => {
        const queryParams: Record<string, unknown> = {};
        if (params.action) queryParams.action = params.action;
        if (params.entityType) queryParams.entityType = params.entityType;
        if (params.from) queryParams.from = params.from;
        if (params.to) queryParams.to = params.to;
        if (params.format) queryParams.format = params.format;
        if (params.actorUserId) queryParams.actorUserId = params.actorUserId;

        return {
          url: "/audit-logs/export",
          method: "GET",
          params: queryParams,
        };
      },
      invalidatesTags: [{ type: "AuditLog" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAuditLogsQuery,
  useGetAuditLogByIdQuery,
  useGetEntityAuditTrailQuery,
  useGetAuditActionDefinitionsQuery,
  useExportAuditLogsMutation,
} = auditApi;

