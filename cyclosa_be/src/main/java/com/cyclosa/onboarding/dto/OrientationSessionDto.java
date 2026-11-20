package com.cyclosa.onboarding.dto;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.onboarding.enums.OrientationSessionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class OrientationSessionDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu lên lịch buổi đào tạo định hướng")
    public static class CreateRequest {
        @NotNull(message = "Công ty không được để trống")
        private UUID companyId;

        @NotBlank(message = "Tên buổi đào tạo không được để trống")
        private String title;

        private String description;

        @NotNull(message = "Thời gian bắt đầu không được để trống")
        private LocalDateTime startTime;

        @NotNull(message = "Thời gian kết thúc không được để trống")
        private LocalDateTime endTime;

        @NotBlank(message = "Địa điểm hoặc đường dẫn phòng học không được để trống")
        private String location;

        @NotNull(message = "Giảng viên nội bộ không được để trống")
        private UUID trainerEmployeeId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật buổi đào tạo định hướng")
    public static class UpdateRequest {
        @NotBlank(message = "Tên buổi đào tạo không được để trống")
        private String title;

        private String description;

        @NotNull(message = "Thời gian bắt đầu không được để trống")
        private LocalDateTime startTime;

        @NotNull(message = "Thời gian kết thúc không được để trống")
        private LocalDateTime endTime;

        @NotBlank(message = "Địa điểm hoặc đường dẫn phòng học không được để trống")
        private String location;

        @NotNull(message = "Giảng viên nội bộ không được để trống")
        private UUID trainerEmployeeId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu điểm danh tham dự buổi đào tạo định hướng")
    public static class AttendanceRequest {
        @NotEmpty(message = "Danh sách nhân viên tham dự không được để trống")
        private List<UUID> employeeIds;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin phản hồi buổi đào tạo định hướng")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String title;
        private String description;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String location;
        private UUID trainerEmployeeId;
        private String trainerName;
        private OrientationSessionStatus status;
        private Integer attendeeCount;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Tham số lọc buổi đào tạo định hướng")
    public static class FilterRequest extends BaseFilterRequest {
        private UUID companyId;
        private OrientationSessionStatus status;
        private LocalDateTime from;
        private LocalDateTime to;
    }
}

