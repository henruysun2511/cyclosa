package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.JobPosting;
import com.cyclosa.recruitment.enums.JobPostingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, UUID> {

    List<JobPosting> findByJobOpening_Id(UUID jobOpeningId);

    Optional<JobPosting> findByJobOpening_IdAndChannel_Id(UUID jobOpeningId, UUID channelId);

    List<JobPosting> findByStatus(JobPostingStatus status);
}
