package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.RecruitmentRequest;
import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecruitmentRequestRepository extends JpaRepository<RecruitmentRequest, UUID>, JpaSpecificationExecutor<RecruitmentRequest> {

    List<RecruitmentRequest> findByCompanyIdAndStatus(UUID companyId, RecruitmentRequestStatus status);
}
