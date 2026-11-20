import type { BaseFilterParams } from "./common.types";

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

