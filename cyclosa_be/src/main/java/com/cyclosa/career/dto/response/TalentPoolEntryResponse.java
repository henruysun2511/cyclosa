package com.cyclosa.career.dto.response;

import com.cyclosa.career.enums.TalentTag;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Bản ghi nhân tài trong kho nội bộ")
public class TalentPoolEntryResponse {

    private UUID id;
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String jobTitleName;
    private TalentTag tag;
    private String reason;
    private LocalDateTime createdAt;
}
