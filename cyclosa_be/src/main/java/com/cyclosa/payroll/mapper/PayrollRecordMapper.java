package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.response.PayrollRecordLineResponse;
import com.cyclosa.payroll.dto.response.PayrollRecordResponse;
import com.cyclosa.payroll.entity.PayrollRecord;
import com.cyclosa.payroll.entity.PayrollRecordLine;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface PayrollRecordMapper {

    @Mapping(target = "payrollPeriodId", source = "payrollPeriod.id")
    PayrollRecordResponse toResponse(PayrollRecord entity);

    List<PayrollRecordResponse> toResponseList(List<PayrollRecord> entities);

    @Mapping(target = "payrollRecordId", source = "payrollRecord.id")
    PayrollRecordLineResponse toLineResponse(PayrollRecordLine line);

    List<PayrollRecordLineResponse> toLineResponseList(List<PayrollRecordLine> lines);
}
