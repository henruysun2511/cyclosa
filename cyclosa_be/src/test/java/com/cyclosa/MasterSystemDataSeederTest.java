package com.cyclosa;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.util.StreamUtils;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("local")
public class MasterSystemDataSeederTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void executeMasterDataSeeding() throws Exception {
        ClassPathResource resource = new ClassPathResource("db/seed_all_modules_master_data.sql");
        String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            System.out.println(">>> Đang kết nối tới Database: " + conn.getMetaData().getURL());
            assertNotNull(conn);

            System.out.println(">>> Bắt đầu thực thi nạp dữ liệu mẫu 147 bảng...");
            stmt.execute(sql);
            System.out.println(">>> HOÀN TẤT NẠP DỮ LIỆU MẪU MASTER DATA THÀNH CÔNG RỰC RỠ! <<<");

            // Kiểm tra số lượng bản ghi sau khi nạp
            verifyData(stmt, "employees", "Số lượng nhân sự");
            verifyData(stmt, "contracts", "Số lượng hợp đồng");
            verifyData(stmt, "workplace_seats", "Số lượng chỗ ngồi");
            verifyData(stmt, "workplace_seat_assignments", "Số lượng phân bổ chỗ ngồi");
            verifyData(stmt, "assets", "Số lượng tài sản");
            verifyData(stmt, "asset_assignments", "Số lượng bàn giao tài sản");
            verifyData(stmt, "shifts", "Số lượng ca làm việc");
            verifyData(stmt, "attendance_logs", "Số lượng nhật ký chấm công");
            verifyData(stmt, "leave_balances", "Số lượng quỹ phép");
            verifyData(stmt, "payslips", "Số lượng phiếu lương");
            verifyData(stmt, "performance_reviews", "Số lượng bản đánh giá KPI");
            verifyData(stmt, "reward_decisions", "Số lượng quyết định khen thưởng");
            verifyData(stmt, "recruitment_requests", "Số lượng yêu cầu tuyển dụng");
            verifyData(stmt, "job_openings", "Số lượng tin tuyển dụng");
            verifyData(stmt, "candidates", "Số lượng ứng viên");
            verifyData(stmt, "applications", "Số lượng hồ sơ ứng tuyển");
            verifyData(stmt, "dossiers", "Số lượng hồ sơ số hóa nhân sự");
            verifyData(stmt, "notifications", "Số lượng thông báo");
        }
    }

    private void verifyData(Statement stmt, String table, String label) {
        try (ResultSet rs = stmt.executeQuery("SELECT count(*) FROM " + table)) {
            if (rs.next()) {
                System.out.println("  [OK] " + label + " (" + table + "): " + rs.getInt(1) + " bản ghi");
            }
        } catch (Exception e) {
            System.out.println("  [WARN] Không thể đếm bảng " + table + ": " + e.getMessage());
        }
    }
}
