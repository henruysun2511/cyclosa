package com.cyclosa.payroll.dto.response;

import com.cyclosa.payroll.enums.ComponentFrequency;
import com.cyclosa.payroll.enums.SalaryComponentCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryComponentResponse {

    private UUID id;
    private String code;
    private String name;
    private SalaryComponentCategory category;
    private ComponentFrequency frequency;
    private BigDecimal defaultAmount;
    private Boolean isTaxable;
    private Boolean isInsuranceBase;
    private Boolean isSystem;
    private Boolean isActive;
    private String formula;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
