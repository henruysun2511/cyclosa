package com.cyclosa.document;

import com.cyclosa.document.config.DigitalRecordsDataSeeder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("local")
public class DigitalRecordsMigrationRunnerTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private DigitalRecordsDataSeeder dataSeeder;

    @Test
    void executeMigrationAndSeed() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("Kết nối Database thành công: " + conn.getMetaData().getURL());
            assertNotNull(conn);
        }

        // Thực thi migration và seed dữ liệu mẫu
        dataSeeder.run();
        System.out.println(">>> ĐÃ MIGRATION VÀ SEED DỮ LIỆU MẪU MODULE 07 THÀNH CÔNG RỰC RỠ! <<<");
    }
}
