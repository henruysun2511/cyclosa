package com.cyclosa.recruitment.dto;

import com.cyclosa.recruitment.enums.InterviewRoundType;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class JobOpeningDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CriterionRequest {
        @NotBlank(message = "Tên tiêu chí không được để trống")
        private String name;
        private String description;
        private BigDecimal weight;
        private Integer maxScore;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionRequest {
        @NotBlank(message = "Nội dung câu hỏi không được để trống")
        private String questionText;
        private String category;
        private String sampleAnswer;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoundConfigRequest {
        private UUID id;
        @NotNull(message = "Thứ tự vòng phỏng vấn không được để trống")
        private Integer roundOrder;
        @NotBlank(message = "Tên vòng phỏng vấn không được để trống")
        private String name;
        @NotNull(message = "Loại vòng phỏng vấn không được để trống")
        private InterviewRoundType roundType;
        private String description;
        private BigDecimal passScore;
        private List<CriterionRequest> criteria;
        private List<QuestionRequest> questions;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        private UUID recruitmentRequestId;

        @NotNull(message = "Phòng ban không được để trống")
        private UUID departmentId;

        private UUID positionId;

        @NotBlank(message = "Tiêu đề vị trí tuyển dụng không được để trống")
        private String title;

        @NotNull(message = "Số lượng chỉ tiêu không được để trống")
        @Min(value = 1, message = "Số lượng chỉ tiêu phải từ 1 người trở lên")
        private Integer targetQuantity;

        private String jobDescription;
        private String requirements;
        private String benefits;
        private BigDecimal salaryRangeMin;
        private BigDecimal salaryRangeMax;
        private Boolean isSalaryNegotiable;
        private String employmentType;
        private String workLocation;
        private LocalDate publishDate;
        private LocalDate closingDate;

        @Valid
        private List<RoundConfigRequest> interviewRounds;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private Integer targetQuantity;
        private String jobDescription;
        private String requirements;
        private String benefits;
        private BigDecimal salaryRangeMin;
        private BigDecimal salaryRangeMax;
        private Boolean isSalaryNegotiable;
        private String employmentType;
        private String workLocation;
        private LocalDate publishDate;
        private LocalDate closingDate;
        private JobOpeningStatus status;
        private List<RoundConfigRequest> interviewRounds;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoundResponse {
        private UUID id;
        private Integer roundOrder;
        private String name;
        private InterviewRoundType roundType;
        private String description;
        private BigDecimal passScore;
        private List<CriterionResponse> criteria;
        private List<QuestionResponse> questions;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CriterionResponse {
        private UUID id;
        private String name;
        private String description;
        private BigDecimal weight;
        private Integer maxScore;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResponse {
        private UUID id;
        private String questionText;
        private String category;
        private String sampleAnswer;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String jobCode;
        private UUID recruitmentRequestId;
        private UUID departmentId;
        private UUID positionId;
        private String title;
        private Integer targetQuantity;
        private Integer hiredQuantity;
        private String jobDescription;
        private String requirements;
        private String benefits;
        private BigDecimal salaryRangeMin;
        private BigDecimal salaryRangeMax;
        private Boolean isSalaryNegotiable;
        private String employmentType;
        private String workLocation;
        private LocalDate publishDate;
        private LocalDate closingDate;
        private JobOpeningStatus status;
        private List<RoundResponse> interviewRounds;
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
        private UUID departmentId;
        private JobOpeningStatus status;
        private String employmentType;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
