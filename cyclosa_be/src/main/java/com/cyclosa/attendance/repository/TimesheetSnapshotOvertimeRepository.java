package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.TimesheetSnapshotOvertime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimesheetSnapshotOvertimeRepository extends JpaRepository<TimesheetSnapshotOvertime, UUID> {
    List<TimesheetSnapshotOvertime> findBySnapshotId(UUID snapshotId);
}

