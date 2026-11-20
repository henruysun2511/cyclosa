package com.cyclosa.restructure.dto.request;

import com.cyclosa.restructure.enums.AssignmentStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReassignScenarioEmployeesRequest {

    @NotEmpty(message = "Danh sách phân công nhân sự không được để trống")
    private List<EmployeeAssignmentItemRequest> assignments;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmployeeAssignmentItemRequest {
        @NotNull(message = "Mã nhân viên không được để trống")
        private UUID employeeId;

        @NotNull(message = "Phòng ban mới không được để trống")
        private UUID newScenarioDeptId;

        @NotNull(message = "Chức danh mới không được để trống")
        private UUID newJobTitleId;

        private UUID newManagerId;

        @Builder.Default
        private AssignmentStatus assignmentStatus = AssignmentStatus.TRANSFERRED;

        private BigDecimal proposedSalary;

        private String notes;
    }
}
