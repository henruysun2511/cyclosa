package com.cyclosa.workplace.dto.request;

import com.cyclosa.workplace.enums.IssueSeverity;
import com.cyclosa.workplace.enums.WorkplaceIssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateWorkplaceIssueRequest {
    @NotNull(message = "Loại sự cố không được để trống")
    private WorkplaceIssueType issueType;

    private IssueSeverity severity = IssueSeverity.MEDIUM;

    @NotBlank(message = "Tiêu đề sự cố không được để trống")
    private String title;

    @NotBlank(message = "Mô tả sự cố không được để trống")
    private String description;

    private UUID seatId;
    private UUID floorObjectId;
    private UUID floorId;
    private BigDecimal locationX;
    private BigDecimal locationY;
}
