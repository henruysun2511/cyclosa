package com.cyclosa.audit;

import com.cyclosa.audit.dto.response.ChangedFieldResponse;
import com.cyclosa.audit.util.JsonDiffUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JsonDiffUtilsTest {

    @Test
    @DisplayName("Tính toán chính xác các trường thay đổi và bỏ qua trường kỹ thuật")
    void testComputeDiff() {
        String oldJson = "{\"baseSalary\":20000000,\"jobTitle\":\"Junior Dev\",\"updatedAt\":\"2026-10-01T08:00:00\"}";
        String newJson = "{\"baseSalary\":25000000,\"jobTitle\":\"Senior Dev\",\"updatedAt\":\"2026-11-14T10:00:00\"}";

        List<ChangedFieldResponse> diff = JsonDiffUtils.computeDiff(oldJson, newJson);

        assertThat(diff).hasSize(2);

        ChangedFieldResponse salaryDiff = diff.stream()
                .filter(d -> d.getField().equals("baseSalary"))
                .findFirst()
                .orElse(null);
        assertThat(salaryDiff).isNotNull();
        assertThat(salaryDiff.getDisplayName()).isEqualTo("Lương cơ bản");
        assertThat(salaryDiff.getOldValue()).isEqualTo(20000000);
        assertThat(salaryDiff.getNewValue()).isEqualTo(25000000);

        ChangedFieldResponse titleDiff = diff.stream()
                .filter(d -> d.getField().equals("jobTitle"))
                .findFirst()
                .orElse(null);
        assertThat(titleDiff).isNotNull();
        assertThat(titleDiff.getDisplayName()).isEqualTo("Chức danh");
        assertThat(titleDiff.getOldValue()).isEqualTo("Junior Dev");
        assertThat(titleDiff.getNewValue()).isEqualTo("Senior Dev");

        // updatedAt phải bị bỏ qua
        assertThat(diff).noneMatch(d -> d.getField().equalsIgnoreCase("updatedAt"));
    }
}

