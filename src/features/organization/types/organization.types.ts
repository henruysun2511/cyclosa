// =============================================================================
// CYCLOSA HRM - TYPES FOR MODULE 01: ORGANIZATION MANAGEMENT
// =============================================================================

import type { BaseFilterParams } from "@/types/api.types";

// ── 1. Company (Công ty / Pháp nhân) ──────────────────────────────────────────
export interface Company {
  id: string;
  code: string;
  name: string;
  taxCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCompanyInput {
  code: string;
  name: string;
  taxCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface UpdateCompanyInput {
  name: string;
  taxCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CompanyFilterParams extends BaseFilterParams {
  status?: string;
}

// ── 2. Region (Khu vực / Vùng miền) ──────────────────────────────────────────
export interface Region {
  id: string;
  companyId: string;
  code: string;
  name: string;
  branchCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRegionInput {
  companyId: string;
  code: string;
  name: string;
}

export interface UpdateRegionInput {
  name: string;
}

export interface RegionFilterParams extends BaseFilterParams {
  companyId: string;
}

// ── 3. Branch (Chi nhánh / Văn phòng GPS) ────────────────────────────────────
export interface Branch {
  id: string;
  regionId: string;
  regionName?: string;
  code: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  attendanceRadiusMeters: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBranchInput {
  regionId: string;
  code: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  attendanceRadiusMeters?: number;
}

export interface UpdateBranchInput {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  attendanceRadiusMeters?: number;
  isActive?: boolean;
}

export interface BranchFilterParams extends BaseFilterParams {
  regionId: string;
  isActive?: boolean;
}

// ── 4. Cost Center (Trung tâm chi phí) ────────────────────────────────────────
export interface CostCenter {
  id: string;
  companyId: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCostCenterInput {
  companyId: string;
  code: string;
  name: string;
  description?: string;
}

export interface UpdateCostCenterInput {
  name: string;
  description?: string;
}

export interface CostCenterFilterParams extends BaseFilterParams {
  companyId: string;
}

// ── 5. Job Title (Chức danh công việc) ────────────────────────────────────────
export interface JobTitle {
  id: string;
  companyId: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobTitleInput {
  companyId: string;
  code: string;
  name: string;
  description?: string;
}

export interface UpdateJobTitleInput {
  name: string;
  description?: string;
}

export interface JobTitleFilterParams extends BaseFilterParams {
  companyId: string;
}

// ── 6. Job Level (Cấp bậc chức danh) ─────────────────────────────────────────
export interface JobLevel {
  id: string;
  companyId: string;
  code: string;
  name: string;
  rankOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobLevelInput {
  companyId: string;
  code: string;
  name: string;
  rankOrder: number;
}

export interface UpdateJobLevelInput {
  name: string;
  rankOrder: number;
}

export interface JobLevelFilterParams extends BaseFilterParams {
  companyId: string;
}

// ── 7. Department & Org Tree ─────────────────────────────────────────────────
export interface Department {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentDepartmentId?: string | null;
  parentDepartmentName?: string | null;
  costCenterId?: string | null;
  costCenterName?: string | null;
  managerEmployeeId?: string | null;
  isPermissionInherited: boolean;
  effectiveFrom?: string;
  dissolvedDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentNode {
  id: string;
  code: string;
  name: string;
  parentDepartmentId?: string | null;
  costCenterId?: string | null;
  costCenterName?: string | null;
  managerEmployeeId?: string | null;
  isPermissionInherited: boolean;
  effectiveFrom?: string;
  memberCount: number;
  children: DepartmentNode[];
}

export interface DepartmentVersion {
  id: string;
  departmentId: string;
  effectiveFrom: string;
  name: string;
  parentDepartmentId?: string | null;
  parentDepartmentName?: string | null;
  costCenterId?: string | null;
  costCenterName?: string | null;
  managerEmployeeId?: string | null;
  isPermissionInherited: boolean;
  createdAt: string;
}

export interface DepartmentImpact {
  departmentId: string;
  departmentName: string;
  targetParentDepartmentId?: string | null;
  targetParentDepartmentName?: string | null;
  isValid: boolean;
  invalidReason?: string | null;
  affectedSubDepartmentCount: number;
  affectedEmployeeCount: number;
  affectedDepartmentIds: string[];
}

export interface CreateDepartmentInput {
  companyId: string;
  code: string;
  name: string;
  parentDepartmentId?: string | null;
  costCenterId?: string | null;
  managerEmployeeId?: string | null;
  effectiveFrom: string;
  isPermissionInherited?: boolean;
}

export interface UpdateDepartmentInput {
  name: string;
  parentDepartmentId?: string | null;
  costCenterId?: string | null;
  managerEmployeeId?: string | null;
  effectiveFrom: string;
  isPermissionInherited?: boolean;
}

export interface MoveDepartmentInput {
  newParentDepartmentId?: string | null;
  effectiveFrom: string;
}

export interface DepartmentFilterParams extends BaseFilterParams {
  companyId: string;
}

