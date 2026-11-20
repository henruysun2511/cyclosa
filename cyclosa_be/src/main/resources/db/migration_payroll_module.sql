-- ====================================================================
-- Migration: Module 10 - Bảng lương và Tính lương tự động (Payroll)
-- Date: 2026-11-16
-- Author: Antigravity
-- Căn cứ pháp lý: Luật Thuế TNCN 109/2025/QH15, Luật BHXH 2024, BLLĐ 2019
-- ====================================================================

-- 1. Bảng salary_components (Danh mục thành phần lương)
CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(30) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    default_amount NUMERIC(18, 2),
    is_taxable BOOLEAN NOT NULL DEFAULT TRUE,
    is_insurance_base BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_salary_components_company_code UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_salary_components_company ON salary_components(company_id);
CREATE INDEX IF NOT EXISTS idx_salary_components_category ON salary_components(category);

-- 2. Bảng employee_salary_items (Khoản lương gán cho nhân viên ngoài HĐLĐ)
CREATE TABLE IF NOT EXISTS employee_salary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    salary_component_id UUID NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    effective_from DATE,
    effective_to DATE,
    payroll_period_id UUID,
    discipline_case_id UUID,
    note VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_emp_salary_items_comp FOREIGN KEY (salary_component_id) REFERENCES salary_components(id)
);

CREATE INDEX IF NOT EXISTS idx_emp_salary_items_emp ON employee_salary_items(employee_id);
CREATE INDEX IF NOT EXISTS idx_emp_salary_items_period ON employee_salary_items(payroll_period_id);

-- 3. Bảng salary_histories (Lịch sử mức lương nhân viên)
CREATE TABLE IF NOT EXISTS salary_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    effective_from DATE NOT NULL,
    base_salary NUMERIC(18, 2) NOT NULL,
    insurance_salary NUMERIC(18, 2),
    reason VARCHAR(30) NOT NULL,
    decision_no VARCHAR(50),
    contract_id UUID,
    contract_appendix_id UUID,
    note VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_salary_histories_emp_date UNIQUE (employee_id, effective_from)
);

CREATE INDEX IF NOT EXISTS idx_salary_histories_emp ON salary_histories(employee_id);

-- 4. Bảng salary_advances (Tạm ứng tiền lương)
CREATE TABLE IF NOT EXISTS salary_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    reason TEXT NOT NULL,
    requested_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    status VARCHAR(30) NOT NULL,
    disbursed_at TIMESTAMP WITHOUT TIME ZONE,
    recovery_payroll_period_id UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_salary_advances_emp ON salary_advances(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_advances_status ON salary_advances(status);
CREATE INDEX IF NOT EXISTS idx_salary_advances_recovery ON salary_advances(recovery_payroll_period_id);

-- 5. Bảng payroll_periods (Kỳ lương)
CREATE TABLE IF NOT EXISTS payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    planned_payment_date DATE NOT NULL,
    standard_work_days NUMERIC(5, 2) NOT NULL,
    timesheet_period_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL,
    note VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_payroll_periods_company_code UNIQUE (company_id, code),
    CONSTRAINT uk_payroll_periods_timesheet UNIQUE (timesheet_period_id)
);

CREATE INDEX IF NOT EXISTS idx_payroll_periods_company ON payroll_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_payroll_periods_status ON payroll_periods(status);

-- 6. Bảng payroll_period_rule_versions (Bản chụp quy tắc pháp lý áp dụng)
CREATE TABLE IF NOT EXISTS payroll_period_rule_versions (
    payroll_period_id UUID NOT NULL,
    rule_version_id VARCHAR(100) NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    applied_parameters JSONB,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (payroll_period_id, rule_version_id),
    CONSTRAINT fk_rule_versions_period FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(id) ON DELETE CASCADE
);

-- 7. Bảng payroll_records (Bảng lương của từng nhân viên)
CREATE TABLE IF NOT EXISTS payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_period_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    timesheet_snapshot_id UUID,
    calculated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_payroll_records_period_emp UNIQUE (payroll_period_id, employee_id),
    CONSTRAINT fk_payroll_records_period FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payroll_records_period ON payroll_records(payroll_period_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_employee ON payroll_records(employee_id);

-- 8. Bảng payroll_record_lines (Dòng chi tiết bảng lương)
CREATE TABLE IF NOT EXISTS payroll_record_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_record_id UUID NOT NULL,
    line_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    overtime_day_type VARCHAR(30),
    is_night_work BOOLEAN,
    insurance_kind VARCHAR(20),
    salary_component_id UUID,
    reward_decision_id UUID,
    salary_advance_id UUID,
    discipline_case_id UUID,
    quantity NUMERIC(10, 2),
    rate NUMERIC(18, 2),
    amount NUMERIC(18, 2) NOT NULL,
    source VARCHAR(30) NOT NULL,
    adjustment_reason VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_payroll_lines_record FOREIGN KEY (payroll_record_id) REFERENCES payroll_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payroll_lines_record ON payroll_record_lines(payroll_record_id);
CREATE INDEX IF NOT EXISTS idx_payroll_lines_type ON payroll_record_lines(line_type);

-- 9. Bảng payroll_payments (Lịch sử giao dịch chi trả ngân hàng)
CREATE TABLE IF NOT EXISTS payroll_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_record_id UUID NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_holder_name VARCHAR(150) NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    bank_reference VARCHAR(100),
    paid_at TIMESTAMP WITHOUT TIME ZONE,
    failure_reason VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_payroll_payments_record FOREIGN KEY (payroll_record_id) REFERENCES payroll_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payroll_payments_record ON payroll_payments(payroll_record_id);
CREATE INDEX IF NOT EXISTS idx_payroll_payments_status ON payroll_payments(status);

-- 10. Bảng payslips (Phiếu lương điện tử)
CREATE TABLE IF NOT EXISTS payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_record_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    file_id UUID,
    file_url VARCHAR(500),
    issued_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_payslips_record UNIQUE (payroll_record_id),
    CONSTRAINT fk_payslips_record FOREIGN KEY (payroll_record_id) REFERENCES payroll_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payslips_emp ON payslips(employee_id);

