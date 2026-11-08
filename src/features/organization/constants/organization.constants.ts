// =============================================================================
// CYCLOSA HRM - CONSTANTS FOR MODULE 01: ORGANIZATION MANAGEMENT
// =============================================================================

export const DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001";

/**
 * 3 Chiều độc lập theo chuẩn DocuCore Enterprise UI Architecture
 */
export const ORG_DIMENSIONS = {
  ORGANIZATION: "organization",
  GEOGRAPHY: "geography",
  JOB_POSITIONS: "job_positions",
} as const;

export type OrgDimension = (typeof ORG_DIMENSIONS)[keyof typeof ORG_DIMENSIONS];

export interface DimensionConfigItem {
  id: OrgDimension;
  code: string;
  name: string;
  desc: string;
}

export const ORG_DIMENSION_CONFIG: readonly DimensionConfigItem[] = [
  {
    id: ORG_DIMENSIONS.ORGANIZATION,
    code: "F-C02",
    name: "Đơn vị tổ chức",
    desc: "Cây kế thừa quyền xuống đơn vị con (Hội sở, Khối, Phòng ban, Bộ phận)",
  },
  {
    id: ORG_DIMENSIONS.GEOGRAPHY,
    code: "F-C03",
    name: "Địa lý & Chi nhánh",
    desc: "Vùng / Chi nhánh / PGD — cây riêng, không suy diễn từ đơn vị",
  },
  {
    id: ORG_DIMENSIONS.JOB_POSITIONS,
    code: "F-C04",
    name: "Vị trí việc làm",
    desc: "Danh mục chức danh & cấp bậc phẳng, độc lập với hai cây trên",
  },
] as const;

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

