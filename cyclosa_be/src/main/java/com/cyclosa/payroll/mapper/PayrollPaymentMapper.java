package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.response.PayrollPaymentResponse;
import com.cyclosa.payroll.entity.PayrollPayment;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface PayrollPaymentMapper {

    @Mapping(target = "payrollRecordId", source = "payrollRecord.id")
    @Mapping(target = "employeeId", source = "payrollRecord.employeeId")
    PayrollPaymentResponse toResponse(PayrollPayment entity);

    List<PayrollPaymentResponse> toResponseList(List<PayrollPayment> entities);
}
