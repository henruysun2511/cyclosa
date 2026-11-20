package com.cyclosa.workplace.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class WorkplaceReportResponse {
    private Integer totalSeats;
    private Integer dedicatedSeats;
    private Integer hotDesks;
    private Integer assignedSeats;
    private Integer occupiedHotDesksToday;
    private BigDecimal averageOccupancyRate;
    private Integer openIssuesCount;
    private List<DailyUtilizationDto> dailyTrend;

    @Data
    @Builder
    public static class DailyUtilizationDto {
        private String dayOfWeek;
        private Integer bookingCount;
        private BigDecimal rate;
    }
}
