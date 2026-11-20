-- ====================================================================
-- Migration: Module 09 - Điểm danh và Quản lý Ca làm việc (Attendance)
-- Date: 2026-11-15
-- Author: Antigravity
-- ====================================================================

-- 1. Bảng shifts (Ca làm việc)
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    late_grace_minutes INT NOT NULL DEFAULT 0,
    early_grace_minutes INT NOT NULL DEFAULT 0,
    work_credit NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_shifts_company_code UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_shifts_company_id ON shifts(company_id);
CREATE INDEX IF NOT EXISTS idx_shifts_code ON shifts(code);

-- 2. Bảng shift_assignments (Phân ca làm việc)
CREATE TABLE IF NOT EXISTS shift_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    shift_id UUID NOT NULL,
    work_date DATE NOT NULL,
    assigned_by UUID,
    note VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_shift_assignments_shift FOREIGN KEY (shift_id) REFERENCES shifts(id),
    CONSTRAINT uk_shift_assignment_emp_date UNIQUE (employee_id, work_date)
);

CREATE INDEX IF NOT EXISTS idx_shift_assignments_employee_date ON shift_assignments(employee_id, work_date);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_work_date ON shift_assignments(work_date);

-- 3. Bảng attendance_logs (Log quẹt thẻ / điểm danh)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    device_id VARCHAR(100),
    device_name VARCHAR(255),
    ip_address VARCHAR(50),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    location_address VARCHAR(500),
    image_url VARCHAR(1000),
    verification_result VARCHAR(50) NOT NULL,
    similarity_score NUMERIC(5, 4),
    transaction_code VARCHAR(100) NOT NULL,
    raw_payload TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_attendance_logs_tx UNIQUE (transaction_code)
);

CREATE INDEX IF NOT EXISTS idx_attendance_logs_emp_occurred ON attendance_logs(employee_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_event_type ON attendance_logs(event_type);

-- 4. Bảng attendance_requests (Đơn giải trình / điều chỉnh chấm công)
CREATE TABLE IF NOT EXISTS attendance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    work_date DATE NOT NULL,
    proposed_check_in TIMESTAMP WITH TIME ZONE,
    proposed_check_out TIMESTAMP WITH TIME ZONE,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approver_id UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    attachment_urls TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_attendance_requests_emp_date ON attendance_requests(employee_id, work_date);
CREATE INDEX IF NOT EXISTS idx_attendance_requests_status ON attendance_requests(status);

-- 5. Bảng attendance_adjustments (Dữ liệu điều chỉnh sau duyệt)
CREATE TABLE IF NOT EXISTS attendance_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_request_id UUID NOT NULL UNIQUE,
    employee_id UUID NOT NULL,
    work_date DATE NOT NULL,
    adjusted_check_in TIMESTAMP WITH TIME ZONE,
    adjusted_check_out TIMESTAMP WITH TIME ZONE,
    adjusted_by UUID NOT NULL,
    adjusted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    note VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_attendance_adj_request FOREIGN KEY (attendance_request_id) REFERENCES attendance_requests(id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_adj_emp_date ON attendance_adjustments(employee_id, work_date);

-- 6. Bảng timesheet_periods (Kỳ chốt công)
CREATE TABLE IF NOT EXISTS timesheet_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    period_year INT NOT NULL,
    period_month INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    locked_by UUID,
    locked_at TIMESTAMP WITH TIME ZONE,
    unlock_reason TEXT,
    unlocked_by UUID,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_timesheet_period_company_month UNIQUE (company_id, period_year, period_month)
);

CREATE INDEX IF NOT EXISTS idx_timesheet_periods_company ON timesheet_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_periods_status ON timesheet_periods(status);

-- 7. Bảng timesheet_snapshots (Bảng công chốt snapshot cho từng nhân viên)
CREATE TABLE IF NOT EXISTS timesheet_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timesheet_period_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    total_standard_working_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    total_actual_working_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    total_paid_leave_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    total_unpaid_leave_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    total_late_minutes INT NOT NULL DEFAULT 0,
    total_early_minutes INT NOT NULL DEFAULT 0,
    total_missing_punch_count INT NOT NULL DEFAULT 0,
    total_payroll_credit_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    raw_breakdown_json TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_timesheet_snapshot_period FOREIGN KEY (timesheet_period_id) REFERENCES timesheet_periods(id),
    CONSTRAINT uk_timesheet_snapshot_period_emp UNIQUE (timesheet_period_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_timesheet_snapshots_period ON timesheet_snapshots(timesheet_period_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_snapshots_employee ON timesheet_snapshots(employee_id);

-- 8. Bảng timesheet_snapshot_overtimes (Chi tiết tăng ca snapshot)
CREATE TABLE IF NOT EXISTS timesheet_snapshot_overtimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timesheet_snapshot_id UUID NOT NULL,
    day_type VARCHAR(50) NOT NULL,
    multiplier NUMERIC(3, 2) NOT NULL,
    hours NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_timesheet_ot_snapshot FOREIGN KEY (timesheet_snapshot_id) REFERENCES timesheet_snapshots(id)
);

CREATE INDEX IF NOT EXISTS idx_timesheet_ot_snapshot ON timesheet_snapshot_overtimes(timesheet_snapshot_id);
