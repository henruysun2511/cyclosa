package com.cyclosa.reward.repository;

import com.cyclosa.reward.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID>, JpaSpecificationExecutor<Complaint> {

    @Query("SELECT c FROM Complaint c " +
            "JOIN FETCH c.complainantEmployee ce " +
            "LEFT JOIN FETCH c.handlerEmployee he " +
            "WHERE c.companyId = :companyId " +
            "ORDER BY c.submittedAt DESC")
    Page<Complaint> findAllWithDetails(@Param("companyId") UUID companyId, Pageable pageable);

    @Query("SELECT c FROM Complaint c " +
            "JOIN FETCH c.complainantEmployee ce " +
            "LEFT JOIN FETCH c.handlerEmployee he " +
            "WHERE ce.id = :employeeId " +
            "ORDER BY c.submittedAt DESC")
    Page<Complaint> findAllByEmployeeId(@Param("employeeId") UUID employeeId, Pageable pageable);

    @Query("SELECT c FROM Complaint c " +
            "JOIN FETCH c.complainantEmployee ce " +
            "LEFT JOIN FETCH c.handlerEmployee he " +
            "WHERE c.id = :id")
    Optional<Complaint> findByIdWithDetails(@Param("id") UUID id);
}

