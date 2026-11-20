package com.cyclosa.workplace.entity;

import com.cyclosa.common.entity.BaseEntity;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.workplace.enums.IssueSeverity;
import com.cyclosa.workplace.enums.WorkplaceIssueStatus;
import com.cyclosa.workplace.enums.WorkplaceIssueType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "workplace_issues", indexes = {
        @Index(name = "idx_workplace_issues_reporter", columnList = "reporter_employee_id"),
        @Index(name = "idx_workplace_issues_status", columnList = "status"),
        @Index(name = "idx_workplace_issues_seat", columnList = "seat_id"),
        @Index(name = "idx_workplace_issues_assigned", columnList = "assigned_to_employee_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkplaceIssue extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_employee_id", nullable = false)
    private Employee reporterEmployee;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false, length = 30)
    private WorkplaceIssueType issueType;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false, length = 20)
    @Builder.Default
    private IssueSeverity severity = IssueSeverity.MEDIUM;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    private WorkplaceSeat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_object_id")
    private WorkplaceFloorObject floorObject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id")
    private WorkplaceFloor floor;

    @Column(name = "location_x", precision = 10, scale = 2)
    private BigDecimal locationX;

    @Column(name = "location_y", precision = 10, scale = 2)
    private BigDecimal locationY;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private WorkplaceIssueStatus status = WorkplaceIssueStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_employee_id")
    private Employee assignedToEmployee;

    @Column(name = "resolution_note", columnDefinition = "TEXT")
    private String resolutionNote;

    @Column(name = "reported_at", nullable = false)
    @Builder.Default
    private LocalDateTime reportedAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
