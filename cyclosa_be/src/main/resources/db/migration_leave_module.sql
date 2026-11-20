-- =============================================================================
-- MIGRATION: MODULE 14 - QUẢN LÝ NGHỈ PHÉP (LEAVE MANAGEMENT)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng loại nghỉ (leave_types)
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    leave_group VARCHAR(30) NOT NULL,
    payer VARCHAR(30) NOT NULL,
    fixed_days NUMERIC(4, 1),
    requires_approval BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_leave_type_company_code UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_leave_types_company ON leave_types(company_id);
CREATE INDEX IF NOT EXISTS idx_leave_types_group ON leave_types(leave_group);

-- 2. Bảng chính sách nghỉ phép năm (leave_policies)
CREATE TABLE IF NOT EXISTS leave_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    contract_type VARCHAR(30),
    effective_from DATE NOT NULL,
    annual_entitlement_days NUMERIC(4, 1) NOT NULL,
    seniority_step_years INT,
    seniority_bonus_days NUMERIC(3, 1),
    max_carryover_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    carryover_deadline_month SMALLINT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_leave_policies_eff UNIQUE (company_id, leave_type_id, contract_type, effective_from)
);

CREATE INDEX IF NOT EXISTS idx_leave_policies_company ON leave_policies(company_id);
CREATE INDEX IF NOT EXISTS idx_leave_policies_type ON leave_policies(leave_type_id);

-- 3. Bảng quỹ phép nhân viên theo năm (leave_balances)
CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    year SMALLINT NOT NULL,
    entitled_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    carried_over_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_leave_balance_emp_type_year UNIQUE (employee_id, leave_type_id, year)
);

CREATE INDEX IF NOT EXISTS idx_leave_balances_emp ON leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_year ON leave_balances(year);

-- 4. Bảng đơn xin nghỉ phép (leave_requests)
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    requested_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    day_portion VARCHAR(20) NOT NULL DEFAULT 'FULL_DAY',
    days_count NUMERIC(4, 1) NOT NULL,
    reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL',
    workflow_request_id UUID,
    rejection_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_leave_request_dates CHECK (start_date <= end_date),
    CONSTRAINT chk_leave_request_portion CHECK (day_portion = 'FULL_DAY' OR start_date = end_date)
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_emp ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_company ON leave_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);

