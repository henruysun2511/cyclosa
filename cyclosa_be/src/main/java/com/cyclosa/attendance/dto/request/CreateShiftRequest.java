package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@Schema(description = "Yêu cầu tạo mới ca làm việc")
public class CreateShiftRequest {

    @NotBlank(message = "Mã ca làm việc không được để trống")
    @Size(max = 30, message = "Mã ca làm việc tối đa 30 ký tự")
    @Schema(description = "Mã ca làm việc", example = "HC_01")
    private String code;

    @NotBlank(message = "Tên ca làm việc không được để trống")
    @Size(max = 100, message = "Tên ca làm việc tối đa 100 ký tự")
    @Schema(description = "Tên hiển thị ca làm việc", example = "Ca hành chính 8h-17h")
    private String name;

    @NotNull(message = "Giờ bắt đầu ca không được để trống")
    @Schema(description = "Giờ bắt đầu ca", example = "08:00:00")
    private LocalTime startTime;

    @NotNull(message = "Giờ kết thúc ca không được để trống")
    @Schema(description = "Giờ kết thúc ca (nếu nhỏ hơn startTime là ca qua đêm)", example = "17:00:00")
    private LocalTime endTime;

    @NotNull(message = "Thời gian nghỉ không được để trống")
    @Min(value = 0, message = "Thời gian nghỉ tối thiểu là 0 phút")
    @Schema(description = "Thời gian nghỉ giữa ca (phút)", example = "60")
    private Integer breakMinutes = 60;

    @NotNull(message = "Định mức công không được để trống")
    @DecimalMin(value = "0.1", message = "Định mức công tối thiểu là 0.1 công")
    @Schema(description = "Định mức công của ca", example = "1.00")
    private BigDecimal workCredit = BigDecimal.valueOf(1.00);

    @NotNull(message = "Dung sai vào trễ không được để trống")
    @Min(value = 0, message = "Dung sai vào trễ tối thiểu là 0 phút")
    @Schema(description = "Số phút cho phép vào trễ không tính phạt", example = "15")
    private Integer lateGraceMinutes = 15;

    @NotNull(message = "Dung sai về sớm không được để trống")
    @Min(value = 0, message = "Dung sai về sớm tối thiểu là 0 phút")
    @Schema(description = "Số phút cho phép về sớm không tính phạt", example = "0")
    private Integer earlyGraceMinutes = 0;

    @Schema(description = "Kích hoạt sử dụng", example = "true")
    private Boolean isActive = true;
}

