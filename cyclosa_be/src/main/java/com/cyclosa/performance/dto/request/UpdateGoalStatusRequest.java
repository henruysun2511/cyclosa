package com.cyclosa.performance.dto.request;

import com.cyclosa.performance.enums.GoalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGoalStatusRequest {

    @NotNull(message = "Trạng thái mục tiêu không được để trống")
    private GoalStatus status;
}
