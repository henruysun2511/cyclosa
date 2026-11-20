-- ====================================================================
-- MIGRATION SCRIPT: MODULE 19 - SƠ ĐỒ GHẾ NGỒI & KHÔNG GIAN LÀM VIỆC (SMART WORKPLACE)
-- ====================================================================

-- 1. Bảng Cơ sở / Tòa nhà (workplace_sites)
CREATE TABLE IF NOT EXISTS workplace_sites (
    id UUID PRIMARY KEY,
    branch_id UUID NOT NULL REFERENCES branches(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_sites_code UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_workplace_sites_branch_id ON workplace_sites(branch_id);
CREATE INDEX IF NOT EXISTS idx_workplace_sites_code ON workplace_sites(code);

-- 2. Bảng Tầng làm việc (workplace_floors)
CREATE TABLE IF NOT EXISTS workplace_floors (
    id UUID PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES workplace_sites(id),
    floor_number INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_floors_site_number UNIQUE (site_id, floor_number)
);

CREATE INDEX IF NOT EXISTS idx_workplace_floors_site_id ON workplace_floors(site_id);

-- 3. Bảng Phiên bản bản vẽ sơ đồ tầng (workplace_floor_plans)
CREATE TABLE IF NOT EXISTS workplace_floor_plans (
    id UUID PRIMARY KEY,
    floor_id UUID NOT NULL REFERENCES workplace_floors(id),
    version_no INT NOT NULL,
    background_file_url VARCHAR(500),
    canvas_width INT NOT NULL DEFAULT 1920,
    canvas_height INT NOT NULL DEFAULT 1080,
    scale_meters_per_px DECIMAL(10, 6) NOT NULL DEFAULT 0.05,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_floor_plans_version UNIQUE (floor_id, version_no)
);

CREATE INDEX IF NOT EXISTS idx_workplace_floor_plans_floor_id ON workplace_floor_plans(floor_id);
CREATE INDEX IF NOT EXISTS idx_workplace_floor_plans_status ON workplace_floor_plans(status);

-- 4. Bảng Phân khu chức năng (workplace_zones)
CREATE TABLE IF NOT EXISTS workplace_zones (
    id UUID PRIMARY KEY,
    floor_id UUID NOT NULL REFERENCES workplace_floors(id),
    name VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id),
    color_hex VARCHAR(10) DEFAULT '#3B82F6',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workplace_zones_floor_id ON workplace_zones(floor_id);
CREATE INDEX IF NOT EXISTS idx_workplace_zones_dept_id ON workplace_zones(department_id);

-- 5. Bảng Đỉnh ranh giới phân khu (workplace_zone_boundary_points)
CREATE TABLE IF NOT EXISTS workplace_zone_boundary_points (
    id UUID PRIMARY KEY,
    zone_id UUID NOT NULL REFERENCES workplace_zones(id) ON DELETE CASCADE,
    point_order INT NOT NULL,
    x DECIMAL(10, 2) NOT NULL,
    y DECIMAL(10, 2) NOT NULL,
    CONSTRAINT uq_workplace_zone_points_order UNIQUE (zone_id, point_order)
);

CREATE INDEX IF NOT EXISTS idx_workplace_zone_points_zone_id ON workplace_zone_boundary_points(zone_id);

-- 6. Bảng Dãy/Cụm bàn làm việc (workplace_seat_rows)
CREATE TABLE IF NOT EXISTS workplace_seat_rows (
    id UUID PRIMARY KEY,
    zone_id UUID NOT NULL REFERENCES workplace_zones(id),
    code VARCHAR(30) NOT NULL,
    layout_type VARCHAR(30) NOT NULL DEFAULT 'SINGLE_ROW',
    x DECIMAL(10, 2) NOT NULL DEFAULT 0,
    y DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rotation_degrees DECIMAL(5, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_seat_rows_zone_code UNIQUE (zone_id, code)
);

CREATE INDEX IF NOT EXISTS idx_workplace_seat_rows_zone_id ON workplace_seat_rows(zone_id);

-- 7. Bảng Danh mục tiện ích bàn (workplace_amenities)
CREATE TABLE IF NOT EXISTS workplace_amenities (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50),
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_amenities_company_name UNIQUE (company_id, name)
);

CREATE INDEX IF NOT EXISTS idx_workplace_amenities_company_id ON workplace_amenities(company_id);

-- 8. Bảng Bàn làm việc (workplace_seats)
CREATE TABLE IF NOT EXISTS workplace_seats (
    id UUID PRIMARY KEY,
    seat_row_id UUID NOT NULL REFERENCES workplace_seat_rows(id),
    seat_code VARCHAR(100) NOT NULL,
    seat_type VARCHAR(20) NOT NULL DEFAULT 'DEDICATED',
    status VARCHAR(20) NOT NULL DEFAULT 'IN_SERVICE',
    x DECIMAL(10, 2) NOT NULL DEFAULT 0,
    y DECIMAL(10, 2) NOT NULL DEFAULT 0,
    shape VARCHAR(20) NOT NULL DEFAULT 'RECTANGLE',
    width DECIMAL(8, 2) NOT NULL DEFAULT 60,
    height DECIMAL(8, 2) NOT NULL DEFAULT 40,
    rotation_degrees DECIMAL(5, 2) NOT NULL DEFAULT 0,
    qr_token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_seats_code UNIQUE (seat_code),
    CONSTRAINT uq_workplace_seats_qr UNIQUE (qr_token)
);

CREATE INDEX IF NOT EXISTS idx_workplace_seats_row_id ON workplace_seats(seat_row_id);
CREATE INDEX IF NOT EXISTS idx_workplace_seats_type ON workplace_seats(seat_type);
CREATE INDEX IF NOT EXISTS idx_workplace_seats_status ON workplace_seats(status);

-- 9. Bảng liên kết Tiện ích - Bàn làm việc (workplace_seat_amenities)
CREATE TABLE IF NOT EXISTS workplace_seat_amenities (
    seat_id UUID NOT NULL REFERENCES workplace_seats(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES workplace_amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (seat_id, amenity_id)
);

-- 10. Bảng Phân bổ bàn cố định (workplace_seat_assignments)
CREATE TABLE IF NOT EXISTS workplace_seat_assignments (
    id UUID PRIMARY KEY,
    seat_id UUID NOT NULL REFERENCES workplace_seats(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    released_at TIMESTAMP,
    note VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_workplace_seat_assign_seat ON workplace_seat_assignments(seat_id);
CREATE INDEX IF NOT EXISTS idx_workplace_seat_assign_emp ON workplace_seat_assignments(employee_id);

-- 11. Bảng Tài sản gắn tại bàn (workplace_seat_assets)
CREATE TABLE IF NOT EXISTS workplace_seat_assets (
    id UUID PRIMARY KEY,
    seat_id UUID NOT NULL REFERENCES workplace_seats(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    unlinked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_workplace_seat_assets_seat ON workplace_seat_assets(seat_id);
CREATE INDEX IF NOT EXISTS idx_workplace_seat_assets_asset ON workplace_seat_assets(asset_id);

-- 12. Bảng Vật thể mặt bằng kiến trúc (workplace_floor_objects)
CREATE TABLE IF NOT EXISTS workplace_floor_objects (
    id UUID PRIMARY KEY,
    floor_id UUID NOT NULL REFERENCES workplace_floors(id),
    object_type VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    x DECIMAL(10, 2) NOT NULL DEFAULT 0,
    y DECIMAL(10, 2) NOT NULL DEFAULT 0,
    width DECIMAL(8, 2) NOT NULL DEFAULT 80,
    height DECIMAL(8, 2) NOT NULL DEFAULT 80,
    rotation_degrees DECIMAL(5, 2) NOT NULL DEFAULT 0,
    qr_token VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_workplace_floor_objects_qr UNIQUE (qr_token)
);

CREATE INDEX IF NOT EXISTS idx_workplace_floor_objects_floor ON workplace_floor_objects(floor_id);
CREATE INDEX IF NOT EXISTS idx_workplace_floor_objects_type ON workplace_floor_objects(object_type);

-- 13. Bảng Mở rộng Thông tin Phòng họp (workplace_meeting_rooms)
CREATE TABLE IF NOT EXISTS workplace_meeting_rooms (
    floor_object_id UUID PRIMARY KEY REFERENCES workplace_floor_objects(id) ON DELETE CASCADE,
    capacity INT NOT NULL DEFAULT 6,
    has_projector BOOLEAN NOT NULL DEFAULT FALSE,
    has_video_conference BOOLEAN NOT NULL DEFAULT FALSE,
    has_whiteboard BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT
);

-- 14. Bảng Đặt bàn linh hoạt (workplace_desk_bookings)
CREATE TABLE IF NOT EXISTS workplace_desk_bookings (
    id UUID PRIMARY KEY,
    seat_id UUID NOT NULL REFERENCES workplace_seats(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    booking_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    checked_in_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    note VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_workplace_desk_book_seat_date ON workplace_desk_bookings(seat_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_workplace_desk_book_emp_date ON workplace_desk_bookings(employee_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_workplace_desk_book_status ON workplace_desk_bookings(status);

-- 15. Bảng Đặt phòng họp (workplace_room_bookings)
CREATE TABLE IF NOT EXISTS workplace_room_bookings (
    id UUID PRIMARY KEY,
    meeting_room_id UUID NOT NULL REFERENCES workplace_floor_objects(id),
    organizer_employee_id UUID NOT NULL REFERENCES employees(id),
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    attendee_count INT NOT NULL DEFAULT 1,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    checked_in_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_workplace_room_book_room_time ON workplace_room_bookings(meeting_room_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_workplace_room_book_organizer ON workplace_room_bookings(organizer_employee_id);
CREATE INDEX IF NOT EXISTS idx_workplace_room_book_status ON workplace_room_bookings(status);

-- 16. Bảng Sự cố cơ sở vật chất (workplace_issues)
CREATE TABLE IF NOT EXISTS workplace_issues (
    id UUID PRIMARY KEY,
    reporter_employee_id UUID NOT NULL REFERENCES employees(id),
    issue_type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    seat_id UUID REFERENCES workplace_seats(id),
    floor_object_id UUID REFERENCES workplace_floor_objects(id),
    floor_id UUID REFERENCES workplace_floors(id),
    location_x DECIMAL(10, 2),
    location_y DECIMAL(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    assigned_to_employee_id UUID REFERENCES employees(id),
    resolution_note TEXT,
    reported_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_workplace_issues_reporter ON workplace_issues(reporter_employee_id);
CREATE INDEX IF NOT EXISTS idx_workplace_issues_status ON workplace_issues(status);
CREATE INDEX IF NOT EXISTS idx_workplace_issues_seat ON workplace_issues(seat_id);
CREATE INDEX IF NOT EXISTS idx_workplace_issues_assigned ON workplace_issues(assigned_to_employee_id);


-- ====================================================================
-- SEED DATA: MODULE 19 - SƠ ĐỒ GHẾ NGỒI & KHÔNG GIAN LÀM VIỆC (SMART WORKPLACE)
-- ====================================================================

-- 0. Quyền hạn phân hệ Không gian làm việc (Permissions)
INSERT INTO permissions (resource, action, code, description) VALUES
('WORKPLACE', 'VIEW', 'workplace.view', 'Xem sơ đồ bàn ghế, địa điểm và danh mục không gian làm việc'),
('WORKPLACE', 'MANAGE', 'workplace.manage', 'Tạo, sửa, xóa cơ sở, bản vẽ tầng, phân khu, bàn ghế, thiết bị'),
('WORKPLACE', 'REPORT', 'workplace.report', 'Xem báo cáo tỷ lệ lấp đầy và sử dụng không gian làm việc')
ON CONFLICT (code) DO NOTHING;

-- Gán quyền cho các vai trò quản trị (SUPER_ADMIN, HR_ADMIN, OFFICE_ADMIN, ADMIN, HR_MANAGER)
INSERT INTO role_permissions (role_id, permission_id, data_scope)
SELECT r.id, p.id, 'ALL'
FROM roles r
CROSS JOIN permissions p
WHERE r.code IN ('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN', 'HR_MANAGER')
  AND p.code IN ('workplace.view', 'workplace.manage', 'workplace.report')
ON CONFLICT DO NOTHING;

-- Gán quyền xem sơ đồ không gian làm việc (workplace.view) cho toàn bộ nhân sự (EMPLOYEE, MANAGER, HR_SPECIALIST, v.v.)
INSERT INTO role_permissions (role_id, permission_id, data_scope)
SELECT r.id, p.id, 'ALL'
FROM roles r
CROSS JOIN permissions p
WHERE r.code IN ('EMPLOYEE', 'MANAGER', 'HR_SPECIALIST', 'RECRUITER', 'EXECUTIVE', 'PAYROLL_ACCOUNTANT', 'AUDITOR')
  AND p.code = 'workplace.view'
ON CONFLICT DO NOTHING;

-- Gán quyền xem báo cáo hiệu suất không gian (workplace.report) cho Ban Giám đốc (EXECUTIVE)
INSERT INTO role_permissions (role_id, permission_id, data_scope)
SELECT r.id, p.id, 'ALL'
FROM roles r
CROSS JOIN permissions p
WHERE r.code IN ('EXECUTIVE')
  AND p.code = 'workplace.report'
ON CONFLICT DO NOTHING;

-- 1. Cơ sở mẫu:
-- Trụ sở Keangnam Landmark 72 (SITE-HN-01)
INSERT INTO workplace_sites (id, branch_id, code, name, address, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000001'::uuid,
    b.id,
    'SITE-HN-01',
    'Tòa nhà Keangnam Landmark 72',
    'Đường Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội',
    'Trụ sở chính khối điều hành & Trung tâm Công nghệ thông tin',
    NOW()
FROM branches b ORDER BY b.created_at ASC LIMIT 1
ON CONFLICT (code) DO NOTHING;

-- Chi nhánh TP.HCM: Bitexco Financial Tower (SITE-HCM-01)
INSERT INTO workplace_sites (id, branch_id, code, name, address, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000002'::uuid,
    b.id,
    'SITE-HCM-01',
    'Tòa nhà Bitexco Financial Tower',
    'Số 02 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    'Chi nhánh Miền Nam — Khối Phát triển Kinh doanh & Dịch vụ Khách hàng',
    NOW()
FROM branches b ORDER BY b.created_at DESC LIMIT 1
ON CONFLICT (code) DO NOTHING;

-- 2. Tầng làm việc mẫu
-- Keangnam Tầng 10 (Kinh doanh)
INSERT INTO workplace_floors (id, site_id, floor_number, name, description, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    10,
    'Tầng 10 — Khối Kinh doanh & Vận hành',
    'Mặt sàn Khối Phát triển Thị trường, Marketing & Hỗ trợ Khách hàng',
    NOW()
) ON CONFLICT (site_id, floor_number) DO NOTHING;

-- Keangnam Tầng 12 (Công nghệ & R&D)
INSERT INTO workplace_floors (id, site_id, floor_number, name, description, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    12,
    'Tầng 12 — Khối Công nghệ & R&D',
    'Mặt sàn văn phòng kỹ thuật phần mềm, thiết kế sản phẩm & cụm bàn Hot-desking',
    NOW()
) ON CONFLICT (site_id, floor_number) DO NOTHING;

-- Bitexco Tầng 15 (Chi nhánh Miền Nam)
INSERT INTO workplace_floors (id, site_id, floor_number, name, description, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000015'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    15,
    'Tầng 15 — Văn phòng Chi nhánh Miền Nam',
    'Không gian mở Hub làm việc linh hoạt và phòng hội nghị truyền hình',
    NOW()
) ON CONFLICT (site_id, floor_number) DO NOTHING;

-- 3. Phiên bản bản vẽ phát hành (v1) cho Tầng 12
INSERT INTO workplace_floor_plans (id, floor_id, version_no, canvas_width, canvas_height, scale_meters_per_px, status, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000101'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    1,
    1000,
    560,
    0.05,
    'PUBLISHED',
    NOW()
) ON CONFLICT (floor_id, version_no) DO NOTHING;

-- 4. Phân khu chức năng (Zones trên Tầng 12)
INSERT INTO workplace_zones (id, floor_id, name, color_hex, created_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000201'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'Khu vực R&D Công nghệ Phần mềm',
    '#3B82F6',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000202'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'Khu vực Bàn Làm việc Linh hoạt (Hot-desking)',
    '#10B981',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000203'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'Khu vực Thiết kế UI/UX & Quản lý Sản phẩm',
    '#8B5CF6',
    NOW()
) ON CONFLICT DO NOTHING;

-- 4.1. Tọa độ ranh giới phân khu chức năng (Boundary Points)
INSERT INTO workplace_zone_boundary_points (id, zone_id, point_order, x, y, created_at)
VALUES
-- Zone 1: R&D (Góc trái: 35, 35 -> 320, 420)
('00000000-0000-0000-0000-000000000211'::uuid, '00000000-0000-0000-0000-000000000201'::uuid, 1, 35, 35, NOW()),
('00000000-0000-0000-0000-000000000212'::uuid, '00000000-0000-0000-0000-000000000201'::uuid, 2, 320, 35, NOW()),
('00000000-0000-0000-0000-000000000213'::uuid, '00000000-0000-0000-0000-000000000201'::uuid, 3, 320, 420, NOW()),
('00000000-0000-0000-0000-000000000214'::uuid, '00000000-0000-0000-0000-000000000201'::uuid, 4, 35, 420, NOW()),
-- Zone 3: UI/UX & Product (Ở giữa: 340, 35 -> 580, 420)
('00000000-0000-0000-0000-000000000231'::uuid, '00000000-0000-0000-0000-000000000203'::uuid, 1, 340, 35, NOW()),
('00000000-0000-0000-0000-000000000232'::uuid, '00000000-0000-0000-0000-000000000203'::uuid, 2, 580, 35, NOW()),
('00000000-0000-0000-0000-000000000233'::uuid, '00000000-0000-0000-0000-000000000203'::uuid, 3, 580, 420, NOW()),
('00000000-0000-0000-0000-000000000234'::uuid, '00000000-0000-0000-0000-000000000203'::uuid, 4, 340, 420, NOW()),
-- Zone 2: Hot-desking (Góc phải: 600, 35 -> 960, 340)
('00000000-0000-0000-0000-000000000221'::uuid, '00000000-0000-0000-0000-000000000202'::uuid, 1, 600, 35, NOW()),
('00000000-0000-0000-0000-000000000222'::uuid, '00000000-0000-0000-0000-000000000202'::uuid, 2, 960, 35, NOW()),
('00000000-0000-0000-0000-000000000223'::uuid, '00000000-0000-0000-0000-000000000202'::uuid, 3, 960, 340, NOW()),
('00000000-0000-0000-0000-000000000224'::uuid, '00000000-0000-0000-0000-000000000202'::uuid, 4, 600, 340, NOW())
ON CONFLICT DO NOTHING;

-- 5. Tiện ích văn phòng (workplace_amenities)
INSERT INTO workplace_amenities (id, company_id, name, icon_name, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000801'::uuid,
    c.id,
    'Màn hình kép 27" 4K UltraHD',
    'Monitor',
    'Trang bị sẵn 2 màn hình Dell Ultrasharp 4K có chân đế xoay đa hướng',
    NOW()
FROM companies c LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO workplace_amenities (id, company_id, name, icon_name, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000802'::uuid,
    c.id,
    'Cổng mạng LAN Gigabit Cat6',
    'Network',
    'Đường truyền cáp quang nội bộ tốc độ cao 1000Mbps bảo mật cao',
    NOW()
FROM companies c LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO workplace_amenities (id, company_id, name, icon_name, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000803'::uuid,
    c.id,
    'Cổng sạc Type-C PD 100W',
    'Zap',
    'Hỗ trợ cắm sạc trực tiếp máy tính xách tay không cần mang củ sạc',
    NOW()
FROM companies c LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO workplace_amenities (id, company_id, name, icon_name, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000804'::uuid,
    c.id,
    'Ghế công thái học Herman Miller',
    'Armchair',
    'Ghế chống đau mỏi thắt lưng hỗ trợ tư thế làm việc dài',
    NOW()
FROM companies c LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO workplace_amenities (id, company_id, name, icon_name, description, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000805'::uuid,
    c.id,
    'Bàn nâng hạ độ cao Electric Desk',
    'ArrowUpDown',
    'Bàn làm việc điều chỉnh độ cao điện tử đứng/ngồi linh hoạt',
    NOW()
FROM companies c LIMIT 1
ON CONFLICT DO NOTHING;

-- 6. Cụm dãy bàn (Seat Rows)
INSERT INTO workplace_seat_rows (id, zone_id, code, layout_type, x, y, rotation_degrees, created_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000301'::uuid,
    '00000000-0000-0000-0000-000000000201'::uuid,
    'DEV-A',
    'POD_4_FACING',
    60,
    80,
    0,
    NOW()
),
(
    '00000000-0000-0000-0000-000000000302'::uuid,
    '00000000-0000-0000-0000-000000000201'::uuid,
    'DEV-B',
    'POD_4_FACING',
    60,
    220,
    0,
    NOW()
),
(
    '00000000-0000-0000-0000-000000000303'::uuid,
    '00000000-0000-0000-0000-000000000202'::uuid,
    'HOT-A',
    'SINGLE_ROW',
    620,
    80,
    0,
    NOW()
),
(
    '00000000-0000-0000-0000-000000000304'::uuid,
    '00000000-0000-0000-0000-000000000202'::uuid,
    'HOT-B',
    'SINGLE_ROW',
    620,
    200,
    0,
    NOW()
) ON CONFLICT DO NOTHING;

-- 7. Danh mục Bàn làm việc (Seats)
INSERT INTO workplace_seats (id, seat_row_id, seat_code, seat_type, status, x, y, shape, width, height, rotation_degrees, qr_token, created_at)
VALUES 
-- Cụm bàn cố định DEV-A (R&D)
(
    '00000000-0000-0000-0000-000000000401'::uuid,
    '00000000-0000-0000-0000-000000000301'::uuid,
    'DEV-A01',
    'DEDICATED',
    'IN_SERVICE',
    60, 80, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-a01', NOW()
),
(
    '00000000-0000-0000-0000-000000000402'::uuid,
    '00000000-0000-0000-0000-000000000301'::uuid,
    'DEV-A02',
    'DEDICATED',
    'IN_SERVICE',
    145, 80, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-a02', NOW()
),
(
    '00000000-0000-0000-0000-000000000403'::uuid,
    '00000000-0000-0000-0000-000000000301'::uuid,
    'DEV-A03',
    'DEDICATED',
    'IN_SERVICE',
    60, 140, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-a03', NOW()
),
(
    '00000000-0000-0000-0000-000000000404'::uuid,
    '00000000-0000-0000-0000-000000000301'::uuid,
    'DEV-A04',
    'DEDICATED',
    'IN_SERVICE',
    145, 140, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-a04', NOW()
),
-- Cụm bàn cố định DEV-B (Frontend / Mobile)
(
    '00000000-0000-0000-0000-000000000405'::uuid,
    '00000000-0000-0000-0000-000000000302'::uuid,
    'DEV-B01',
    'DEDICATED',
    'IN_SERVICE',
    60, 220, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-b01', NOW()
),
(
    '00000000-0000-0000-0000-000000000406'::uuid,
    '00000000-0000-0000-0000-000000000302'::uuid,
    'DEV-B02',
    'DEDICATED',
    'IN_SERVICE',
    145, 220, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-b02', NOW()
),
(
    '00000000-0000-0000-0000-000000000407'::uuid,
    '00000000-0000-0000-0000-000000000302'::uuid,
    'DEV-B03',
    'DEDICATED',
    'IN_SERVICE',
    60, 280, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-b03', NOW()
),
(
    '00000000-0000-0000-0000-000000000408'::uuid,
    '00000000-0000-0000-0000-000000000302'::uuid,
    'DEV-B04',
    'DEDICATED',
    'MAINTENANCE',
    145, 280, 'RECTANGLE', 70, 45, 0, 'qr-seat-dev-b04', NOW()
),
-- Cụm bàn linh hoạt Hot-desking HOT-A
(
    '00000000-0000-0000-0000-000000000409'::uuid,
    '00000000-0000-0000-0000-000000000303'::uuid,
    'HOT-01',
    'HOT_DESK',
    'IN_SERVICE',
    620, 80, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-01', NOW()
),
(
    '00000000-0000-0000-0000-000000000410'::uuid,
    '00000000-0000-0000-0000-000000000303'::uuid,
    'HOT-02',
    'HOT_DESK',
    'IN_SERVICE',
    705, 80, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-02', NOW()
),
(
    '00000000-0000-0000-0000-000000000411'::uuid,
    '00000000-0000-0000-0000-000000000303'::uuid,
    'HOT-03',
    'HOT_DESK',
    'IN_SERVICE',
    790, 80, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-03', NOW()
),
(
    '00000000-0000-0000-0000-000000000412'::uuid,
    '00000000-0000-0000-0000-000000000303'::uuid,
    'HOT-04',
    'HOT_DESK',
    'IN_SERVICE',
    875, 80, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-04', NOW()
),
-- Cụm bàn linh hoạt Hot-desking HOT-B
(
    '00000000-0000-0000-0000-000000000413'::uuid,
    '00000000-0000-0000-0000-000000000304'::uuid,
    'HOT-05',
    'HOT_DESK',
    'IN_SERVICE',
    620, 200, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-05', NOW()
),
(
    '00000000-0000-0000-0000-000000000414'::uuid,
    '00000000-0000-0000-0000-000000000304'::uuid,
    'HOT-06',
    'HOT_DESK',
    'IN_SERVICE',
    705, 200, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-06', NOW()
),
(
    '00000000-0000-0000-0000-000000000415'::uuid,
    '00000000-0000-0000-0000-000000000304'::uuid,
    'HOT-07',
    'HOT_DESK',
    'IN_SERVICE',
    790, 200, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-07', NOW()
),
(
    '00000000-0000-0000-0000-000000000416'::uuid,
    '00000000-0000-0000-0000-000000000304'::uuid,
    'HOT-08',
    'HOT_DESK',
    'IN_SERVICE',
    875, 200, 'RECTANGLE', 70, 45, 0, 'qr-seat-hot-08', NOW()
) ON CONFLICT (seat_code) DO NOTHING;

-- 8. Gắn tiện ích cho bàn làm việc (workplace_seat_amenities)
-- Bàn DEV-A01, A02 gắn Màn hình 4K, LAN Gigabit, Ghế Ergonomic
INSERT INTO workplace_seat_amenities (seat_id, amenity_id)
SELECT '00000000-0000-0000-0000-000000000401'::uuid, id FROM workplace_amenities
WHERE name IN ('Màn hình kép 27" 4K UltraHD', 'Cổng mạng LAN Gigabit Cat6', 'Ghế công thái học Herman Miller', 'Bàn nâng hạ độ cao Electric Desk')
ON CONFLICT DO NOTHING;

INSERT INTO workplace_seat_amenities (seat_id, amenity_id)
SELECT '00000000-0000-0000-0000-000000000402'::uuid, id FROM workplace_amenities
WHERE name IN ('Màn hình kép 27" 4K UltraHD', 'Cổng mạng LAN Gigabit Cat6', 'Ghế công thái học Herman Miller')
ON CONFLICT DO NOTHING;

-- Các bàn Hot-desk gắn sạc nhanh Type-C và ghế Ergonomic
INSERT INTO workplace_seat_amenities (seat_id, amenity_id)
SELECT s.id, a.id
FROM workplace_seats s
CROSS JOIN workplace_amenities a
WHERE s.seat_code LIKE 'HOT-%'
  AND a.name IN ('Cổng sạc Type-C PD 100W', 'Ghế công thái học Herman Miller')
ON CONFLICT DO NOTHING;

-- 9. GÁN CHỖ CHO NHÂN VIÊN THỰC TẾ TRONG HỆ THỐNG (Seat Assignments)
-- Nguyên tắc: Một nhân viên chỉ có 1 bàn cố định đang hoạt động (released_at IS NULL)
DO $$
DECLARE
    r_emp RECORD;
    v_seat_id UUID;
BEGIN
    -- 9.1. Gán bàn DEV-A01 cho nhân viên đầu tiên (NV-2026-00001 - Nguyễn Văn An / Quản lý R&D)
    SELECT id INTO v_seat_id FROM workplace_seats WHERE seat_code = 'DEV-A01';
    SELECT id INTO r_emp FROM employees WHERE employee_code = 'NV-2026-00001' LIMIT 1;
    IF r_emp.id IS NOT NULL AND v_seat_id IS NOT NULL THEN
        -- Đóng các phân bổ cũ nếu có
        UPDATE workplace_seat_assignments SET released_at = NOW() WHERE employee_id = r_emp.id AND released_at IS NULL;
        INSERT INTO workplace_seat_assignments (id, seat_id, employee_id, assigned_at, released_at, note, created_at)
        VALUES (
            '00000000-0000-0000-0000-000000000901'::uuid,
            v_seat_id,
            r_emp.id,
            '2026-01-15 08:30:00',
            NULL,
            'Phân bổ chỗ ngồi cố định Trưởng nhóm R&D',
            NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;

    -- 9.2. Gán bàn DEV-A02 cho nhân viên thứ 2 (NV-2026-00002 - Trần Thị Bình / Senior Dev)
    SELECT id INTO v_seat_id FROM workplace_seats WHERE seat_code = 'DEV-A02';
    SELECT id INTO r_emp FROM employees WHERE employee_code = 'NV-2026-00002' LIMIT 1;
    IF r_emp.id IS NOT NULL AND v_seat_id IS NOT NULL THEN
        UPDATE workplace_seat_assignments SET released_at = NOW() WHERE employee_id = r_emp.id AND released_at IS NULL;
        INSERT INTO workplace_seat_assignments (id, seat_id, employee_id, assigned_at, released_at, note, created_at)
        VALUES (
            '00000000-0000-0000-0000-000000000902'::uuid,
            v_seat_id,
            r_emp.id,
            '2026-02-01 08:30:00',
            NULL,
            'Phân bổ chỗ ngồi Lập trình viên Backend Senior',
            NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;

    -- 9.3. Gán bàn DEV-A03 cho nhân viên thứ 3 (NV-2026-00003 - Hoàng Thu Hà / Nhân viên chính thức)
    SELECT id INTO v_seat_id FROM workplace_seats WHERE seat_code = 'DEV-A03';
    SELECT id INTO r_emp FROM employees WHERE employee_code = 'NV-2026-00003' LIMIT 1;
    IF r_emp.id IS NOT NULL AND v_seat_id IS NOT NULL THEN
        UPDATE workplace_seat_assignments SET released_at = NOW() WHERE employee_id = r_emp.id AND released_at IS NULL;
        INSERT INTO workplace_seat_assignments (id, seat_id, employee_id, assigned_at, released_at, note, created_at)
        VALUES (
            '00000000-0000-0000-0000-000000000903'::uuid,
            v_seat_id,
            r_emp.id,
            '2026-02-15 08:30:00',
            NULL,
            'Phân bổ chỗ ngồi Kỹ sư phát triển phần mềm',
            NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;

    -- 9.4. Gán bàn DEV-B01 cho nhân viên thứ 4 (nếu có trong bảng employees)
    SELECT id INTO v_seat_id FROM workplace_seats WHERE seat_code = 'DEV-B01';
    SELECT id INTO r_emp FROM employees WHERE employee_code NOT IN ('NV-2026-00001', 'NV-2026-00002', 'NV-2026-00003') LIMIT 1;
    IF r_emp.id IS NOT NULL AND v_seat_id IS NOT NULL THEN
        UPDATE workplace_seat_assignments SET released_at = NOW() WHERE employee_id = r_emp.id AND released_at IS NULL;
        INSERT INTO workplace_seat_assignments (id, seat_id, employee_id, assigned_at, released_at, note, created_at)
        VALUES (
            '00000000-0000-0000-0000-000000000904'::uuid,
            v_seat_id,
            r_emp.id,
            '2026-03-01 08:30:00',
            NULL,
            'Phân bổ chỗ ngồi chuyên viên Frontend',
            NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 10. Gắn Tài sản cố định vào bàn (Seat Assets)
-- Tạo tài sản mẫu trong bảng assets nếu chưa có
DO $$
DECLARE
    v_comp_id UUID;
    v_cat_id UUID;
    v_asset1_id UUID;
    v_asset2_id UUID;
BEGIN
    SELECT id INTO v_comp_id FROM companies LIMIT 1;
    IF v_comp_id IS NOT NULL THEN
        -- Kiểm tra/tạo category
        SELECT id INTO v_cat_id FROM asset_categories WHERE company_id = v_comp_id AND code = 'IT_EQUIPMENT' LIMIT 1;
        IF v_cat_id IS NULL THEN
            INSERT INTO asset_categories (id, company_id, code, name, description, created_at)
            VALUES (gen_random_uuid(), v_comp_id, 'IT_EQUIPMENT', 'Thiết bị công nghệ thông tin', 'Màn hình, máy tính, docking station', NOW())
            ON CONFLICT DO NOTHING
            RETURNING id INTO v_cat_id;
        END IF;

        IF v_cat_id IS NOT NULL THEN
            -- Tạo asset 1: Màn hình Dell
            SELECT id INTO v_asset1_id FROM assets WHERE company_id = v_comp_id AND asset_code = 'AST-MON-001';
            IF v_asset1_id IS NULL THEN
                INSERT INTO assets (id, company_id, asset_code, asset_category_id, name, serial_number, model, manufacturer, status, condition_status, created_at)
                VALUES (gen_random_uuid(), v_comp_id, 'AST-MON-001', v_cat_id, 'Màn hình Dell Ultrasharp 27" 4K', 'SN-DELL-88319', 'U2723QE', 'Dell Technologies', 'ASSIGNED', 'GOOD', NOW())
                RETURNING id INTO v_asset1_id;
            END IF;

            -- Tạo asset 2: Docking HP
            SELECT id INTO v_asset2_id FROM assets WHERE company_id = v_comp_id AND asset_code = 'AST-DOC-001';
            IF v_asset2_id IS NULL THEN
                INSERT INTO assets (id, company_id, asset_code, asset_category_id, name, serial_number, model, manufacturer, status, condition_status, created_at)
                VALUES (gen_random_uuid(), v_comp_id, 'AST-DOC-001', v_cat_id, 'Docking Station HP USB-C G5', 'SN-HP-44120', '5TW10AA', 'HP Inc.', 'ASSIGNED', 'GOOD', NOW())
                RETURNING id INTO v_asset2_id;
            END IF;

            -- Gán vào bàn DEV-A01
            IF v_asset1_id IS NOT NULL THEN
                INSERT INTO workplace_seat_assets (id, seat_id, asset_id, linked_at, created_at)
                VALUES (
                    gen_random_uuid(),
                    '00000000-0000-0000-0000-000000000401'::uuid,
                    v_asset1_id,
                    NOW(),
                    NOW()
                ) ON CONFLICT DO NOTHING;
            END IF;

            -- Gán vào bàn DEV-A02
            IF v_asset2_id IS NOT NULL THEN
                INSERT INTO workplace_seat_assets (id, seat_id, asset_id, linked_at, created_at)
                VALUES (
                    gen_random_uuid(),
                    '00000000-0000-0000-0000-000000000402'::uuid,
                    v_asset2_id,
                    NOW(),
                    NOW()
                ) ON CONFLICT DO NOTHING;
            END IF;
        END IF;
    END IF;
END $$;

-- 11. Vật thể mặt bằng kiến trúc & Phòng họp
INSERT INTO workplace_floor_objects (id, floor_id, object_type, name, x, y, width, height, rotation_degrees, qr_token, created_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000501'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'MEETING_ROOM',
    'Phòng họp Innovation',
    350, 350, 280, 160, 0, 'qr-room-innovation', NOW()
),
(
    '00000000-0000-0000-0000-000000000502'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'MEETING_ROOM',
    'Phòng họp Agile Daily',
    60, 350, 240, 160, 0, 'qr-room-agile-daily', NOW()
),
(
    '00000000-0000-0000-0000-000000000503'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'PANTRY',
    'Khu vực Pantry & Cà phê thư giãn',
    720, 350, 220, 160, 0, NULL, NOW()
),
(
    '00000000-0000-0000-0000-000000000504'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'ELEVATOR',
    'Sảnh thang máy trung tâm Tầng 12',
    420, 30, 140, 80, 0, NULL, NOW()
),
(
    '00000000-0000-0000-0000-000000000505'::uuid,
    '00000000-0000-0000-0000-000000000012'::uuid,
    'PRINTER',
    'Khu in ấn & Photocopy trung tâm',
    350, 180, 60, 50, 0, NULL, NOW()
) ON CONFLICT DO NOTHING;

-- Chi tiết phòng họp
INSERT INTO workplace_meeting_rooms (floor_object_id, capacity, has_projector, has_video_conference, has_whiteboard, description)
VALUES 
(
    '00000000-0000-0000-0000-000000000501'::uuid,
    16,
    TRUE,
    TRUE,
    TRUE,
    'Phòng họp lớn trang bị camera 4K Polycom, màn hình ghép Sony 85", hệ thống micro âm trần hội nghị truyền hình quốc tế'
),
(
    '00000000-0000-0000-0000-000000000502'::uuid,
    8,
    FALSE,
    TRUE,
    TRUE,
    'Phòng họp nhanh phục vụ họp đầu ngày Scrum/Agile Daily, TV thông minh 65" và bảng kính viết bút lông'
)
ON CONFLICT (floor_object_id) DO UPDATE SET
    capacity = EXCLUDED.capacity,
    has_projector = EXCLUDED.has_projector,
    has_video_conference = EXCLUDED.has_video_conference,
    has_whiteboard = EXCLUDED.has_whiteboard,
    description = EXCLUDED.description;

-- 12. Lịch Đặt bàn Hot-desking mẫu (Desk Bookings)
INSERT INTO workplace_desk_bookings (id, seat_id, employee_id, booking_date, status, checked_in_at, note, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000701'::uuid,
    '00000000-0000-0000-0000-000000000409'::uuid, -- HOT-01
    e.id,
    CURRENT_DATE,
    'CHECKED_IN',
    NOW() - INTERVAL '2 hours',
    'Làm việc kết hợp ngày thứ Hai tại văn phòng',
    NOW()
FROM employees e WHERE e.employee_code = 'NV-2026-00002' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO workplace_desk_bookings (id, seat_id, employee_id, booking_date, status, checked_in_at, note, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000702'::uuid,
    '00000000-0000-0000-0000-000000000410'::uuid, -- HOT-02
    e.id,
    CURRENT_DATE + INTERVAL '1 day',
    'CONFIRMED',
    NULL,
    'Đặt trước chỗ làm việc phục vụ chạy dự án cùng khách hàng',
    NOW()
FROM employees e WHERE e.employee_code = 'NV-2026-00003' LIMIT 1
ON CONFLICT DO NOTHING;

-- 13. Lịch Đặt phòng họp mẫu (Room Bookings)
INSERT INTO workplace_room_bookings (
    id, meeting_room_id, organizer_employee_id, created_by_user_id,
    title, attendee_count, start_time, end_time, status, checked_in_at, description, created_at
)
SELECT 
    '00000000-0000-0000-0000-000000000601'::uuid,
    '00000000-0000-0000-0000-000000000501'::uuid, -- Phòng họp Innovation
    e.id,
    u.id,
    'Sprint Planning & Product Backlog Refinement Q4',
    12,
    CURRENT_DATE + TIME '09:00:00',
    CURRENT_DATE + TIME '11:30:00',
    'CONFIRMED',
    CURRENT_DATE + TIME '08:55:00',
    'Lập kế hoạch sprint, rà soát user stories và phân bổ nhân sự quý 4',
    NOW()
FROM employees e
CROSS JOIN users u
WHERE e.employee_code = 'NV-2026-00001'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 14. Báo cáo sự cố mẫu (Workplace Issues)
INSERT INTO workplace_issues (
    id, reporter_employee_id, issue_type, severity, title, description,
    seat_id, floor_id, status, reported_at, created_at
)
SELECT 
    '00000000-0000-0000-0000-000000000781'::uuid,
    e.id,
    'ELECTRICAL',
    'MEDIUM',
    'Ổ cắm điện âm sàn tại bàn DEV-B04 bị mất nguồn',
    'Ổ cắm đôi âm sàn bên dưới bàn DEV-B04 không có điện, đã thử cắm lại nhiều lần.',
    '00000000-0000-0000-0000-000000000408'::uuid, -- DEV-B04
    '00000000-0000-0000-0000-000000000012'::uuid,
    'IN_PROGRESS',
    NOW() - INTERVAL '1 day',
    NOW()
FROM employees e WHERE e.employee_code = 'NV-2026-00002' LIMIT 1
ON CONFLICT DO NOTHING;

