-- ==============================================================================
-- CYCLOSA HRM - MODULE 12: KHEN THƯỞNG, KỶ LUẬT & KHIẾU NẠI (REWARD & DISCIPLINE)
-- ==============================================================================

-- 1. BẢNG QUYẾT ĐỊNH KHEN THƯỞNG (reward_decisions)
CREATE TABLE IF NOT EXISTS reward_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    reward_type VARCHAR(30) NOT NULL, -- CERTIFICATE, MONETARY_BONUS, PROMOTION_PROPOSAL, OTHER
    title VARCHAR(200) NOT NULL,
    reason TEXT NOT NULL,
    amount DECIMAL(18,2) NULL,
    decided_by_employee_id UUID NOT NULL REFERENCES employees(id),
    decision_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT chk_reward_amount CHECK (
        (reward_type = 'MONETARY_BONUS' AND amount IS NOT NULL AND amount > 0) OR
        (reward_type != 'MONETARY_BONUS')
    )
);

CREATE INDEX IF NOT EXISTS idx_reward_decisions_company ON reward_decisions(company_id);
CREATE INDEX IF NOT EXISTS idx_reward_decisions_employee ON reward_decisions(employee_id);
CREATE INDEX IF NOT EXISTS idx_reward_decisions_date ON reward_decisions(decision_date);

-- 2. BẢNG HỒ SƠ VI PHẠM & KỶ LUẬT (discipline_cases)
CREATE TABLE IF NOT EXISTS discipline_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    violation_date DATE NOT NULL,
    violation_category VARCHAR(30) NOT NULL, -- GENERAL, FINANCIAL_ASSET_SECRET
    violation_description TEXT NOT NULL,
    rule_basis TEXT NULL,
    meeting_date DATE NULL,
    meeting_note TEXT NULL,
    discipline_form VARCHAR(30) NULL, -- KHIEN_TRACH, KEO_DAI_NANG_LUONG, CACH_CHUC, SA_THAI
    salary_extension_months INT NULL,
    reason TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING_DISMISSAL_APPROVAL, DECIDED
    decided_by_employee_id UUID NULL REFERENCES employees(id),
    decided_at DATE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_discipline_cases_company ON discipline_cases(company_id);
CREATE INDEX IF NOT EXISTS idx_discipline_cases_employee ON discipline_cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_discipline_cases_status ON discipline_cases(status);

-- 3. BẢNG THÀNH PHẦN THAM DỰ HỌP KỶ LUẬT (discipline_participants)
CREATE TABLE IF NOT EXISTS discipline_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_case_id UUID NOT NULL REFERENCES discipline_cases(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    participant_role VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_discipline_participant UNIQUE(discipline_case_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_discipline_participants_case ON discipline_participants(discipline_case_id);

-- 4. BẢNG BẰNG CHỨNG VI PHẠM (discipline_evidences)
CREATE TABLE IF NOT EXISTS discipline_evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_case_id UUID NOT NULL REFERENCES discipline_cases(id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    file_id UUID NULL,
    file_url VARCHAR(500) NULL,
    file_name VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_discipline_evidences_case ON discipline_evidences(discipline_case_id);

-- 5. BẢNG KHIẾU NẠI & PHẢN ÁNH NỘI BỘ (complaints)
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    complainant_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL, -- WORKPLACE_CONFLICT, COMPENSATION, POLICY, HARASSMENT, OTHER
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED, CLOSED
    handler_employee_id UUID NULL REFERENCES employees(id),
    resolution TEXT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE NULL,
    closed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_complaints_company ON complaints(company_id);
CREATE INDEX IF NOT EXISTS idx_complaints_complainant ON complaints(complainant_employee_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

