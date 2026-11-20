package com.cyclosa.restructure.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.restructure.enums.ScenarioScope;
import com.cyclosa.restructure.enums.ScenarioStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "org_scenarios", indexes = {
        @Index(name = "idx_org_scenarios_comp_status", columnList = "company_id, status")
})
@SQLDelete(sql = "UPDATE org_scenarios SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrgScenario extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope", nullable = false, length = 30)
    @Builder.Default
    private ScenarioScope scope = ScenarioScope.COMPANY_WIDE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private ScenarioStatus status = ScenarioStatus.DRAFT;

    @Column(name = "target_effective_date", nullable = false)
    private LocalDate targetEffectiveDate;

    @Column(name = "executed_at")
    private LocalDateTime executedAt;

    @Column(name = "executed_by")
    private UUID executedBy;
}
