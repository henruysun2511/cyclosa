package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "job_openings", indexes = {
        @Index(name = "idx_job_openings_company_status", columnList = "company_id, status"),
        @Index(name = "idx_job_openings_landing_slug", columnList = "landing_slug", unique = true),
        @Index(name = "idx_job_openings_dept", columnList = "department_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE job_openings SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class JobOpening extends BaseEntity {

    @Column(name = "recruitment_request_id")
    private UUID recruitmentRequestId;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;

    @Column(name = "job_title_id", nullable = false)
    private UUID jobTitleId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "required_quantity", nullable = false)
    private Integer requiredQuantity;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirements", nullable = false, columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "requirements_version", nullable = false)
    @Builder.Default
    private Integer requirementsVersion = 1;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "salary_band_min", precision = 15, scale = 2)
    private BigDecimal salaryBandMin;

    @Column(name = "salary_band_max", precision = 15, scale = 2)
    private BigDecimal salaryBandMax;

    @Column(name = "is_salary_negotiable", nullable = false)
    @Builder.Default
    private Boolean isSalaryNegotiable = true;

    @Column(name = "work_location", length = 255)
    private String workLocation;

    @Column(name = "deadline_date", nullable = false)
    private LocalDate deadlineDate;

    @Column(name = "landing_slug", nullable = false, unique = true, length = 255)
    private String landingSlug;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private JobOpeningStatus status = JobOpeningStatus.DRAFT;
}
