import type { UserStatus } from "../constants/user.constants";

export interface UserResponse {
  id: string;
  email: string;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UserDetailResponse {
  id: string;
  email: string;
  status: UserStatus;
  lastLoginAt: string | null;
  linkedProviders: string[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserFilterParams {
  keyword?: string;
  status?: UserStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export interface CreateUserPayload {
  email: string;
  employeeId?: string;
  roleCodes?: string[];
}

export interface UserRoleAssignmentResponse {
  id: string;
  userId: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  companyId: string;
  createdAt: string;
}

export interface AssignUserRolePayload {
  roleId: string;
  companyId: string;
}

export interface EffectivePermissionResponse {
  permissionCode: string;
  maxDataScope: string;
}

