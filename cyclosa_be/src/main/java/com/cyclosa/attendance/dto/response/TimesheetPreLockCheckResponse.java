package com.cyclosa.attendance.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Kết quả kiểm tra trước khi khóa sổ kỳ công (Pre-lock check)")
public class TimesheetPreLockCheckResponse {

    private boolean canLock;
    private long pendingRequestCount;
    private long missingPunchCount;
    private long unexplainedAbsentCount;
    private List<String> warnings;
}

