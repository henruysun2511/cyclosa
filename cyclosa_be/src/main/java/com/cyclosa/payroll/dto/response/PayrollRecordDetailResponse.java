package com.cyclosa.payroll.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRecordDetailResponse {

    private PayrollRecordResponse record;
    private List<PayrollRecordLineResponse> lines;
}

