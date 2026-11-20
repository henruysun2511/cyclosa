package com.cyclosa.workplace;

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

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("local")
public class WorkplaceMigrationRunnerTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void executeWorkplaceMigration() throws Exception {
        ClassPathResource resource = new ClassPathResource("db/migration_workplace_module.sql");
        String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            System.out.println("Connected to database: " + conn.getMetaData().getURL());
            stmt.execute(sql);
            System.out.println("Successfully executed migration_workplace_module.sql!");

            // Cập nhật và đảm bảo toàn bộ role_permissions được gán đầy đủ
            String permSql = """
                INSERT INTO permissions (resource, action, code, description) VALUES
                ('WORKPLACE', 'VIEW', 'workplace.view', 'Xem sơ đồ bàn ghế, địa điểm và danh mục không gian làm việc'),
                ('WORKPLACE', 'MANAGE', 'workplace.manage', 'Tạo, sửa, xóa cơ sở, bản vẽ tầng, phân khu, bàn ghế, thiết bị'),
                ('WORKPLACE', 'REPORT', 'workplace.report', 'Xem báo cáo tỷ lệ lấp đầy và sử dụng không gian làm việc')
                ON CONFLICT (code) DO NOTHING;

                INSERT INTO role_permissions (role_id, permission_id, data_scope)
                SELECT r.id, p.id, 'ALL'
                FROM roles r
                CROSS JOIN permissions p
                WHERE r.code IN ('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN', 'HR_MANAGER')
                  AND p.code IN ('workplace.view', 'workplace.manage', 'workplace.report')
                ON CONFLICT DO NOTHING;

                INSERT INTO role_permissions (role_id, permission_id, data_scope)
                SELECT r.id, p.id, 'ALL'
                FROM roles r
                CROSS JOIN permissions p
                WHERE r.code IN ('EMPLOYEE', 'MANAGER', 'HR_SPECIALIST', 'RECRUITER', 'EXECUTIVE', 'PAYROLL_ACCOUNTANT', 'AUDITOR')
                  AND p.code = 'workplace.view'
                ON CONFLICT DO NOTHING;

                INSERT INTO role_permissions (role_id, permission_id, data_scope)
                SELECT r.id, p.id, 'ALL'
                FROM roles r
                CROSS JOIN permissions p
                WHERE r.code = 'EXECUTIVE'
                  AND p.code = 'workplace.report'
                ON CONFLICT DO NOTHING;
            """;
            stmt.execute(permSql);
            System.out.println("Successfully updated role permissions for workplace!");

            // Verify role_permissions count
            try (ResultSet rs = stmt.executeQuery(
                    "SELECT r.code, p.code, rp.data_scope " +
                    "FROM role_permissions rp " +
                    "JOIN roles r ON rp.role_id = r.id " +
                    "JOIN permissions p ON rp.permission_id = p.id " +
                    "WHERE p.code LIKE 'workplace.%' " +
                    "ORDER BY r.code, p.code")) {
                System.out.println("--- Workplace Permissions Matrix ---");
                int count = 0;
                while (rs.next()) {
                    System.out.printf("Role: %s | Perm: %s | Scope: %s%n",
                            rs.getString(1), rs.getString(2), rs.getString(3));
                    count++;
                }
                System.out.println("Total workplace role-permission mappings: " + count);
                assertTrue(count > 0);
            }

            // Verify tables and seed data
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM workplace_sites")) {
                if (rs.next()) {
                    System.out.println("Total workplace sites: " + rs.getInt(1));
                    assertTrue(rs.getInt(1) > 0);
                }
            }

            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM workplace_floors")) {
                if (rs.next()) {
                    System.out.println("Total workplace floors: " + rs.getInt(1));
                    assertTrue(rs.getInt(1) > 0);
                }
            }

            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM workplace_seats")) {
                if (rs.next()) {
                    System.out.println("Total workplace seats: " + rs.getInt(1));
                    assertTrue(rs.getInt(1) > 0);
                }
            }

            // Print all employees in database
            try (ResultSet rs = stmt.executeQuery("SELECT id, employee_code, first_name, last_name FROM employees LIMIT 10")) {
                System.out.println("--- Employees in DB ---");
                while (rs.next()) {
                    System.out.printf("Employee: id=%s | code=%s | name=%s %s%n",
                            rs.getString("id"), rs.getString("employee_code"), rs.getString("last_name"), rs.getString("first_name"));
                }
            }

            // Gán trực tiếp chỗ ngồi cố định cho các nhân viên có thật
            String assignSql = """
                DO $$
                DECLARE
                    emp RECORD;
                    seats RECORD;
                    idx INT := 1;
                    v_seat_id UUID;
                    seat_codes TEXT[] := ARRAY['DEV-A01', 'DEV-A02', 'DEV-A03', 'DEV-B01'];
                    assign_ids UUID[] := ARRAY[
                        '00000000-0000-0000-0000-000000000901'::uuid,
                        '00000000-0000-0000-0000-000000000902'::uuid,
                        '00000000-0000-0000-0000-000000000903'::uuid,
                        '00000000-0000-0000-0000-000000000904'::uuid
                    ];
                BEGIN
                    FOR emp IN (SELECT id, employee_code, first_name, last_name FROM employees ORDER BY created_at ASC LIMIT 4) LOOP
                        IF idx <= 4 THEN
                            SELECT id INTO v_seat_id FROM workplace_seats WHERE seat_code = seat_codes[idx];
                            IF v_seat_id IS NOT NULL THEN
                                UPDATE workplace_seat_assignments SET released_at = NOW() WHERE employee_id = emp.id AND released_at IS NULL;
                                INSERT INTO workplace_seat_assignments (id, seat_id, employee_id, assigned_at, released_at, note, created_at)
                                VALUES (
                                    assign_ids[idx],
                                    v_seat_id,
                                    emp.id,
                                    NOW() - INTERVAL '1 month',
                                    NULL,
                                    'Phân bổ chỗ ngồi cố định nhân sự ' || emp.employee_code,
                                    NOW()
                                ) ON CONFLICT (id) DO UPDATE SET
                                    seat_id = EXCLUDED.seat_id,
                                    employee_id = EXCLUDED.employee_id,
                                    released_at = NULL;
                            END IF;
                            idx := idx + 1;
                        END IF;
                    END LOOP;
                END $$;
            """;
            stmt.execute(assignSql);
            System.out.println("Assigned dedicated seats to real employees successfully!");

            try (ResultSet rs = stmt.executeQuery(
                    "SELECT wsa.id, ws.seat_code, e.employee_code, e.first_name, e.last_name, wsa.assigned_at " +
                    "FROM workplace_seat_assignments wsa " +
                    "JOIN workplace_seats ws ON ws.id = wsa.seat_id " +
                    "JOIN employees e ON e.id = wsa.employee_id " +
                    "WHERE wsa.released_at IS NULL")) {

                System.out.println("--- Current Active Seat Assignments ---");
                int count = 0;
                while (rs.next()) {
                    count++;
                    System.out.println(String.format("Assignment #%d: Seat %s -> Employee %s (%s %s) assigned at %s",
                            count,
                            rs.getString("seat_code"),
                            rs.getString("employee_code"),
                            rs.getString("last_name"),
                            rs.getString("first_name"),
                            rs.getTimestamp("assigned_at")
                    ));
                }
                System.out.println("Total assigned seats: " + count);
            }
        }
    }
}
