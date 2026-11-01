import type { UserStatus } from "../constants/user.constants";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
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
  username?: string;
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
