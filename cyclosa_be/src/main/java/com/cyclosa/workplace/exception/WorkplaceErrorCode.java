package com.cyclosa.workplace.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum WorkplaceErrorCode implements ErrorCode {
    SITE_NOT_FOUND(19001, "Cơ sở / Tòa nhà không tồn tại", HttpStatus.NOT_FOUND),
    SITE_CODE_EXISTS(19002, "Mã cơ sở đã tồn tại trong hệ thống", HttpStatus.CONFLICT),
    FLOOR_NOT_FOUND(19003, "Tầng làm việc không tồn tại", HttpStatus.NOT_FOUND),
    FLOOR_NUMBER_EXISTS(19004, "Số tầng đã tồn tại trong tòa nhà này", HttpStatus.CONFLICT),
    FLOOR_HAS_ACTIVE_ZONES(19005, "Không thể xóa tầng đang chứa phân khu hoặc dữ liệu mặt bằng", HttpStatus.BAD_REQUEST),
    FLOOR_PLAN_NOT_FOUND(19006, "Bản vẽ mặt bằng không tồn tại", HttpStatus.NOT_FOUND),
    ZONE_NOT_FOUND(19007, "Phân khu chức năng không tồn tại", HttpStatus.NOT_FOUND),
    SEAT_ROW_NOT_FOUND(19008, "Cụm / dãy bàn không tồn tại", HttpStatus.NOT_FOUND),
    SEAT_NOT_FOUND(19009, "Bàn làm việc không tồn tại", HttpStatus.NOT_FOUND),
    SEAT_CODE_EXISTS(19010, "Mã bàn làm việc đã tồn tại", HttpStatus.CONFLICT),
    SEAT_NOT_AVAILABLE(19011, "Bàn làm việc đang bảo trì hoặc bị khóa", HttpStatus.BAD_REQUEST),
    SEAT_ALREADY_ASSIGNED(19012, "Bàn làm việc đã được phân bổ cho nhân sự khác", HttpStatus.CONFLICT),
    EMPLOYEE_ALREADY_HAS_DEDICATED_SEAT(19013, "Nhân viên đã được phân bổ một bàn làm việc cố định", HttpStatus.CONFLICT),
    SEAT_ASSIGNMENT_NOT_FOUND(19014, "Bản ghi phân bổ bàn không tồn tại", HttpStatus.NOT_FOUND),
    AMENITY_NOT_FOUND(19015, "Tiện ích không tồn tại", HttpStatus.NOT_FOUND),
    AMENITY_NAME_EXISTS(19016, "Tên tiện ích đã tồn tại", HttpStatus.CONFLICT),
    AMENITY_IN_USE(19017, "Không thể xóa tiện ích đang được liên kết với bàn làm việc", HttpStatus.BAD_REQUEST),
    DESK_BOOKING_NOT_FOUND(19018, "Lượt đặt bàn không tồn tại", HttpStatus.NOT_FOUND),
    DESK_ALREADY_BOOKED(19019, "Bàn làm việc đã được người khác đặt trong ngày này", HttpStatus.CONFLICT),
    EMPLOYEE_ALREADY_BOOKED_DESK(19020, "Bạn đã đặt một bàn làm việc trong ngày này", HttpStatus.CONFLICT),
    NOT_HOT_DESK(19021, "Chỉ bàn làm việc linh hoạt (Hot-desk) mới cho phép đặt chỗ", HttpStatus.BAD_REQUEST),
    MEETING_ROOM_NOT_FOUND(19022, "Phòng họp không tồn tại", HttpStatus.NOT_FOUND),
    ROOM_BOOKING_NOT_FOUND(19023, "Lịch đặt phòng họp không tồn tại", HttpStatus.NOT_FOUND),
    ROOM_BOOKING_CONFLICT(19024, "Khung giờ họp đã bị trùng với một cuộc họp khác trong phòng", HttpStatus.CONFLICT),
    ROOM_CAPACITY_EXCEEDED(19025, "Số lượng người tham dự vượt quá sức chứa tối đa của phòng họp", HttpStatus.BAD_REQUEST),
    INVALID_BOOKING_TIME(19026, "Thời gian bắt đầu phải trước thời gian kết thúc và không được ở quá khứ", HttpStatus.BAD_REQUEST),
    WORKPLACE_ISSUE_NOT_FOUND(19027, "Sự cố không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_QR_TOKEN(19028, "Mã QR không hợp lệ hoặc đã hết hạn", HttpStatus.BAD_REQUEST),
    ASSET_ALREADY_LINKED(19029, "Tài sản này đang được gắn tại một vị trí bàn khác", HttpStatus.CONFLICT),
    SEAT_ASSET_NOT_FOUND(19030, "Liên kết tài sản tại bàn không tồn tại", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
