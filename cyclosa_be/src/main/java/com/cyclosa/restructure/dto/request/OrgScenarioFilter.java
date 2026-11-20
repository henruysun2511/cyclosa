package com.cyclosa.restructure.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.restructure.enums.ScenarioScope;
import com.cyclosa.restructure.enums.ScenarioStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Bộ lọc kịch bản tái cơ cấu")
public class OrgScenarioFilter extends BaseFilterRequest {

    @Schema(description = "Pháp nhân sở hữu kịch bản")
    private UUID companyId;

    @Schema(description = "Lọc theo trạng thái kịch bản")
    private ScenarioStatus status;

    @Schema(description = "Lọc theo phạm vi kịch bản")
    private ScenarioScope scope;
}
