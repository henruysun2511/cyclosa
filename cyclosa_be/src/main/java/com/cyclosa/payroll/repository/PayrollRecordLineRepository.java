package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.PayrollRecordLine;
import com.cyclosa.payroll.enums.PayrollLineType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PayrollRecordLineRepository extends JpaRepository<PayrollRecordLine, UUID>, JpaSpecificationExecutor<PayrollRecordLine> {

    List<PayrollRecordLine> findAllByPayrollRecordId(UUID payrollRecordId);

    List<PayrollRecordLine> findAllByPayrollRecordIdAndLineType(UUID payrollRecordId, PayrollLineType lineType);

    boolean existsByRewardDecisionId(UUID rewardDecisionId);

    boolean existsByDisciplineCaseId(UUID disciplineCaseId);

    void deleteAllByPayrollRecordId(UUID payrollRecordId);
}

