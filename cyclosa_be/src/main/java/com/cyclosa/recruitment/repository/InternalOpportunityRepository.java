package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.InternalOpportunity;
import com.cyclosa.recruitment.enums.InternalOpportunityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InternalOpportunityRepository extends JpaRepository<InternalOpportunity, UUID>, JpaSpecificationExecutor<InternalOpportunity> {

    List<InternalOpportunity> findByCompanyIdAndStatus(UUID companyId, InternalOpportunityStatus status);
}
