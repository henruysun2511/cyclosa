package com.cyclosa.reward.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu cập nhật danh sách thành phần tham dự họp kỷ luật")
public class UpdateParticipantsRequest {

    @NotEmpty(message = "Danh sách người tham dự không được để trống")
    @Schema(description = "Danh sách thành phần tham dự")
    private List<ParticipantItem> participants;

    @Getter
    @Setter
    public static class ParticipantItem {
        @NotNull(message = "ID nhân viên tham dự không được để trống")
        private UUID employeeId;

        private String participantRole;
    }
}

