package com.cyclosa.dashboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkplaceDashboardResponse {

    // ── 4 KPIs ──
    private Double deskOccupancyRateToday;
    private Double meetingRoomOccupancyRate;
    private Long totalAssignedAssetValue;
    private String formattedAssetValue;
    private Long damagedOrPendingAssetsCount;

    // ── BIỂU ĐỒ ──
    private List<FloorOccupancyPoint> floorOccupancy;
    private List<PeakMeetingHourPoint> peakMeetingHours;
    private List<AssetCategorySharePoint> assetCategoryDistribution;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FloorOccupancyPoint {
        private String floorName;
        private Long totalSeats;
        private Long occupiedSeats;
        private Double occupancyRate;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeakMeetingHourPoint {
        private String hourSlot; // 08:00, 09:00, ...
        private Long bookingCount;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssetCategorySharePoint {
        private String categoryName;
        private Long totalQuantity;
        private Long assignedQuantity;
        private Double assignedPercentage;
    }
}
