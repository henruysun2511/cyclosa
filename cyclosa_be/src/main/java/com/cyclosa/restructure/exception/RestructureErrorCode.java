package com.cyclosa.restructure.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum RestructureErrorCode implements ErrorCode {

    SCENARIO_NOT_FOUND(4801, "Không tìm thấy kịch bản tái cơ cấu tổ chức", HttpStatus.NOT_FOUND),
    SCENARIO_CODE_ALREADY_EXISTS(4802, "Mã kịch bản tái cơ cấu đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    SCENARIO_LOCKED_FOR_EDITING(4803, "Kịch bản đã được trình duyệt hoặc phê duyệt, không thể chỉnh sửa", HttpStatus.BAD_REQUEST),
    CYCLIC_HIERARCHY_DETECTED(4804, "Phát hiện lỗi phân cấp lặp vòng đệ quy trong sơ đồ tổ chức", HttpStatus.BAD_REQUEST),
    DISSOLVE_FAILED_HAS_CHILDREN(4805, "Không thể giải thể phòng ban do vẫn còn đơn vị con trực thuộc", HttpStatus.BAD_REQUEST),
    DISSOLVE_FAILED_HAS_EMPLOYEES(4806, "Không thể giải thể phòng ban do vẫn còn nhân sự chưa được tái bố trí", HttpStatus.BAD_REQUEST),
    MERGE_REQUIRES_AT_LEAST_TWO(4807, "Thao tác sáp nhập yêu cầu tối thiểu hai phòng ban", HttpStatus.BAD_REQUEST),
    TARGET_DEPARTMENT_NOT_FOUND(4808, "Không tìm thấy phòng ban đích trong kịch bản", HttpStatus.NOT_FOUND),
    ORPHANED_EMPLOYEES_DETECTED(4809, "Còn nhân sự mồ côi chưa được phân bổ vào phòng ban hợp lệ", HttpStatus.UNPROCESSABLE_ENTITY),
    TARGET_DATE_MUST_BE_FUTURE(4810, "Ngày hiệu lực dự kiến không được ở trong quá khứ", HttpStatus.BAD_REQUEST),
    SCENARIO_NOT_APPROVED(4811, "Chỉ kịch bản đã được phê duyệt mới có thể thực thi áp dụng", HttpStatus.BAD_REQUEST),
    CANNOT_DELETE_ACTIVE_SCENARIO(4812, "Chỉ có thể xóa kịch bản ở trạng thái nháp hoặc bị từ chối", HttpStatus.BAD_REQUEST),
    SCENARIO_EXECUTION_FAILED(4813, "Lỗi trong quá trình thực thi áp dụng sơ đồ tổ chức vào hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),
    DEPARTMENT_NOT_IN_SCENARIO(4814, "Phòng ban không tồn tại trong kịch bản tái cơ cấu này", HttpStatus.NOT_FOUND);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
