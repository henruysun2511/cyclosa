package com.cyclosa.restructure.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SplitScenarioDepartmentRequest {

    @NotNull(message = "Phòng ban cần chia tách không được để trống")
    private UUID sourceDepartmentId;

    @NotEmpty(message = "Danh sách các đơn vị mới phân tách không được để trống")
    private List<CreateScenarioDepartmentRequest> newDepartments;

    private String notes;
}
