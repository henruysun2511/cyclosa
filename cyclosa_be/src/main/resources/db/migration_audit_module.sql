-- =============================================================================
-- MIGRATION: MODULE 21 — NHẬT KÝ KIỂM TOÁN & TRUY VẾT HỆ THỐNG (AUDIT LOG & AUDIT TRAIL)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng audit_logs — Sổ cái bất biến (Append-only Ledger) ghi vết mọi biến động hệ thống
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(30) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    old_value TEXT,
    new_value TEXT,
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Chỉ mục tối ưu hóa hiệu năng truy vấn đa chiều
-- Index 1: Tối ưu truy vết lịch sử thực thể (Audit Trail Query) O(log N)
CREATE INDEX IF NOT EXISTS idx_audit_entity_trail 
ON audit_logs (entity_type, entity_id, occurred_at DESC);

-- Index 2: Tối ưu truy vấn hoạt động của tác nhân (Actor Activities)
CREATE INDEX IF NOT EXISTS idx_audit_actor_time 
ON audit_logs (actor_user_id, occurred_at DESC);

-- Index 3: Tối ưu lọc theo hành vi kiểm toán (Action)
CREATE INDEX IF NOT EXISTS idx_audit_action_time 
ON audit_logs (action, occurred_at DESC);

-- Index 4: Tối ưu phân trang tổng quát theo thời gian giảm dần
CREATE INDEX IF NOT EXISTS idx_audit_occurred_time 
ON audit_logs (occurred_at DESC);

-- 3. Phân quyền RBAC cho Module Nhật ký kiểm toán
-- Thêm quyền audit.view và audit.export vào danh mục permissions
INSERT INTO permissions (resource, action, code, description)
SELECT 'AUDIT', 'VIEW', 'audit.view', 'Xem nhật ký kiểm toán và báo cáo tuân thủ'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'audit.view');

INSERT INTO permissions (resource, action, code, description)
SELECT 'AUDIT', 'EXPORT', 'audit.export', 'Xuất file báo cáo nhật ký kiểm toán'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'audit.export');

-- Gán quyền cho các vai trò quản trị (Super Admin, HR Admin, Company Admin)
INSERT INTO role_permissions (role_id, permission_id, data_scope)
SELECT r.id, p.id, 'COMPANY'
FROM roles r
CROSS JOIN permissions p
WHERE r.code IN ('ROLE_SUPER_ADMIN', 'ROLE_HR_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')
  AND p.code IN ('audit.view', 'audit.export')
  AND NOT EXISTS (
      SELECT 1 FROM role_permissions rp
      WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

