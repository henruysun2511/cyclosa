package com.cyclosa.assistant.repository;

import com.cyclosa.assistant.entity.AiConversation;
import com.cyclosa.assistant.enums.AiConversationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AiConversationRepository extends JpaRepository<AiConversation, UUID>, JpaSpecificationExecutor<AiConversation> {

    List<AiConversation> findAllByUserIdAndCompanyIdAndStatusOrderByCreatedAtDesc(
            UUID userId, UUID companyId, AiConversationStatus status
    );

    Page<AiConversation> findAllByUserIdAndCompanyIdOrderByCreatedAtDesc(
            UUID userId, UUID companyId, Pageable pageable
    );

    Optional<AiConversation> findByIdAndUserId(UUID id, UUID userId);
}
