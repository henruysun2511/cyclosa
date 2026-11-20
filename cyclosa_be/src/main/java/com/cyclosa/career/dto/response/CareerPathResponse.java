package com.cyclosa.career.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin tuyến thăng tiến chuẩn")
public class CareerPathResponse {

    private UUID id;
    private UUID companyId;
    private UUID fromJobTitleId;
    private String fromJobTitleCode;
    private String fromJobTitleName;
    private UUID toJobTitleId;
    private String toJobTitleCode;
    private String toJobTitleName;
    private BigDecimal minExperienceYears;
    private String requirements;
    private LocalDateTime createdAt;
}
