package com.cyclosa.assistant.enums;

import lombok.Getter;

@Getter
public enum KnowledgeCategory {
    HR_POLICY("Chính sách & Quy chế Nhân sự"),
    EMPLOYEE_HANDBOOK("Sổ tay Văn hóa Doanh nghiệp"),
    SYSTEM_GUIDE("Hướng dẫn Sử dụng Hệ thống"),
    LEGAL_COMPLIANCE("Quy định Pháp luật & Tuân thủ");

    private final String description;

    KnowledgeCategory(String description) {
        this.description = description;
    }
}
