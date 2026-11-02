import type { BaseFilterParams } from "./common.types";

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

