-- ====================================================================
-- MIGRATION SCRIPT: MODULE MÔ PHỎNG TÁI CƠ CẤU TỔ CHỨC (ORG RESTRUCTURING)
-- ====================================================================

-- 1. Bảng Kịch bản tái cơ cấu (org_scenarios)
CREATE TABLE IF NOT EXISTS org_scenarios (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    scope VARCHAR(30) NOT NULL DEFAULT 'COMPANY_WIDE',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    target_effective_date DATE NOT NULL,
    executed_at TIMESTAMP,
    executed_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT uq_org_scenario_code UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_org_scenarios_comp_status ON org_scenarios(company_id, status);

-- 2. Bảng Phòng ban ảo trong kịch bản (scenario_departments)
CREATE TABLE IF NOT EXISTS scenario_departments (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    scenario_id UUID NOT NULL REFERENCES org_scenarios(id) ON DELETE CASCADE,
    original_department_id UUID REFERENCES departments(id),
    parent_scenario_dept_id UUID REFERENCES scenario_departments(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    manager_employee_id UUID REFERENCES employees(id),
    status_in_scenario VARCHAR(30) NOT NULL DEFAULT 'UNCHANGED',
    target_headcount INT NOT NULL DEFAULT 0,
    is_permission_inherited BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scen_dept_scenario ON scenario_departments(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scen_dept_parent ON scenario_departments(parent_scenario_dept_id);
CREATE INDEX IF NOT EXISTS idx_scen_dept_status ON scenario_departments(scenario_id, status_in_scenario);

-- 3. Bảng Nhật ký thao tác trong kịch bản (scenario_actions)
CREATE TABLE IF NOT EXISTS scenario_actions (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    scenario_id UUID NOT NULL REFERENCES org_scenarios(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    payload TEXT NOT NULL,
    summary TEXT NOT NULL,
    executed_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scen_actions_scen ON scenario_actions(scenario_id, created_at);

-- 4. Bảng Phân công nhân sự trong kịch bản (scenario_employee_assignments)
CREATE TABLE IF NOT EXISTS scenario_employee_assignments (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    scenario_id UUID NOT NULL REFERENCES org_scenarios(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    original_department_id UUID REFERENCES departments(id),
    new_scenario_dept_id UUID NOT NULL REFERENCES scenario_departments(id),
    original_job_title_id UUID REFERENCES job_titles(id),
    new_job_title_id UUID NOT NULL REFERENCES job_titles(id),
    original_manager_id UUID REFERENCES employees(id),
    new_manager_id UUID REFERENCES employees(id),
    assignment_status VARCHAR(30) NOT NULL DEFAULT 'UNCHANGED',
    proposed_salary DECIMAL(15, 2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    CONSTRAINT uq_scen_emp_assign UNIQUE (scenario_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_scen_emp_scenario_dept ON scenario_employee_assignments(scenario_id, new_scenario_dept_id);
CREATE INDEX IF NOT EXISTS idx_scen_emp_status ON scenario_employee_assignments(scenario_id, assignment_status);

-- 5. Cấp quyền hệ thống cho Module Mô phỏng Tái cơ cấu (Permissions)
INSERT INTO permissions (resource, action, code, description) VALUES
('ORG_RESTRUCTURE', 'VIEW', 'org_restructure.view', 'Xem danh sách kịch bản, cây tổ chức giả lập và phân tích What-If'),
('ORG_RESTRUCTURE', 'MANAGE', 'org_restructure.manage', 'Tạo mới, chỉnh sửa, kéo thả sơ đồ, sáp nhập, chia tách và điều chuyển nhân sự ảo'),
('ORG_RESTRUCTURE', 'APPROVE', 'org_restructure.approve', 'Thẩm định, phê duyệt hoặc từ chối kịch bản tái cơ cấu tổ chức'),
('ORG_RESTRUCTURE', 'EXECUTE', 'org_restructure.execute', 'Thực thi áp dụng chính thức kịch bản vào cây tổ chức thực tế')
ON CONFLICT (code) DO NOTHING;

-- Gán quyền cho các role quản trị ADMIN và HR_MANAGER
DO $$
DECLARE
    r_admin UUID;
    r_hr_mgr UUID;
    p_v UUID;
    p_m UUID;
    p_a UUID;
    p_e UUID;
BEGIN
    SELECT id INTO r_admin FROM roles WHERE code = 'ADMIN' LIMIT 1;
    SELECT id INTO r_hr_mgr FROM roles WHERE code = 'HR_MANAGER' LIMIT 1;

    SELECT id INTO p_v FROM permissions WHERE code = 'org_restructure.view' LIMIT 1;
    SELECT id INTO p_m FROM permissions WHERE code = 'org_restructure.manage' LIMIT 1;
    SELECT id INTO p_a FROM permissions WHERE code = 'org_restructure.approve' LIMIT 1;
    SELECT id INTO p_e FROM permissions WHERE code = 'org_restructure.execute' LIMIT 1;

    IF r_admin IS NOT NULL THEN
        IF p_v IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_v) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_v);
        END IF;
        IF p_m IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_m) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_m);
        END IF;
        IF p_a IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_a) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_a);
        END IF;
        IF p_e IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_admin AND permission_id = p_e) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_admin, p_e);
        END IF;
    END IF;

    IF r_hr_mgr IS NOT NULL THEN
        IF p_v IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_v) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_v);
        END IF;
        IF p_m IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_m) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_m);
        END IF;
        IF p_a IS NOT NULL AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = r_hr_mgr AND permission_id = p_a) THEN
            INSERT INTO role_permissions (role_id, permission_id) VALUES (r_hr_mgr, p_a);
        END IF;
    END IF;
END $$;

-- 6. Seed dữ liệu mẫu chi tiết cho Module Tái cơ cấu (Scenarios, Departments, Assignments, Actions)
DO $$
DECLARE
    v_comp_id UUID;
    v_user_id UUID;
    v_dept_1 UUID;
    v_dept_2 UUID;
    v_dept_3 UUID;
    v_emp_1 UUID;
    v_emp_2 UUID;
    v_emp_3 UUID;
    v_emp_4 UUID;
    v_jt_1 UUID;
    v_jt_2 UUID;

    v_scen_1 UUID;
    v_scen_2 UUID;
    v_scen_dept_root UUID;
    v_scen_dept_sub1 UUID;
    v_scen_dept_sub2 UUID;
    v_scen_dept_ai UUID;
BEGIN
    SELECT id INTO v_comp_id FROM companies LIMIT 1;
    IF v_comp_id IS NULL THEN RETURN; END IF;

    SELECT id INTO v_user_id FROM users LIMIT 1;

    -- Departments thực tế
    SELECT id INTO v_dept_1 FROM departments WHERE company_id = v_comp_id ORDER BY created_at LIMIT 1;
    SELECT id INTO v_dept_2 FROM departments WHERE company_id = v_comp_id AND id != v_dept_1 ORDER BY created_at LIMIT 1;
    SELECT id INTO v_dept_3 FROM departments WHERE company_id = v_comp_id AND id NOT IN (v_dept_1, v_dept_2) ORDER BY created_at LIMIT 1;

    -- Employees thực tế
    SELECT id INTO v_emp_1 FROM employees WHERE company_id = v_comp_id ORDER BY created_at LIMIT 1;
    SELECT id INTO v_emp_2 FROM employees WHERE company_id = v_comp_id AND id != v_emp_1 ORDER BY created_at LIMIT 1;
    SELECT id INTO v_emp_3 FROM employees WHERE company_id = v_comp_id AND id NOT IN (v_emp_1, v_emp_2) ORDER BY created_at LIMIT 1;
    SELECT id INTO v_emp_4 FROM employees WHERE company_id = v_comp_id AND id NOT IN (v_emp_1, v_emp_2, v_emp_3) ORDER BY created_at LIMIT 1;

    -- Job Titles thực tế
    SELECT id INTO v_jt_1 FROM job_titles WHERE company_id = v_comp_id ORDER BY created_at LIMIT 1;
    SELECT id INTO v_jt_2 FROM job_titles WHERE company_id = v_comp_id AND id != v_jt_1 ORDER BY created_at LIMIT 1;
    IF v_jt_2 IS NULL THEN v_jt_2 := v_jt_1; END IF;

    -- 6.1 Tạo Kịch bản 1: "Tái cấu trúc Khối Công nghệ & Sản phẩm 2027" (DRAFT)
    IF NOT EXISTS (SELECT 1 FROM org_scenarios WHERE company_id = v_comp_id AND code = 'SCENARIO-TECH-2027') THEN
        v_scen_1 := gen_random_uuid();
        INSERT INTO org_scenarios (id, company_id, name, code, description, scope, status, target_effective_date, created_by, created_at)
        VALUES (
            v_scen_1,
            v_comp_id,
            'Tái cấu trúc Khối Công nghệ & Sản phẩm 2027',
            'SCENARIO-TECH-2027',
            'Phương án sáp nhập các đội ngũ phát triển sản phẩm, thành lập Trung tâm AI & Đổi mới sáng tạo phục vụ chiến lược GenAI toàn tập đoàn.',
            'COMPANY_WIDE',
            'DRAFT',
            CURRENT_DATE + INTERVAL '45 days',
            v_user_id,
            NOW() - INTERVAL '3 days'
        );

        -- Tạo cây phòng ban ảo trong kịch bản 1
        v_scen_dept_root := gen_random_uuid();
        INSERT INTO scenario_departments (id, company_id, scenario_id, original_department_id, parent_scenario_dept_id, code, name, manager_employee_id, status_in_scenario, target_headcount, created_by, created_at)
        VALUES (v_scen_dept_root, v_comp_id, v_scen_1, v_dept_1, NULL, 'TECH-CORP', 'Ban Công nghệ & Chuyển đổi số', v_emp_1, 'MODIFIED', 35, v_user_id, NOW() - INTERVAL '3 days');

        v_scen_dept_sub1 := gen_random_uuid();
        INSERT INTO scenario_departments (id, company_id, scenario_id, original_department_id, parent_scenario_dept_id, code, name, manager_employee_id, status_in_scenario, target_headcount, created_by, created_at)
        VALUES (v_scen_dept_sub1, v_comp_id, v_scen_1, v_dept_2, v_scen_dept_root, 'ENG-CORE', 'Phòng Kỹ thuật Nền tảng (Platform Engineering)', v_emp_2, 'UNCHANGED', 20, v_user_id, NOW() - INTERVAL '2 days');

        v_scen_dept_ai := gen_random_uuid();
        INSERT INTO scenario_departments (id, company_id, scenario_id, original_department_id, parent_scenario_dept_id, code, name, manager_employee_id, status_in_scenario, target_headcount, created_by, created_at)
        VALUES (v_scen_dept_ai, v_comp_id, v_scen_1, NULL, v_scen_dept_root, 'AI-LAB', 'Trung tâm Nghiên cứu AI & Tự động hóa', v_emp_3, 'ADDED', 15, v_user_id, NOW() - INTERVAL '1 day');

        IF v_dept_3 IS NOT NULL THEN
            v_scen_dept_sub2 := gen_random_uuid();
            INSERT INTO scenario_departments (id, company_id, scenario_id, original_department_id, parent_scenario_dept_id, code, name, manager_employee_id, status_in_scenario, target_headcount, created_by, created_at)
            VALUES (v_scen_dept_sub2, v_comp_id, v_scen_1, v_dept_3, v_scen_dept_root, 'LEGACY-SYS', 'Bộ phận Vận hành Hệ thống Cũ', NULL, 'MERGED', 0, v_user_id, NOW() - INTERVAL '1 day');
        END IF;

        -- Phân công nhân sự trong kịch bản 1
        IF v_emp_1 IS NOT NULL THEN
            INSERT INTO scenario_employee_assignments (id, company_id, scenario_id, employee_id, original_department_id, new_scenario_dept_id, original_job_title_id, new_job_title_id, assignment_status, notes, created_by, created_at)
            VALUES (gen_random_uuid(), v_comp_id, v_scen_1, v_emp_1, v_dept_1, v_scen_dept_root, v_jt_1, v_jt_1, 'PROMOTED', 'Bổ nhiệm Giám đốc Khối Công nghệ & CĐS', v_user_id, NOW() - INTERVAL '2 days');
        END IF;

        IF v_emp_2 IS NOT NULL THEN
            INSERT INTO scenario_employee_assignments (id, company_id, scenario_id, employee_id, original_department_id, new_scenario_dept_id, original_job_title_id, new_job_title_id, assignment_status, notes, created_by, created_at)
            VALUES (gen_random_uuid(), v_comp_id, v_scen_1, v_emp_2, v_dept_2, v_scen_dept_sub1, v_jt_1, v_jt_1, 'UNCHANGED', 'Tiếp tục phụ trách Platform Engineering', v_user_id, NOW() - INTERVAL '2 days');
        END IF;

        IF v_emp_3 IS NOT NULL THEN
            INSERT INTO scenario_employee_assignments (id, company_id, scenario_id, employee_id, original_department_id, new_scenario_dept_id, original_job_title_id, new_job_title_id, assignment_status, notes, created_by, created_at)
            VALUES (gen_random_uuid(), v_comp_id, v_scen_1, v_emp_3, v_dept_1, v_scen_dept_ai, v_jt_2, v_jt_2, 'TRANSFERRED', 'Điều chuyển sang phụ trách AI Lab', v_user_id, NOW() - INTERVAL '1 day');
        END IF;

        IF v_emp_4 IS NOT NULL THEN
            INSERT INTO scenario_employee_assignments (id, company_id, scenario_id, employee_id, original_department_id, new_scenario_dept_id, original_job_title_id, new_job_title_id, assignment_status, notes, created_by, created_at)
            VALUES (gen_random_uuid(), v_comp_id, v_scen_1, v_emp_4, v_dept_2, v_scen_dept_ai, v_jt_2, v_jt_2, 'TRANSFERRED', 'Kỹ sư AI nòng cốt', v_user_id, NOW() - INTERVAL '1 day');
        END IF;

        -- Ghi nhận lịch sử thao tác
        INSERT INTO scenario_actions (id, company_id, scenario_id, action_type, payload, summary, executed_by, created_at)
        VALUES 
        (gen_random_uuid(), v_comp_id, v_scen_1, 'CREATE_DEPT', '{"name":"Trung tâm Nghiên cứu AI"}', 'Thành lập đơn vị mới: Trung tâm Nghiên cứu AI & Tự động hóa', v_user_id, NOW() - INTERVAL '2 days'),
        (gen_random_uuid(), v_comp_id, v_scen_1, 'MERGE_DEPTS', '{"merged":"LEGACY-SYS"}', 'Sáp nhập Bộ phận Vận hành Hệ thống Cũ vào Ban Công nghệ', v_user_id, NOW() - INTERVAL '1 day'),
        (gen_random_uuid(), v_comp_id, v_scen_1, 'REASSIGN_EMP', '{"count":2}', 'Điều chuyển 2 chuyên gia kỹ thuật sang Trung tâm AI Lab', v_user_id, NOW() - INTERVAL '12 hours');
    END IF;

    -- 6.2 Tạo Kịch bản 2: "Phương án Tinh gọn Khối Vận hành & Hỗ trợ" (SUBMITTED)
    IF NOT EXISTS (SELECT 1 FROM org_scenarios WHERE company_id = v_comp_id AND code = 'SCENARIO-OPS-2027') THEN
        v_scen_2 := gen_random_uuid();
        INSERT INTO org_scenarios (id, company_id, name, code, description, scope, status, target_effective_date, created_by, created_at)
        VALUES (
            v_scen_2,
            v_comp_id,
            'Phương án Tinh gọn Khối Vận hành & Hỗ trợ',
            'SCENARIO-OPS-2027',
            'Sắp xếp tinh giản các phòng ban hành chính trung gian, tăng tỉ lệ quản lý Span of Control từ 4 lên 7 nhân sự/quản lý.',
            'DIVISION_LEVEL',
            'SUBMITTED',
            CURRENT_DATE + INTERVAL '60 days',
            v_user_id,
            NOW() - INTERVAL '5 days'
        );

        -- Thêm phòng ban ảo cho kịch bản 2
        INSERT INTO scenario_departments (id, company_id, scenario_id, original_department_id, parent_scenario_dept_id, code, name, manager_employee_id, status_in_scenario, target_headcount, created_by, created_at)
        VALUES (gen_random_uuid(), v_comp_id, v_scen_2, v_dept_1, NULL, 'OPS-SHARED', 'Trung tâm Dịch vụ Chia sẻ (Shared Services)', v_emp_1, 'MODIFIED', 30, v_user_id, NOW() - INTERVAL '5 days');

        -- Ghi nhận lịch sử thao tác cho kịch bản 2
        INSERT INTO scenario_actions (id, company_id, scenario_id, action_type, payload, summary, executed_by, created_at)
        VALUES (gen_random_uuid(), v_comp_id, v_scen_2, 'CREATE_DEPT', '{"status":"SUBMITTED"}', 'Trình Hội đồng Quản trị thẩm định phương án tinh gọn bộ máy', v_user_id, NOW() - INTERVAL '1 day');
    END IF;

END $$;
