-- ==============================================================================
-- CYCLOSA HRM - MODULE 11: HIỆU SUẤT & KPI (PERFORMANCE MANAGEMENT)
-- ==============================================================================

-- 1. BẢNG KỲ ĐÁNH GIÁ (performance_cycles)
CREATE TABLE IF NOT EXISTS performance_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    cycle_type VARCHAR(30) NOT NULL, -- QUARTERLY, SEMI_ANNUAL, ANNUAL
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, ACTIVE, CLOSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT uq_performance_cycles_company_name UNIQUE (company_id, name),
    CONSTRAINT chk_performance_cycles_dates CHECK (start_date <= end_date)
);

CREATE INDEX IF NOT EXISTS idx_perf_cycles_company_status ON performance_cycles(company_id, status);

-- 2. BẢNG DANH MỤC KPI (kpis)
CREATE TABLE IF NOT EXISTS kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    measurement_method TEXT,
    department_id UUID NULL REFERENCES departments(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT uq_kpis_company_name UNIQUE (company_id, name)
);

CREATE INDEX IF NOT EXISTS idx_kpis_company_dept ON kpis(company_id, department_id);

-- 3. BẢNG PHIẾU ĐÁNH GIÁ (performance_reviews)
CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL REFERENCES performance_cycles(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    manager_employee_id UUID NULL REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SELF_REVIEWED, MANAGER_REVIEWED, FINALIZED
    self_comment TEXT,
    manager_comment TEXT,
    self_submitted_at TIMESTAMP WITH TIME ZONE,
    manager_submitted_at TIMESTAMP WITH TIME ZONE,
    final_score NUMERIC(5, 2),
    final_rating VARCHAR(30), -- EXCELLENT, GOOD, SATISFACTORY, NEEDS_IMPROVEMENT, POOR
    finalized_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    finalized_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT uq_performance_reviews_cycle_employee UNIQUE (cycle_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_perf_reviews_cycle ON performance_reviews(cycle_id);
CREATE INDEX IF NOT EXISTS idx_perf_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_perf_reviews_manager ON performance_reviews(manager_employee_id);

-- 4. BẢNG MỤC TIÊU CÔNG VIỆC (performance_goals)
CREATE TABLE IF NOT EXISTS performance_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES performance_reviews(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    target_value NUMERIC(18, 2),
    kpi_id UUID NULL REFERENCES kpis(id) ON DELETE SET NULL,
    weight NUMERIC(5, 2) NOT NULL, -- 0.01 - 100.00
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED
    self_score NUMERIC(5, 2),
    self_comment TEXT,
    manager_score NUMERIC(5, 2),
    manager_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID NULL,
    updated_by UUID NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_perf_goals_review ON performance_goals(review_id);
CREATE INDEX IF NOT EXISTS idx_perf_goals_kpi ON performance_goals(kpi_id);
