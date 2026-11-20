package com.cyclosa.career.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.organization.entity.JobTitle;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "career_paths", indexes = {
        @Index(name = "idx_career_path_company_id", columnList = "company_id"),
        @Index(name = "idx_career_path_from", columnList = "from_job_title_id"),
        @Index(name = "idx_career_path_to", columnList = "to_job_title_id")
})
@SQLDelete(sql = "UPDATE career_paths SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPath extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_job_title_id", nullable = false)
    private JobTitle fromJobTitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_job_title_id", nullable = false)
    private JobTitle toJobTitle;

    @Column(name = "min_experience_years", nullable = false, precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal minExperienceYears = BigDecimal.valueOf(1.0);

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;
}
