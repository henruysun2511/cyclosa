package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.RetentionStartEvent;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "retention_policies", indexes = {
        @Index(name = "idx_retention_policies_company", columnList = "company_id"),
        @Index(name = "idx_retention_policies_start_event", columnList = "start_event")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE retention_policies SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class RetentionPolicy extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "retention_months", nullable = false)
    private Integer retentionMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "start_event", nullable = false, length = 30)
    private RetentionStartEvent startEvent;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
