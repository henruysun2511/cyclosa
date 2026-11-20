package com.cyclosa.attendance.service.helper;

import java.math.BigDecimal;

/**
 * Helper tính toán khoảng cách GPS dựa trên công thức Haversine:
 * d = 2R * arcsin(sqrt(sin^2(delta_phi / 2) + cos(phi1) * cos(phi2) * sin^2(delta_lambda / 2)))
 */
public final class GeofencingHelper {

    /**
     * Bán kính trung bình của Trái Đất (mét)
     */
    public static final double EARTH_RADIUS_METERS = 6371000.0;

    private GeofencingHelper() {}

    /**
     * Tính khoảng cách giữa 2 tọa độ GPS theo mét.
     */
    public static double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi / 2.0) * Math.sin(deltaPhi / 2.0)
                + Math.cos(phi1) * Math.cos(phi2)
                * Math.sin(deltaLambda / 2.0) * Math.sin(deltaLambda / 2.0);

        double c = 2.0 * Math.asin(Math.sqrt(Math.min(1.0, a)));
        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Kiểm tra xem tọa độ chấm công có nằm trong bán kính cho phép của chi nhánh không:
     * d <= attendance_radius_meters
     */
    public static boolean isWithinRadius(BigDecimal punchLat, BigDecimal punchLon,
                                         BigDecimal branchLat, BigDecimal branchLon,
                                         int allowedRadiusMeters) {
        if (punchLat == null || punchLon == null || branchLat == null || branchLon == null) {
            return false;
        }

        double distance = calculateDistanceMeters(
                punchLat.doubleValue(), punchLon.doubleValue(),
                branchLat.doubleValue(), branchLon.doubleValue()
        );

        return distance <= allowedRadiusMeters;
    }
}

