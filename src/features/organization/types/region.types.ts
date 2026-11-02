import type { BaseFilterParams } from "./common.types";

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

