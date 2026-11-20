package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.ScorecardScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScorecardScoreRepository extends JpaRepository<ScorecardScore, UUID> {

    List<ScorecardScore> findByScorecard_Id(UUID scorecardId);

    void deleteByScorecard_Id(UUID scorecardId);
}
