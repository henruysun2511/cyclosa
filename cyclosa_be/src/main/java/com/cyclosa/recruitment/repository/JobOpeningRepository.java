package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobOpeningRepository extends JpaRepository<JobOpening, UUID>, JpaSpecificationExecutor<JobOpening> {

    Optional<JobOpening> findByLandingSlug(String landingSlug);

    boolean existsByLandingSlug(String landingSlug);

    List<JobOpening> findByCompanyIdAndStatus(UUID companyId, JobOpeningStatus status);
}
