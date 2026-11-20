-- ====================================================================
-- MIGRATION SCRIPT: MODULE QUẢN LÝ TÀI SẢN (ASSET MANAGEMENT)
-- ====================================================================

-- 1. Bảng Loại tài sản (asset_categories)
CREATE TABLE IF NOT EXISTS asset_categories (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_asset_cat_company_code UNIQUE (company_id, code),
    CONSTRAINT uq_asset_cat_company_name UNIQUE (company_id, name)
);

CREATE INDEX IF NOT EXISTS idx_asset_cat_company_id ON asset_categories(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_cat_code ON asset_categories(code);

-- 2. Bảng Hiện vật tài sản (assets)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    asset_code VARCHAR(50) NOT NULL,
    asset_category_id UUID NOT NULL REFERENCES asset_categories(id),
    name VARCHAR(200) NOT NULL,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    specifications TEXT,
    purchase_date DATE,
    purchase_price DECIMAL(15, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    condition_status VARCHAR(30) NOT NULL DEFAULT 'GOOD',
    location VARCHAR(200),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_asset_company_code UNIQUE (company_id, asset_code)
);

CREATE INDEX IF NOT EXISTS idx_asset_company_id ON assets(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_code ON assets(asset_code);
CREATE INDEX IF NOT EXISTS idx_asset_category_id ON assets(asset_category_id);
CREATE INDEX IF NOT EXISTS idx_asset_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_asset_serial_number ON assets(serial_number);

-- 3. Bảng Cấp phát & Thu hồi tài sản (asset_assignments)
CREATE TABLE IF NOT EXISTS asset_assignments (
    id UUID PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES assets(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    assigned_at TIMESTAMP NOT NULL,
    returned_at TIMESTAMP,
    condition_on_assign VARCHAR(50),
    condition_on_return VARCHAR(50),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asset_assign_asset_id ON asset_assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_assign_employee_id ON asset_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_asset_assign_returned_at ON asset_assignments(returned_at);

-- Partial index: Một tài sản chỉ được cấp cho 1 người tại một thời điểm
CREATE UNIQUE INDEX IF NOT EXISTS uq_asset_active_assignment 
ON asset_assignments (asset_id) 
WHERE returned_at IS NULL;

-- 4. Bổ sung quyền phân hệ Quản lý tài sản (Permissions)
INSERT INTO permissions (resource, action, code, description) VALUES
('ASSET', 'VIEW', 'asset.view', 'Xem danh sách, chi tiết và thống kê tài sản doanh nghiệp'),
('ASSET', 'MANAGE', 'asset.manage', 'Tạo mới, chỉnh sửa, xóa hiện vật và loại tài sản'),
('ASSET', 'ASSIGN', 'asset.assign', 'Thực hiện cấp phát và thu hồi hoàn trả tài sản cho nhân viên')
ON CONFLICT (code) DO NOTHING;
