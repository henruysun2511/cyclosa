package com.cyclosa.attendance.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "cyclosa.attendance")
public class AttendanceProperties {

    /**
     * Bán kính cho phép quẹt thẻ mặc định (mét) nếu chi nhánh chưa cấu hình riêng
     */
    private int defaultRadiusMeters = 200;

    /**
     * Ngưỡng tối thiểu so khớp khuôn mặt AI (thang điểm 0 - 100)
     */
    private double faceMatchThreshold = 75.0;

    /**
     * Bắt buộc kiểm tra Anti-Spoofing (Liveness)
     */
    private boolean livenessCheckRequired = true;

    /**
     * Số phút ân hạn đi muộn mặc định
     */
    private int defaultLateGraceMinutes = 15;

    /**
     * Số phút ân hạn về sớm mặc định
     */
    private int defaultEarlyGraceMinutes = 0;
}

