export type SalaryComponentCategory =
  | "BASIC"
  | "ALLOWANCE"
  | "BONUS"
  | "OVERTIME"
  | "DEDUCTION"
  | "OTHER";

export type ComponentFrequency = "MONTHLY" | "ONE_TIME" | "QUARTERLY" | "YEARLY";

export type SalaryAdvanceStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED";

export type PayrollPeriodStatus =
  | "OPEN"
  | "CALCULATING"
  | "CALCULATED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "PAYMENT_PROCESSING"
  | "PAID"
  | "LOCKED"
  | "REJECTED";

export type PayrollLineType =
  | "BASE_SALARY"
  | "OVERTIME"
  | "ALLOWANCE"
  | "BONUS"
  | "REIMBURSEMENT"
  | "INSURANCE_EMPLOYEE"
  | "PERSONAL_INCOME_TAX"
  | "ADVANCE_RECOVERY"
  | "DEDUCTION"
  | "INSURANCE_EMPLOYER";

export type PayrollLineSource = "SYSTEM_CALCULATED" | "MANUAL_ADJUSTMENT";

export type PaymentStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED";

export interface SalaryComponentDto {
  id: string;
  code: string;
  name: string;
  category: SalaryComponentCategory;
  frequency: ComponentFrequency;
  defaultAmount?: number;
  isTaxable: boolean;
  isInsuranceSalary: boolean;
  isActive: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSalaryComponentDto {
  code: string;
  name: string;
  category: SalaryComponentCategory;
  frequency: ComponentFrequency;
  defaultAmount?: number;
  isTaxable?: boolean;
  isInsuranceSalary?: boolean;
  description?: string;
}

export interface UpdateSalaryComponentDto {
  name: string;
  category: SalaryComponentCategory;
  frequency: ComponentFrequency;
  defaultAmount?: number;
  isTaxable?: boolean;
  isInsuranceSalary?: boolean;
  isActive?: boolean;
  description?: string;
}

export interface SalaryAdvanceDto {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  amount: number;
  reason: string;
  requestedAt: string;
  status: SalaryAdvanceStatus;
  disbursedAt?: string;
  recoveryPayrollPeriodId?: string;
  recoveryPayrollPeriodName?: string;
  createdAt?: string;
}

export interface CreateSalaryAdvanceDto {
  employeeId?: string;
  amount: number;
  requestDate: string;
  reason: string;
}

export interface PayrollPeriodDto {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  plannedPaymentDate: string;
  standardWorkDays: number;
  timesheetPeriodId?: string;
  status: PayrollPeriodStatus;
  note?: string;
  totalEmployees?: number;
  totalGross?: number;
  totalNet?: number;
  totalEmployerCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePayrollPeriodDto {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  plannedPaymentDate: string;
  standardWorkDays: number;
  timesheetPeriodId?: string;
  note?: string;
}

export interface UpdatePayrollPeriodDto {
  name: string;
  startDate: string;
  endDate: string;
  plannedPaymentDate: string;
  standardWorkDays: number;
  note?: string;
}

export interface PayrollPrecheckDto {
  isReady: boolean;
  totalEligibleEmployees: number;
  missingAttendanceEmployees?: number;
  missingSalaryContractEmployees?: number;
  pendingAdvancesCount?: number;
  warnings: string[];
  errors: string[];
}

export interface PayrollAnomalyDto {
  recordId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  anomalyType: string;
  message: string;
  currentNet: number;
  previousNet?: number;
  diffPercentage?: number;
}

export interface PayrollPeriodSummaryDto {
  periodId: string;
  periodCode: string;
  periodName: string;
  totalEmployees: number;
  totalGross: number;
  totalNet: number;
  totalEmployerCost: number;
  totalEmployeeInsurance: number;
  totalEmployerInsurance: number;
  totalPitTax: number;
  totalAdvanceDeducted: number;
  totalPaid: number;
  totalPendingPayment: number;
  diffGrossPercentage?: number;
  diffNetPercentage?: number;
  anomalyCount: number;
  anomalies: PayrollAnomalyDto[];
}

export interface PayrollRecordLineDto {
  id: string;
  payrollRecordId: string;
  lineType: PayrollLineType;
  title: string;
  quantity?: number;
  rate?: number;
  amount: number;
  source: PayrollLineSource;
  adjustmentReason?: string;
}

export interface PayrollRecordDto {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  positionName?: string;
  bankAccount?: string;
  bankName?: string;
  calculatedAt?: string;

  baseSalary?: number;
  standardDays?: number;
  actualWorkDays?: number;
  otHours?: number;
  totalAllowances?: number;
  grossSalary?: number;
  employeeInsurance?: number;
  employerInsurance?: number;
  pitTax?: number;
  salaryAdvance?: number;
  otherDeductions?: number;
  netSalary?: number;
  totalEmployerCost?: number;

  hasManualAdjustment?: boolean;
}

export interface PayrollRecordDetailDto {
  record: PayrollRecordDto;
  lines: PayrollRecordLineDto[];
}

export interface ManualAdjustmentDto {
  lineId?: string;
  salaryComponentId?: string;
  title?: string;
  amount: number;
  reason: string;
}

export interface PayrollPaymentDto {
  id: string;
  payrollRecordId: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  status: PaymentStatus;
  bankReference?: string;
  paidAt?: string;
  failureReason?: string;
  createdAt?: string;
}

export interface PayslipDto {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  positionName?: string;
  payrollPeriodId: string;
  payrollPeriodCode?: string;
  payrollPeriodName?: string;
  startDate?: string;
  endDate?: string;
  grossSalary?: number;
  totalAllowances?: number;
  employeeInsurance?: number;
  pitTax?: number;
  salaryAdvance?: number;
  netSalary?: number;
  fileId?: string;
  fileUrl?: string;
  issuedAt: string;
  lines?: PayrollRecordLineDto[];
}
