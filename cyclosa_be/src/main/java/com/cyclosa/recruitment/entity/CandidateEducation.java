package com.cyclosa.recruitment.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "candidate_educations", indexes = {
        @Index(name = "idx_cand_edu_cand", columnList = "candidate_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE candidate_educations SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class CandidateEducation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "institution_name", nullable = false, length = 150)
    private String institutionName;

    @Column(name = "degree", nullable = false, length = 100)
    private String degree;

    @Column(name = "major", nullable = false, length = 100)
    private String major;

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(name = "gpa", length = 20)
    private String gpa;
}
