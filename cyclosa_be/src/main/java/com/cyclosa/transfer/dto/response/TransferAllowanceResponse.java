package com.cyclosa.transfer.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferAllowanceResponse {

    private UUID id;
    private String allowanceName;
    private BigDecimal amount;
    private String notes;
    private LocalDateTime createdAt;
}
