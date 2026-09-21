import type { z } from "zod";
import type {
  companySchema,
  createCompanySchema,
  updateCompanySchema,
  companyStatsSchema,
  COMPANY_PLANS,
  COMPANY_BILLING_CYCLES,
  COMPANY_STATUSES,
} from "../schemas/company.schema";

export type Company = z.infer<typeof companySchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyStats = z.infer<typeof companyStatsSchema>;

export type CompanyPlan = (typeof COMPANY_PLANS)[number];
export type CompanyBillingCycle = (typeof COMPANY_BILLING_CYCLES)[number];
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];
