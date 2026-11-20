import type { BaseFilterParams } from "./common.types";

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

