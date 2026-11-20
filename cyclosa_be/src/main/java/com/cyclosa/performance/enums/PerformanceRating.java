package com.cyclosa.performance.enums;

public enum PerformanceRating {
    EXCELLENT,
    GOOD,
    SATISFACTORY,
    NEEDS_IMPROVEMENT,
    POOR;

    public static PerformanceRating fromScore(double score) {
        if (score >= 90.0) {
            return EXCELLENT;
        } else if (score >= 80.0) {
            return GOOD;
        } else if (score >= 65.0) {
            return SATISFACTORY;
        } else if (score >= 50.0) {
            return NEEDS_IMPROVEMENT;
        } else {
            return POOR;
        }
    }
}
