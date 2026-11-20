package com.cyclosa.career.dto.response;

import com.cyclosa.career.enums.Readiness;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin ứng viên kế nhiệm")
public class SuccessionCandidateResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String currentDepartmentName;
    private String currentJobTitleName;
    private Readiness readiness;
    private String developmentNotes;
    private LocalDateTime createdAt;
}
