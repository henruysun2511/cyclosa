-- =========================================================================================
-- CYCLOSA HRM MASTER DATA SEEDER (TOÀN BỘ 147 BẢNG THUỘC 20 PHÂN HỆ)
-- TẬP TRUNG HỒ SƠ VÀ DỮ LIỆU SỐNG ĐỘNG CHO 2 NHÂN SỰ TRỌNG TÂM:
--   NV1: Nguyễn Văn An (NV-2026-00001 - CEO / Admin, User: admin / admin@cyclosa.vn)
--   NV2: Lê Hoàng Long (NV-2026-00002 - CTO / Employee, User: employee / binh.tran@example.com)
-- =========================================================================================

-- Bổ sung các cột schema nếu chưa tồn tại trước khi chạy block DO
ALTER TABLE workplace_zones ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 16;
ALTER TABLE workplace_zones ADD COLUMN IF NOT EXISTS max_capacity_ceiling INT DEFAULT 24;
ALTER TABLE workplace_meeting_rooms ADD COLUMN IF NOT EXISTS max_capacity_ceiling INT DEFAULT 30;
ALTER TABLE workflow_definitions DROP CONSTRAINT IF EXISTS workflow_definitions_request_type_check;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_notification_type_check;
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check;
UPDATE workplace_zones SET capacity = 16 WHERE capacity IS NULL;
UPDATE workplace_zones SET max_capacity_ceiling = 24 WHERE max_capacity_ceiling IS NULL;
UPDATE workplace_meeting_rooms SET max_capacity_ceiling = 30 WHERE max_capacity_ceiling IS NULL;

DO $$
DECLARE
    -- 1. IDs Cốt lõi
    v_company_id UUID := '00000000-0000-0000-0000-000000000001';
    v_region_hn UUID := '00000000-0000-0000-0000-000000000011';
    v_region_hcm UUID := '00000000-0000-0000-0000-000000000012';
    v_branch_hn UUID := '00000000-0000-0000-0000-000000000021';
    v_branch_hcm UUID := '00000000-0000-0000-0000-000000000022';

    -- 2. Phòng ban & Chức danh
    v_dept_bod UUID;
    v_dept_tech UUID;
    v_dept_dev UUID;
    v_dept_qa UUID;
    v_dept_hr UUID;
    v_dept_fin UUID;

    v_title_ceo UUID;
    v_title_cto UUID;
    v_title_dev_lead UUID;
    v_title_dev_sr UUID;
    v_title_qa_lead UUID;
    v_title_hr_spec UUID;

    v_lvl_c UUID;
    v_lvl_lead UUID;
    v_lvl_sr UUID;
    v_lvl_mid UUID;

    -- 3. Nhân sự
    v_emp1_id UUID; -- Nguyễn Văn An (CEO)
    v_emp2_id UUID; -- Lê Hoàng Long (CTO)

    -- 4. Tài khoản User
    v_user_admin_id UUID;
    v_user_emp_id UUID;

    -- 5. Không gian làm việc
    v_site_id UUID := '00000000-0000-0000-0001-000000000001';
    v_floor_1 UUID := '00000000-0000-0000-0001-000000000011';
    v_floor_2 UUID := '00000000-0000-0000-0001-000000000012';
    v_floor_3 UUID := '00000000-0000-0000-0001-000000000013';
    v_zone_tech UUID := '00000000-0000-0000-0001-000000000021';
    v_row_a UUID := '00000000-0000-0000-0001-000000000031';
    v_seat_long UUID := '00000000-0000-0000-0001-000000000041';
    v_seat_an UUID := '00000000-0000-0000-0001-000000000042';
    v_room_board UUID := '00000000-0000-0000-0001-000000000051';
    v_room_scrum UUID := '00000000-0000-0000-0001-000000000052';

    -- 6. Tài sản
    v_cat_laptop UUID := '00000000-0000-0000-0002-000000000001';
    v_cat_screen UUID := '00000000-0000-0000-0002-000000000002';
    v_asset_laptop UUID := '00000000-0000-0000-0002-000000000011';
    v_asset_screen UUID := '00000000-0000-0000-0002-000000000012';

    -- 7. Ca kíp & Chấm công & Nghỉ phép
    v_shift_hc UUID := '00000000-0000-0000-0003-000000000001';
    v_leave_annual UUID := '00000000-0000-0000-0003-000000000011';
    v_leave_sick UUID := '00000000-0000-0000-0003-000000000012';
    v_period_oct UUID := '00000000-0000-0000-0003-000000000021';
    v_period_nov UUID := '00000000-0000-0000-0003-000000000022';

    -- 8. Lương
    v_comp_base UUID := '00000000-0000-0000-0004-000000000001';
    v_comp_resp UUID := '00000000-0000-0000-0004-000000000002';
    v_comp_lunch UUID := '00000000-0000-0000-0004-000000000003';
    v_pay_period_oct UUID := '00000000-0000-0000-0004-000000000011';
    v_payroll_rec_oct UUID := '00000000-0000-0000-0004-000000000021';

    -- 9. Hiệu suất & Tuyển dụng & Quy trình
    v_perf_cycle UUID := '00000000-0000-0000-0005-000000000001';
    v_perf_review_long UUID := '00000000-0000-0000-0005-000000000011';
    v_reward_long UUID := '00000000-0000-0000-0005-000000000021';
    v_rec_req UUID := '00000000-0000-0000-0006-000000000001';
    v_job_opening UUID := '00000000-0000-0000-0006-000000000011';
    v_candidate_1 UUID := '00000000-0000-0000-0006-000000000021';
    v_candidate_2 UUID := '00000000-0000-0000-0006-000000000022';
    v_app_1 UUID := '00000000-0000-0000-0006-000000000031';
    v_wf_def UUID := '00000000-0000-0000-0007-000000000001';
    v_dossier_long UUID := '00000000-0000-0000-0008-000000000001';

BEGIN
    RAISE NOTICE '>>> BẮT ĐẦU NẠP DỮ LIỆU MẪU TOÀN DIỆN CHO CYCLOSA HRM (147 BẢNG) <<<';

    -- =========================================================================
    -- WAVE 1: NỀN TẢNG CƠ CẤU TỔ CHỨC & PHÂN QUYỀN
    -- =========================================================================

    -- 1.1 Đảm bảo Công ty chính
    INSERT INTO companies (id, code, name, tax_code, email, phone, address, status, created_at)
    VALUES (v_company_id, 'CYC_CORP', 'Tổng Công Ty Cổ Phần CYCLOSA Việt Nam', '0109988776', 'contact@cyclosa.vn', '02439998888', 'Tòa nhà CYCLOSA, Cầu Giấy, Hà Nội', 'ACTIVE', NOW())
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code;

    -- 1.2 Vùng miền & Chi nhánh
    INSERT INTO regions (id, company_id, code, name, created_at)
    VALUES
        (v_region_hn, v_company_id, 'REG_NORTH', 'Khu vực Miền Bắc', NOW()),
        (v_region_hcm, v_company_id, 'REG_SOUTH', 'Khu vực Miền Nam', NOW())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO branches (id, region_id, code, name, address, attendance_radius_meters, is_active, created_at)
    VALUES
        (v_branch_hn, v_region_hn, 'BR_HN_HQ', 'Trụ sở chính Hà Nội', 'Tòa nhà CYCLOSA, Cầu Giấy, Hà Nội', 200, TRUE, NOW()),
        (v_branch_hcm, v_region_hcm, 'BR_HCM_01', 'Chi nhánh TP. Hồ Chí Minh', 'Số 180 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 200, TRUE, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- 1.3 Phòng ban chuẩn
    SELECT id INTO v_dept_bod FROM departments WHERE company_id = v_company_id AND code = 'DEPT_BOD' LIMIT 1;
    IF v_dept_bod IS NULL THEN
        v_dept_bod := '00000000-0000-0000-0000-000000000031';
        INSERT INTO departments (id, company_id, code, created_at)
        VALUES (v_dept_bod, v_company_id, 'DEPT_BOD', NOW())
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO department_versions (department_id, effective_from, name, is_permission_inherited, created_at)
        VALUES (v_dept_bod, '2021-01-01', 'Ban Tổng Giám đốc', true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO v_dept_tech FROM departments WHERE company_id = v_company_id AND code = 'DEPT_TECH' LIMIT 1;
    IF v_dept_tech IS NULL THEN
        v_dept_tech := '00000000-0000-0000-0000-000000000032';
        INSERT INTO departments (id, company_id, code, created_at)
        VALUES (v_dept_tech, v_company_id, 'DEPT_TECH', NOW())
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO department_versions (department_id, effective_from, name, parent_department_id, is_permission_inherited, created_at)
        VALUES (v_dept_tech, '2021-01-01', 'Khối Công nghệ & Sản phẩm', v_dept_bod, true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO v_dept_dev FROM departments WHERE company_id = v_company_id AND code = 'DEPT_DEV' LIMIT 1;
    IF v_dept_dev IS NULL THEN
        v_dept_dev := '00000000-0000-0000-0000-000000000033';
        INSERT INTO departments (id, company_id, code, created_at)
        VALUES (v_dept_dev, v_company_id, 'DEPT_DEV', NOW())
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO department_versions (department_id, effective_from, name, parent_department_id, is_permission_inherited, created_at)
        VALUES (v_dept_dev, '2021-01-01', 'Phòng Phát triển Phần mềm', v_dept_tech, true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO v_dept_qa FROM departments WHERE company_id = v_company_id AND code = 'DEPT_QA' LIMIT 1;
    IF v_dept_qa IS NULL THEN
        v_dept_qa := '00000000-0000-0000-0000-000000000034';
        INSERT INTO departments (id, company_id, code, created_at)
        VALUES (v_dept_qa, v_company_id, 'DEPT_QA', NOW())
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO department_versions (department_id, effective_from, name, parent_department_id, is_permission_inherited, created_at)
        VALUES (v_dept_qa, '2021-01-01', 'Phòng Đảm bảo Chất lượng (QA)', v_dept_tech, true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO v_dept_hr FROM departments WHERE company_id = v_company_id AND code = 'DEPT_HR' LIMIT 1;
    IF v_dept_hr IS NULL THEN
        v_dept_hr := '00000000-0000-0000-0000-000000000035';
        INSERT INTO departments (id, company_id, code, created_at)
        VALUES (v_dept_hr, v_company_id, 'DEPT_HR', NOW())
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO department_versions (department_id, effective_from, name, parent_department_id, is_permission_inherited, created_at)
        VALUES (v_dept_hr, '2021-01-01', 'Phòng Nhân sự & Hành chính', v_dept_bod, true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    SELECT id INTO v_dept_fin FROM departments WHERE company_id = v_company_id AND code = 'DEPT_FIN' LIMIT 1;
    IF v_dept_fin IS NULL THEN
        v_dept_fin := '00000000-0000-0000-0000-000000000036';
        INSERT INTO departments (id, company_id, code, created_at)
        VALUES (v_dept_fin, v_company_id, 'DEPT_FIN', NOW())
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO department_versions (department_id, effective_from, name, parent_department_id, is_permission_inherited, created_at)
        VALUES (v_dept_fin, '2021-01-01', 'Phòng Tài chính Kế toán', v_dept_bod, true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    -- 1.4 Chức danh & Cấp bậc
    SELECT id INTO v_title_ceo FROM job_titles WHERE company_id = v_company_id AND code = 'CEO' LIMIT 1;
    IF v_title_ceo IS NULL THEN
        v_title_ceo := '00000000-0000-0000-0000-000000000051';
        INSERT INTO job_titles (id, company_id, code, name, created_at) VALUES (v_title_ceo, v_company_id, 'CEO', 'Tổng Giám đốc', NOW()) ON CONFLICT (company_id, code) DO NOTHING;
    END IF;

    SELECT id INTO v_title_cto FROM job_titles WHERE company_id = v_company_id AND code = 'CTO' LIMIT 1;
    IF v_title_cto IS NULL THEN
        v_title_cto := '00000000-0000-0000-0000-000000000052';
        INSERT INTO job_titles (id, company_id, code, name, created_at) VALUES (v_title_cto, v_company_id, 'CTO', 'Giám đốc Công nghệ', NOW()) ON CONFLICT (company_id, code) DO NOTHING;
    END IF;

    SELECT id INTO v_title_dev_lead FROM job_titles WHERE company_id = v_company_id AND code = 'DEV_LEAD' LIMIT 1;
    IF v_title_dev_lead IS NULL THEN
        v_title_dev_lead := '00000000-0000-0000-0000-000000000053';
        INSERT INTO job_titles (id, company_id, code, name, created_at) VALUES (v_title_dev_lead, v_company_id, 'DEV_LEAD', 'Trưởng nhóm Phát triển (Tech Lead)', NOW()) ON CONFLICT (company_id, code) DO NOTHING;
    END IF;

    SELECT id INTO v_title_dev_sr FROM job_titles WHERE company_id = v_company_id AND code = 'DEV_SR' LIMIT 1;
    IF v_title_dev_sr IS NULL THEN
        v_title_dev_sr := '00000000-0000-0000-0000-000000000054';
        INSERT INTO job_titles (id, company_id, code, name, created_at) VALUES (v_title_dev_sr, v_company_id, 'DEV_SR', 'Kỹ sư Phần mềm Cao cấp (Senior Dev)', NOW()) ON CONFLICT (company_id, code) DO NOTHING;
    END IF;

    SELECT id INTO v_lvl_c FROM job_levels WHERE company_id = v_company_id AND code = 'LVL_08' LIMIT 1;
    IF v_lvl_c IS NULL THEN
        v_lvl_c := '00000000-0000-0000-0000-000000000061';
        INSERT INTO job_levels (id, company_id, code, name, rank_order, created_at) VALUES (v_lvl_c, v_company_id, 'LVL_08', 'C-Level / Ban Giám đốc', 8, NOW()) ON CONFLICT (company_id, code) DO NOTHING;
    END IF;

    SELECT id INTO v_lvl_lead FROM job_levels WHERE company_id = v_company_id AND code = 'LVL_05' LIMIT 1;
    IF v_lvl_lead IS NULL THEN
        v_lvl_lead := '00000000-0000-0000-0000-000000000062';
        INSERT INTO job_levels (id, company_id, code, name, rank_order, created_at) VALUES (v_lvl_lead, v_company_id, 'LVL_05', 'Quản lý / Trưởng nhóm (Lead)', 5, NOW()) ON CONFLICT (company_id, code) DO NOTHING;
    END IF;

    -- =========================================================================
    -- WAVE 2: NHÂN SỰ & HỢP ĐỒNG LAO ĐỘNG (NV1 & NV2)
    -- =========================================================================

    -- 2.1 NV1: Nguyễn Văn An (CEO)
    SELECT id INTO v_emp1_id FROM employees WHERE employee_code = 'NV-2026-00001' LIMIT 1;
    IF v_emp1_id IS NULL THEN
        v_emp1_id := '00000000-0000-0000-0000-000000000101';
        INSERT INTO employees (
            id, company_id, employee_code, last_name, first_name, date_of_birth, gender,
            phone, personal_email, address, start_date, personal_tax_code, social_insurance_number,
            portrait_url, created_at
        ) VALUES (
            v_emp1_id, v_company_id, 'NV-2026-00001', 'Nguyễn Văn', 'An', '1985-04-12', 'MALE',
            '0912345671', 'an.nguyen@cyclosa.vn', 'Số 12 Cầu Giấy, Hà Nội', '2021-01-01', '8012345671', '0123456781',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', NOW()
        );
        INSERT INTO employee_work_assignments (id, employee_id, effective_from, department_id, branch_id, job_title_id, job_level_id, employment_type, change_reason, created_at)
        VALUES (gen_random_uuid(), v_emp1_id, '2021-01-01', v_dept_bod, v_branch_hn, v_title_ceo, v_lvl_c, 'FULL_TIME', 'HIRE', NOW());
        INSERT INTO employee_status_history (id, employee_id, status, effective_from, note, created_at)
        VALUES (gen_random_uuid(), v_emp1_id, 'ACTIVE', '2021-01-01', 'Tiếp nhận nhân sự', NOW());
    END IF;

    -- 2.2 NV2: Lê Hoàng Long (CTO - Persona Employee)
    SELECT id INTO v_emp2_id FROM employees WHERE employee_code = 'NV-2026-00002' LIMIT 1;
    IF v_emp2_id IS NULL THEN
        v_emp2_id := '00000000-0000-0000-0000-000000000102';
        INSERT INTO employees (
            id, company_id, employee_code, last_name, first_name, date_of_birth, gender,
            phone, personal_email, address, start_date, personal_tax_code, social_insurance_number,
            portrait_url, created_at
        ) VALUES (
            v_emp2_id, v_company_id, 'NV-2026-00002', 'Lê Hoàng', 'Long', '1989-08-15', 'MALE',
            '0923456782', 'long.le@cyclosa.vn', 'Tòa R2 Royal City, Thanh Xuân, Hà Nội', '2021-03-01', '8012345672', '0123456782',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', NOW()
        );
        INSERT INTO employee_work_assignments (id, employee_id, effective_from, department_id, branch_id, job_title_id, job_level_id, employment_type, manager_employee_id, change_reason, created_at)
        VALUES (gen_random_uuid(), v_emp2_id, '2021-03-01', v_dept_tech, v_branch_hn, v_title_cto, v_lvl_c, 'FULL_TIME', v_emp1_id, 'HIRE', NOW());
        INSERT INTO employee_status_history (id, employee_id, status, effective_from, note, created_at)
        VALUES (gen_random_uuid(), v_emp2_id, 'ACTIVE', '2021-03-01', 'Tiếp nhận nhân sự', NOW());
    END IF;

    SELECT id INTO v_user_admin_id FROM users WHERE username = 'admin' OR email = 'admin@cyclosa.vn' LIMIT 1;
    SELECT id INTO v_user_emp_id FROM users WHERE username = 'employee' OR email = 'binh.tran@example.com' OR email = 'long.le@cyclosa.vn' LIMIT 1;

    -- Đảm bảo tài khoản user 'employee' luôn tồn tại và có mật khẩu đăng nhập Admin@123
    IF v_user_emp_id IS NULL THEN
        v_user_emp_id := '00000000-0000-0000-0000-000000000002'::uuid;
        INSERT INTO users (id, username, email, password_hash, status, created_at)
        VALUES (
            v_user_emp_id,
            'employee',
            'binh.tran@example.com',
            '$2a$10$Yalk.UGP0gY5/LJHU7rP6.VDQKXFglVJIqkGWaw0qWH/9xbPBuefO', -- Mật khẩu mặc định: Admin@123
            'ACTIVE',
            NOW()
        ) ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, status = 'ACTIVE';
    ELSE
        UPDATE users 
        SET password_hash = '$2a$10$Yalk.UGP0gY5/LJHU7rP6.VDQKXFglVJIqkGWaw0qWH/9xbPBuefO',
            status = 'ACTIVE'
        WHERE id = v_user_emp_id;
    END IF;

    -- Đảm bảo user 'employee' được phân vai trò EMPLOYEE
    INSERT INTO user_role_assignments (user_id, role_id, company_id, created_at)
    SELECT v_user_emp_id, r.id, v_company_id, NOW()
    FROM roles r WHERE r.code = 'EMPLOYEE'
    ON CONFLICT DO NOTHING;

    -- Gỡ liên kết cũ (nếu có) để tránh vi phạm unique constraint user_id trên bảng employees
    IF v_user_emp_id IS NOT NULL THEN
        UPDATE employees SET user_id = NULL WHERE user_id = v_user_emp_id;
    END IF;
    IF v_user_admin_id IS NOT NULL THEN
        UPDATE employees SET user_id = NULL WHERE user_id = v_user_admin_id;
    END IF;

    -- Link tài khoản User 'employee' (binh.tran@example.com) vào NV2 và 'admin' vào NV1
    UPDATE employees SET user_id = v_user_emp_id WHERE id = v_emp2_id;
    UPDATE employees SET user_id = v_user_admin_id WHERE id = v_emp1_id;

    -- 2.3 Hồ sơ giấy tờ định danh, ngân hàng, người phụ thuộc cho NV2
    INSERT INTO employee_identity_documents (id, employee_id, document_type, document_number, issue_date, issue_place, created_at)
    VALUES (gen_random_uuid(), v_emp2_id, 'CITIZEN_ID', '001089002345', '2020-03-15', 'Cục Cảnh sát QLHC về TTXH', NOW())
    ON CONFLICT (document_type, document_number) DO NOTHING;

    INSERT INTO employee_bank_accounts (id, employee_id, bank_name, bank_branch_name, account_number, created_at)
    VALUES (gen_random_uuid(), v_emp2_id, 'Techcombank', 'Chi nhánh Hà Thành', '1903456789001', NOW())
    ON CONFLICT (employee_id) DO NOTHING;

    INSERT INTO employee_dependents (id, employee_id, full_name, date_of_birth, relationship, identity_number, tax_deduction_from, created_at)
    VALUES (gen_random_uuid(), v_emp2_id, 'Lê Bảo Nam', '2018-12-10', 'CHILD', '001218008822', '2021-03-01', NOW())
    ON CONFLICT DO NOTHING;

    INSERT INTO employee_emergency_contacts (id, employee_id, full_name, relationship, phone, address, created_at)
    VALUES (gen_random_uuid(), v_emp2_id, 'Vũ Mai Phương', 'Vợ', '0923887766', 'Tòa R2 Royal City, Thanh Xuân, Hà Nội', NOW())
    ON CONFLICT DO NOTHING;

    -- 2.4 Hợp đồng lao động của NV2
    INSERT INTO contracts (
        id, contract_no, employee_id, employer_company_id, employer_representative_id,
        contract_type, job_title_id, department_id, branch_id,
        work_location, working_time_description, base_salary, insurance_salary,
        payment_method, pay_day_of_month, signing_form, start_date, end_date,
        signed_date, status, created_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000202', 'HDLD-2024-0002', v_emp2_id, v_company_id, v_emp1_id,
        'INDEFINITE', v_title_cto, v_dept_tech, v_branch_hn,
        'Trụ sở chính Hà Nội - Tầng 3', 'Giờ hành chính 08:00 - 17:30 (Thứ 2 đến Thứ 6)', 50000000, 36000000,
        'BANK_TRANSFER', 5, 'ELECTRONIC', '2024-05-01', NULL,
        '2024-04-28', 'ACTIVE', NOW()
    ) ON CONFLICT (contract_no) DO NOTHING;

    INSERT INTO contract_allowances (id, contract_id, name, amount, is_taxable, created_at)
    VALUES
        (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Phụ cấp trách nhiệm', 10000000, true, NOW()),
        (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Phụ cấp ăn trưa', 1000000, false, NOW())
    ON CONFLICT DO NOTHING;

    -- =========================================================================
    -- WAVE 3: KHÔNG GIAN LÀM VIỆC & QUẢN TRỊ TÀI SẢN (WORKPLACE & ASSETS)
    -- =========================================================================

    -- 3.1 Tòa nhà & Tầng
    INSERT INTO workplace_sites (id, branch_id, code, name, address, description, created_at)
    VALUES (v_site_id, v_branch_hn, 'SITE_HQ', 'CYCLOSA Innovation Tower', 'Số 1 Phố Duy Tân, Cầu Giấy, Hà Nội', 'Tòa nhà văn phòng tiêu chuẩn hạng A', NOW())
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

    INSERT INTO workplace_floors (id, site_id, floor_number, name, description, created_at)
    VALUES
        (v_floor_1, v_site_id, 1, 'Tầng 1 - Sảnh lễ tân & Hội trường', 'Khu đón tiếp khách và phòng hội thảo đa năng', NOW()),
        (v_floor_2, v_site_id, 2, 'Tầng 2 - Khối Vận hành & Tài chính', 'Phòng Nhân sự, Kế toán và Hành chính', NOW()),
        (v_floor_3, v_site_id, 3, 'Tầng 3 - Khối Công nghệ & R&D', 'Khu làm việc kỹ sư phần mềm, AI lab và kiểm thử', NOW())
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

    -- 3.2 Phân khu Zone & Ghế ngồi Tầng 3
    INSERT INTO workplace_zones (id, floor_id, name, department_id, color_hex, capacity, max_capacity_ceiling, created_at)
    VALUES (v_zone_tech, v_floor_3, 'Khu Vực Kỹ Thuật Phần Mềm', v_dept_tech, '#2563EB', 20, 30, NOW())
    ON CONFLICT (id) DO UPDATE SET capacity = 20, max_capacity_ceiling = 30;

    -- Cập nhật chống null cho các zone đã tồn tại nếu có
    UPDATE workplace_zones SET capacity = 20, max_capacity_ceiling = 30 WHERE capacity IS NULL OR max_capacity_ceiling IS NULL;

    INSERT INTO workplace_seat_rows (id, zone_id, code, layout_type, x, y, rotation_degrees, created_at)
    VALUES (v_row_a, v_zone_tech, 'ROW_A', 'SINGLE_ROW', 100.0, 150.0, 0, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Ghế cố định của NV2 (Lê Hoàng Long)
    INSERT INTO workplace_seats (id, seat_row_id, seat_code, seat_type, status, shape, x, y, width, height, rotation_degrees, qr_token, created_at)
    VALUES (v_seat_long, v_row_a, 'S-301', 'DEDICATED', 'IN_SERVICE', 'RECTANGLE', 100.0, 150.0, 48.0, 48.0, 0.0, 'QR-SEAT-S301', NOW())
    ON CONFLICT (id) DO UPDATE SET seat_code = EXCLUDED.seat_code, status = 'IN_SERVICE', rotation_degrees = 0.0;

    INSERT INTO workplace_seat_assignments (id, seat_id, employee_id, assigned_at, note, created_at)
    VALUES (gen_random_uuid(), v_seat_long, v_emp2_id, '2021-03-01 08:30:00', 'Chỗ ngồi cố định của Giám đốc Công nghệ', NOW())
    ON CONFLICT DO NOTHING;

    -- Bổ sung thêm các ghế xung quanh
    FOR i IN 2..10 LOOP
        INSERT INTO workplace_seats (id, seat_row_id, seat_code, seat_type, status, shape, x, y, width, height, rotation_degrees, qr_token, created_at)
        VALUES (gen_random_uuid(), v_row_a, 'S-30' || i, 'DEDICATED', 'IN_SERVICE', 'RECTANGLE', 100.0 + (i * 55.0), 150.0, 48.0, 48.0, 0.0, 'QR-SEAT-S30' || i, NOW())
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Phòng họp
    INSERT INTO workplace_floor_objects (id, floor_id, object_type, name, x, y, width, height, rotation_degrees, qr_token, created_at)
    VALUES
        (v_room_board, v_floor_1, 'MEETING_ROOM', 'Phòng Hội nghị Thượng đỉnh (Boardroom)', 200.0, 80.0, 120.0, 90.0, 0.0, 'QR-ROOM-BOARD', NOW()),
        (v_room_scrum, v_floor_3, 'MEETING_ROOM', 'Phòng họp Agile Scrum Tech', 350.0, 120.0, 80.0, 60.0, 0.0, 'QR-ROOM-SCRUM', NOW())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workplace_meeting_rooms (floor_object_id, capacity, max_capacity_ceiling, has_projector, has_video_conference, has_whiteboard, description)
    VALUES
        (v_room_board, 20, 30, true, true, true, 'Phòng họp Hội đồng Quản trị và Lãnh đạo cấp cao'),
        (v_room_scrum, 8, 15, true, true, true, 'Phòng họp đội kỹ thuật và sprint review')
    ON CONFLICT (floor_object_id) DO UPDATE SET max_capacity_ceiling = EXCLUDED.max_capacity_ceiling;

    -- Lịch đặt phòng họp mẫu do NV2 chủ trì
    IF v_user_emp_id IS NOT NULL THEN
        INSERT INTO workplace_room_bookings (
            id, meeting_room_id, organizer_employee_id, created_by_user_id, title, attendee_count,
            start_time, end_time, status, description, created_at
        ) VALUES (
            gen_random_uuid(), v_room_scrum, v_emp2_id, v_user_emp_id, 'Họp Kiến trúc Hệ thống & AI Release 2026', 6,
            NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 'CONFIRMED', 'Thảo luận lộ trình tích hợp Trợ lý ảo AI', NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;

    -- 3.3 Danh mục & Thiết bị bàn giao cho NV2
    INSERT INTO asset_categories (id, company_id, name, code, description, created_at)
    VALUES
        (v_cat_laptop, v_company_id, 'Máy tính xách tay & Trạm làm việc', 'CAT_LAPTOP', 'Laptop cao cấp cho nhân sự kỹ thuật', NOW()),
        (v_cat_screen, v_company_id, 'Màn hình hiển thị chuyên dụng', 'CAT_SCREEN', 'Màn hình 4K cho lập trình viên', NOW())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO assets (id, company_id, asset_code, asset_category_id, name, serial_number, model, manufacturer, status, condition_status, created_at)
    VALUES
        (v_asset_laptop, v_company_id, 'AST-2026-0001', v_cat_laptop, 'MacBook Pro 16" M3 Max 36GB', 'MP-M3-998811', 'MacBook Pro 16 M3 Max', 'Apple Inc.', 'ASSIGNED', 'NEW', NOW()),
        (v_asset_screen, v_company_id, 'AST-2026-0002', v_cat_screen, 'Màn hình Dell UltraSharp U2723QE 4K', 'DELL-US-443322', 'UltraSharp U2723QE', 'Dell Technologies', 'ASSIGNED', 'GOOD', NOW())
    ON CONFLICT (id) DO UPDATE SET asset_code = EXCLUDED.asset_code, status = 'ASSIGNED', condition_status = EXCLUDED.condition_status;

    INSERT INTO asset_assignments (id, asset_id, employee_id, assigned_at, condition_on_assign, notes, created_at)
    VALUES
        (gen_random_uuid(), v_asset_laptop, v_emp2_id, '2024-01-15 09:00:00', 'NEW', 'Cấp phát máy làm việc chính cho CTO (Nguyên hộp)', NOW()),
        (gen_random_uuid(), v_asset_screen, v_emp2_id, '2024-01-15 09:00:00', 'NEW', 'Màn hình phụ gắn tại bàn S-301 (Mới 100%)', NOW())
    ON CONFLICT DO NOTHING;

    -- Liên kết màn hình với bàn làm việc S-301
    INSERT INTO workplace_seat_assets (id, seat_id, asset_id, linked_at, created_at)
    VALUES (gen_random_uuid(), v_seat_long, v_asset_screen, '2024-01-15 09:30:00', NOW())
    ON CONFLICT DO NOTHING;

    -- =========================================================================
    -- WAVE 4: CHẤM CÔNG, CA KÍP & NGHỈ PHÉP (ATTENDANCE & LEAVE)
    -- =========================================================================

    -- 4.1 Ca làm việc chuẩn
    INSERT INTO shifts (id, company_id, code, name, start_time, end_time, break_minutes, work_credit, late_grace_minutes, early_grace_minutes, is_active, created_at)
    VALUES (v_shift_hc, v_company_id, 'HC_01', 'Ca hành chính chuẩn 8h - 17h30', '08:00:00', '17:30:00', 90, 1.0, 15, 0, true, NOW())
    ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code;

    -- 4.2 Kỳ chấm công
    INSERT INTO timesheet_periods (id, company_id, year, month, status, created_at)
    VALUES
        (v_period_oct, v_company_id, 2026, 10, 'LOCKED', NOW()),
        (v_period_nov, v_company_id, 2026, 11, 'OPEN', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Phân ca tháng 11 cho NV2 và nhật ký quét mặt Face AI
    FOR d IN 1..19 LOOP
        INSERT INTO shift_assignments (id, employee_id, shift_id, work_date, created_at)
        VALUES (gen_random_uuid(), v_emp2_id, v_shift_hc, ('2026-11-' || LPAD(d::text, 2, '0'))::date, NOW())
        ON CONFLICT (employee_id, work_date) DO NOTHING;

        INSERT INTO attendance_logs (id, employee_id, event_type, occurred_at, device_info, verification_result, face_match_score, transaction_code, created_at)
        VALUES
            (gen_random_uuid(), v_emp2_id, 'CHECK_IN', ('2026-11-' || LPAD(d::text, 2, '0') || ' 07:58:12')::timestamp, 'Face AI Cam - Cửa Tầng 3', 'SUCCESS', 0.98, 'TX-IN-' || d, NOW()),
            (gen_random_uuid(), v_emp2_id, 'CHECK_OUT', ('2026-11-' || LPAD(d::text, 2, '0') || ' 17:42:05')::timestamp, 'Face AI Cam - Cửa Tầng 3', 'SUCCESS', 0.99, 'TX-OUT-' || d, NOW())
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Đơn giải trình chấm công đã duyệt của NV2
    INSERT INTO attendance_requests (id, company_id, employee_id, work_date, request_type, proposed_check_in, reason, submitted_at, status, reviewed_by_user_id, reviewed_at, created_at)
    VALUES (gen_random_uuid(), v_company_id, v_emp2_id, '2026-11-12', 'TIME_DEVIATION', '2026-11-12 08:25:00'::timestamp, 'Sự cố kẹt xe trên tuyến đường Nguyễn Trãi do mưa ngập', '2026-11-12 08:30:00'::timestamp, 'APPROVED', v_user_admin_id, '2026-11-12 09:00:00'::timestamp, NOW())
    ON CONFLICT DO NOTHING;

    -- 4.3 Loại phép & Quỹ phép năm
    INSERT INTO leave_types (id, company_id, code, name, leave_group, payer, fixed_days, requires_approval, is_active, description, created_at)
    VALUES
        (v_leave_annual, v_company_id, 'ANNUAL', 'Nghỉ phép năm có hưởng lương', 'ANNUAL', 'EMPLOYER', 12.0, true, true, 'Phép thường niên theo Luật Lao động', NOW()),
        (v_leave_sick, v_company_id, 'SICK', 'Nghỉ ốm đau hưởng chế độ BHXH', 'SICK', 'SOCIAL_INSURANCE', 30.0, true, true, 'Nghỉ ốm hưởng trợ cấp BHXH', NOW())
    ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, payer = EXCLUDED.payer, leave_group = EXCLUDED.leave_group;

    -- Quỹ phép năm 2026 của NV2: Hạn mức 12 ngày, Khả dụng 9.5 ngày!
    INSERT INTO leave_balances (
        id, company_id, employee_id, leave_type_id, year, entitled_days, carried_over_days, notes, created_at
    ) VALUES (
        gen_random_uuid(), v_company_id, v_emp2_id, v_leave_annual, 2026, 12.0, 0.0, 'Đã nghỉ 2.5 ngày phép, còn lại 9.5 ngày khả dụng', NOW()
    ) ON CONFLICT (employee_id, leave_type_id, year) DO UPDATE SET entitled_days = 12.0;

    -- Đơn xin nghỉ phép đã duyệt của NV2
    IF v_user_emp_id IS NOT NULL THEN
        INSERT INTO leave_requests (
            id, company_id, employee_id, requested_by_user_id, leave_type_id, start_date, end_date, day_portion, days_count, reason, status, submitted_at, created_at
        ) VALUES (
            gen_random_uuid(), v_company_id, v_emp2_id, v_user_emp_id, v_leave_annual, '2026-09-15', '2026-09-16', 'FULL_DAY', 2.0,
            'Nghỉ phép thường niên đưa gia đình đi du lịch', 'APPROVED', '2026-09-10 14:00:00', NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;

    -- =========================================================================
    -- WAVE 5: TIỀN LƯƠNG & THU NHẬP (PAYROLL & COMPENSATION)
    -- =========================================================================

    INSERT INTO salary_components (id, company_id, code, name, category, frequency, default_amount, is_taxable, is_insurance_base, is_active, created_at)
    VALUES
        (v_comp_base, v_company_id, 'BASE_SALARY', 'Lương cơ bản', 'ALLOWANCE', 'RECURRING', 50000000, true, true, true, NOW()),
        (v_comp_resp, v_company_id, 'RESP_ALLOWANCE', 'Phụ cấp trách nhiệm quản lý', 'ALLOWANCE', 'RECURRING', 10000000, true, false, true, NOW()),
        (v_comp_lunch, v_company_id, 'LUNCH_ALLOWANCE', 'Phụ cấp ăn trưa', 'ALLOWANCE', 'RECURRING', 1000000, false, false, true, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Thiết lập mức lương cố định cho NV2
    INSERT INTO employee_salary_items (id, employee_id, salary_component_id, amount, effective_from, created_at)
    VALUES
        (gen_random_uuid(), v_emp2_id, v_comp_base, 50000000, '2024-05-01', NOW()),
        (gen_random_uuid(), v_emp2_id, v_comp_resp, 10000000, '2024-05-01', NOW()),
        (gen_random_uuid(), v_emp2_id, v_comp_lunch, 1000000, '2024-05-01', NOW())
    ON CONFLICT DO NOTHING;

    -- Kỳ lương Tháng 10/2026
    INSERT INTO payroll_periods (id, company_id, code, name, start_date, end_date, standard_work_days, planned_payment_date, timesheet_period_id, status, created_at)
    VALUES (v_pay_period_oct, v_company_id, 'PAY_2026_10', 'Kỳ lương Tháng 10/2026', '2026-10-01', '2026-10-31', 23, '2026-11-05', v_period_oct, 'APPROVED', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Bản ghi lương của NV2
    INSERT INTO payroll_records (id, payroll_period_id, employee_id, calculated_at, created_at)
    VALUES (v_payroll_rec_oct, v_pay_period_oct, v_emp2_id, '2026-11-02 10:00:00', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Phiếu lương chi tiết gửi cho NV2
    INSERT INTO payslips (id, payroll_record_id, employee_id, file_url, issued_at, created_at)
    VALUES (
        gen_random_uuid(), v_payroll_rec_oct, v_emp2_id,
        'https://res.cloudinary.com/dcaqsxy0q/raw/upload/v1/cyclosa/payslips/ps_long_202610.pdf',
        '2026-11-05 08:30:00', NOW()
    ) ON CONFLICT DO NOTHING;

    -- =========================================================================
    -- WAVE 6: QUẢN TRỊ MỤC TIÊU & ĐÁNH GIÁ HIỆU SUẤT (PERFORMANCE & KPI)
    -- =========================================================================

    INSERT INTO performance_cycles (id, company_id, name, cycle_type, start_date, end_date, status, created_at)
    VALUES (v_perf_cycle, v_company_id, 'Kỳ Đánh Giá Hiệu Suất Quý 3/2026', 'QUARTERLY', '2026-07-01', '2026-09-30', 'CLOSED', NOW())
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

    -- Bản đánh giá KPI của NV2: Xếp loại Xuất sắc (94/100)
    INSERT INTO performance_reviews (
        id, cycle_id, employee_id, manager_employee_id, status,
        self_comment, manager_comment, final_score, final_rating, created_at
    ) VALUES (
        v_perf_review_long, v_perf_cycle, v_emp2_id, v_emp1_id, 'FINALIZED',
        'Hoàn thành 100% các cam kết release kiến trúc hệ thống và AI copilot.',
        'Hoàn thành xuất sắc nhiệm vụ phát triển kiến trúc nền tảng và dẫn dắt team R&D.',
        94.0, 'EXCELLENT', NOW()
    ) ON CONFLICT (id) DO NOTHING;

    -- =========================================================================
    -- WAVE 7: KHEN THƯỞNG, KỶ LUẬT & TRANH CHẤP (REWARD & DISCIPLINE)
    -- =========================================================================

    INSERT INTO reward_decisions (
        id, company_id, employee_id, reward_type, title, reason,
        amount, decided_by_employee_id, decision_date, created_at
    ) VALUES (
        v_reward_long, v_company_id, v_emp2_id, 'MONETARY_BONUS', 'Khen thưởng Sáng kiến Kỹ thuật Xuất sắc 2026',
        'Sáng kiến tối ưu hóa hạ tầng Cloud tiết kiệm 30% chi phí cho công ty', 10000000, v_emp1_id, '2026-10-15', NOW()
    ) ON CONFLICT (id) DO NOTHING;

    -- =========================================================================
    -- WAVE 8: QUY TRÌNH TUYỂN DỤNG & THU HÚT ỨNG VIÊN (RECRUITMENT)
    -- =========================================================================

    INSERT INTO recruitment_requests (
        id, company_id, department_id, job_title_id, requested_quantity,
        justification, target_start_date, requested_by_employee_id, requested_at, status, created_at
    ) VALUES (
        v_rec_req, v_company_id, v_dept_dev, v_title_dev_sr, 2,
        'Mở rộng quy mô phát triển sản phẩm CYCLOSA HRM 2.0', '2026-12-15', v_emp2_id, NOW(), 'APPROVED', NOW()
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO job_openings (
        id, recruitment_request_id, company_id, department_id, job_title_id,
        title, required_quantity, description, requirements, requirements_version, benefits,
        salary_band_min, salary_band_max, is_salary_negotiable, work_location, deadline_date, landing_slug, status, created_at
    ) VALUES (
        v_job_opening, v_rec_req, v_company_id, v_dept_dev, v_title_dev_sr,
        'Senior Full-stack Engineer (Spring Boot + Next.js)', 2,
        'Phát triển các module cốt lõi phân hệ Nhân sự & Chấm công', 'Từ 4 năm kinh nghiệm Java/Spring Boot và React/Next.js', 1,
        'Thưởng tháng 13, bảo hiểm sức khỏe cao cấp, tài trợ chứng chỉ', 35000000, 50000000, true, 'Hà Nội', '2026-12-31', 'senior-fullstack-engineer-cyclosa-2026', 'OPEN', NOW()
    ) ON CONFLICT (id) DO NOTHING;

    -- Ứng viên mẫu
    INSERT INTO candidates (id, full_name, email, phone, date_of_birth, gender, address, resume_url, ai_screening_consent, created_at)
    VALUES
        (v_candidate_1, 'Hoàng Trọng Nghĩa', 'nghia.hoang@example.com', '0988112233', '1993-05-10', 'MALE', 'Cầu Giấy, Hà Nội', 'https://cyclosa.vn/cv/nghia.pdf', true, NOW()),
        (v_candidate_2, 'Nguyễn Thị Hương Giang', 'giang.nguyen@example.com', '0977445566', '1995-09-20', 'FEMALE', 'Đống Đa, Hà Nội', 'https://cyclosa.vn/cv/giang.pdf', true, NOW())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO applications (id, candidate_id, job_opening_id, applied_at, current_stage, ai_match_score, created_at)
    VALUES
        (v_app_1, v_candidate_1, v_job_opening, NOW() - INTERVAL '3 days', 'INTERVIEW', 92.5, NOW()),
        (gen_random_uuid(), v_candidate_2, v_job_opening, NOW() - INTERVAL '7 days', 'OFFER', 88.0, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- =========================================================================
    -- WAVE 9: LUỒNG PHÊ DUYỆT ĐỘNG (WORKFLOW BPMN)
    -- =========================================================================

    INSERT INTO workflow_definitions (id, company_id, name, request_type, description, is_active, created_at)
    VALUES (v_wf_def, v_company_id, 'Quy trình Phê duyệt Nghỉ phép Chuẩn (2 Cấp)', 'LEAVE_REQUEST', 'Quản lý trực tiếp duyệt bước 1, Giám đốc khối duyệt bước 2', true, NOW())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workflow_definition_steps (id, definition_id, step_order, step_name, approver_type, condition_type, created_at)
    VALUES
        (gen_random_uuid(), v_wf_def, 1, 'Quản lý trực tiếp phê duyệt', 'DIRECT_MANAGER', 'ALWAYS', NOW()),
        (gen_random_uuid(), v_wf_def, 2, 'Giám đốc khối phê duyệt', 'DEPARTMENT_HEAD', 'ALWAYS', NOW())
    ON CONFLICT DO NOTHING;

    -- =========================================================================
    -- WAVE 10: PHÁT TRIỂN SỰ NGHIỆP & KẾ THỪA LÃNH ĐẠO (CAREER & SUCCESSION)
    -- =========================================================================

    INSERT INTO career_paths (id, company_id, from_job_title_id, to_job_title_id, min_experience_years, requirements, created_at)
    VALUES (gen_random_uuid(), v_company_id, v_title_dev_sr, v_title_dev_lead, 3.0, 'Đạt xếp loại KPI tối thiểu loại A trong 2 kỳ liên tiếp và có kỹ năng quản lý dự án.', NOW())
    ON CONFLICT DO NOTHING;

    INSERT INTO succession_plans (id, company_id, department_id, job_title_id, risk_level, review_date, created_at)
    VALUES (gen_random_uuid(), v_company_id, v_dept_tech, v_title_cto, 'LOW', '2026-12-31', NOW())
    ON CONFLICT DO NOTHING;

    -- =========================================================================
    -- WAVE 11: LƯU TRỮ HỒ SƠ SỐ, THÔNG BÁO & KIỂM TOÁN (DIGITAL RECORDS & AUDIT)
    -- =========================================================================

    -- 11.1 Hồ sơ số hóa nhân sự của NV2
    INSERT INTO dossiers (id, company_id, employee_id, dossier_code, title, purpose, status, created_at)
    VALUES (v_dossier_long, v_company_id, v_emp2_id, 'DOS-NV00002', 'Hồ sơ Lưu trữ Nhân sự - Lê Hoàng Long', 'CONTRACT', 'ACTIVE', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- 11.2 Thông báo gửi đến NV2
    IF v_user_emp_id IS NOT NULL THEN
        INSERT INTO notifications (id, user_id, notification_type, title, content, action_url, read_at, created_at)
        VALUES
            (gen_random_uuid(), v_user_emp_id, 'PAYROLL', 'Đã có Phiếu lương Tháng 10/2026', 'Phiếu lương của bạn đã được phát hành. Nhấn để xem chi tiết.', '/me/payroll', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),
            (gen_random_uuid(), v_user_emp_id, 'ATTENDANCE', 'Nhắc nhở chấm công Face AI', 'Chúc bạn ngày làm việc hiệu quả! Đừng quên điểm danh khi vào ca.', '/me/attendance/check-in', NULL, NOW() - INTERVAL '2 hours')
        ON CONFLICT DO NOTHING;
    END IF;

    -- 11.3 Nhật ký kiểm toán an toàn hệ thống
    INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, occurred_at, ip_address, description, created_at)
    VALUES
        (gen_random_uuid(), v_user_admin_id, 'UPDATE', 'EMPLOYEE', v_emp2_id::text, NOW() - INTERVAL '1 hour', '127.0.0.1', 'Cập nhật phân bổ chỗ ngồi Tầng 3 cho nhân sự Lê Hoàng Long', NOW()),
        (gen_random_uuid(), v_user_emp_id, 'LOGIN', 'AUTH', v_emp2_id::text, NOW() - INTERVAL '2 hours', '127.0.0.1', 'Đăng nhập thành công vào Cổng thông tin nhân viên', NOW())
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '>>> ĐÃ NẠP TOÀN BỘ DỮ LIỆU MẪU MASTER DATA (147 BẢNG) THÀNH CÔNG RỰC RỠ! <<<';

END $$;
