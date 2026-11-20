package com.cyclosa.authorization.security;

import com.cyclosa.common.enums.DataScope;
import com.cyclosa.common.enums.UserRole;
import com.cyclosa.authorization.entity.Permission;
import com.cyclosa.authorization.entity.Role;
import com.cyclosa.authorization.entity.RolePermission;
import com.cyclosa.authorization.repository.PermissionRepository;
import com.cyclosa.authorization.repository.RolePermissionRepository;
import com.cyclosa.authorization.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class RolePermissionDataInitializer implements ApplicationRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Bắt đầu kiểm tra và khởi tạo dữ liệu mặc định cho Module Phân quyền...");
        Map<String, Permission> permMap = initPermissions();
        initSystemRoles(permMap);
        log.info("Hoàn tất khởi tạo dữ liệu mặc định cho Module Phân quyền.");
    }

    private Map<String, Permission> initPermissions() {
        List<PermissionDefinition> definitions = List.of(
                // USER
                new PermissionDefinition("USER", "VIEW", "user.view", "Xem danh sách và chi tiết người dùng"),
                new PermissionDefinition("USER", "CREATE", "user.create", "Tạo mới tài khoản người dùng"),
                new PermissionDefinition("USER", "UPDATE", "user.update", "Cập nhật thông tin tài khoản"),
                new PermissionDefinition("USER", "DELETE", "user.delete", "Khóa / Xóa tài khoản người dùng"),
                new PermissionDefinition("USER", "ACTIVATE", "user.activate", "Kích hoạt tài khoản nhân viên"),

                // ROLE
                new PermissionDefinition("ROLE", "VIEW", "role.view", "Xem danh sách vai trò và ma trận quyền"),
                new PermissionDefinition("ROLE", "MANAGE", "role.manage", "Tạo, cập nhật và thiết lập quyền cho vai trò"),
                new PermissionDefinition("ROLE", "ASSIGN", "role.assign", "Gán hoặc thu hồi vai trò của người dùng"),

                // ORGANIZATION
                new PermissionDefinition("ORG", "VIEW", "org.view", "Xem cơ cấu tổ chức và sơ đồ phòng ban"),
                new PermissionDefinition("ORG", "MANAGE", "org.manage", "Quản lý cơ cấu tổ chức, phòng ban, chi nhánh"),
                new PermissionDefinition("ORG", "SIMULATE", "org.simulate", "Mô phỏng tái cơ cấu tổ chức"),

                // EMPLOYEE
                new PermissionDefinition("EMPLOYEE", "VIEW", "employee.view", "Xem thông tin hồ sơ nhân viên"),
                new PermissionDefinition("EMPLOYEE", "CREATE", "employee.create", "Thêm mới hồ sơ nhân sự"),
                new PermissionDefinition("EMPLOYEE", "UPDATE", "employee.update", "Cập nhật hồ sơ nhân sự"),
                new PermissionDefinition("EMPLOYEE", "DELETE", "employee.delete", "Xóa / Lưu trữ hồ sơ nhân sự"),

                // LEAVE
                new PermissionDefinition("LEAVE", "VIEW", "leave.view", "Xem đơn nghỉ phép"),
                new PermissionDefinition("LEAVE", "APPLY", "leave.apply", "Tạo và gửi đơn xin nghỉ phép"),
                new PermissionDefinition("LEAVE", "APPROVE", "leave.approve", "Phê duyệt hoặc từ chối đơn nghỉ phép"),
                new PermissionDefinition("LEAVE", "MANAGE", "leave.manage", "Quản trị cấu hình và quỹ phép doanh nghiệp"),
                new PermissionDefinition("LEAVE", "CONFIG", "leave.config", "Cấu hình loại nghỉ và chính sách nghỉ phép"),

                // ATTENDANCE
                new PermissionDefinition("ATTENDANCE", "VIEW", "attendance.view", "Xem dữ liệu chấm công"),
                new PermissionDefinition("ATTENDANCE", "CHECKIN", "attendance.checkin", "Thực hiện chấm công hàng ngày"),
                new PermissionDefinition("ATTENDANCE", "MANAGE", "attendance.manage", "Chốt ca, đối soát và điều chỉnh chấm công"),
                new PermissionDefinition("ATTENDANCE", "SHIFT_MANAGE", "attendance.shift_manage", "Quản lý ca làm việc và phân ca"),
                new PermissionDefinition("ATTENDANCE", "APPROVE", "attendance.approve", "Phê duyệt đơn giải trình chấm công"),
                new PermissionDefinition("ATTENDANCE", "PERIOD_MANAGE", "attendance.period_manage", "Quản lý mở và khóa sổ kỳ công tháng"),
                new PermissionDefinition("ATTENDANCE", "PERIOD_UNLOCK", "attendance.period_unlock", "Mở khóa kỳ công tháng có kiểm soát"),
                new PermissionDefinition("ATTENDANCE", "EXPORT", "attendance.export", "Xuất báo cáo và bảng công tháng"),

                // PAYROLL
                new PermissionDefinition("PAYROLL", "VIEW", "payroll.view", "Xem bảng tính lương tổng hợp"),
                new PermissionDefinition("PAYROLL", "PROCESS", "payroll.process", "Tính toán, phê duyệt và chi trả lương"),
                new PermissionDefinition("PAYROLL", "VIEW_SALARY", "payroll.view_salary", "Xem chi tiết mức lương và thu nhập nhân sự"),

                // CONTRACT
                new PermissionDefinition("CONTRACT", "VIEW", "contract.view", "Xem hợp đồng lao động"),
                new PermissionDefinition("CONTRACT", "CREATE", "contract.create", "Tạo mới và gia hạn hợp đồng"),
                new PermissionDefinition("CONTRACT", "SIGN", "contract.sign", "Ký duyệt hợp đồng lao động"),

                // RECRUITMENT
                new PermissionDefinition("RECRUITMENT", "VIEW", "recruitment.view", "Xem tin tuyển dụng và hồ sơ ứng viên"),
                new PermissionDefinition("RECRUITMENT", "CREATE", "recruitment.create", "Đăng tin tuyển dụng mới"),
                new PermissionDefinition("RECRUITMENT", "MANAGE", "recruitment.manage", "Điều phối ứng viên, phỏng vấn và đánh giá"),
                new PermissionDefinition("RECRUITMENT_REQUEST", "CREATE", "recruitment_request.create", "Lập đề xuất tuyển dụng nhân sự"),
                new PermissionDefinition("RECRUITMENT_REQUEST", "VIEW", "recruitment_request.view", "Xem danh sách và tiến trình đề xuất tuyển dụng"),
                new PermissionDefinition("CANDIDATE", "VIEW", "candidate.view", "Xem hồ sơ và lý lịch ứng viên"),
                new PermissionDefinition("CANDIDATE", "MANAGE", "candidate.manage", "Quản lý và cập nhật hồ sơ ứng viên"),
                new PermissionDefinition("APPLICATION", "AI_SCREEN", "application.ai_screen", "Kích hoạt AI sàng lọc hồ sơ ứng viên"),
                new PermissionDefinition("INTERVIEW", "VIEW", "interview.view", "Xem lịch và kết quả phỏng vấn"),
                new PermissionDefinition("INTERVIEW", "MANAGE", "interview.manage", "Điều phối và thiết lập lịch phỏng vấn"),
                new PermissionDefinition("OFFER", "VIEW", "offer.view", "Xem danh sách và chi tiết Thư mời nhận việc"),
                new PermissionDefinition("OFFER", "MANAGE", "offer.manage", "Soạn thảo và gửi Thư mời nhận việc"),
                new PermissionDefinition("OFFER", "APPROVE", "offer.approve", "Phê duyệt chế độ đãi ngộ Thư mời nhận việc"),

                // ONBOARDING
                new PermissionDefinition("ONBOARDING", "VIEW", "onboarding.view", "Xem thông tin mẫu checklist và tiến trình hội nhập"),
                new PermissionDefinition("ONBOARDING", "MANAGE", "onboarding.manage", "Quản lý mẫu checklist, điều phối và nghiệm thu tiến trình hội nhập"),
                new PermissionDefinition("ONBOARDING", "IT_HANDLE", "onboarding.it_handle", "Tiếp nhận và xử lý hàng đợi cấp tài khoản CNTT"),

                // PERFORMANCE
                new PermissionDefinition("PERFORMANCE", "VIEW", "performance.view", "Xem đánh giá hiệu suất và KPI"),
                new PermissionDefinition("PERFORMANCE", "CONFIG", "performance.config", "Cấu hình kỳ đánh giá và danh mục KPI"),
                new PermissionDefinition("PERFORMANCE", "MANAGE", "performance.manage", "Khởi tạo phiếu và quản lý mục tiêu"),
                new PermissionDefinition("PERFORMANCE", "REVIEW", "performance.review", "Chấm điểm đánh giá của quản lý"),
                new PermissionDefinition("PERFORMANCE", "FINALIZE", "performance.finalize", "Chốt kết quả đánh giá bất biến"),
                new PermissionDefinition("PERFORMANCE", "EVALUATE", "performance.evaluate", "Thiết lập và chấm điểm hiệu suất"),

                // WORKPLACE
                new PermissionDefinition("WORKPLACE", "VIEW", "workplace.view", "Xem sơ đồ mặt bằng và chỗ ngồi"),
                new PermissionDefinition("WORKPLACE", "MANAGE", "workplace.manage", "Quản lý cơ sở vật chất và cấp phát tài sản"),
                new PermissionDefinition("WORKPLACE", "REPORT", "workplace.report", "Xem báo cáo tỷ lệ lấp đầy và sử dụng không gian làm việc"),

                // AUDIT
                new PermissionDefinition("AUDIT", "VIEW", "audit.view", "Xem nhật ký kiểm toán và báo cáo tuân thủ"),
                new PermissionDefinition("AUDIT", "EXPORT", "audit.export", "Xuất file báo cáo nhật ký kiểm toán"),

                // WORKFLOW
                new PermissionDefinition("WORKFLOW", "VIEW", "workflow.view", "Xem danh sách và tiến trình phê duyệt hồ sơ"),
                new PermissionDefinition("WORKFLOW", "MANAGE", "workflow.manage", "Cấu hình quy trình phê duyệt của công ty"),

                // NOTIFICATION
                new PermissionDefinition("NOTIFICATION", "BROADCAST", "notification.broadcast", "Phát thông báo toàn công ty"),

                // REWARD & DISCIPLINE (MODULE 12)
                new PermissionDefinition("REWARD", "VIEW", "reward.view", "Xem danh sách và chi tiết quyết định khen thưởng"),
                new PermissionDefinition("REWARD", "MANAGE", "reward.manage", "Tạo, cập nhật và xóa quyết định khen thưởng"),
                new PermissionDefinition("DISCIPLINE", "VIEW", "discipline.view", "Xem danh sách và chi tiết hồ sơ kỷ luật"),
                new PermissionDefinition("DISCIPLINE", "MANAGE", "discipline.manage", "Mở hồ sơ vi phạm, quản lý bằng chứng và thành phần họp"),
                new PermissionDefinition("DISCIPLINE", "DECIDE", "discipline.decide", "Ban hành quyết định kỷ luật lao động"),
                new PermissionDefinition("COMPLAINT", "MANAGE", "complaint.manage", "Quản lý, điều tra và giải quyết khiếu nại nội bộ"),

                // OFFBOARDING (MODULE 16)
                new PermissionDefinition("OFFBOARDING", "VIEW", "offboarding.view", "Xem danh sách và chi tiết hồ sơ thôi việc"),
                new PermissionDefinition("OFFBOARDING", "CREATE", "offboarding.create", "Tiếp nhận đơn thôi việc và ban hành quyết định chấm dứt HĐLĐ"),
                new PermissionDefinition("OFFBOARDING", "APPROVE", "offboarding.approve", "Phê duyệt hoặc từ chối đơn xin thôi việc"),
                new PermissionDefinition("OFFBOARDING", "CLEARANCE", "offboarding.clearance", "Xác nhận các hạng mục bàn giao thủ tục thôi việc"),
                new PermissionDefinition("OFFBOARDING", "INTERVIEW", "offboarding.interview", "Ghi nhận và cập nhật khảo sát phỏng vấn thôi việc"),
                new PermissionDefinition("OFFBOARDING", "COMPLETE", "offboarding.complete", "Thực thi hoàn tất thủ tục thôi việc và khóa tài khoản"),
                new PermissionDefinition("OFFBOARDING", "DELETE", "offboarding.delete", "Xóa hồ sơ thôi việc"),

                // DIGITAL RECORDS (MODULE 07 - THÔNG TƯ 05/2025/TT-BNV)
                new PermissionDefinition("DIGITAL_RECORD", "VIEW", "digital_record.view", "Xem danh sách và chi tiết hồ sơ tài liệu số hóa"),
                new PermissionDefinition("DIGITAL_RECORD", "CREATE", "digital_record.create", "Tải lên tệp scan gốc và khởi tạo hồ sơ số hóa"),
                new PermissionDefinition("DIGITAL_RECORD", "EDIT", "digital_record.edit", "Cập nhật hồ sơ và tải phiên bản mới"),
                new PermissionDefinition("DIGITAL_RECORD", "DELETE", "digital_record.delete", "Xóa hồ sơ nháp"),
                new PermissionDefinition("DIGITAL_RECORD", "VERIFY", "digital_record.verify", "Thẩm định và xác thực metadata số hóa"),
                new PermissionDefinition("DIGITAL_RECORD", "ARCHIVE", "digital_record.archive", "Phê duyệt nộp lưu kho chính thức bất biến"),
                new PermissionDefinition("DIGITAL_RECORD", "SIGN", "digital_record.sign", "Ký số xác thực số hóa theo Thông tư 05"),
                new PermissionDefinition("DIGITAL_RECORD", "LEGAL_HOLD", "digital_record.legal_hold", "Ban hành và gỡ bỏ lệnh tạm giữ pháp lý chống hủy"),
                new PermissionDefinition("DIGITAL_RECORD", "DESTROY", "digital_record.destroy", "Lập đề xuất và thực thi tiêu hủy hồ sơ hết hạn"),
                new PermissionDefinition("DIGITAL_RECORD", "VOTE", "digital_record.vote", "Biểu quyết tiêu hủy tài liệu của Hội đồng"),
                new PermissionDefinition("DIGITAL_RECORD", "EXPORT", "digital_record.export", "Trích xuất hồ sơ có đóng dấu Watermark động"),
                new PermissionDefinition("DIGITAL_RECORD", "MANAGE", "digital_record.manage", "Quản lý chính sách lưu trữ và danh mục loại tài liệu"),

                // AI ASSISTANT & CHATBOT (MODULE 18)
                new PermissionDefinition("AI", "USE", "ai.chat.use", "Sử dụng tính năng Trợ lý AI và tra cứu thông tin cá nhân"),
                new PermissionDefinition("AI", "QUERY_TEAM", "ai.chat.query_team_data", "Truy vấn số liệu tổng hợp phòng ban thông qua AI"),
                new PermissionDefinition("AI", "QUERY_COMPANY", "ai.chat.query_company_data", "Truy vấn số liệu cấp công ty và chi phí thông qua AI"),
                new PermissionDefinition("AI", "MANAGE", "ai.knowledge_base.manage", "Quản trị kho tài liệu tri thức, theo dõi câu hỏi chưa giải đáp và cấu hình AI"),

                // CENTRALIZED DASHBOARDS
                new PermissionDefinition("DASHBOARD", "EXECUTIVE", "dashboard.executive.view", "Xem bảng điều khiển tổng quan điều hành dành cho BOD và C-Level"),
                new PermissionDefinition("DASHBOARD", "PERSONNEL", "dashboard.personnel.view", "Xem bảng điều khiển phân tích nhân sự và hợp đồng lao động"),
                new PermissionDefinition("DASHBOARD", "ATTENDANCE", "dashboard.attendance.view", "Xem bảng điều khiển phân tích chấm công, ca kíp và giờ làm thêm"),
                new PermissionDefinition("DASHBOARD", "RECRUITMENT", "dashboard.recruitment.view", "Xem bảng điều khiển phễu tuyển dụng và chi phí thu hút nhân tài"),
                new PermissionDefinition("DASHBOARD", "PERFORMANCE", "dashboard.performance.view", "Xem bảng điều khiển đánh giá hiệu suất, OKR và chuông phân phối năng lực"),
                new PermissionDefinition("DASHBOARD", "WORKPLACE", "dashboard.workplace.view", "Xem bảng điều khiển lấp đầy không gian làm việc và quản trị tài sản")
        );

        Map<String, Permission> permMap = new HashMap<>();
        for (PermissionDefinition def : definitions) {
            Permission perm = permissionRepository.findByCode(def.code())
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .resource(def.resource())
                            .action(def.action())
                            .code(def.code())
                            .description(def.description())
                            .build()));
            permMap.put(perm.getCode(), perm);
        }
        log.info("Đã đồng bộ {} quyền chức năng hệ thống", permMap.size());
        return permMap;
    }

    private void initSystemRoles(Map<String, Permission> permMap) {
        for (UserRole userRole : UserRole.values()) {
            String roleCode = userRole.name();
            Optional<Role> roleOpt = roleRepository.findByCodeAndCompanyIdIsNullAndDeletedFalse(roleCode);

            Role role;
            if (roleOpt.isEmpty()) {
                role = roleRepository.save(Role.builder()
                        .code(roleCode)
                        .name(userRole.getTitle())
                        .description(userRole.getDescription())
                        .isSystemRole(true)
                        .deleted(false)
                        .companyId(null)
                        .build());
                log.info("Khởi tạo vai trò hệ thống: code={}, name={}", roleCode, userRole.getTitle());
            } else {
                role = roleOpt.get();
            }

            List<RolePermission> existing = rolePermissionRepository.findAllByRoleId(role.getId());
            if (existing.isEmpty()) {
                assignDefaultPermissionsForRole(role, userRole, permMap);
            } else if (userRole == UserRole.SUPER_ADMIN || userRole == UserRole.HR_ADMIN) {
                Set<UUID> existingPermIds = new HashSet<>();
                for (RolePermission rp : existing) {
                    existingPermIds.add(rp.getPermission().getId());
                }
                List<RolePermission> missing = new ArrayList<>();
                for (Permission p : permMap.values()) {
                    if (!existingPermIds.contains(p.getId())) {
                        missing.add(buildRolePerm(role, p, userRole == UserRole.SUPER_ADMIN ? DataScope.ALL : DataScope.COMPANY));
                    }
                }
                if (!missing.isEmpty()) {
                    rolePermissionRepository.saveAll(missing);
                    log.info("Đã bổ sung {} quyền mới cho vai trò {}", missing.size(), role.getCode());
                }
            }
        }
    }

    private void assignDefaultPermissionsForRole(Role role, UserRole userRole, Map<String, Permission> permMap) {
        List<RolePermission> toSave = new ArrayList<>();

        switch (userRole) {
            case SUPER_ADMIN -> {
                for (Permission p : permMap.values()) {
                    toSave.add(buildRolePerm(role, p, DataScope.ALL));
                }
            }
            case HR_ADMIN -> {
                grantPerm(toSave, role, permMap, "user.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "user.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "user.update", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "user.activate", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "role.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "role.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "role.assign", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "org.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "org.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.update", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.delete", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "leave.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "leave.approve", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "leave.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "leave.config", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.shift_manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.approve", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.period_manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.period_unlock", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.export", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "contract.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "contract.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "contract.sign", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "performance.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "performance.config", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "performance.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "performance.review", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "performance.finalize", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "performance.evaluate", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment_request.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment_request.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "candidate.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "candidate.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "application.ai_screen", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "interview.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "interview.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offer.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offer.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offer.approve", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "notification.broadcast", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "audit.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "audit.export", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.clearance", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.interview", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.it_handle", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "reward.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "reward.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "discipline.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "discipline.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "discipline.decide", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "complaint.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.approve", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.clearance", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.interview", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.complete", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.delete", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "workplace.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "workplace.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "workplace.report", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.edit", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.delete", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.verify", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.archive", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.sign", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.legal_hold", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.destroy", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.vote", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.export", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.chat.query_team_data", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.chat.query_company_data", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.knowledge_base.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.executive.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.personnel.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.attendance.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.recruitment.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.performance.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.workplace.view", DataScope.COMPANY);
            }
            case HR_SPECIALIST -> {
                grantPerm(toSave, role, permMap, "reward.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "reward.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "discipline.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "discipline.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "complaint.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.update", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "contract.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "contract.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "leave.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "leave.approve", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.shift_manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.approve", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.period_manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.period_unlock", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.export", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "org.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.clearance", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.interview", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "workplace.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.edit", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.verify", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "digital_record.export", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.chat.query_team_data", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.knowledge_base.manage", DataScope.COMPANY);
            }
            case RECRUITER -> {
                grantPerm(toSave, role, permMap, "recruitment.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "recruitment_request.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "candidate.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "candidate.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "application.ai_screen", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "interview.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "interview.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offer.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offer.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "onboarding.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.create", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.clearance", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "offboarding.interview", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.recruitment.view", DataScope.COMPANY);
            }
            case PAYROLL_ACCOUNTANT -> {
                grantPerm(toSave, role, permMap, "payroll.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "payroll.process", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "payroll.view_salary", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "attendance.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "contract.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.personnel.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "dashboard.attendance.view", DataScope.COMPANY);
            }
            case EXECUTIVE -> {
                grantPerm(toSave, role, permMap, "employee.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "org.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "payroll.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "attendance.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "leave.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "performance.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "audit.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "audit.export", DataScope.ALL);
                grantPerm(toSave, role, permMap, "recruitment.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "recruitment_request.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "offer.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "offer.approve", DataScope.ALL);
                grantPerm(toSave, role, permMap, "onboarding.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "reward.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "discipline.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "discipline.decide", DataScope.ALL);
                grantPerm(toSave, role, permMap, "workplace.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "workplace.report", DataScope.ALL);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.ALL);
                grantPerm(toSave, role, permMap, "ai.chat.query_team_data", DataScope.ALL);
                grantPerm(toSave, role, permMap, "ai.chat.query_company_data", DataScope.ALL);
                grantPerm(toSave, role, permMap, "dashboard.executive.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "dashboard.personnel.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "dashboard.attendance.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "dashboard.recruitment.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "dashboard.performance.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "dashboard.workplace.view", DataScope.ALL);
            }
            case MANAGER -> {
                grantPerm(toSave, role, permMap, "employee.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "leave.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "leave.approve", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "attendance.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "attendance.approve", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "performance.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "performance.manage", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "performance.review", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "performance.evaluate", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "org.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "recruitment_request.create", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "recruitment_request.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "interview.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "candidate.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "workplace.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "dashboard.personnel.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "dashboard.attendance.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "dashboard.performance.view", DataScope.DEPARTMENT);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.OWN);
                grantPerm(toSave, role, permMap, "ai.chat.query_team_data", DataScope.DEPARTMENT);
            }
            case EMPLOYEE -> {
                grantPerm(toSave, role, permMap, "employee.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "leave.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "leave.apply", DataScope.OWN);
                grantPerm(toSave, role, permMap, "attendance.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "attendance.checkin", DataScope.OWN);
                grantPerm(toSave, role, permMap, "payroll.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "performance.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "workplace.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "digital_record.view", DataScope.OWN);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.OWN);
            }
            case OFFICE_ADMIN -> {
                grantPerm(toSave, role, permMap, "workplace.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "workplace.manage", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "workplace.report", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "employee.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "org.view", DataScope.COMPANY);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.OWN);
            }
            case AUDITOR -> {
                grantPerm(toSave, role, permMap, "audit.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "employee.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "contract.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "payroll.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "role.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "digital_record.view", DataScope.ALL);
                grantPerm(toSave, role, permMap, "ai.chat.use", DataScope.ALL);
            }
        }

        if (!toSave.isEmpty()) {
            rolePermissionRepository.saveAll(toSave);
            log.info("Đã gán {} quyền mặc định cho vai trò {}", toSave.size(), role.getCode());
        }
    }

    private void grantPerm(List<RolePermission> list, Role role, Map<String, Permission> permMap, String code, DataScope scope) {
        Permission p = permMap.get(code);
        if (p != null) {
            list.add(buildRolePerm(role, p, scope));
        }
    }

    private RolePermission buildRolePerm(Role role, Permission p, DataScope scope) {
        return RolePermission.builder()
                .role(role)
                .permission(p)
                .dataScope(scope)
                .build();
    }

    private record PermissionDefinition(String resource, String action, String code, String description) {}
}
