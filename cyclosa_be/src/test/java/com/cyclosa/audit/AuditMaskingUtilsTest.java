package com.cyclosa.audit;

import com.cyclosa.audit.util.AuditMaskingUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class AuditMaskingUtilsTest {

    @Test
    @DisplayName("Che giấu hoàn toàn các trường mật khẩu, token, OTP")
    void testMaskSensitiveFullKeys() {
        Map<String, Object> data = Map.of(
                "username", "admin",
                "password", "secret123",
                "refreshToken", "jwt-refresh-token",
                "otpCode", "123456"
        );

        String json = AuditMaskingUtils.maskToJson(data);

        assertThat(json).contains("\"username\":\"admin\"");
        assertThat(json).contains("\"password\":\"***REDACTED***\"");
        assertThat(json).contains("\"refreshToken\":\"***REDACTED***\"");
        assertThat(json).contains("\"otpCode\":\"***REDACTED***\"");
        assertThat(json).doesNotContain("secret123");
        assertThat(json).doesNotContain("123456");
    }

    @Test
    @DisplayName("Che giấu một phần CCCD và số tài khoản ngân hàng")
    void testMaskPartialKeys() {
        Map<String, Object> data = Map.of(
                "citizenId", "079012345678",
                "bankAccountNumber", "19036789012345"
        );

        String json = AuditMaskingUtils.maskToJson(data);

        assertThat(json).contains("0790******678");
        assertThat(json).doesNotContain("079012345678");
    }
}

