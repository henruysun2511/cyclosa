package com.cyclosa.workplace.repository;

import com.cyclosa.workplace.entity.WorkplaceIssue;
import com.cyclosa.workplace.enums.IssueSeverity;
import com.cyclosa.workplace.enums.WorkplaceIssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkplaceIssueRepository extends JpaRepository<WorkplaceIssue, UUID> {
    List<WorkplaceIssue> findByReporterEmployeeIdOrderByReportedAtDesc(UUID reporterEmployeeId);

    Page<WorkplaceIssue> findAllByOrderByReportedAtDesc(Pageable pageable);

    @Query("SELECT i FROM WorkplaceIssue i " +
            "WHERE (:status IS NULL OR i.status = :status) " +
            "AND (:severity IS NULL OR i.severity = :severity) " +
            "AND (:floorId IS NULL OR i.floor.id = :floorId OR i.seat.seatRow.zone.floor.id = :floorId OR i.floorObject.floor.id = :floorId)")
    Page<WorkplaceIssue> findIssuesFiltered(
            @Param("status") WorkplaceIssueStatus status,
            @Param("severity") IssueSeverity severity,
            @Param("floorId") UUID floorId,
            Pageable pageable
    );
}
