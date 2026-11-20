package com.cyclosa.transfer.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferStatisticsResponse {

    private long total;
    private long pendingApprovalCount;
    private long approvedCount;
    private long temporaryDispatchCount;
}
