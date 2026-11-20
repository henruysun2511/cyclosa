import type { BaseFilterParams } from "./common.types";

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

