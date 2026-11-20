package com.cyclosa.attendance.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Tham số lọc danh sách ca làm việc")
public class ShiftFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo trạng thái kích hoạt", example = "true")
    private Boolean isActive;
}

