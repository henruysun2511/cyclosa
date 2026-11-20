-- ====================================================================
-- MIGRATION SCRIPT: MODULE 18 - TRỢ LÝ AI (AI ASSISTANT & CHATBOT)
-- Chuẩn hóa CSDL cho Hội thoại 1-1, RAG Kho tri thức và Kiểm toán Token
-- ====================================================================

-- 1. Bảng Quản lý Phiên hội thoại (ai_conversations)
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_conv_company_id ON ai_conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_conv_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conv_status ON ai_conversations(status);
CREATE INDEX IF NOT EXISTS idx_ai_conv_created_at ON ai_conversations(created_at DESC);

-- 2. Bảng Tin nhắn trong hội thoại (ai_messages)
CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,
    response_type VARCHAR(50), -- OUT_OF_SCOPE, FUNCTION_CALLING, RAG_POLICY, FALLBACK_NO_DATA
    function_calls TEXT, -- Chuỗi JSON lưu chi tiết các hàm đã gọi
    source_documents TEXT, -- Chuỗi JSON lưu danh sách tài liệu/điều khoản trích dẫn
    chart_config TEXT, -- Chuỗi JSON lưu cấu hình biểu đồ (bar, line, pie)
    token_usage INTEGER,
    feedback VARCHAR(20), -- HELPFUL, NOT_HELPFUL
    feedback_note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_msg_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_msg_role ON ai_messages(role);
CREATE INDEX IF NOT EXISTS idx_ai_msg_created_at ON ai_messages(created_at ASC);

-- 3. Bảng Nhật ký phân loại ý định (ai_intent_logs)
CREATE TABLE IF NOT EXISTS ai_intent_logs (
    id UUID PRIMARY KEY,
    message_id UUID REFERENCES ai_messages(id) ON DELETE SET NULL,
    classified_intent VARCHAR(50) NOT NULL, -- IN_SCOPE_DATA, IN_SCOPE_POLICY, OUT_OF_SCOPE
    confidence_score DECIMAL(5,4),
    latency_ms INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_intent_msg_id ON ai_intent_logs(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_intent_type ON ai_intent_logs(classified_intent);

-- 4. Bảng Văn bản Tri thức nội bộ (knowledge_base_documents)
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    title VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL, -- HR_POLICY, EMPLOYEE_HANDBOOK, SYSTEM_GUIDE, LEGAL_COMPLIANCE
    version VARCHAR(30) NOT NULL DEFAULT 'v1.0',
    file_url VARCHAR(1000),
    file_size BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- PROCESSING, ACTIVE, ARCHIVED
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    updated_by UUID,
    archived_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kb_doc_company_id ON knowledge_base_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_kb_doc_category ON knowledge_base_documents(category);
CREATE INDEX IF NOT EXISTS idx_kb_doc_status ON knowledge_base_documents(status);

-- 5. Bảng Đoạn trích & Vector Embeddings (knowledge_base_chunks)
CREATE TABLE IF NOT EXISTS knowledge_base_chunks (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES knowledge_base_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    section_ref VARCHAR(150),
    content TEXT NOT NULL,
    embedding_json TEXT, -- Mảng float vector lưu dạng JSON text phục vụ tìm kiếm tương đồng
    token_count INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kb_chunks_doc_id ON knowledge_base_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_kb_chunks_index ON knowledge_base_chunks(document_id, chunk_index);

-- 6. Bảng Kho câu hỏi chưa có lời giải (ai_unanswered_questions)
CREATE TABLE IF NOT EXISTS ai_unanswered_questions (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    message_id UUID REFERENCES ai_messages(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    cluster_id UUID,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, DOCUMENT_ADDED, DISMISSED
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    resolved_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_unanswered_company ON ai_unanswered_questions(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_unanswered_status ON ai_unanswered_questions(status);
CREATE INDEX IF NOT EXISTS idx_ai_unanswered_cluster ON ai_unanswered_questions(cluster_id);

-- 7. Bảng Nhật ký tương tác & Đo lường Token (ai_interaction_logs)
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    user_id UUID REFERENCES users(id),
    feature VARCHAR(50) NOT NULL, -- CHATBOT, CV_SCREENING, ONBOARDING_OCR
    model_name VARCHAR(100),
    latency_ms INTEGER,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    status VARCHAR(30) NOT NULL, -- SUCCESS, LOW_CONFIDENCE, FAILED, TIMEOUT
    error_code VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_log_company ON ai_interaction_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_user ON ai_interaction_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_feature ON ai_interaction_logs(feature);
CREATE INDEX IF NOT EXISTS idx_ai_log_created_at ON ai_interaction_logs(created_at DESC);


-- ====================================================================
-- SEED DATA BAN ĐẦU CHO PHÂN HỆ AI (RAG KNOWLEDGE & KNOWLEDGE GAPS)
-- ====================================================================

-- 1. Seed Kho văn bản tri thức (knowledge_base_documents)
INSERT INTO knowledge_base_documents (id, company_id, title, category, version, status, created_at)
VALUES 
    ('11111111-2222-3333-4444-555555555501'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Quy chế Quản lý Thời gian làm việc, Nghỉ phép & Làm việc từ xa (WFH) 2026', 'HR_POLICY', 'v2.0', 'ACTIVE', NOW()),
    ('11111111-2222-3333-4444-555555555502'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Sổ tay Văn hóa Doanh nghiệp & Quy tắc Ứng xử CYCLOSA', 'EMPLOYEE_HANDBOOK', 'v1.5', 'ACTIVE', NOW()),
    ('11111111-2222-3333-4444-555555555503'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Quy chế Khen thưởng, Kỷ luật Lao động & Trách nhiệm Vật chất', 'LEGAL_COMPLIANCE', 'v1.0', 'ACTIVE', NOW()),
    ('11111111-2222-3333-4444-555555555504'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Hướng dẫn Sử dụng Cổng Tự phục vụ Nhân viên (ESS Portal)', 'SYSTEM_GUIDE', 'v1.0', 'ACTIVE', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Chunks RAG cho các văn bản
INSERT INTO knowledge_base_chunks (id, document_id, chunk_index, section_ref, content, token_count, created_at)
VALUES
    ('22222222-3333-4444-5555-666666666601'::uuid, '11111111-2222-3333-4444-555555555501'::uuid, 0, 'Điều 8: Làm việc từ xa (WFH)', 'Nhân viên chính thức được phép đăng ký tối đa 2 ngày làm việc từ xa (WFH) mỗi tuần, cần được Quản lý trực tiếp phê duyệt trước 17:00 ngày hôm trước.', 45, NOW()),
    ('22222222-3333-4444-5555-666666666602'::uuid, '11111111-2222-3333-4444-555555555501'::uuid, 1, 'Điều 12: Chế độ nghỉ phép năm', 'Mỗi nhân viên có 12 ngày phép năm hưởng nguyên lương. Cứ mỗi 5 năm làm việc liên tục được cộng thêm 1 ngày phép thâm niên theo Luật Lao động.', 48, NOW()),
    ('22222222-3333-4444-5555-666666666603'::uuid, '11111111-2222-3333-4444-555555555502'::uuid, 0, 'Chương 2: Quy tắc ứng xử và bảo mật thông tin', 'Cán bộ nhân viên tuyệt đối không tiết lộ thông tin lương, dữ liệu khách hàng hoặc tài sản trí tuệ của doanh nghiệp ra ngoài dưới mọi hình thức.', 42, NOW()),
    ('22222222-3333-4444-5555-666666666604'::uuid, '11111111-2222-3333-4444-555555555503'::uuid, 0, 'Điều 15: Các hình thức khen thưởng định kỳ', 'Công ty xét khen thưởng Ngôi sao tháng, Nhân viên xuất sắc Quý và Dự án cống hiến đặc biệt với mức thưởng từ 1 đến 5 tháng lương cơ bản.', 46, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Câu hỏi chưa có lời giải (ai_unanswered_questions)
INSERT INTO ai_unanswered_questions (id, company_id, question_text, status, created_at)
VALUES
    ('33333333-4444-5555-6666-777777777701'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Chính sách hỗ trợ tài chính cho nhân viên học và thi chứng chỉ quốc tế (PMP, AWS, CFA) như thế nào?', 'PENDING_REVIEW', NOW() - INTERVAL '2 hours'),
    ('33333333-4444-5555-6666-777777777702'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Công ty có hỗ trợ phụ cấp gửi xe ô tô tại chi nhánh miền Nam không?', 'PENDING_REVIEW', NOW() - INTERVAL '5 hours'),
    ('33333333-4444-5555-6666-777777777703'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Quy định về thời gian nghỉ phép kết hôn có được cộng thêm ngày phép năm không?', 'DOCUMENT_ADDED', NOW() - INTERVAL '1 day'),
    ('33333333-4444-5555-6666-777777777704'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Có được mang thú cưng đến văn phòng làm việc vào ngày thứ Sáu không?', 'DISMISSED', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;
