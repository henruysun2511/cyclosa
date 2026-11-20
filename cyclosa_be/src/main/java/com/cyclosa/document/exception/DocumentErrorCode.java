package com.cyclosa.document.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum DocumentErrorCode implements ErrorCode {
    RETENTION_POLICY_NOT_FOUND(70001, "Chính sách lưu trữ không tồn tại", HttpStatus.NOT_FOUND),
    RETENTION_POLICY_NAME_EXISTS(70002, "Tên chính sách lưu trữ đã tồn tại", HttpStatus.CONFLICT),
    RETENTION_POLICY_IN_USE(70003, "Không thể xóa chính sách đang được áp dụng cho loại tài liệu", HttpStatus.BAD_REQUEST),

    DOCUMENT_TYPE_NOT_FOUND(70004, "Loại tài liệu không tồn tại", HttpStatus.NOT_FOUND),
    DOCUMENT_TYPE_CODE_EXISTS(70005, "Mã loại tài liệu đã tồn tại", HttpStatus.CONFLICT),
    DOCUMENT_TYPE_IN_USE(70006, "Không thể xóa loại tài liệu đang có tài liệu lưu trữ", HttpStatus.BAD_REQUEST),

    METADATA_FIELD_NOT_FOUND(70007, "Trường metadata không tồn tại", HttpStatus.NOT_FOUND),
    METADATA_FIELD_KEY_EXISTS(70008, "Mã trường metadata đã tồn tại trong loại tài liệu này", HttpStatus.CONFLICT),

    DOSSIER_NOT_FOUND(70009, "Bộ hồ sơ không tồn tại", HttpStatus.NOT_FOUND),
    DOSSIER_CODE_EXISTS(70010, "Mã bộ hồ sơ đã tồn tại", HttpStatus.CONFLICT),

    SOURCE_FILE_NOT_FOUND(70011, "Tệp nguồn không tồn tại", HttpStatus.NOT_FOUND),
    SOURCE_FILE_QUALITY_FAILED(70012, "Tệp không đạt tiêu chuẩn số hóa (Độ phân giải phải >= 300 DPI)", HttpStatus.BAD_REQUEST),

    DOCUMENT_NOT_FOUND(70013, "Tài liệu lưu trữ không tồn tại", HttpStatus.NOT_FOUND),
    DOCUMENT_CODE_EXISTS(70014, "Mã tài liệu đã tồn tại", HttpStatus.CONFLICT),
    DOCUMENT_ALREADY_ARCHIVED(70015, "Tài liệu đã được nộp lưu kho chính thức, không thể sửa đổi", HttpStatus.BAD_REQUEST),
    DOCUMENT_NOT_VERIFIED(70016, "Tài liệu phải được thẩm định xác thực trước khi nộp lưu", HttpStatus.BAD_REQUEST),
    DOCUMENT_UNDER_LEGAL_HOLD(70017, "Tài liệu đang trong trạng thái tạm giữ pháp lý, tuyệt đối không được tiêu hủy", HttpStatus.BAD_REQUEST),
    DOCUMENT_NOT_EXPIRED(70018, "Tài liệu chưa hết hạn lưu trữ, không đủ điều kiện đề xuất tiêu hủy", HttpStatus.BAD_REQUEST),
    DOCUMENT_ALREADY_DESTROYED(70019, "Tài liệu này đã bị tiêu hủy", HttpStatus.BAD_REQUEST),

    DOCUMENT_VERSION_NOT_FOUND(70020, "Phiên bản tài liệu không tồn tại", HttpStatus.NOT_FOUND),

    LEGAL_HOLD_NOT_FOUND(70021, "Lệnh tạm giữ pháp lý không tồn tại", HttpStatus.NOT_FOUND),
    LEGAL_HOLD_ALREADY_RELEASED(70022, "Lệnh tạm giữ này đã được gỡ bỏ trước đó", HttpStatus.BAD_REQUEST),

    DESTRUCTION_PROPOSAL_NOT_FOUND(70023, "Đề xuất tiêu hủy không tồn tại", HttpStatus.NOT_FOUND),
    DESTRUCTION_PROPOSAL_CODE_EXISTS(70024, "Mã đề xuất tiêu hủy đã tồn tại", HttpStatus.CONFLICT),
    DESTRUCTION_NOT_APPROVED(70025, "Đề xuất tiêu hủy chưa được Hội đồng biểu quyết phê duyệt đạt tỷ lệ quy định", HttpStatus.BAD_REQUEST),
    COUNCIL_MEMBER_NOT_FOUND(70026, "Thành viên không thuộc Hội đồng xét hủy của đề xuất này", HttpStatus.NOT_FOUND),
    COUNCIL_MEMBER_ALREADY_VOTED(70027, "Bạn đã thực hiện biểu quyết cho đề xuất này", HttpStatus.CONFLICT),

    DIGITAL_SIGNATURE_FAILED(70028, "Ký số xác thực số hóa thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
    DOCUMENT_ALREADY_SIGNED(70029, "Tài liệu đã được ký số xác thực số hóa", HttpStatus.BAD_REQUEST),

    EXPORT_REQUEST_NOT_FOUND(70030, "Yêu cầu trích xuất hồ sơ không tồn tại", HttpStatus.NOT_FOUND),
    EXPORT_REQUEST_FAILED(70031, "Quá trình đóng gói và đóng dấu Watermark hồ sơ thất bại", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
