import type { BaseFilterParams } from "./common.types";

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

