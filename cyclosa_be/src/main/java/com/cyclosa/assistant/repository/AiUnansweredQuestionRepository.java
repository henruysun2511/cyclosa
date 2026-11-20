package com.cyclosa.assistant.repository;

import com.cyclosa.assistant.entity.AiUnansweredQuestion;
import com.cyclosa.assistant.enums.UnansweredQuestionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AiUnansweredQuestionRepository extends JpaRepository<AiUnansweredQuestion, UUID>, JpaSpecificationExecutor<AiUnansweredQuestion> {

    Page<AiUnansweredQuestion> findAllByCompanyId(UUID companyId, Pageable pageable);

    Page<AiUnansweredQuestion> findAllByCompanyIdAndStatus(UUID companyId, UnansweredQuestionStatus status, Pageable pageable);

    Optional<AiUnansweredQuestion> findByIdAndCompanyId(UUID id, UUID companyId);

    long countByCompanyIdAndStatus(UUID companyId, UnansweredQuestionStatus status);
}
