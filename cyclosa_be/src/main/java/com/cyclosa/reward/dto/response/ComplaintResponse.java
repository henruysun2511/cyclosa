package com.cyclosa.reward.dto.response;

import com.cyclosa.reward.enums.ComplaintCategory;
import com.cyclosa.reward.enums.ComplaintStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin khiếu nại hoặc phản ánh nội bộ")
public class ComplaintResponse {

    private UUID id;
    private UUID companyId;

    private UUID complainantEmployeeId;
    private String complainantEmployeeName;
    private String complainantEmployeeCode;
    private String departmentName;

    private ComplaintCategory category;
    private String subject;
    private String content;
    private LocalDateTime submittedAt;
    private ComplaintStatus status;

    private UUID handlerEmployeeId;
    private String handlerEmployeeName;

    private String resolution;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    private LocalDateTime createdAt;
}
