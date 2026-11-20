package com.cyclosa.audit.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Tiện ích che giấu dữ liệu nhạy cảm (Data Masking & Redaction)
 * Tuân thủ Nghị định 13/2023/NĐ-CP (PDPD) và tiêu chuẩn ISO 27001.
 */
@Slf4j
public final class AuditMaskingUtils {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private static final Set<String> FULL_MASK_KEYS = Set.of(
            "password", "passwordhash", "password_hash",
            "refreshtoken", "refresh_token", "token", "accesstoken", "access_token",
            "otp", "otpcode", "otp_code", "secret", "secretkey", "secret_key"
    );

    private static final Set<String> PARTIAL_MASK_KEYS = Set.of(
            "idcardnumber", "id_card_number", "citizenid", "citizen_id", "cccd", "cmnd",
            "bankaccountnumber", "bank_account_number", "bankaccount", "bank_account"
    );

    private AuditMaskingUtils() {}

    /**
     * Chuyển đổi đối tượng bất kỳ thành chuỗi JSON đã được mask các trường nhạy cảm.
     */
    public static String maskToJson(Object object) {
        if (object == null) {
            return null;
        }
        try {
            if (object instanceof String str) {
                if (str.trim().startsWith("{") || str.trim().startsWith("[")) {
                    JsonNode node = OBJECT_MAPPER.readTree(str);
                    maskJsonNode(node);
                    return OBJECT_MAPPER.writeValueAsString(node);
                }
                return str;
            }
            JsonNode node = OBJECT_MAPPER.valueToTree(object);
            maskJsonNode(node);
            return OBJECT_MAPPER.writeValueAsString(node);
        } catch (Exception e) {
            log.warn("Không thể mask dữ liệu đối tượng sang JSON: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Mask trực tiếp trên cây JSON node (đệ quy).
     */
    public static void maskJsonNode(JsonNode node) {
        if (node == null || !node.isObject()) {
            return;
        }

        ObjectNode objectNode = (ObjectNode) node;
        Iterator<Map.Entry<String, JsonNode>> fields = objectNode.fields();
        List<String> keysToRedact = new ArrayList<>();
        Map<String, String> keysToPartialMask = new HashMap<>();

        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();
            String key = entry.getKey();
            String normalizedKey = key.toLowerCase(Locale.ROOT).replace("-", "").replace("_", "");
            JsonNode value = entry.getValue();

            if (FULL_MASK_KEYS.contains(normalizedKey)) {
                keysToRedact.add(key);
            } else if (PARTIAL_MASK_KEYS.contains(normalizedKey) && value.isTextual()) {
                keysToPartialMask.put(key, maskPartial(value.asText()));
            } else if (value.isObject() || value.isArray()) {
                maskJsonNode(value);
            }
        }

        for (String key : keysToRedact) {
            objectNode.put(key, "***REDACTED***");
        }

        for (Map.Entry<String, String> entry : keysToPartialMask.entrySet()) {
            objectNode.put(entry.getKey(), entry.getValue());
        }
    }

    /**
     * Che giấu các chữ số ở giữa, chỉ giữ lại 3 chữ số đầu và 3 chữ số cuối.
     * Ví dụ: "079012345678" -> "0790******678"
     */
    public static String maskPartial(String value) {
        if (value == null || value.length() <= 6) {
            return "******";
        }
        int keep = Math.min(3, value.length() / 4);
        int maskedLength = value.length() - (keep * 2);
        return value.substring(0, keep) + "*".repeat(Math.max(4, maskedLength)) + value.substring(value.length() - keep);
    }
}

