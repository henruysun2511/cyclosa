-- =============================================================================
-- MIGRATION: MODULE 04 - TUYỂN DỤNG & THU HÚT NHÂN TÀI (RECRUITMENT & TALENT ACQUISITION ATS)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng Đề xuất tuyển dụng nhân sự (Recruitment Request)
CREATE TABLE IF NOT EXISTS recruitment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    job_title_id UUID NOT NULL REFERENCES job_titles(id) ON DELETE RESTRICT,
    job_level_id UUID REFERENCES job_levels(id) ON DELETE SET NULL,
    requested_quantity INT NOT NULL CHECK (requested_quantity >= 1),
    justification TEXT NOT NULL,
    target_start_date DATE,
    requested_by_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_rec_req_company ON recruitment_requests(company_id, status);
CREATE INDEX IF NOT EXISTS idx_rec_req_dept ON recruitment_requests(department_id);
CREATE INDEX IF NOT EXISTS idx_rec_req_requester ON recruitment_requests(requested_by_employee_id);

-- 2. Bảng Vị trí tuyển dụng & JD (Job Openings)
CREATE TABLE IF NOT EXISTS job_openings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruitment_request_id UUID REFERENCES recruitment_requests(id) ON DELETE SET NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    job_title_id UUID NOT NULL REFERENCES job_titles(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    required_quantity INT NOT NULL CHECK (required_quantity >= 1),
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    requirements_version INT NOT NULL DEFAULT 1,
    benefits TEXT,
    salary_band_min NUMERIC(15, 2),
    salary_band_max NUMERIC(15, 2),
    is_salary_negotiable BOOLEAN NOT NULL DEFAULT true,
    work_location VARCHAR(255),
    deadline_date DATE NOT NULL,
    landing_slug VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_job_openings_company_status ON job_openings(company_id, status);
CREATE INDEX IF NOT EXISTS idx_job_openings_landing_slug ON job_openings(landing_slug);
CREATE INDEX IF NOT EXISTS idx_job_openings_dept ON job_openings(department_id);

-- 3. Bảng Kênh / Nguồn tuyển dụng (Recruitment Channels)
CREATE TABLE IF NOT EXISTS recruitment_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    channel_code VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_channel_company_code UNIQUE (company_id, channel_code)
);

-- 4. Bảng Tin đăng tuyển dụng trên các kênh (Job Postings)
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES recruitment_channels(id) ON DELETE RESTRICT,
    posted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    external_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_job_postings_job_channel ON job_postings(job_opening_id, channel_id);

-- 5. Bảng Hồ sơ ứng viên tổng thể (Candidates)
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address VARCHAR(255),
    resume_url VARCHAR(500),
    parsed_profile TEXT,
    ai_screening_consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_phone ON candidates(phone);

-- 6. Bảng Kinh nghiệm làm việc của ứng viên (Candidate Work Experiences)
CREATE TABLE IF NOT EXISTS candidate_work_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_cand_work_exp_cand ON candidate_work_experiences(candidate_id);

-- 7. Bảng Học vấn của ứng viên (Candidate Educations)
CREATE TABLE IF NOT EXISTS candidate_educations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    institution_name VARCHAR(150) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    major VARCHAR(100) NOT NULL,
    start_year INT,
    end_year INT,
    gpa VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_cand_edu_cand ON candidate_educations(candidate_id);

-- 8. Bảng Kỹ năng ứng viên (Candidate Skills)
CREATE TABLE IF NOT EXISTS candidate_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    years_experience INT,
    proficiency_level VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_cand_skills_cand ON candidate_skills(candidate_id);

-- 9. Bảng Ngân hàng hồ sơ tiềm năng (Talent Pool)
CREATE TABLE IF NOT EXISTS talent_pool_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    tag VARCHAR(100),
    note TEXT,
    added_by_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_talent_pool_cand ON talent_pool_entries(candidate_id);

-- 10. Bảng Đơn ứng tuyển vào vị trí (Applications & ATS Funnel)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE RESTRICT,
    job_opening_id UUID NOT NULL REFERENCES job_openings(id) ON DELETE RESTRICT,
    source_channel_id UUID REFERENCES recruitment_channels(id) ON DELETE SET NULL,
    referrer_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_stage VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    ai_match_score NUMERIC(5, 2),
    ai_match_reasoning TEXT,
    ai_confidence_level VARCHAR(20),
    ai_screened_at TIMESTAMP WITH TIME ZONE,
    ai_screened_requirements_version INT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_applications_job_stage ON applications(job_opening_id, current_stage);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);

-- 11. Bảng Lịch sử chuyển giai đoạn (Application Stage Transitions)
CREATE TABLE IF NOT EXISTS application_stage_transitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    from_stage VARCHAR(30),
    to_stage VARCHAR(30) NOT NULL,
    transitioned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transitioned_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_app_stage_trans_app ON application_stage_transitions(application_id);

-- 12. Bảng Các vòng phỏng vấn của vị trí tuyển dụng (Interview Rounds)
CREATE TABLE IF NOT EXISTS interview_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    round_no INT NOT NULL CHECK (round_no >= 1),
    round_type VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_interview_rounds_job ON interview_rounds(job_opening_id, round_no);

-- 13. Bảng Tiêu chí đánh giá của vòng phỏng vấn (Interview Criteria)
CREATE TABLE IF NOT EXISTS interview_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_round_id UUID NOT NULL REFERENCES interview_rounds(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    max_score INT NOT NULL DEFAULT 10,
    weight NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_interview_criteria_round ON interview_criteria(interview_round_id);

-- 14. Bảng Ngân hàng câu hỏi phỏng vấn (Interview Questions - Standard & AI Generated)
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_round_id UUID NOT NULL REFERENCES interview_rounds(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    expected_answer_guideline TEXT,
    is_ai_generated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_round ON interview_questions(interview_round_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_app ON interview_questions(application_id);

-- 15. Bảng Buổi phỏng vấn cụ thể (Interviews)
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    interview_round_id UUID NOT NULL REFERENCES interview_rounds(id) ON DELETE RESTRICT,
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    format VARCHAR(20) NOT NULL DEFAULT 'ONLINE',
    location_or_link VARCHAR(500) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_interviews_app ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled ON interviews(scheduled_start, scheduled_end);

-- 16. Bảng Hội đồng phỏng vấn (Interview Panelists)
CREATE TABLE IF NOT EXISTS interview_panelists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    is_lead_interviewer BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_panelist_interview_employee UNIQUE (interview_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_interview_panelists_emp ON interview_panelists(employee_id, interview_id);

-- 17. Bảng Phiếu đánh giá của giám khảo (Interview Scorecards - Blind Grading)
CREATE TABLE IF NOT EXISTS interview_scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    interviewer_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    overall_recommendation VARCHAR(30),
    general_notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_scorecard_interview_interviewer UNIQUE (interview_id, interviewer_employee_id)
);

CREATE INDEX IF NOT EXISTS idx_scorecards_interview ON interview_scorecards(interview_id);

-- 18. Bảng Điểm chi tiết theo từng tiêu chí (Scorecard Scores)
CREATE TABLE IF NOT EXISTS scorecard_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scorecard_id UUID NOT NULL REFERENCES interview_scorecards(id) ON DELETE CASCADE,
    criterion_id UUID NOT NULL REFERENCES interview_criteria(id) ON DELETE RESTRICT,
    score NUMERIC(4, 2) NOT NULL CHECK (score >= 0),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_score_scorecard_criterion UNIQUE (scorecard_id, criterion_id)
);

CREATE INDEX IF NOT EXISTS idx_scorecard_scores_scorecard ON scorecard_scores(scorecard_id);

-- 19. Bảng Cảnh báo AI về nội dung phỏng vấn không phù hợp (Interview Content Flags)
CREATE TABLE IF NOT EXISTS interview_content_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    flagged_content TEXT NOT NULL,
    reason TEXT NOT NULL,
    review_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reviewed_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_interview_content_flags_interview ON interview_content_flags(interview_id);

-- 20. Bảng Thư mời nhận việc (Offers)
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
    base_salary NUMERIC(15, 2) NOT NULL CHECK (base_salary > 0),
    expected_start_date DATE NOT NULL,
    response_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    template_version_id UUID,
    offer_letter_url VARCHAR(500),
    requires_executive_approval BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    decline_reason VARCHAR(50),
    decline_note TEXT,
    approved_by_user_id UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_offers_application ON offers(application_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

-- 21. Bảng Danh mục phụ cấp kèm theo Thư mời (Offer Allowances)
CREATE TABLE IF NOT EXISTS offer_allowances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    allowance_type VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_offer_allowances_offer ON offer_allowances(offer_id);

-- 22. Bảng Cơ hội việc làm & Dự án nội bộ (Internal Opportunities)
CREATE TABLE IF NOT EXISTS internal_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    job_opening_id UUID REFERENCES job_openings(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'OPEN_POSITION',
    description TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_internal_opp_company ON internal_opportunities(company_id, status);

-- 23. Bảng Nhân viên đăng ký tham gia cơ hội nội bộ (Internal Opportunity Applications)
CREATE TABLE IF NOT EXISTS internal_opportunity_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES internal_opportunities(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    motivation TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'INTERESTED',
    assigned_task TEXT,
    outcome_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_internal_opp_emp UNIQUE (opportunity_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_internal_opp_app_opp ON internal_opportunity_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_internal_opp_app_emp ON internal_opportunity_applications(employee_id);

-- 24. Bảng Nhật ký kiểm toán AI (AI Screening Logs)
CREATE TABLE IF NOT EXISTS ai_screening_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    redacted_input TEXT NOT NULL,
    ai_output TEXT NOT NULL,
    model_name VARCHAR(100),
    triggered_by_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_ai_screening_logs_app ON ai_screening_logs(application_id);

-- =============================================================================
-- DATA SEEDING: DỮ LIỆU NỀN TẢNG TUYỂN DỤNG
-- =============================================================================

-- Seed các kênh tuyển dụng mặc định cho các công ty hiện có
INSERT INTO recruitment_channels (id, company_id, name, channel_code, is_active, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    c.id,
    v.name,
    v.code,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM companies c
CROSS JOIN (
    VALUES 
        ('Cổng nghề nghiệp nội bộ (Career Portal)', 'CAREER_SITE'),
        ('Mạng tuyển dụng LinkedIn', 'LINKEDIN'),
        ('Cổng việc làm TopCV', 'TOPCV'),
        ('Cổng việc làm VietnamWorks', 'VIETNAMWORKS'),
        ('Chuyên trang việc làm CNTT ITViec', 'ITVIEC'),
        ('Giới thiệu nhân sự nội bộ (Referral)', 'INTERNAL_REFERRAL'),
        ('Kênh Săn đầu người (Headhunt)', 'HEADHUNT')
) AS v(name, code)
WHERE NOT EXISTS (
    SELECT 1 FROM recruitment_channels rc WHERE rc.company_id = c.id AND rc.channel_code = v.code
);
