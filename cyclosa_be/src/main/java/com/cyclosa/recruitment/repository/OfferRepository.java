package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.Offer;
import com.cyclosa.recruitment.enums.OfferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfferRepository extends JpaRepository<Offer, UUID>, JpaSpecificationExecutor<Offer> {

    Optional<Offer> findByApplication_Id(UUID applicationId);

    List<Offer> findByStatus(OfferStatus status);
}
