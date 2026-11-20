package com.cyclosa.document.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.document.enums.DossierPurpose;
import com.cyclosa.document.enums.DossierStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "dossiers", indexes = {
        @Index(name = "idx_dossiers_employee", columnList = "employee_id"),
        @Index(name = "idx_dossiers_company", columnList = "company_id"),
        @Index(name = "idx_dossiers_purpose", columnList = "purpose")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE dossiers SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Dossier extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "dossier_code", nullable = false, length = 50)
    private String dossierCode;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 30)
    @Builder.Default
    private DossierPurpose purpose = DossierPurpose.RECRUITMENT;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private DossierStatus status = DossierStatus.ACTIVE;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "dossier")
    @Builder.Default
    private List<Document> documents = new ArrayList<>();
}
