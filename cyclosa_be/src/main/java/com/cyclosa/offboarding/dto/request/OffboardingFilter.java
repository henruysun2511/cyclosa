package com.cyclosa.offboarding.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.offboarding.enums.OffboardingStatus;
import com.cyclosa.offboarding.enums.OffboardingType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Bộ lọc tìm kiếm hồ sơ thôi việc")
public class OffboardingFilter extends BaseFilterRequest {

    @Schema(description = "Từ khóa tìm kiếm (Tên nhân viên, mã nhân viên, số quyết định)")
    private String search;

    @Schema(description = "Loại hồ sơ (RESIGNATION / TERMINATION)")
    private OffboardingType type;

    @Schema(description = "Trạng thái hồ sơ")
    private OffboardingStatus status;

    @Schema(description = "ID phòng ban")
    private UUID departmentId;

    @Schema(description = "Từ ngày làm việc cuối cùng")
    private LocalDate fromDate;

    @Schema(description = "Đến ngày làm việc cuối cùng")
    private LocalDate toDate;
}
