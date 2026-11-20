package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.request.CreatePayrollPeriodRequest;
import com.cyclosa.payroll.dto.request.UpdatePayrollPeriodRequest;
import com.cyclosa.payroll.dto.response.PayrollPeriodResponse;
import com.cyclosa.payroll.entity.PayrollPeriod;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface PayrollPeriodMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "status", constant = "OPEN")
    PayrollPeriod toEntity(CreatePayrollPeriodRequest request);

    void updateEntityFromDto(UpdatePayrollPeriodRequest request, @MappingTarget PayrollPeriod entity);

    PayrollPeriodResponse toResponse(PayrollPeriod entity);

    List<PayrollPeriodResponse> toResponseList(List<PayrollPeriod> entities);
}
