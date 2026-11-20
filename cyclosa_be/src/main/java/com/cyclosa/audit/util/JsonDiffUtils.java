package com.cyclosa.audit.util;

import com.cyclosa.audit.dto.response.ChangedFieldResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * Tiện ích so sánh biến động dữ liệu JSON (Visual Diff Engine)
 */
@Slf4j
public final class JsonDiffUtils {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private static final Set<String> IGNORED_FIELDS = Set.of(
            "updatedat", "updated_at",
            "createdat", "created_at",
            "deletedat", "deleted_at",
            "updatedby", "updated_by",
            "createdby", "created_by",
            "version", "etag", "deleted"
    );

    private static final Map<String, String> DISPLAY_NAMES = Map.ofEntries(
            Map.entry("basesalary", "Lương cơ bản"),
            Map.entry("positionallowance", "Phụ cấp chức vụ"),
            Map.entry("fullname", "Họ và tên"),
            Map.entry("email", "Email"),
            Map.entry("phonenumber", "Số điện thoại"),
            Map.entry("status", "Trạng thái"),
            Map.entry("contractnumber", "Số hợp đồng"),
            Map.entry("contracttype", "Loại hợp đồng"),
            Map.entry("startdate", "Ngày bắt đầu"),
            Map.entry("enddate", "Ngày kết thúc"),
            Map.entry("jobtitle", "Chức danh"),
            Map.entry("department", "Phòng ban"),
            Map.entry("departmentid", "Phòng ban"),
            Map.entry("companyid", "Công ty"),
            Map.entry("gender", "Giới tính"),
            Map.entry("dob", "Ngày sinh"),
            Map.entry("address", "Địa chỉ"),
            Map.entry("taxcode", "Mã số thuế"),
            Map.entry("insurancecode", "Mã số BHXH"),
            Map.entry("role", "Vai trò"),
            Map.entry("rolename", "Tên vai trò"),
            Map.entry("code", "Mã hiệu"),
            Map.entry("title", "Tiêu đề"),
            Map.entry("description", "Mô tả")
    );

    private JsonDiffUtils() {}

    /**
     * So sánh 2 chuỗi JSON snapshot (oldValue, newValue) và trích xuất danh sách các trường biến động.
     */
    public static List<ChangedFieldResponse> computeDiff(String oldJsonStr, String newJsonStr) {
        if (oldJsonStr == null && newJsonStr == null) {
            return Collections.emptyList();
        }

        try {
            JsonNode oldNode = parseNode(oldJsonStr);
            JsonNode newNode = parseNode(newJsonStr);

            if (oldNode == null && newNode == null) {
                return Collections.emptyList();
            }

            Set<String> allKeys = new LinkedHashSet<>();
            if (oldNode != null && oldNode.isObject()) {
                oldNode.fieldNames().forEachRemaining(allKeys::add);
            }
            if (newNode != null && newNode.isObject()) {
                newNode.fieldNames().forEachRemaining(allKeys::add);
            }

            List<ChangedFieldResponse> changedFields = new ArrayList<>();

            for (String key : allKeys) {
                String normalizedKey = key.toLowerCase(Locale.ROOT).replace("-", "").replace("_", "");
                if (IGNORED_FIELDS.contains(normalizedKey)) {
                    continue;
                }

                JsonNode oldValNode = (oldNode != null) ? oldNode.get(key) : null;
                JsonNode newValNode = (newNode != null) ? newNode.get(key) : null;

                if (!Objects.equals(oldValNode, newValNode)) {
                    Object oldVal = extractValue(oldValNode);
                    Object newVal = extractValue(newValNode);

                    changedFields.add(ChangedFieldResponse.builder()
                            .field(key)
                            .displayName(getDisplayName(key))
                            .oldValue(oldVal)
                            .newValue(newVal)
                            .build());
                }
            }

            return changedFields;
        } catch (Exception e) {
            log.warn("Lỗi khi so sánh diff JSON: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private static JsonNode parseNode(String jsonStr) {
        if (jsonStr == null || jsonStr.isBlank()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readTree(jsonStr);
        } catch (Exception e) {
            return null;
        }
    }

    private static Object extractValue(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        if (node.isTextual()) {
            return node.asText();
        }
        if (node.isNumber()) {
            return node.numberValue();
        }
        if (node.isBoolean()) {
            return node.asBoolean();
        }
        return node.toString();
    }

    private static String getDisplayName(String key) {
        String normalized = key.toLowerCase(Locale.ROOT).replace("-", "").replace("_", "");
        return DISPLAY_NAMES.getOrDefault(normalized, formatCamelCase(key));
    }

    private static String formatCamelCase(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        StringBuilder result = new StringBuilder();
        result.append(Character.toUpperCase(str.charAt(0)));
        for (int i = 1; i < str.length(); i++) {
            char c = str.charAt(i);
            if (Character.isUpperCase(c)) {
                result.append(" ").append(c);
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }
}

