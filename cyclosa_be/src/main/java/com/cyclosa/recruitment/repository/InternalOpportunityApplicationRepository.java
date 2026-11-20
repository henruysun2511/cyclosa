package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.InternalOpportunityApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InternalOpportunityApplicationRepository extends JpaRepository<InternalOpportunityApplication, UUID> {

    List<InternalOpportunityApplication> findByOpportunity_Id(UUID opportunityId);

    List<InternalOpportunityApplication> findByEmployeeId(UUID employeeId);

    boolean existsByOpportunity_IdAndEmployeeId(UUID opportunityId, UUID employeeId);
}
