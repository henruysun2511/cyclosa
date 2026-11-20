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
public class MergeScenarioDepartmentsRequest {

    @NotEmpty(message = "Danh sách phòng ban nguồn cần sáp nhập không được để trống")
    private List<UUID> sourceDepartmentIds;

    @NotNull(message = "Phòng ban đích tiếp nhận không được để trống")
    private UUID targetDepartmentId;

    private UUID newManagerEmployeeId;

    private String notes;
}
