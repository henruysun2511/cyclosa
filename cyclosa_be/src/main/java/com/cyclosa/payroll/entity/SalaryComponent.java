package com.cyclosa.payroll.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.payroll.enums.ComponentFrequency;
import com.cyclosa.payroll.enums.SalaryComponentCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "salary_components", indexes = {
        @Index(name = "idx_salary_components_company", columnList = "company_id"),
        @Index(name = "idx_salary_components_category", columnList = "category")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_salary_components_company_code", columnNames = {"company_id", "code"})
})
@SQLDelete(sql = "UPDATE salary_components SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryComponent extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private SalaryComponentCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false, length = 20)
    private ComponentFrequency frequency;

    @Column(name = "default_amount", precision = 18, scale = 2)
    private BigDecimal defaultAmount;

    @Column(name = "is_taxable", nullable = false)
    @Builder.Default
    private Boolean isTaxable = true;

    @Column(name = "is_insurance_base", nullable = false)
    @Builder.Default
    private Boolean isInsuranceBase = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}

