package com.cyclosa.career.repository;

import com.cyclosa.career.entity.CareerPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CareerPathRepository extends JpaRepository<CareerPath, UUID>, JpaSpecificationExecutor<CareerPath> {

    @Query("SELECT cp FROM CareerPath cp JOIN FETCH cp.fromJobTitle JOIN FETCH cp.toJobTitle WHERE cp.id = :id")
    Optional<CareerPath> findByIdWithDetails(@Param("id") UUID id);

    boolean existsByCompanyIdAndFromJobTitleIdAndToJobTitleId(UUID companyId, UUID fromId, UUID toId);

    boolean existsByCompanyIdAndFromJobTitleIdAndToJobTitleIdAndIdNot(UUID companyId, UUID fromId, UUID toId, UUID id);

    @Query("SELECT cp FROM CareerPath cp JOIN FETCH cp.fromJobTitle JOIN FETCH cp.toJobTitle WHERE cp.companyId = :companyId AND cp.fromJobTitle.id = :fromJobTitleId")
    List<CareerPath> findAllByFromJobTitle(@Param("companyId") UUID companyId, @Param("fromJobTitleId") UUID fromJobTitleId);

    @Query("SELECT cp FROM CareerPath cp JOIN FETCH cp.fromJobTitle JOIN FETCH cp.toJobTitle WHERE cp.companyId = :companyId")
    List<CareerPath> findAllByCompanyIdWithDetails(@Param("companyId") UUID companyId);
}
