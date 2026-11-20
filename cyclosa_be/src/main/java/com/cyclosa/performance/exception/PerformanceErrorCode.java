package com.cyclosa.performance.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum PerformanceErrorCode implements ErrorCode {

    PERFORMANCE_CYCLE_NOT_FOUND(4301, "Không tìm thấy kỳ đánh giá", HttpStatus.NOT_FOUND),
    PERFORMANCE_CYCLE_NAME_EXISTS(4302, "Tên kỳ đánh giá đã tồn tại trong công ty", HttpStatus.CONFLICT),
    INVALID_PERFORMANCE_CYCLE_DATES(4303, "Ngày bắt đầu kỳ đánh giá không được sau ngày kết thúc", HttpStatus.BAD_REQUEST),
    PERFORMANCE_CYCLE_NOT_DRAFT(4304, "Chỉ kỳ đánh giá ở trạng thái DRAFT mới được phép sửa hoặc xóa", HttpStatus.BAD_REQUEST),
    PERFORMANCE_CYCLE_NOT_ACTIVE(4305, "Kỳ đánh giá chưa được kích hoạt hoặc đã đóng, không thể giao mục tiêu", HttpStatus.BAD_REQUEST),
    PERFORMANCE_CYCLE_CANNOT_CLOSE(4306, "Chỉ kỳ đánh giá đang ở trạng thái ACTIVE mới có thể đóng", HttpStatus.BAD_REQUEST),
    PERFORMANCE_CYCLE_HAS_REVIEWS(4307, "Kỳ đánh giá đã có phiếu đánh giá phát sinh, không thể xóa", HttpStatus.BAD_REQUEST),

    KPI_NOT_FOUND(4310, "Không tìm thấy chỉ số KPI", HttpStatus.NOT_FOUND),
    KPI_NAME_EXISTS(4311, "Tên chỉ số KPI đã tồn tại trong công ty", HttpStatus.CONFLICT),
    KPI_IN_USE(4312, "Chỉ số KPI đã được gắn vào mục tiêu đánh giá, không thể xóa", HttpStatus.BAD_REQUEST),
    KPI_DEPARTMENT_MISMATCH(4313, "Chỉ số KPI này thuộc đơn vị khác, không thể giao cho nhân sự này", HttpStatus.BAD_REQUEST),

    PERFORMANCE_REVIEW_NOT_FOUND(4320, "Không tìm thấy phiếu đánh giá", HttpStatus.NOT_FOUND),
    PERFORMANCE_REVIEW_ALREADY_EXISTS(4321, "Nhân viên đã có phiếu đánh giá trong kỳ này", HttpStatus.CONFLICT),
    PERFORMANCE_REVIEW_ALREADY_FINALIZED(4322, "Phiếu đánh giá đã được chốt kết quả bất biến, không thể chỉnh sửa", HttpStatus.BAD_REQUEST),
    CANNOT_FINALIZE_REVIEW(4323, "Phiếu đánh giá chưa đủ điều kiện chốt kết quả (phải có ít nhất 1 mục tiêu và đã được quản lý chấm điểm)", HttpStatus.BAD_REQUEST),

    PERFORMANCE_GOAL_NOT_FOUND(4330, "Không tìm thấy mục tiêu đánh giá", HttpStatus.NOT_FOUND),
    TOTAL_WEIGHT_EXCEEDED(4331, "Tổng trọng số các mục tiêu trong phiếu đánh giá vượt quá 100.00%", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
