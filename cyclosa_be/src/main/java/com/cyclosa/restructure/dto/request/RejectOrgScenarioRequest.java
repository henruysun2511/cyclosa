package com.cyclosa.restructure.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RejectOrgScenarioRequest {

    @NotBlank(message = "Lý do từ chối không được để trống")
    private String reason;
}
