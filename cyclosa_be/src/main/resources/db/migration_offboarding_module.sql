-- =============================================================================
-- Migration: Offboarding Module (Thôi việc & Bàn giao)
-- Author: CYCLOSA Architecture Team
-- Date: 2026-11-16
-- =============================================================================

-- 1. Bảng hồ sơ thôi việc / quyết định chấm dứt
CREATE TABLE IF NOT EXISTS offboarding_requests (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    type VARCHAR(30) NOT NULL, -- RESIGNATION, TERMINATION
    status VARCHAR(30) NOT NULL, -- PENDING, APPROVED, REJECTED, PROCESSING, COMPLETED, CANCELLED
    
    -- Trường dành cho Đơn xin thôi việc (Resignation)
    resignation_reason VARCHAR(50),
    notice_date DATE,
    desired_last_working_date DATE,
    
    -- Trường dành cho Quyết định chấm dứt HĐLĐ (Termination)
    termination_reason VARCHAR(50),
    discipline_id VARCHAR(36),
    decision_number VARCHAR(100),
    decision_date DATE,
    
    -- Thông tin chung & Bàn giao
    actual_last_working_date DATE NOT NULL,
    successor_id VARCHAR(36),
    reason_detail TEXT,
    notes TEXT,
    
    -- Phê duyệt & Hoàn tất
    approved_by VARCHAR(36),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Base Entity Fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_offboarding_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_offboarding_successor FOREIGN KEY (successor_id) REFERENCES employees(id),
    CONSTRAINT fk_offboarding_approver FOREIGN KEY (approved_by) REFERENCES employees(id)
);

CREATE INDEX IF NOT EXISTS idx_offboarding_employee_id ON offboarding_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_offboarding_status ON offboarding_requests(status);
CREATE INDEX IF NOT EXISTS idx_offboarding_type ON offboarding_requests(type);

-- 2. Bảng 5 hạng mục bàn giao (Offboarding Clearance Items)
CREATE TABLE IF NOT EXISTS offboarding_clearance_items (
    id VARCHAR(36) PRIMARY KEY,
    offboarding_request_id VARCHAR(36) NOT NULL,
    clearance_type VARCHAR(30) NOT NULL, -- JOB_HANDOVER, ASSET, IT_ACCOUNT, FINANCE, DOCUMENT
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, CLEARED, REJECTED
    cleared_by VARCHAR(36),
    cleared_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    -- Base Entity Fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_clearance_offboarding FOREIGN KEY (offboarding_request_id) REFERENCES offboarding_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_clearance_cleared_by FOREIGN KEY (cleared_by) REFERENCES employees(id)
);

CREATE INDEX IF NOT EXISTS idx_clearance_request_id ON offboarding_clearance_items(offboarding_request_id);
CREATE INDEX IF NOT EXISTS idx_clearance_status ON offboarding_clearance_items(status);

-- 3. Bảng phỏng vấn thôi việc (Exit Interview)
CREATE TABLE IF NOT EXISTS exit_interviews (
    id VARCHAR(36) PRIMARY KEY,
    offboarding_request_id VARCHAR(36) NOT NULL UNIQUE,
    interviewer_id VARCHAR(36) NOT NULL,
    interview_date DATE NOT NULL,
    primary_reason VARCHAR(100),
    working_environment_feedback TEXT,
    management_feedback TEXT,
    compensation_feedback TEXT,
    improvement_suggestions TEXT,
    willing_to_recommend BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    
    -- Base Entity Fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_exit_interview_offboarding FOREIGN KEY (offboarding_request_id) REFERENCES offboarding_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_exit_interview_interviewer FOREIGN KEY (interviewer_id) REFERENCES employees(id)
);

CREATE INDEX IF NOT EXISTS idx_exit_interview_request_id ON exit_interviews(offboarding_request_id);
