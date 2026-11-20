package com.cyclosa.leave.repository;

import com.cyclosa.contract.entity.enums.ContractType;
import com.cyclosa.leave.entity.LeavePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, UUID>, JpaSpecificationExecutor<LeavePolicy> {

    boolean existsByCompanyIdAndLeaveTypeIdAndContractTypeAndEffectiveFrom(
            UUID companyId, UUID leaveTypeId, ContractType contractType, LocalDate effectiveFrom);

    boolean existsByCompanyIdAndLeaveTypeIdAndContractTypeAndEffectiveFromAndIdNot(
            UUID companyId, UUID leaveTypeId, ContractType contractType, LocalDate effectiveFrom, UUID id);

    @Query("SELECT lp FROM LeavePolicy lp JOIN FETCH lp.leaveType " +
            "WHERE lp.companyId = :companyId " +
            "AND lp.leaveType.id = :leaveTypeId " +
            "AND (lp.contractType IS NULL OR lp.contractType = :contractType) " +
            "AND lp.effectiveFrom <= :effectiveDate " +
            "ORDER BY lp.contractType DESC NULLS LAST, lp.effectiveFrom DESC")
    List<LeavePolicy> findApplicablePolicies(
            @Param("companyId") UUID companyId,
            @Param("leaveTypeId") UUID leaveTypeId,
            @Param("contractType") ContractType contractType,
            @Param("effectiveDate") LocalDate effectiveDate);

    boolean existsByLeaveTypeId(UUID leaveTypeId);
}

