package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.TalentTag;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Tham số lọc kho nhân tài nội bộ")
public class TalentPoolFilter extends BaseFilterRequest {

    @Schema(description = "Thẻ phân loại nhân tài")
    private TalentTag tag;

    @Schema(description = "Lọc theo phòng ban")
    private UUID departmentId;
}
