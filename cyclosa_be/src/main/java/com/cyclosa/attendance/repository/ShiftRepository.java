package com.cyclosa.attendance.repository;

import com.cyclosa.attendance.entity.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, UUID>, JpaSpecificationExecutor<Shift> {

    Optional<Shift> findByIdAndCompanyId(UUID id, UUID companyId);

    boolean existsByCompanyIdAndCodeIgnoreCase(UUID companyId, String code);

    @Query("SELECT s FROM Shift s WHERE s.companyId = :companyId AND s.isActive = true ORDER BY s.startTime ASC")
    List<Shift> findAllActiveByCompanyId(@Param("companyId") UUID companyId);

    @Query("SELECT s FROM Shift s WHERE s.companyId = :companyId " +
           "AND (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:isActive IS NULL OR s.isActive = :isActive)")
    Page<Shift> searchShifts(
            @Param("companyId") UUID companyId,
            @Param("keyword") String keyword,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );
}

