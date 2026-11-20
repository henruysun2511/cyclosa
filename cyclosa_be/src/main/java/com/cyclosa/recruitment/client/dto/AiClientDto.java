package com.cyclosa.recruitment.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

public class AiClientDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CvScreenRequest {
        @JsonProperty("job_title")
        private String jobTitle;
        @JsonProperty("job_description")
        private String jobDescription;
        @JsonProperty("job_requirements")
        private String jobRequirements;
        private String requirements;
        @JsonProperty("cv_text")
        private String cvText;
        @JsonProperty("cv_url")
        private String cvUrl;
        @JsonProperty("ai_screening_consent")
        @Builder.Default
        private Boolean aiScreeningConsent = true;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CvScreenResponse {
        @JsonProperty("matching_score")
        private Double matchingScore;
        private String summary;
        private List<String> strengths;
        private List<String> weaknesses;
        @JsonProperty("missing_skills")
        private List<String> missingSkills;
        private String recommendation;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkExperienceItem {
        @JsonProperty("company_name")
        private String companyName;
        @JsonProperty("job_title")
        private String jobTitle;
        @JsonProperty("start_date")
        private String startDate;
        @JsonProperty("end_date")
        private String endDate;
        @JsonProperty("is_current")
        private Boolean isCurrent;
        private String description;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationItem {
        private String institution;
        private String degree;
        @JsonProperty("field_of_study")
        private String fieldOfStudy;
        @JsonProperty("graduation_year")
        private Integer graduationYear;
        private String gpa;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateParsedProfile {
        @JsonProperty("full_name")
        private String fullName;
        private String email;
        private String phone;
        @JsonProperty("date_of_birth")
        private String dateOfBirth;
        private String address;
        @JsonProperty("linkedin_url")
        private String linkedinUrl;
        @JsonProperty("portfolio_url")
        private String portfolioUrl;
        private List<String> skills;
        @JsonProperty("work_experiences")
        private List<WorkExperienceItem> workExperiences;
        private List<EducationItem> educations;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionRequest {
        @JsonProperty("job_title")
        private String jobTitle;
        @JsonProperty("seniority_level")
        private String seniorityLevel;
        @JsonProperty("focus_areas")
        private List<String> focusAreas;
        @JsonProperty("num_questions")
        private Integer numQuestions;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResponse {
        private String category;
        @JsonProperty("question_text")
        private String questionText;
        @JsonProperty("sample_answer")
        private String sampleAnswer;
        @JsonProperty("evaluation_criteria")
        private String evaluationCriteria;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QuestionResultWrapper {
        private List<QuestionResponse> questions;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScorecardScanRequest {
        private String comments;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlaggedItem {
        @JsonProperty("forbidden_phrase")
        private String forbiddenPhrase;
        private String category;
        private String suggestion;
        private String severity;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentScanResponse {
        @JsonProperty("is_clean")
        private Boolean isClean;
        @JsonProperty("flagged_items")
        private List<FlaggedItem> flaggedItems;
    }
}
