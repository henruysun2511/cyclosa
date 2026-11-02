// =============================================================================
// CYCLOSA HRM - CONSTANTS FOR MODULE 01: ORGANIZATION MANAGEMENT
// =============================================================================

export const DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Các chế độ hiển thị màn hình Sơ đồ tổ chức
 */
export const ORG_VIEW_MODES = {
  TREE: "tree",
  TABLE: "table",
} as const;

export type OrgViewMode = (typeof ORG_VIEW_MODES)[keyof typeof ORG_VIEW_MODES];

/**
 * Các Tab trong màn hình Danh mục Cơ cấu tổ chức
 */
export const CATALOG_TABS = {
  COMPANIES: "companies",
  BRANCHES: "branches",
  COST_CENTERS: "cost-centers",
  JOB_MATRIX: "job-matrix",
} as const;

export type CatalogTab = (typeof CATALOG_TABS)[keyof typeof CATALOG_TABS];

export const CATALOG_TAB_LABELS: Record<CatalogTab, string> = {
  companies: "Công ty & Pháp nhân",
  branches: "Vùng miền & Chi nhánh (GPS)",
  "cost-centers": "Trung tâm Chi phí",
  "job-matrix": "Chức danh & Cấp bậc",
};

/**
 * Trạng thái hoạt động của Công ty
 */
export const COMPANY_STATUS_LABELS: Record<"ACTIVE" | "INACTIVE", string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Tạm ngưng",
};

export const COMPANY_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Tạm ngưng" },
] as const;

/**
 * Tùy chọn phân trang kích thước trang (dùng chung từ config toàn cục)
 */
export { PAGE_SIZE_OPTIONS } from "@/config/pagination";

/**
 * Cấu hình mặc định cho Chi nhánh và GPS
 */
export const GPS_CONFIG = {
  DEFAULT_RADIUS_METERS: 200,
  MIN_RADIUS_METERS: 10,
  MAX_RADIUS_METERS: 5000,
} as const;

