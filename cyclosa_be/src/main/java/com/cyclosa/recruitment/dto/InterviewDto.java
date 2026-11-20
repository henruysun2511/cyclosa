package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.InterviewFormat;
import com.cyclosa.recruitment.enums.InterviewStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class InterviewDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        @NotNull(message = "Hồ sơ ứng tuyển không được để trống")
        private UUID applicationId;

        @NotNull(message = "Vòng phỏng vấn không được để trống")
        private UUID roundId;

        @NotBlank(message = "Tiêu đề buổi phỏng vấn không được để trống")
        private String title;

        @NotNull(message = "Thời gian bắt đầu không được để trống")
        @Future(message = "Thời gian phỏng vấn phải ở tương lai")
        private LocalDateTime startTime;

        @NotNull(message = "Thời gian kết thúc không được để trống")
        private LocalDateTime endTime;

        @NotNull(message = "Hình thức phỏng vấn không được để trống")
        private InterviewFormat format;

        private String location;
        private String meetingLink;
        private String instructions;

        @NotEmpty(message = "Danh sách người phỏng vấn không được để trống")
        private List<UUID> interviewerIds;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RescheduleRequest {
        @NotNull(message = "Thời gian bắt đầu mới không được để trống")
        private LocalDateTime startTime;

        @NotNull(message = "Thời gian kết thúc mới không được để trống")
        private LocalDateTime endTime;

        private String location;
        private String meetingLink;
        private String reason;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancelRequest {
        @NotBlank(message = "Lý do hủy phỏng vấn không được để trống")
        private String reason;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PanelistResponse {
        private UUID id;
        private UUID interviewerId;
        private String interviewerName;
        private String interviewerEmail;
        private Boolean isLead;
        private Boolean hasSubmittedScorecard;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String interviewCode;
        private UUID applicationId;
        private String applicationCode;
        private String candidateName;
        private UUID roundId;
        private String roundName;
        private String title;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private InterviewFormat format;
        private String location;
        private String meetingLink;
        private String instructions;
        private InterviewStatus status;
        private String cancellationReason;
        private List<PanelistResponse> panelists;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterRequest {
        private UUID companyId;
        private UUID roundId;
        private UUID applicationId;
        private InterviewStatus status;
        private InterviewFormat format;
        private LocalDateTime fromDate;
        private LocalDateTime toDate;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
