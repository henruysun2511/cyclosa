package com.cyclosa.recruitment.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Danh mục mã lỗi nghiệp vụ Module Tuyển dụng & Thu hút nhân tài (Dải mã 1401 - 1435)
 */
@Getter
@RequiredArgsConstructor
public enum RecruitmentErrorCode implements ErrorCode {

    RECRUITMENT_REQUEST_NOT_FOUND       (1401, "Đề xuất tuyển dụng không tồn tại trong hệ thống", HttpStatus.NOT_FOUND),
    RECRUITMENT_REQUEST_NOT_EDITABLE    (1402, "Đề xuất tuyển dụng đã được duyệt hoặc đang trong quy trình xét duyệt, không thể sửa đổi", HttpStatus.UNPROCESSABLE_ENTITY),
    JOB_OPENING_NOT_FOUND               (1403, "Vị trí tuyển dụng không tồn tại", HttpStatus.NOT_FOUND),
    JOB_OPENING_CLOSED                  (1404, "Vị trí tuyển dụng đã đóng hoặc hết hạn nhận hồ sơ", HttpStatus.UNPROCESSABLE_ENTITY),
    JOB_SLUG_DUPLICATED                 (1405, "Đường dẫn tĩnh (landing slug) của tin tuyển dụng đã bị trùng lặp", HttpStatus.CONFLICT),
    CANDIDATE_NOT_FOUND                 (1406, "Không tìm thấy thông tin hồ sơ ứng viên", HttpStatus.NOT_FOUND),
    CANDIDATE_EMAIL_DUPLICATED          (1407, "Email ứng viên đã tồn tại trên một hồ sơ khác trong hệ thống", HttpStatus.CONFLICT),
    APPLICATION_NOT_FOUND               (1408, "Đơn ứng tuyển không tồn tại", HttpStatus.NOT_FOUND),
    APPLICATION_ALREADY_EXISTS          (1409, "Ứng viên này đã nộp đơn ứng tuyển cho vị trí hiện tại đang mở", HttpStatus.CONFLICT),
    INVALID_STAGE_TRANSITION            (1410, "Chuyển dịch giai đoạn không hợp lệ theo quy tắc phễu tuyển dụng", HttpStatus.UNPROCESSABLE_ENTITY),
    AI_SCREENING_CONSENT_REQUIRED       (1411, "Ứng viên chưa cung cấp văn bản/xác nhận đồng thuận cho phép AI xử lý hồ sơ", HttpStatus.UNPROCESSABLE_ENTITY),
    JOB_REQUIREMENTS_NOT_DEFINED        (1412, "Vị trí tuyển dụng chưa có mô tả yêu cầu công việc (JD), AI không đủ dữ liệu để chấm điểm", HttpStatus.UNPROCESSABLE_ENTITY),
    INTERVIEW_ROUND_NOT_FOUND           (1413, "Vòng phỏng vấn không tồn tại", HttpStatus.NOT_FOUND),
    INTERVIEW_SCHEDULE_CONFLICT         (1414, "Giám khảo đã có lịch phỏng vấn hoặc cuộc họp khác bị trùng thời gian", HttpStatus.CONFLICT),
    SCORECARD_NOT_FOUND                 (1415, "Phiếu đánh giá phỏng vấn không tồn tại", HttpStatus.NOT_FOUND),
    SCORECARD_ALREADY_SUBMITTED         (1416, "Phiếu đánh giá đã được nộp chính thức, không thể sửa đổi", HttpStatus.UNPROCESSABLE_ENTITY),
    BLIND_GRADING_ACCESS_DENIED         (1417, "Bạn phải nộp phiếu đánh giá của chính mình trước khi xem kết quả của giám khảo khác", HttpStatus.FORBIDDEN),
    OFFER_NOT_FOUND                     (1418, "Thư mời nhận việc không tồn tại", HttpStatus.NOT_FOUND),
    OFFER_NOT_EDITABLE                  (1419, "Thư mời đã được gửi đi hoặc đã phê duyệt, không thể chỉnh sửa điều khoản trực tiếp", HttpStatus.UNPROCESSABLE_ENTITY),
    OFFER_SALARY_OUT_OF_BAND            (1420, "Mức lương đề xuất vượt khung dải lương của vị trí tuyển dụng mà chưa có sự phê duyệt của Ban Giám đốc", HttpStatus.UNPROCESSABLE_ENTITY),
    OFFER_RESPONSE_DEADLINE_PASSED      (1421, "Hạn chót phản hồi thư mời làm việc của ứng viên đã qua", HttpStatus.UNPROCESSABLE_ENTITY),
    APPLICATION_NOT_ELIGIBLE_FOR_OFFER  (1422, "Ứng viên chưa hoàn thành các vòng phỏng vấn bắt buộc, không đủ điều kiện lập Offer", HttpStatus.UNPROCESSABLE_ENTITY),
    INTERVIEW_NOT_FOUND                 (1423, "Buổi phỏng vấn không tồn tại trong hệ thống", HttpStatus.NOT_FOUND),
    RECRUITMENT_CHANNEL_NOT_FOUND       (1424, "Kênh tuyển dụng không tồn tại", HttpStatus.NOT_FOUND),
    RECRUITMENT_CHANNEL_CODE_DUPLICATED (1425, "Mã kênh tuyển dụng đã tồn tại trong doanh nghiệp", HttpStatus.CONFLICT),
    INTERNAL_OPPORTUNITY_NOT_FOUND      (1426, "Cơ hội nội bộ hoặc dự án không tồn tại", HttpStatus.NOT_FOUND),
    AI_SERVICE_COMMUNICATION_ERROR      (1427, "Lỗi kết nối hoặc xử lý từ microservice AI", HttpStatus.SERVICE_UNAVAILABLE),
    INTERVIEWER_NOT_ASSIGNED            (1428, "Người phỏng vấn chưa được phân công vào hội đồng phỏng vấn này", HttpStatus.FORBIDDEN),
    CRITERION_NOT_FOUND                 (1429, "Tiêu chí đánh giá không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_INTERVIEW_STATUS            (1430, "Trạng thái buổi phỏng vấn không hợp lệ cho thao tác này", HttpStatus.UNPROCESSABLE_ENTITY),
    OFFER_ALREADY_CONVERTED             (1431, "Ứng viên từ Offer này đã được tiếp nhận và tạo hồ sơ nhân viên trong hệ thống", HttpStatus.CONFLICT),
    OFFER_NOT_ACCEPTED                  (1432, "Thư mời nhận việc chưa được ứng viên chấp thuận (ACCEPTED), không thể chuyển đổi thành nhân viên", HttpStatus.UNPROCESSABLE_ENTITY);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
