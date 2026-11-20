-- =============================================================================
-- MIGRATION: MODULE 20 — THÔNG BÁO NỘI BỘ (NOTIFICATION SYSTEM)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng notifications — Lưu trữ thông báo cá nhân hóa theo từng người dùng (Pull-based & Fan-out)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    action_url VARCHAR(500),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Chỉ mục tối ưu hóa hiệu năng truy vấn
-- Index tối ưu truy vấn đếm unread count & lọc tin chưa đọc: O(1) Index-only scan
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON notifications (user_id, read_at) 
WHERE read_at IS NULL;

-- Index phân trang danh sách thông báo theo thời gian giảm dần
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
ON notifications (user_id, created_at DESC);

-- Index lọc theo loại thông báo
CREATE INDEX IF NOT EXISTS idx_notifications_user_type 
ON notifications (user_id, notification_type, created_at DESC);

-- 3. Phân quyền RBAC cho Module Thông báo
-- Thêm quyền notification.broadcast vào danh mục permissions
INSERT INTO permissions (resource, action, code, description)
SELECT 'notification', 'broadcast', 'notification.broadcast', 'Phát thông báo toàn công ty'
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'notification.broadcast');

-- Gán quyền cho các vai trò quản trị (Super Admin, HR Admin)
INSERT INTO role_permissions (role_id, permission_id, data_scope)
SELECT r.id, p.id, 'COMPANY'
FROM roles r
CROSS JOIN permissions p
WHERE r.code IN ('ROLE_SUPER_ADMIN', 'ROLE_HR_ADMIN', 'ROLE_HR_MANAGER')
  AND p.code = 'notification.broadcast'
  AND NOT EXISTS (
      SELECT 1 FROM role_permissions rp
      WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

