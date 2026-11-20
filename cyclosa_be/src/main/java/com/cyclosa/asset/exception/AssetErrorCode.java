package com.cyclosa.asset.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AssetErrorCode implements ErrorCode {

    ASSET_NOT_FOUND(4601, "Không tìm thấy thông tin tài sản yêu cầu", HttpStatus.NOT_FOUND),
    ASSET_CODE_ALREADY_EXISTS(4602, "Mã tài sản đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    CANNOT_DELETE_CATEGORY_WITH_ASSETS(4603, "Không thể xóa loại tài sản đang chứa hiện vật tài sản", HttpStatus.BAD_REQUEST),
    ASSET_CATEGORY_NOT_FOUND(4604, "Không tìm thấy loại tài sản tương ứng", HttpStatus.NOT_FOUND),
    CANNOT_DELETE_ASSIGNED_ASSET(4605, "Không thể xóa tài sản đang trong trạng thái cấp phát cho nhân viên", HttpStatus.BAD_REQUEST),
    ASSET_NOT_AVAILABLE_FOR_ASSIGN(4606, "Tài sản không ở trạng thái sẵn sàng để cấp phát", HttpStatus.BAD_REQUEST),
    ASSET_ALREADY_ASSIGNED(4607, "Tài sản này hiện đang được cấp phát cho một nhân viên khác", HttpStatus.CONFLICT),
    ASSIGNMENT_NOT_FOUND(4608, "Không tìm thấy lượt cấp phát tài sản yêu cầu", HttpStatus.NOT_FOUND),
    ASSIGNMENT_ALREADY_RETURNED(4609, "Lượt cấp phát này đã được ghi nhận hoàn trả trước đó", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND(4610, "Không tìm thấy thông tin nhân viên nhận tài sản", HttpStatus.NOT_FOUND),
    INVALID_RETURN_DATE(4611, "Ngày hoàn trả không được trước ngày cấp phát", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_DUPLICATED(4612, "Tên loại tài sản đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    CATEGORY_CODE_DUPLICATED(4613, "Mã loại tài sản đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
