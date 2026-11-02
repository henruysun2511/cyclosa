import type { BaseFilterParams } from "./common.types";

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

