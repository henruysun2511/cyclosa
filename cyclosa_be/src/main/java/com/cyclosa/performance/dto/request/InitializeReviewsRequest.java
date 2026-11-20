package com.cyclosa.performance.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitializeReviewsRequest {

    @NotEmpty(message = "Danh sách nhân viên không được để trống")
    private List<UUID> employeeIds;
}
