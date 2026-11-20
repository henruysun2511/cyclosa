package com.cyclosa.recruitment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class CandidateDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceDto {
        private UUID id;
        @NotBlank(message = "Tên công ty không được để trống")
        private String companyName;
        @NotBlank(message = "Chức danh không được để trống")
        private String jobTitle;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isCurrent;
        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationDto {
        private UUID id;
        @NotBlank(message = "Tên trường không được để trống")
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private Integer graduationYear;
        private String gpa;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDto {
        private UUID id;
        @NotBlank(message = "Tên kỹ năng không được để trống")
        private String skillName;
        private String proficiencyLevel;
        private Integer yearsOfExperience;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Pháp nhân công ty không được để trống")
        private UUID companyId;

        @NotBlank(message = "Họ và tên ứng viên không được để trống")
        private String fullName;

        @Email(message = "Email ứng viên không hợp lệ")
        private String email;

        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private String linkedinUrl;
        private String portfolioUrl;
        private String cvFileUrl;
        private String originalCvFileName;
        private String notes;

        private List<ExperienceDto> workExperiences;
        private List<EducationDto> educations;
        private List<SkillDto> skills;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String fullName;
        private String email;
        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private String linkedinUrl;
        private String portfolioUrl;
        private String cvFileUrl;
        private String originalCvFileName;
        private String notes;
        private Boolean isBlacklisted;
        private String blacklistReason;

        private List<ExperienceDto> workExperiences;
        private List<EducationDto> educations;
        private List<SkillDto> skills;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String candidateCode;
        private String fullName;
        private String email;
        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private String linkedinUrl;
        private String portfolioUrl;
        private String cvFileUrl;
        private String originalCvFileName;
        private Boolean isBlacklisted;
        private String blacklistReason;
        private String notes;
        private List<ExperienceDto> workExperiences;
        private List<EducationDto> educations;
        private List<SkillDto> skills;
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
        private Boolean isBlacklisted;
        private String keyword;
        @Builder.Default
        private int page = 0;
        @Builder.Default
        private int size = 20;
    }
}
