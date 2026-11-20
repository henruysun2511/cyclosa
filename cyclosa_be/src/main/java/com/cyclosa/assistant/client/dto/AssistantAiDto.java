package com.cyclosa.assistant.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

public class AssistantAiDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatMessage {
        private String role;
        private String content;
        private String timestamp;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class UserContext {
        @JsonProperty("user_id")
        private String userId;

        @JsonProperty("employee_id")
        private String employeeId;

        @JsonProperty("full_name")
        private String fullName;

        @JsonProperty("department_id")
        private String departmentId;

        @JsonProperty("department_name")
        private String departmentName;

        @JsonProperty("job_title")
        private String jobTitle;

        private List<String> roles;

        @JsonProperty("company_id")
        private String companyId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatRequest {
        private String query;

        @JsonProperty("user_context")
        private UserContext userContext;

        @JsonProperty("conversation_history")
        private List<ChatMessage> conversationHistory;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Citation {
        @JsonProperty("document_title")
        private String documentTitle;

        private String section;

        @JsonProperty("content_snippet")
        private String contentSnippet;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatResponseData {
        private String response;
        private String intent;

        @JsonProperty("function_called")
        private String functionCalled;

        @JsonProperty("function_args")
        private Map<String, Object> functionArgs;

        @JsonProperty("chart_config")
        private String chartConfig;

        private List<Citation> citations;
        private String disclaimer;

        @JsonProperty("execution_time_ms")
        private Integer executionTimeMs;
    }
}
