package com.cyclosa.audit.dto.request;

import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc nhật ký kiểm toán hệ thống")
public class AuditLogFilterRequest extends BaseFilterRequest {

    @Schema(description = "ID người thực hiện thao tác (User ID)")
    private UUID actorUserId;

    @Schema(description = "Mã hành động kiểm toán (CREATE, UPDATE, DELETE, APPROVE...)")
    private AuditAction action;

    @Schema(description = "Tên loại thực thể nghiệp vụ (EMPLOYEE, CONTRACT, WORKFLOW_REQUEST...)")
    private String entityType;

    @Schema(description = "ID của đối tượng nghiệp vụ bị tác động")
    private String entityId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Schema(description = "Mốc thời gian bắt đầu lọc (ISO-8601)", example = "2026-11-01T00:00:00")
    private LocalDateTime from;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Schema(description = "Mốc thời gian kết thúc lọc (ISO-8601)", example = "2026-11-14T23:59:59")
    private LocalDateTime to;

    @Schema(description = "Địa chỉ IP nguồn (IPv4 hoặc IPv6)", example = "118.69.182.45")
    private String ipAddress;

    @Schema(description = "Định dạng file xuất (XLSX hoặc CSV)", example = "XLSX")
    private String format;
}

