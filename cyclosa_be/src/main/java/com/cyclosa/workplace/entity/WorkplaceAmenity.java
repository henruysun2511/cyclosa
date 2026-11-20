package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.organization.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "workplace_amenities", uniqueConstraints = {
        @UniqueConstraint(name = "uq_workplace_amenities_company_name", columnNames = {"company_id", "name"})
}, indexes = {
        @Index(name = "idx_workplace_amenities_company_id", columnList = "company_id")
})
@SQLDelete(sql = "UPDATE workplace_amenities SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceAmenity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "icon_name", length = 50)
    private String iconName;

    @Column(name = "description", length = 255)
    private String description;

    @ManyToMany(mappedBy = "amenities")
    @Builder.Default
    private Set<WorkplaceSeat> seats = new HashSet<>();
}
