import { z } from "zod";

export const COMPANY_PLANS = ["Basic", "Advanced", "Enterprise"] as const;
export const COMPANY_BILLING_CYCLES = ["Monthly", "Yearly"] as const;
export const COMPANY_STATUSES = ["Active", "Inactive"] as const;

// ── Base schema (shape from API / Entity) ──────────────────────────────
export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  logoBg: z.string(),
  logoColor: z.string(),
  initials: z.string(),
  email: z.string().email(),
  accountUrl: z.string(),
  plan: z.enum(COMPANY_PLANS),
  billingCycle: z.enum(COMPANY_BILLING_CYCLES),
  canUpgrade: z.boolean(),
  createdDate: z.string(),
  status: z.enum(COMPANY_STATUSES),
});

// ── Form schema: create ────────────────────────────────────────────────
export const createCompanySchema = z.object({
  name: z
    .string({ required_error: "Tên công ty là bắt buộc" })
    .min(2, "Tên công ty phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự"),

  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email("Email không đúng định dạng"),

  accountUrl: z
    .string({ required_error: "URL tài khoản là bắt buộc" })
    .min(3, "URL tài khoản quá ngắn"),

  plan: z.enum(COMPANY_PLANS, {
    required_error: "Gói đăng ký là bắt buộc",
  }).default("Advanced"),

  billingCycle: z.enum(COMPANY_BILLING_CYCLES, {
    required_error: "Chu kỳ thanh toán là bắt buộc",
  }).default("Monthly"),

  status: z.enum(COMPANY_STATUSES, {
    required_error: "Trạng thái là bắt buộc",
  }).default("Active"),
});

// ── Form schema: update ────────────────────────────────────────────────
export const updateCompanySchema = createCompanySchema.partial();

// ── Schema for company stats/KPIs ──────────────────────────────────────
export const companyStatsSchema = z.object({
  totalCompanies: z.number().int().nonnegative(),
  activeCompanies: z.number().int().nonnegative(),
  inactiveCompanies: z.number().int().nonnegative(),
  companyLocation: z.number().int().nonnegative(),
});
