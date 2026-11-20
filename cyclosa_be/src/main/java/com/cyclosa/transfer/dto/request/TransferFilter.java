package com.cyclosa.transfer.dto.request;

import com.cyclosa.transfer.enums.TransferStatus;
import com.cyclosa.transfer.enums.TransferType;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferFilter {

    private String keyword;
    private TransferStatus status;
    private TransferType transferType;
    private UUID departmentId;
    private Boolean isTemporary;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;
}
