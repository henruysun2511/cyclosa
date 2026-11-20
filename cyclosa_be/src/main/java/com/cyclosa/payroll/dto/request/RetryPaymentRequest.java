package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetryPaymentRequest {

    @NotEmpty(message = "Danh sách ID thanh toán cần chi trả lại không được rỗng")
    private List<UUID> paymentIds;

    private String note;
}
