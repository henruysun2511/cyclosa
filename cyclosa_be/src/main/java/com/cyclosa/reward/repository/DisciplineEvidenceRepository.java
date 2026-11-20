package com.cyclosa.reward.repository;

import com.cyclosa.reward.entity.DisciplineEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisciplineEvidenceRepository extends JpaRepository<DisciplineEvidence, UUID> {

    List<DisciplineEvidence> findAllByDisciplineCaseId(UUID disciplineCaseId);
}
