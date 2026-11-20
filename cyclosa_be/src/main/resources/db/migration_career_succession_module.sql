-- ====================================================================
-- MIGRATION SCRIPT: MODULE 13 - PHÁT TRIỂN NHÂN SỰ & QUY HOẠCH KẾ NHIỆM
-- (CAREER & SUCCESSION PLANNING - M13)
-- ====================================================================

-- 1. Tuyến thăng tiến chuẩn (career_paths)
CREATE TABLE IF NOT EXISTS career_paths (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    from_job_title_id UUID NOT NULL REFERENCES job_titles(id),
    to_job_title_id UUID NOT NULL REFERENCES job_titles(id),
    min_experience_years DECIMAL(4, 1) NOT NULL DEFAULT 1.0,
    requirements TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_path_company_id ON career_paths(company_id);
CREATE INDEX IF NOT EXISTS idx_career_path_from ON career_paths(from_job_title_id);
CREATE INDEX IF NOT EXISTS idx_career_path_to ON career_paths(to_job_title_id);

-- 2. Kế hoạch kế nhiệm vị trí trọng yếu (succession_plans)
CREATE TABLE IF NOT EXISTS succession_plans (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    job_title_id UUID NOT NULL REFERENCES job_titles(id),
    risk_level VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    review_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_succ_plan_company_id ON succession_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_succ_plan_dept ON succession_plans(department_id);
CREATE INDEX IF NOT EXISTS idx_succ_plan_job ON succession_plans(job_title_id);
CREATE INDEX IF NOT EXISTS idx_succ_plan_risk ON succession_plans(risk_level);

-- 3. Ứng viên kế cận (succession_candidates)
CREATE TABLE IF NOT EXISTS succession_candidates (
    id UUID PRIMARY KEY,
    succession_plan_id UUID NOT NULL REFERENCES succession_plans(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    readiness VARCHAR(30) NOT NULL DEFAULT 'READY_NOW',
    development_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_succ_cand_plan ON succession_candidates(succession_plan_id);
CREATE INDEX IF NOT EXISTS idx_succ_cand_emp ON succession_candidates(employee_id);
CREATE INDEX IF NOT EXISTS idx_succ_cand_readiness ON succession_candidates(readiness);

-- 4. Kho nhân tài nội bộ (internal_talent_pool)
CREATE TABLE IF NOT EXISTS internal_talent_pool (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    tag VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_talent_pool_company ON internal_talent_pool(company_id);
CREATE INDEX IF NOT EXISTS idx_talent_pool_emp ON internal_talent_pool(employee_id);
CREATE INDEX IF NOT EXISTS idx_talent_pool_tag ON internal_talent_pool(tag);

-- 5. Kịch bản mô phỏng công danh (career_simulations)
CREATE TABLE IF NOT EXISTS career_simulations (
    id UUID PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id),
    start_job_title_id UUID NOT NULL REFERENCES job_titles(id),
    tenure_months INT NOT NULL DEFAULT 12,
    title VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_career_sim_emp ON career_simulations(employee_id);

-- 6. Các bước trong kịch bản mô phỏng (career_simulation_steps)
CREATE TABLE IF NOT EXISTS career_simulation_steps (
    id UUID PRIMARY KEY,
    simulation_id UUID NOT NULL REFERENCES career_simulations(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    job_title_id UUID NOT NULL REFERENCES job_titles(id),
    match_percent DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sim_step_sim ON career_simulation_steps(simulation_id);
CREATE INDEX IF NOT EXISTS idx_sim_step_title ON career_simulation_steps(job_title_id);

-- Bổ sung Unique Constraints nếu chưa có
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_career_path_company_from_to') THEN
        ALTER TABLE career_paths ADD CONSTRAINT uq_career_path_company_from_to UNIQUE (company_id, from_job_title_id, to_job_title_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_succession_plan_dept_job') THEN
        ALTER TABLE succession_plans ADD CONSTRAINT uq_succession_plan_dept_job UNIQUE (department_id, job_title_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_succ_cand_plan_emp') THEN
        ALTER TABLE succession_candidates ADD CONSTRAINT uq_succ_cand_plan_emp UNIQUE (succession_plan_id, employee_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_talent_pool_emp_tag') THEN
        ALTER TABLE internal_talent_pool ADD CONSTRAINT uq_talent_pool_emp_tag UNIQUE (employee_id, tag);
    END IF;
END $$;

-- 7. Cấp quyền hệ thống cho Module 13 (Permissions)
INSERT INTO permissions (resource, action, code, description) VALUES
('CAREER', 'VIEW', 'career.view', 'Xem lộ trình thăng tiến và đồ thị mạng lưới phát triển'),
('CAREER', 'MANAGE', 'career.manage', 'Thiết lập, cập nhật và quản lý các tuyến thăng tiến chuẩn'),
('SUCCESSION', 'VIEW', 'succession.view', 'Xem kế hoạch kế nhiệm, kho nhân tài nội bộ và ma trận 9 ô'),
('SUCCESSION', 'MANAGE', 'succession.manage', 'Quản lý kế hoạch kế nhiệm, chỉ định ứng viên kế cận và gắn thẻ nhân tài')
ON CONFLICT (code) DO NOTHING;

-- Gán quyền cho các role quản trị
DO $$
DECLARE
    r_admin UUID;
    r_hr_mgr UUID;
    p_career_v UUID;
    p_career_m UUID;
    p_succ_v UUID;
    p_succ_m UUID;
BEGIN
    SELECT id INTO r_admin FROM roles WHERE code = 'ADMIN' LIMIT 1;
    SELECT id INTO r_hr_mgr FROM roles WHERE code = 'HR_MANAGER' LIMIT 1;

    SELECT id INTO p_career_v FROM permissions WHERE code = 'career.view' LIMIT 1;
    SELECT id INTO p_career_m FROM permissions WHERE code = 'career.manage' LIMIT 1;
    SELECT id INTO p_succ_v FROM permissions WHERE code = 'succession.view' LIMIT 1;
    SELECT id INTO p_succ_m FROM permissions WHERE code = 'succession.manage' LIMIT 1;

    IF r_admin IS NOT NULL THEN
        IF p_career_v IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_career_v) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_career_v);
        END IF;
        IF p_career_m IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_career_m) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_career_m);
        END IF;
        IF p_succ_v IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_succ_v) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_succ_v);
        END IF;
        IF p_succ_m IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_succ_m) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_succ_m);
        END IF;
    END IF;

    IF r_hr_mgr IS NOT NULL THEN
        IF p_career_v IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_career_v) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_career_v);
        END IF;
        IF p_career_m IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_career_m) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_career_m);
        END IF;
        IF p_succ_v IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_succ_v) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_succ_v);
        END IF;
        IF p_succ_m IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_succ_m) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_succ_m);
        END IF;
    END IF;
END $$;

-- 8. Seed dữ liệu mẫu hiển thị (Career Paths, Succession Plans, Candidates, Talent Pool)
DO $$
DECLARE
    v_comp_id UUID;
    v_dept_tech UUID;
    v_dept_hr UUID;
    v_jt_dev UUID;
    v_jt_senior_dev UUID;
    v_jt_tech_lead UUID;
    v_jt_architect UUID;
    v_emp_1 UUID;
    v_emp_2 UUID;
    v_emp_3 UUID;
    v_emp_4 UUID;
    v_plan_tech UUID;
    v_plan_hr UUID;
BEGIN
    SELECT id INTO v_comp_id FROM companies LIMIT 1;
    IF v_comp_id IS NULL THEN RETURN; END IF;

    -- Job Titles
    SELECT id INTO v_jt_dev FROM job_titles WHERE company_id = v_comp_id ORDER BY created_at LIMIT 1;
    SELECT id INTO v_jt_senior_dev FROM job_titles WHERE company_id = v_comp_id AND id != v_jt_dev ORDER BY created_at LIMIT 1;
    SELECT id INTO v_jt_tech_lead FROM job_titles WHERE company_id = v_comp_id AND id NOT IN (v_jt_dev, v_jt_senior_dev) ORDER BY created_at LIMIT 1;
    SELECT id INTO v_jt_architect FROM job_titles WHERE company_id = v_comp_id AND id NOT IN (v_jt_dev, v_jt_senior_dev, v_jt_tech_lead) ORDER BY created_at LIMIT 1;

    -- Fallback nếu không có đủ 4 job titles
    IF v_jt_senior_dev IS NULL THEN v_jt_senior_dev := v_jt_dev; END IF;
    IF v_jt_tech_lead IS NULL THEN v_jt_tech_lead := v_jt_dev; END IF;
    IF v_jt_architect IS NULL THEN v_jt_architect := v_jt_senior_dev; END IF;

    -- Departments
    SELECT id INTO v_dept_tech FROM departments WHERE company_id = v_comp_id ORDER BY created_at LIMIT 1;
    SELECT id INTO v_dept_hr FROM departments WHERE company_id = v_comp_id AND id != v_dept_tech ORDER BY created_at LIMIT 1;
    IF v_dept_hr IS NULL THEN v_dept_hr := v_dept_tech; END IF;

    -- Employees
    SELECT id INTO v_emp_1 FROM employees WHERE company_id = v_comp_id ORDER BY created_at LIMIT 1;
    SELECT id INTO v_emp_2 FROM employees WHERE company_id = v_comp_id AND id != v_emp_1 ORDER BY created_at LIMIT 1;
    SELECT id INTO v_emp_3 FROM employees WHERE company_id = v_comp_id AND id NOT IN (v_emp_1, v_emp_2) ORDER BY created_at LIMIT 1;
    SELECT id INTO v_emp_4 FROM employees WHERE company_id = v_comp_id AND id NOT IN (v_emp_1, v_emp_2, v_emp_3) ORDER BY created_at LIMIT 1;

    -- 8.1 Seed Tuyến thăng tiến chuẩn (Career Paths)
    IF v_jt_dev != v_jt_senior_dev AND NOT EXISTS (
        SELECT 1 FROM career_paths WHERE company_id = v_comp_id AND from_job_title_id = v_jt_dev AND to_job_title_id = v_jt_senior_dev
    ) THEN
        INSERT INTO career_paths (id, company_id, from_job_title_id, to_job_title_id, min_experience_years, requirements, created_at)
        VALUES 
        (gen_random_uuid(), v_comp_id, v_jt_dev, v_jt_senior_dev, 2.0, 'Đạt hiệu suất xuất sắc 2 năm liên tiếp, chứng chỉ chuyên môn nâng cao', NOW());
    END IF;

    IF v_jt_senior_dev != v_jt_tech_lead AND NOT EXISTS (
        SELECT 1 FROM career_paths WHERE company_id = v_comp_id AND from_job_title_id = v_jt_senior_dev AND to_job_title_id = v_jt_tech_lead
    ) THEN
        INSERT INTO career_paths (id, company_id, from_job_title_id, to_job_title_id, min_experience_years, requirements, created_at)
        VALUES 
        (gen_random_uuid(), v_comp_id, v_jt_senior_dev, v_jt_tech_lead, 3.0, 'Kỹ năng quản trị dự án, năng lực dẫn dắt nhóm từ 5 thành viên', NOW());
    END IF;

    IF v_jt_tech_lead != v_jt_architect AND NOT EXISTS (
        SELECT 1 FROM career_paths WHERE company_id = v_comp_id AND from_job_title_id = v_jt_tech_lead AND to_job_title_id = v_jt_architect
    ) THEN
        INSERT INTO career_paths (id, company_id, from_job_title_id, to_job_title_id, min_experience_years, requirements, created_at)
        VALUES 
        (gen_random_uuid(), v_comp_id, v_jt_tech_lead, v_jt_architect, 3.5, 'Năng lực thiết kế kiến trúc phân tán Enterprise, tư duy chiến lược sản phẩm', NOW());
    END IF;

    -- 8.2 Seed Kế hoạch kế nhiệm (Succession Plans)
    IF v_dept_tech IS NOT NULL AND v_jt_tech_lead IS NOT NULL THEN
        SELECT id INTO v_plan_tech FROM succession_plans WHERE department_id = v_dept_tech AND job_title_id = v_jt_tech_lead;
        IF v_plan_tech IS NULL THEN
            v_plan_tech := gen_random_uuid();
            INSERT INTO succession_plans (id, company_id, department_id, job_title_id, risk_level, review_date, created_at)
            VALUES (v_plan_tech, v_comp_id, v_dept_tech, v_jt_tech_lead, 'CRITICAL', CURRENT_DATE + INTERVAL '90 days', NOW());
        END IF;

        -- Seed Ứng viên kế cận cho v_plan_tech (Readiness: READY_NOW, READY_1_2_YEARS, READY_3_5_YEARS)
        IF v_emp_1 IS NOT NULL AND v_plan_tech IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM succession_candidates WHERE succession_plan_id = v_plan_tech AND employee_id = v_emp_1
        ) THEN
            INSERT INTO succession_candidates (id, succession_plan_id, employee_id, readiness, development_notes, created_at)
            VALUES (gen_random_uuid(), v_plan_tech, v_emp_1, 'READY_NOW', 'Hoàn thành xuất sắc khóa Leadership Mentoring, đã đóng vai trò Backup Lead 6 tháng qua.', NOW());
        END IF;

        IF v_emp_2 IS NOT NULL AND v_plan_tech IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM succession_candidates WHERE succession_plan_id = v_plan_tech AND employee_id = v_emp_2
        ) THEN
            INSERT INTO succession_candidates (id, succession_plan_id, employee_id, readiness, development_notes, created_at)
            VALUES (gen_random_uuid(), v_plan_tech, v_emp_2, 'READY_1_2_YEARS', 'Cần hoàn thiện thêm kỹ năng phân rã kiến trúc microservices và quản trị ngân sách team.', NOW());
        END IF;
    END IF;

    IF v_dept_hr IS NOT NULL AND v_jt_senior_dev IS NOT NULL THEN
        SELECT id INTO v_plan_hr FROM succession_plans WHERE department_id = v_dept_hr AND job_title_id = v_jt_senior_dev;
        IF v_plan_hr IS NULL THEN
            v_plan_hr := gen_random_uuid();
            INSERT INTO succession_plans (id, company_id, department_id, job_title_id, risk_level, review_date, created_at)
            VALUES (v_plan_hr, v_comp_id, v_dept_hr, v_jt_senior_dev, 'HIGH', CURRENT_DATE + INTERVAL '60 days', NOW());
        END IF;

        IF v_emp_3 IS NOT NULL AND v_plan_hr IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM succession_candidates WHERE succession_plan_id = v_plan_hr AND employee_id = v_emp_3
        ) THEN
            INSERT INTO succession_candidates (id, succession_plan_id, employee_id, readiness, development_notes, created_at)
            VALUES (gen_random_uuid(), v_plan_hr, v_emp_3, 'READY_3_5_YEARS', 'Nhân sự có tư duy logic tốt, đang tham gia luân chuyển công việc định kỳ.', NOW());
        END IF;
    END IF;

    -- 8.3 Seed Kho nhân tài nội bộ (Talent Pool) - Tag: HIPO, KEY_TALENT, LEADERSHIP_POTENTIAL, TECH_EXPERT
    IF v_emp_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM internal_talent_pool WHERE employee_id = v_emp_1 AND tag = 'KEY_TALENT') THEN
        INSERT INTO internal_talent_pool (id, company_id, employee_id, tag, reason, created_at)
        VALUES (gen_random_uuid(), v_comp_id, v_emp_1, 'KEY_TALENT', 'Top 5% nhân sự có đóng góp vượt trội toàn công ty trong năm tài chính.', NOW());
    END IF;

    IF v_emp_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM internal_talent_pool WHERE employee_id = v_emp_2 AND tag = 'HIPO') THEN
        INSERT INTO internal_talent_pool (id, company_id, employee_id, tag, reason, created_at)
        VALUES (gen_random_uuid(), v_comp_id, v_emp_2, 'HIPO', 'Tiềm năng lãnh đạo nổi trội, khả năng học hỏi và ứng biến tốc độ cao.', NOW());
    END IF;

    IF v_emp_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM internal_talent_pool WHERE employee_id = v_emp_3 AND tag = 'TECH_EXPERT') THEN
        INSERT INTO internal_talent_pool (id, company_id, employee_id, tag, reason, created_at)
        VALUES (gen_random_uuid(), v_comp_id, v_emp_3, 'TECH_EXPERT', 'Nắm giữ bí quyết kỹ thuật cốt lõi và các chứng chỉ bảo mật cấp độ cao.', NOW());
    END IF;

    IF v_emp_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM internal_talent_pool WHERE employee_id = v_emp_4 AND tag = 'LEADERSHIP_POTENTIAL') THEN
        INSERT INTO internal_talent_pool (id, company_id, employee_id, tag, reason, created_at)
        VALUES (gen_random_uuid(), v_comp_id, v_emp_4, 'LEADERSHIP_POTENTIAL', 'Tố chất điều phối, dẫn dắt đội ngũ dự án xuyên chức năng xuất sắc.', NOW());
    END IF;

END $$;
