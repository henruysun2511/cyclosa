package com.cyclosa.recruitment.repository;

import com.cyclosa.recruitment.entity.OfferAllowance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfferAllowanceRepository extends JpaRepository<OfferAllowance, UUID> {

    List<OfferAllowance> findByOffer_Id(UUID offerId);

    void deleteByOffer_Id(UUID offerId);
}
