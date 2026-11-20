package com.cyclosa.restructure.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.restructure.enums.RestructureActionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "scenario_actions", indexes = {
        @Index(name = "idx_scen_actions_scen", columnList = "scenario_id, created_at")
})
@SQLDelete(sql = "UPDATE scenario_actions SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioAction extends BaseEntity {

    @Column(name = "company_id")
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scenario_id", nullable = false)
    private OrgScenario scenario;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 50)
    private RestructureActionType actionType;

    @Column(name = "payload", columnDefinition = "TEXT", nullable = false)
    private String payload;

    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "executed_by", nullable = false)
    private UUID executedBy;
}
