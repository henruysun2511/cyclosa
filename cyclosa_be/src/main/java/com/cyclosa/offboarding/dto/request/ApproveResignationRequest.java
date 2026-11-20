package com.cyclosa.offboarding.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu phê duyệt đơn xin thôi việc")
public class ApproveResignationRequest {

    @Schema(description = "Ngày làm việc cuối cùng được phê duyệt điều chỉnh (nếu có)")
    private LocalDate actualLastWorkingDate;

    @Schema(description = "Ý kiến phê duyệt hoặc ghi chú của người duyệt")
    private String notes;
}
