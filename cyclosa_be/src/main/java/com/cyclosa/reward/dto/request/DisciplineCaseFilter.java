package com.cyclosa.reward.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.reward.enums.DisciplineForm;
import com.cyclosa.reward.enums.DisciplineStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc danh sách hồ sơ kỷ luật")
public class DisciplineCaseFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên")
    private UUID employeeId;

    @Schema(description = "Lọc theo trạng thái hồ sơ")
    private DisciplineStatus status;

    @Schema(description = "Lọc theo hình thức kỷ luật")
    private DisciplineForm disciplineForm;
}

