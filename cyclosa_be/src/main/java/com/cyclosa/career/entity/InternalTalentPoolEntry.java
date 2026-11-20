package com.cyclosa.career.entity;

import com.cyclosa.career.enums.TalentTag;
import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "internal_talent_pool_entries", indexes = {
        @Index(name = "idx_talent_pool_comp", columnList = "company_id"),
        @Index(name = "idx_talent_pool_emp", columnList = "employee_id"),
        @Index(name = "idx_talent_pool_tag", columnList = "tag")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalTalentPoolEntry extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "tag", nullable = false, length = 50)
    private TalentTag tag;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;
}
