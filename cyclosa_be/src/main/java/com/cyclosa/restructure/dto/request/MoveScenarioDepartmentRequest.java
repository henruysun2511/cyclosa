package com.cyclosa.restructure.dto.request;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoveScenarioDepartmentRequest {

    // Có thể null nếu di chuyển lên làm root department
    private UUID newParentScenarioDeptId;
}
