package com.cyclosa.leave.repository;

import com.cyclosa.leave.entity.LeaveType;
import com.cyclosa.leave.enums.LeaveGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, UUID>, JpaSpecificationExecutor<LeaveType> {

    Optional<LeaveType> findByCompanyIdAndCode(UUID companyId, String code);

    boolean existsByCompanyIdAndCode(UUID companyId, String code);

    boolean existsByCompanyIdAndCodeAndIdNot(UUID companyId, String code, UUID id);

    List<LeaveType> findByCompanyIdAndIsActiveTrue(UUID companyId);

    List<LeaveType> findByCompanyIdAndLeaveGroup(UUID companyId, LeaveGroup leaveGroup);
}

