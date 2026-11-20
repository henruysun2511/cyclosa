package com.cyclosa.restructure.dto.request;

import com.cyclosa.restructure.enums.ScenarioScope;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrgScenarioRequest {

    private UUID companyId;

    @NotBlank(message = "Tên kịch bản không được để trống")
    @Size(max = 150, message = "Tên kịch bản không vượt quá 150 ký tự")
    private String name;

    @NotBlank(message = "Mã kịch bản không được để trống")
    @Size(max = 50, message = "Mã kịch bản không vượt quá 50 ký tự")
    private String code;

    private String description;

    @NotNull(message = "Phạm vi kịch bản không được để trống")
    private ScenarioScope scope;

    @NotNull(message = "Ngày hiệu lực dự kiến không được để trống")
    @FutureOrPresent(message = "Ngày hiệu lực dự kiến không được ở trong quá khứ")
    private LocalDate targetEffectiveDate;
}
