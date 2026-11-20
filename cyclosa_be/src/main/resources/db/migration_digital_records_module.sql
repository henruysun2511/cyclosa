-- =============================================================================
-- MIGRATION SCRIPT: MODULE 07 - SỐ HÓA VÀ LƯU KHO HỒ SƠ NHÂN SỰ (DIGITAL RECORDS)
-- Tiêu chuẩn: Thông tư 05/2025/TT-BNV, Luật Lưu trữ 2024, Luật Giao dịch điện tử
-- Kiến trúc: OAIS Reference Model (Gói SIP, Gói AIP bất biến, Gói DIP Watermark)
-- =============================================================================

-- 1. Bảng Chính sách lưu trữ hồ sơ (retention_policies)
CREATE TABLE IF NOT EXISTS retention_policies (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    retention_months INT NOT NULL, -- Thời hạn tính bằng tháng (ví dụ 60 tháng = 5 năm, 120 tháng = 10 năm, 840 tháng = 70 năm)
    start_event VARCHAR(30) NOT NULL, -- ARCHIVED_DATE, EMPLOYMENT_END_DATE, CONTRACT_END_DATE, DOCUMENT_EXPIRY_DATE
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_retention_policies_company ON retention_policies(company_id);
CREATE INDEX IF NOT EXISTS idx_retention_policies_start_event ON retention_policies(start_event);

-- 2. Bảng Danh mục loại tài liệu (document_types)
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL, -- CCCD, DEGREE, LABOR_CONTRACT, HEALTH_CHECK, CERTIFICATE, WORK_PERMIT, OTHER
    name VARCHAR(150) NOT NULL,
    retention_policy_id UUID REFERENCES retention_policies(id),
    is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_document_types_company_code UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_document_types_company ON document_types(company_id);
CREATE INDEX IF NOT EXISTS idx_document_types_policy ON document_types(retention_policy_id);

-- 3. Bảng Cấu hình trường Metadata động của loại tài liệu (document_metadata_fields)
CREATE TABLE IF NOT EXISTS document_metadata_fields (
    id UUID PRIMARY KEY,
    document_type_id UUID NOT NULL REFERENCES document_types(id) ON DELETE CASCADE,
    field_key VARCHAR(50) NOT NULL, -- id_number, full_name, issue_date, issue_place, expiry_date, major, university
    label VARCHAR(100) NOT NULL,
    data_type VARCHAR(20) NOT NULL, -- TEXT, DATE, NUMBER, BOOLEAN, SELECT
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    validation_regex VARCHAR(255),
    options_json TEXT, -- Danh sách lựa chọn nếu data_type = SELECT
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_doc_meta_type_field UNIQUE (document_type_id, field_key)
);

CREATE INDEX IF NOT EXISTS idx_document_metadata_fields_type ON document_metadata_fields(document_type_id);

-- 4. Bảng Bộ hồ sơ nhân viên gom nhóm (dossiers)
CREATE TABLE IF NOT EXISTS dossiers (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    dossier_code VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    purpose VARCHAR(30) NOT NULL DEFAULT 'RECRUITMENT', -- RECRUITMENT, CONTRACT, INSURANCE, MEDICAL, TERMINATION, OTHER
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CLOSED, ARCHIVED
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_dossiers_code UNIQUE (company_id, dossier_code)
);

CREATE INDEX IF NOT EXISTS idx_dossiers_employee ON dossiers(employee_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_company ON dossiers(company_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_purpose ON dossiers(purpose);

-- 5. Bảng Tệp gốc nguyên bản người dùng upload - Gói SIP (document_source_files)
CREATE TABLE IF NOT EXISTS document_source_files (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    file_id UUID, -- Liên kết module storage file nếu có
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    dpi INT, -- Tiêu chuẩn số hóa TT 05: >= 300 DPI
    total_pages INT NOT NULL DEFAULT 1,
    quality_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_CHECK', -- PENDING_CHECK, ACCEPTED, REJECTED
    rejection_reason TEXT,
    ocr_raw_text TEXT,
    ocr_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    uploaded_by_user_id UUID,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_source_company ON document_source_files(company_id);
CREATE INDEX IF NOT EXISTS idx_doc_source_quality ON document_source_files(quality_status);
CREATE INDEX IF NOT EXISTS idx_doc_source_ocr ON document_source_files(ocr_status);

-- 6. Bảng Tài liệu trung tâm lưu trữ - Gói AIP (documents)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    document_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    dossier_id UUID REFERENCES dossiers(id),
    document_type_id UUID NOT NULL REFERENCES document_types(id),
    employee_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, VERIFIED, PENDING_ARCHIVE, ARCHIVED, DESTROYED
    is_legal_hold BOOLEAN NOT NULL DEFAULT FALSE, -- Cờ bảo vệ tạm giữ pháp lý chống hủy
    issue_date DATE,
    expiry_date DATE,
    retention_policy_id UUID REFERENCES retention_policies(id),
    retention_until DATE, -- Ngày hết hạn lưu trữ
    
    -- Thẩm định metadata
    verified_by_user_id UUID,
    verified_at TIMESTAMP,
    
    -- Lưu kho chính thức
    archived_by_user_id UUID,
    archived_at TIMESTAMP,
    
    -- Ký số xác thực số hóa (Điều 9 Khoản 6 Thông tư 05/2025/TT-BNV)
    is_digitally_signed BOOLEAN NOT NULL DEFAULT FALSE,
    digitally_signed_at TIMESTAMP,
    signed_by_user_id UUID,
    digital_signature_value TEXT,
    
    -- Tiêu hủy
    destroyed_at TIMESTAMP,
    destruction_proposal_id UUID,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_documents_code UNIQUE (company_id, document_code)
);

CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_employee ON documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_documents_dossier ON documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_retention ON documents(retention_until);
CREATE INDEX IF NOT EXISTS idx_documents_legal_hold ON documents(is_legal_hold);

-- 7. Bảng Phiên bản tài liệu (document_versions)
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_no INT NOT NULL,
    source_file_id UUID REFERENCES document_source_files(id),
    file_url VARCHAR(500) NOT NULL,
    file_format VARCHAR(20) NOT NULL DEFAULT 'PDF_A', -- PDF_A, PDF, JPG, PNG
    file_size BIGINT NOT NULL DEFAULT 0,
    sha256_checksum VARCHAR(64) NOT NULL, -- Mã băm toàn vẹn SHA-256
    page_from INT NOT NULL DEFAULT 1,
    page_to INT NOT NULL DEFAULT 1,
    change_reason VARCHAR(255),
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_doc_versions_doc_no UNIQUE (document_id, version_no)
);

CREATE INDEX IF NOT EXISTS idx_document_versions_doc ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_checksum ON document_versions(sha256_checksum);

-- 8. Bảng Giá trị Metadata động đã bóc tách (document_metadata_values)
CREATE TABLE IF NOT EXISTS document_metadata_values (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES document_metadata_fields(id) ON DELETE CASCADE,
    value TEXT,
    ocr_confidence DECIMAL(5, 4) DEFAULT 1.0000, -- 0.0000 -> 1.0000 (độ tin cậy từ OCR)
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_doc_meta_val_doc_field UNIQUE (document_id, field_id)
);

CREATE INDEX IF NOT EXISTS idx_doc_meta_val_doc ON document_metadata_values(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_meta_val_field ON document_metadata_values(field_id);

-- 9. Bảng Lệnh tạm giữ pháp lý chống tiêu hủy (document_legal_holds)
CREATE TABLE IF NOT EXISTS document_legal_holds (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    document_id UUID NOT NULL REFERENCES documents(id),
    hold_code VARCHAR(50) NOT NULL,
    reason VARCHAR(30) NOT NULL, -- DISPUTE, AUDIT, INSPECTION, LEGAL_REQUEST, OTHER
    note TEXT NOT NULL,
    placed_by_user_id UUID NOT NULL,
    placed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    released_by_user_id UUID,
    released_at TIMESTAMP,
    release_note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_legal_holds_doc ON document_legal_holds(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_legal_holds_released ON document_legal_holds(released_at);

-- 10. Bảng Đề xuất tiêu hủy tài liệu hết hạn (destruction_proposals)
CREATE TABLE IF NOT EXISTS destruction_proposals (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    proposal_code VARCHAR(50) NOT NULL,
    retention_policy_id UUID REFERENCES retention_policies(id),
    proposed_by_employee_id UUID NOT NULL,
    reason TEXT NOT NULL,
    proposed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, COUNCIL_REVIEW, APPROVED, REJECTED, EXECUTED, CANCELLED
    required_approval_ratio DECIMAL(5, 2) NOT NULL DEFAULT 100.00, -- Mặc định 100% đồng thuận
    
    -- Thực thi tiêu hủy
    executed_by_user_id UUID,
    executed_at TIMESTAMP,
    evidence_file_url VARCHAR(500), -- Biên bản tiêu hủy kèm chữ ký hội đồng
    certificate_sha256 VARCHAR(64),
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_destruction_proposals_code UNIQUE (company_id, proposal_code)
);

CREATE INDEX IF NOT EXISTS idx_destruction_proposals_company ON destruction_proposals(company_id);
CREATE INDEX IF NOT EXISTS idx_destruction_proposals_status ON destruction_proposals(status);

-- 11. Bảng Danh mục tài liệu đề xuất hủy (destruction_proposal_items)
CREATE TABLE IF NOT EXISTS destruction_proposal_items (
    id UUID PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES destruction_proposals(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id),
    retention_until DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_destruct_prop_items UNIQUE (proposal_id, document_id)
);

CREATE INDEX IF NOT EXISTS idx_destruct_items_proposal ON destruction_proposal_items(proposal_id);
CREATE INDEX IF NOT EXISTS idx_destruct_items_doc ON destruction_proposal_items(document_id);

-- 12. Bảng Thành viên hội đồng xét hủy & biểu quyết (destruction_council_members)
CREATE TABLE IF NOT EXISTS destruction_council_members (
    id UUID PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES destruction_proposals(id) ON DELETE CASCADE,
    member_employee_id UUID NOT NULL,
    council_role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- CHAIRPERSON, SECRETARY, MEMBER
    vote VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVE, REJECT
    voted_at TIMESTAMP,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_destruct_council_member UNIQUE (proposal_id, member_employee_id)
);

CREATE INDEX IF NOT EXISTS idx_destruct_council_proposal ON destruction_council_members(proposal_id);
CREATE INDEX IF NOT EXISTS idx_destruct_council_member ON destruction_council_members(member_employee_id);

-- 13. Bảng Yêu cầu trích xuất & đóng gói hồ sơ có Watermark - Gói DIP (dossier_export_requests)
CREATE TABLE IF NOT EXISTS dossier_export_requests (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    dossier_id UUID REFERENCES dossiers(id),
    requested_by_user_id UUID NOT NULL,
    export_format VARCHAR(20) NOT NULL DEFAULT 'PDF_A_WATERMARKED', -- PDF_A_WATERMARKED, ZIP_AIP
    watermark_text VARCHAR(200),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, READY, FAILED
    download_url VARCHAR(500),
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dossier_export_company ON dossier_export_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_dossier_export_emp ON dossier_export_requests(employee_id);
