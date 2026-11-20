package com.cyclosa.career.repository;

import com.cyclosa.career.entity.InternalTalentPoolEntry;
import com.cyclosa.career.enums.TalentTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InternalTalentPoolRepository extends JpaRepository<InternalTalentPoolEntry, UUID>, JpaSpecificationExecutor<InternalTalentPoolEntry> {

    boolean existsByEmployeeIdAndTag(UUID employeeId, TalentTag tag);

    List<InternalTalentPoolEntry> findAllByEmployeeId(UUID employeeId);

    @Query("SELECT ite FROM InternalTalentPoolEntry ite JOIN FETCH ite.employee WHERE ite.companyId = :companyId")
    List<InternalTalentPoolEntry> findAllByCompanyIdWithEmployee(@Param("companyId") UUID companyId);

    long countByCompanyId(UUID companyId);

    long countByCompanyIdAndTag(UUID companyId, TalentTag tag);
}
