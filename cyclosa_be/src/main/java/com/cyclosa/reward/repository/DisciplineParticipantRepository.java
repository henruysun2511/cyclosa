package com.cyclosa.reward.repository;

import com.cyclosa.reward.entity.DisciplineParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisciplineParticipantRepository extends JpaRepository<DisciplineParticipant, UUID> {

    @Query("SELECT p FROM DisciplineParticipant p " +
            "JOIN FETCH p.employee e " +
            "WHERE p.disciplineCase.id = :disciplineCaseId")
    List<DisciplineParticipant> findAllByDisciplineCaseIdWithEmployee(@Param("disciplineCaseId") UUID disciplineCaseId);

    void deleteAllByDisciplineCaseId(UUID disciplineCaseId);
}

