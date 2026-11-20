package com.cyclosa.payroll.repository;

import com.cyclosa.payroll.entity.SalaryComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryComponentRepository extends JpaRepository<SalaryComponent, UUID>, JpaSpecificationExecutor<SalaryComponent> {

    Optional<SalaryComponent> findByCompanyIdAndCode(UUID companyId, String code);

    boolean existsByCompanyIdAndCode(UUID companyId, String code);

    List<SalaryComponent> findAllByCompanyIdAndIsActiveTrue(UUID companyId);
}

