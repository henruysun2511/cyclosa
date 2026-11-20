package com.cyclosa.document.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@Order(30)
@RequiredArgsConstructor
public class DigitalRecordsDataSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public static final UUID DEFAULT_COMPANY_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Override
    @Transactional
    public void run(String... args) {
        try {
            // 1. Tự động kiểm tra và thực thi migration script tạo bảng
            ClassPathResource resource = new ClassPathResource("db/migration_digital_records_module.sql");
            if (resource.exists()) {
                String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                jdbcTemplate.execute(sql);
                log.info("Khởi tạo cấu trúc bảng Module 07 (Digital Records) thành công.");
            }

            // 2. Bổ sung quyền phân hệ Digital Records
            seedPermissions();

            // 3. Kiểm tra xem đã có dữ liệu mẫu tài liệu chưa
            Integer docCount = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM documents WHERE company_id = ?",
                    Integer.class,
                    DEFAULT_COMPANY_ID
            );

            if (docCount != null && docCount > 0) {
                log.info("Dữ liệu mẫu Module 07 (Digital Records) đã tồn tại ({} tài liệu), bỏ qua Seeding.", docCount);
                return;
            }

            log.info("Bắt đầu khởi tạo dữ liệu mẫu Module 07 - Số hóa & Lưu trữ hồ sơ nhân sự (TT 05/2025/TT-BNV)...");
            seedSampleData();
            log.info("Khởi tạo dữ liệu mẫu Module 07 hoàn tất thành công!");

        } catch (Exception e) {
            log.error("Lỗi khi khởi tạo dữ liệu mẫu Module 07: {}", e.getMessage(), e);
        }
    }

    private void seedPermissions() {
        String permSql = """
            INSERT INTO permissions (resource, action, code, description) VALUES
            ('DIGITAL_RECORD', 'VIEW', 'digital_record.view', 'Xem danh sách tài liệu số hóa và kho lưu trữ'),
            ('DIGITAL_RECORD', 'CREATE', 'digital_record.create', 'Khởi tạo tài liệu số hóa và tải tệp scan gốc'),
            ('DIGITAL_RECORD', 'UPDATE', 'digital_record.update', 'Cập nhật tài liệu, thẩm định OCR và tải phiên bản mới'),
            ('DIGITAL_RECORD', 'DELETE', 'digital_record.delete', 'Xóa tài liệu số hóa nháp'),
            ('DIGITAL_RECORD', 'ARCHIVE', 'digital_record.archive', 'Nộp lưu kho bất biến AIP và ký số TT 05'),
            ('DIGITAL_RECORD', 'LEGAL_HOLD', 'digital_record.legal_hold', 'Ban hành và gỡ bỏ lệnh tạm giữ pháp lý'),
            ('DIGITAL_RECORD', 'DESTROY', 'digital_record.destroy', 'Đề xuất và thực thi tiêu hủy tài liệu hết hạn')
            ON CONFLICT (code) DO NOTHING;

            INSERT INTO role_permissions (role_id, permission_id, data_scope)
            SELECT r.id, p.id, 'ALL'
            FROM roles r
            CROSS JOIN permissions p
            WHERE r.code IN ('SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'HR_MANAGER', 'OFFICE_ADMIN')
              AND p.code LIKE 'digital_record.%'
            ON CONFLICT DO NOTHING;

            INSERT INTO role_permissions (role_id, permission_id, data_scope)
            SELECT r.id, p.id, 'ALL'
            FROM roles r
            CROSS JOIN permissions p
            WHERE r.code IN ('EMPLOYEE', 'MANAGER', 'HR_SPECIALIST', 'AUDITOR', 'RECRUITER')
              AND p.code IN ('digital_record.view', 'digital_record.create', 'digital_record.update')
            ON CONFLICT DO NOTHING;
            """;
        jdbcTemplate.execute(permSql);
    }

    private void seedSampleData() {
        // 3.1. CHÍNH SÁCH LƯU TRỮ (RETENTION POLICIES)
        UUID polContract = UUID.randomUUID();
        UUID polCccd = UUID.randomUUID();
        UUID polRecruit = UUID.randomUUID();
        UUID polHealth = UUID.randomUUID();
        UUID polInsurance = UUID.randomUUID();

        insertRetentionPolicy(polContract, "Chính sách lưu trữ Hợp đồng lao động & Phụ lục", "Thời hạn bảo quản 10 năm kể từ ngày hết hiệu lực hợp đồng theo Luật Lao động", 120, "CONTRACT_END_DATE");
        insertRetentionPolicy(polCccd, "Chính sách bảo quản CCCD & Giấy tờ định danh", "Bảo quản 5 năm kể từ ngày hết hạn CCCD hoặc ngày cập nhật bản mới", 60, "DOCUMENT_EXPIRY_DATE");
        insertRetentionPolicy(polRecruit, "Chính sách lưu trữ Hồ sơ tuyển dụng ứng viên", "Bảo quản 2 năm phục vụ đối chiếu và kiểm toán tuyển dụng", 24, "ARCHIVED_DATE");
        insertRetentionPolicy(polHealth, "Chính sách lưu giữ Giấy khám sức khỏe định kỳ", "Thời hạn bảo quản 12 tháng kể từ ngày nộp lưu hồ sơ y tế", 12, "ARCHIVED_DATE");
        insertRetentionPolicy(polInsurance, "Chính sách lưu trữ Sổ BHXH & Quyết định nhân sự trọn đời", "Lưu trữ lâu dài 70 năm sau khi nhân viên nghỉ hưu", 840, "EMPLOYMENT_END_DATE");

        // 3.2. DANH MỤC LOẠI TÀI LIỆU (DOCUMENT TYPES)
        UUID typeCccd = UUID.randomUUID();
        UUID typeDegree = UUID.randomUUID();
        UUID typeContract = UUID.randomUUID();
        UUID typeHealth = UUID.randomUUID();

        insertDocumentType(typeCccd, "CCCD", "Căn cước công dân / Hộ chiếu nhân sự", polCccd, true, "Giấy tờ định danh cá nhân nhạy cảm cao, áp dụng PII Redaction");
        insertDocumentType(typeDegree, "DEGREE", "Bằng tốt nghiệp Đại học / Chứng chỉ", polContract, false, "Văn bằng, chứng chỉ chuyên môn của nhân viên");
        insertDocumentType(typeContract, "LABOR_CONTRACT", "Hợp đồng lao động điện tử", polContract, true, "HĐLĐ chính thức ký số có giá trị pháp lý tương đương bản giấy");
        insertDocumentType(typeHealth, "HEALTH_CHECK", "Giấy chứng nhận sức khỏe", polHealth, false, "Hồ sơ y tế kiểm tra sức khỏe hàng năm");

        // 3.3. TRƯỜNG DỮ LIỆU ĐỘNG OCR (METADATA FIELDS)
        insertMetadataField(typeCccd, "id_number", "Số CCCD (12 chữ số)", "TEXT", true, 1);
        insertMetadataField(typeCccd, "full_name", "Họ và tên", "TEXT", true, 2);
        insertMetadataField(typeCccd, "date_of_birth", "Ngày sinh", "DATE", true, 3);
        insertMetadataField(typeCccd, "place_of_origin", "Quê quán", "TEXT", false, 4);
        insertMetadataField(typeCccd, "issue_date", "Ngày cấp", "DATE", true, 5);
        insertMetadataField(typeCccd, "expiry_date", "Ngày hết hạn", "DATE", true, 6);

        insertMetadataField(typeDegree, "school_name", "Tên cơ sở giáo dục", "TEXT", true, 1);
        insertMetadataField(typeDegree, "major", "Ngành đào tạo", "TEXT", true, 2);
        insertMetadataField(typeDegree, "degree_level", "Hệ đào tạo", "TEXT", true, 3);
        insertMetadataField(typeDegree, "graduation_year", "Năm tốt nghiệp", "NUMBER", true, 4);
        insertMetadataField(typeDegree, "ranking", "Xếp loại tốt nghiệp", "TEXT", false, 5);

        insertMetadataField(typeContract, "contract_number", "Số hợp đồng", "TEXT", true, 1);
        insertMetadataField(typeContract, "contract_type", "Loại hợp đồng", "TEXT", true, 2);
        insertMetadataField(typeContract, "job_title", "Chức danh đảm nhận", "TEXT", true, 3);
        insertMetadataField(typeContract, "base_salary", "Mức lương chính (VNĐ)", "NUMBER", true, 4);
        insertMetadataField(typeContract, "start_date", "Ngày có hiệu lực", "DATE", true, 5);

        // 3.4. LẤY DANH SÁCH NHÂN VIÊN MẪU
        List<Map<String, Object>> employees = jdbcTemplate.queryForList(
                "SELECT id, first_name, last_name, employee_code, user_id FROM employees WHERE company_id = ? LIMIT 5",
                DEFAULT_COMPANY_ID
        );

        if (employees.isEmpty()) {
            log.warn("Chưa có nhân viên trong hệ thống, bỏ qua seeding tài liệu cá nhân.");
            return;
        }

        Map<String, Object> emp1 = employees.get(0);
        UUID emp1Id = (UUID) emp1.get("id");
        UUID userId1 = (UUID) emp1.get("user_id");

        Map<String, Object> emp2 = employees.size() > 1 ? employees.get(1) : emp1;
        UUID emp2Id = (UUID) emp2.get("id");

        // 3.5. BỘ HỒ SƠ (DOSSIERS)
        UUID dossier1 = UUID.randomUUID();
        UUID dossier2 = UUID.randomUUID();

        insertDossier(dossier1, emp1Id, "DOS-RECRUIT-001", "Bộ Hồ sơ Hội nhập & Tuyển dụng ban đầu", "RECRUITMENT");
        insertDossier(dossier2, emp2Id, "DOS-LEGAL-002", "Bộ Hồ sơ Hợp đồng & Pháp lý Nhân sự", "CONTRACT");

        // 3.6. CÁC TÀI LIỆU SỐ HÓA (DOCUMENTS) ĐỦ 4 TRẠNG THÁI (RULE TT 05)
        // Tài liệu 1: CCCD đã ký số, đã lưu kho AIP (ARCHIVED)
        UUID doc1 = UUID.randomUUID();
        insertDocument(doc1, dossier1, typeCccd, emp1Id, "DOC-CCCD-2026-001", "Căn cước công dân - " + emp1.get("last_name") + " " + emp1.get("first_name"),
                "ARCHIVED", false, true, LocalDate.of(2021, 5, 10), LocalDate.of(2036, 5, 10), LocalDate.of(2031, 5, 10));

        // Tài liệu 2: HĐLĐ đã nộp lưu kho an toàn (ARCHIVED)
        UUID doc2 = UUID.randomUUID();
        insertDocument(doc2, dossier2, typeContract, emp2Id, "DOC-HDLD-2026-002", "Hợp đồng lao động Không xác định thời hạn",
                "ARCHIVED", false, true, LocalDate.of(2023, 1, 1), null, LocalDate.of(2033, 1, 1));

        // Tài liệu 3: Bằng tốt nghiệp đại học đã thẩm định OCR (VERIFIED)
        UUID doc3 = UUID.randomUUID();
        insertDocument(doc3, dossier1, typeDegree, emp1Id, "DOC-DEG-2026-003", "Bằng Kỹ sư Công nghệ Thông tin - ĐH Bách Khoa",
                "VERIFIED", false, false, LocalDate.of(2020, 6, 20), null, null);

        // Tài liệu 4: Giấy khám sức khỏe định kỳ bản nháp (DRAFT)
        UUID doc4 = UUID.randomUUID();
        insertDocument(doc4, dossier1, typeHealth, emp1Id, "DOC-MED-2026-004", "Giấy khám sức khỏe định kỳ năm 2026",
                "DRAFT", false, false, LocalDate.of(2026, 1, 15), LocalDate.of(2027, 1, 15), null);

        // Tài liệu 5: CCCD đang bị TẠM GIỮ PHÁP LÝ (LEGAL HOLD)
        UUID doc5 = UUID.randomUUID();
        insertDocument(doc5, dossier2, typeCccd, emp2Id, "DOC-CCCD-HOLD-005", "Bản sao CCCD đính kèm phụ lục (Đang tranh chấp)",
                "ARCHIVED", true, true, LocalDate.of(2022, 3, 15), LocalDate.of(2037, 3, 15), LocalDate.of(2032, 3, 15));

        // Tài liệu 6: Hợp đồng cộng tác viên cũ ĐÃ HẾT HẠN LƯU TRỮ (Ứng viên tiêu hủy)
        UUID doc6 = UUID.randomUUID();
        insertDocument(doc6, dossier2, typeContract, emp2Id, "DOC-CTV-EXPIRED-006", "Hợp đồng cộng tác viên thử nghiệm dự án 2020",
                "ARCHIVED", false, true, LocalDate.of(2020, 1, 1), LocalDate.of(2020, 12, 31), LocalDate.of(2025, 12, 31));

        // 3.7. BAN HÀNH LỆNH TẠM GIỮ PHÁP LÝ CHO DOC 5
        UUID holdId = UUID.randomUUID();
        UUID placedUserId = userId1 != null ? userId1 : UUID.randomUUID();
        jdbcTemplate.update("""
            INSERT INTO document_legal_holds (id, company_id, document_id, hold_code, reason, note, placed_by_user_id, placed_at, created_at)
            VALUES (?, ?, ?, 'HOLD-AUDIT-2026-001', 'AUDIT', 'Tạm giữ tài liệu phục vụ đợt kiểm toán độc lập tuân thủ Luật Lao động Q1/2026', ?, NOW(), NOW())
            """, holdId, DEFAULT_COMPANY_ID, doc5, placedUserId);

        // 3.8. LẬP 1 ĐỀ XUẤT TIÊU HỦY MẪU (COUNCIL REVIEW) CHO TÀI LIỆU HẾT HẠN DOC 6
        UUID proposalId = UUID.randomUUID();
        jdbcTemplate.update("""
            INSERT INTO destruction_proposals (id, company_id, proposal_code, retention_policy_id, proposed_by_employee_id, reason, status, required_approval_ratio, proposed_at, created_at)
            VALUES (?, ?, 'PROP-DEST-2026-001', ?, ?, 'Hợp đồng cộng tác viên đã lưu kho đủ 5 năm theo quy định và đã hết thời hạn bảo quản bắt buộc.', 'COUNCIL_REVIEW', 100.00, NOW(), NOW())
            """, proposalId, DEFAULT_COMPANY_ID, polContract, emp1Id);

        jdbcTemplate.update("""
            INSERT INTO destruction_proposal_items (id, proposal_id, document_id, retention_until, created_at)
            VALUES (?, ?, ?, ?, NOW())
            """, UUID.randomUUID(), proposalId, doc6, LocalDate.of(2025, 12, 31));

        jdbcTemplate.update("""
            INSERT INTO destruction_council_members (id, proposal_id, member_employee_id, council_role, vote, voted_at, comment, created_at)
            VALUES (?, ?, ?, 'CHAIRPERSON', 'APPROVE', NOW(), 'Hồ sơ đã hết thời hiệu tranh chấp và lưu trữ, đồng ý tiêu hủy theo TT 05.', NOW())
            """, UUID.randomUUID(), proposalId, emp1Id);
    }

    private void insertRetentionPolicy(UUID id, String name, String desc, int months, String startEvent) {
        jdbcTemplate.update("""
            INSERT INTO retention_policies (id, company_id, name, description, retention_months, start_event, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW())
            ON CONFLICT DO NOTHING
            """, id, DEFAULT_COMPANY_ID, name, desc, months, startEvent);
    }

    private void insertDocumentType(UUID id, String code, String name, UUID policyId, boolean sensitive, String desc) {
        jdbcTemplate.update("""
            INSERT INTO document_types (id, company_id, code, name, retention_policy_id, is_sensitive, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ON CONFLICT DO NOTHING
            """, id, DEFAULT_COMPANY_ID, code, name, policyId, sensitive, desc);
    }

    private void insertMetadataField(UUID typeId, String key, String label, String dataType, boolean required, int order) {
        jdbcTemplate.update("""
            INSERT INTO document_metadata_fields (id, document_type_id, field_key, label, data_type, is_required, display_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ON CONFLICT DO NOTHING
            """, UUID.randomUUID(), typeId, key, label, dataType, required, order);
    }

    private void insertDossier(UUID id, UUID empId, String code, String title, String purpose) {
        jdbcTemplate.update("""
            INSERT INTO dossiers (id, company_id, employee_id, dossier_code, title, purpose, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', NOW())
            ON CONFLICT DO NOTHING
            """, id, DEFAULT_COMPANY_ID, empId, code, title, purpose);
    }

    private void insertDocument(UUID id, UUID dossierId, UUID typeId, UUID empId, String code, String title,
                               String status, boolean isHold, boolean isSigned, LocalDate issue, LocalDate expiry, LocalDate retainUntil) {
        jdbcTemplate.update("""
            INSERT INTO documents (id, company_id, dossier_id, document_type_id, employee_id, document_code, title,
                                  status, is_legal_hold, is_digitally_signed, digitally_signed_at,
                                  issue_date, expiry_date, retention_until, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? THEN NOW() ELSE NULL END, ?, ?, ?, NOW())
            ON CONFLICT DO NOTHING
            """, id, DEFAULT_COMPANY_ID, dossierId, typeId, empId, code, title,
                status, isHold, isSigned, isSigned, issue, expiry, retainUntil);

        // Tạo 1 version mẫu
        UUID verId = UUID.randomUUID();
        jdbcTemplate.update("""
            INSERT INTO document_versions (id, document_id, version_no, file_url, file_format, file_size, sha256_checksum, page_from, page_to, is_current, created_at)
            VALUES (?, ?, 1, 'https://res.cloudinary.com/cyclosa/image/upload/sample_doc.pdf', 'PDF_A', 1048576,
                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 1, 1, TRUE, NOW())
            ON CONFLICT DO NOTHING
            """, verId, id);
    }
}
