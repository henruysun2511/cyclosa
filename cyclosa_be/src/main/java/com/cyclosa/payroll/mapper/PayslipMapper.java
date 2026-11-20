package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.response.PayslipResponse;
import com.cyclosa.payroll.entity.Payslip;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface PayslipMapper {

    @Mapping(target = "payrollPeriodId", expression = "java(entity.getPayrollRecord() != null && entity.getPayrollRecord().getPayrollPeriod() != null ? entity.getPayrollRecord().getPayrollPeriod().getId() : null)")
    @Mapping(target = "payrollPeriodCode", expression = "java(entity.getPayrollRecord() != null && entity.getPayrollRecord().getPayrollPeriod() != null ? entity.getPayrollRecord().getPayrollPeriod().getCode() : null)")
    @Mapping(target = "payrollPeriodName", expression = "java(entity.getPayrollRecord() != null && entity.getPayrollRecord().getPayrollPeriod() != null ? entity.getPayrollRecord().getPayrollPeriod().getName() : null)")
    @Mapping(target = "startDate", expression = "java(entity.getPayrollRecord() != null && entity.getPayrollRecord().getPayrollPeriod() != null ? entity.getPayrollRecord().getPayrollPeriod().getStartDate() : null)")
    @Mapping(target = "endDate", expression = "java(entity.getPayrollRecord() != null && entity.getPayrollRecord().getPayrollPeriod() != null ? entity.getPayrollRecord().getPayrollPeriod().getEndDate() : null)")
    @Mapping(target = "lines", ignore = true)
    PayslipResponse toResponse(Payslip entity);

    List<PayslipResponse> toResponseList(List<Payslip> entities);
}
