# Quy chuẩn 09: Ghi Vết Kiểm Toán (Audit Log) & Sử Dụng @Auditable

> **Áp dụng cho:** Tất cả các module và lập trình viên / AI Agent khi phát triển trong `cyclosa_be`.

---

## 1. Mục Tiêu & Tầm Quan Trọng Của Audit Log

Trong hệ thống quản trị nhân sự CYCLOSA HRM, mọi thay đổi dữ liệu liên quan đến nhân sự, hợp đồng, chấm công, tiền lương và bảo mật **bắt buộc phải được ghi vết kiểm toán minh bạch**. 

Nhật ký kiểm toán phục vụ các mục tiêu:
1. **Tuân thủ Pháp lý & Bảo mật:** Truy vết ai đã làm gì, vào thời điểm nào, từ địa chỉ IP nào, trên đối tượng nào.
2. **Đối soát & Minh bạch:** Giải trình các quyết định phê duyệt, từ chối, ghi đè hoặc can thiệp dữ liệu nhạy cảm.
3. **Phát hiện Bất thường & Điều tra:** Nhanh chóng khôi phục bối cảnh khi phát sinh tranh chấp hoặc sự cố dữ liệu.

---

## 2. Danh Mục 13 Mã Hành Động Chuẩn Hóa (`AuditAction`)

Module `com.cyclosa.audit.enums.AuditAction` định nghĩa 13 mã hành động chuẩn mực:

| Mã AuditAction | Tên hiển thị | Badge Variant | Ngữ cảnh nghiệp vụ bắt buộc sử dụng |
| :--- | :--- | :--- | :--- |
| `CREATE` | Tạo mới | `success` | Khởi tạo thực thể mới (ca làm việc, nhân viên, hợp đồng, đợt tuyển dụng...). |
| `UPDATE` | Cập nhật | `info` | Chỉnh sửa cấu hình ca, thông tin nhân sự, phụ lục hợp đồng, tiêu chí đánh giá. |
| `DELETE` | Xóa | `destructive` | Xóa mềm ca làm việc, xóa bản ghi tuyển dụng, xóa quyền. |
| `APPROVE` | Phê duyệt | `success` | Duyệt đơn nghỉ phép, duyệt giải trình công, duyệt Offer tuyển dụng, ký hợp đồng. |
| `REJECT` | Từ chối | `destructive` | Từ chối đơn giải trình chấm công, từ chối nghỉ phép, từ chối ứng viên. |
| `OVERRIDE` | Ghi đè/Can thiệp | `warning` | Hiệu chỉnh thủ công giờ công, sửa điểm đánh giá, điều chỉnh công nhật sau chốt. |
| `EXPORT` | Xuất dữ liệu | `secondary` | Xuất bảng công Excel, xuất danh sách nhân viên, xuất báo cáo quỹ lương. |
| `VIEW` | Xem thông tin mật | `outline` | Xem mức lương nhạy cảm, số CCCD/CMND, lịch sử kỷ luật/khen thưởng. |
| `DOWNLOAD` | Tải chứng từ | `outline` | Tải file đính kèm bằng chứng giải trình, scan hợp đồng lao động, CV ứng viên. |
| `LOGIN` | Đăng nhập | `default` | Đăng nhập hệ thống, đăng nhập thất bại liên tiếp, đăng xuất. |
| `LOCK` | Khóa | `warning` | Khóa sổ kỳ công tháng, chốt bảng snapshot tính lương. |
| `UNLOCK` | Mở khóa | `info` | Mở khóa kỳ công tháng có kiểm soát (bắt buộc nhập lý do). |
| `PUBLISH` | Công bố | `success` | Công bố tin tuyển dụng, công bố bảng đánh giá năng lực, gửi quyết định khen thưởng. |

---

## 3. Quy Chuẩn Sử Dụng Annotation `@Auditable`

CYCLOSA sử dụng AOP Aspect `AuditableAspect` để tự động hóa việc ghi vết. Mọi phương thức Service thực hiện các thao tác thay đổi dữ liệu hoặc truy xuất thông tin nhạy cảm **bắt buộc phải gắn `@Auditable`**.

### 3.1. Cấu trúc thuộc tính `@Auditable`
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    AuditAction action();                   // Hành động bắt buộc trong AuditAction
    String entityType();                    // Tên loại thực thể IN HOA (vd: SHIFT, TIMESHEET_PERIOD, LEAVE_REQUEST)
    String entityIdExpression() default ""; // Biểu thức SpEL trích xuất ID thực thể
    String description() default "";        // Mô tả hành vi nghiệp vụ ngắn gọn bằng Tiếng Việt
}
```

### 3.2. Cú pháp SpEL trích xuất `entityIdExpression`
- Khi ID nằm trong tham số phương thức: `entityIdExpression = "#id"` hoặc `entityIdExpression = "#periodId"`.
- Khi ID nằm trong kết quả trả về: `entityIdExpression = "#result.id"`.
- Khi ID nằm trong Request DTO: `entityIdExpression = "#req.employeeId"`.

### 3.3. Ví dụ Triển Khai Thực Tế

#### Ví dụ 1: Tạo mới ca làm việc (`CREATE`)
```java
@Transactional
@Auditable(
    action = AuditAction.CREATE,
    entityType = "SHIFT",
    entityIdExpression = "#result.id",
    description = "Khởi tạo ca làm việc mới"
)
public ShiftResponse createShift(CreateShiftRequest req) {
    // ... logic nghiệp vụ
    return shiftMapper.toResponse(savedShift);
}
```

#### Ví dụ 2: Phê duyệt đơn giải trình kèm hiệu chỉnh giờ công (`APPROVE`)
```java
@Transactional
@Auditable(
    action = AuditAction.APPROVE,
    entityType = "ATTENDANCE_REQUEST",
    entityIdExpression = "#id",
    description = "Người có thẩm quyền phê duyệt đơn giải trình chấm công"
)
public AttendanceRequestResponse updateApprovedTimesAndApprove(UUID id, UpdateApprovedTimesRequest body) {
    // ... logic phê duyệt và sinh bản ghi điều chỉnh AttendanceAdjustment
    return response;
}
```

#### Ví dụ 3: Khóa & Mở khóa kỳ công (`LOCK` / `UNLOCK`)
```java
@Transactional
@Auditable(
    action = AuditAction.LOCK,
    entityType = "TIMESHEET_PERIOD",
    entityIdExpression = "#id",
    description = "Khóa sổ kỳ công tháng và chốt bảng snapshot tính lương"
)
public TimesheetPeriodResponse lockPeriod(UUID id) { ... }

@Transactional
@Auditable(
    action = AuditAction.UNLOCK,
    entityType = "TIMESHEET_PERIOD",
    entityIdExpression = "#id",
    description = "Mở khóa kỳ công tháng có kiểm soát kèm lý do giải trình"
)
public TimesheetPeriodResponse unlockPeriod(UUID id, UnlockPeriodRequest req) { ... }
```

---

## 4. Danh Sách Hành Vi Bắt Buộc Ghi Audit Log Theo Từng Phân Hệ

| Phân hệ | Hành vi bắt buộc gắn `@Auditable` | EntityType |
| :--- | :--- | :--- |
| **Attendance (Chấm công)** | Tạo/sửa/xóa ca làm việc, phân ca hàng loạt, duyệt/từ chối giải trình công, khóa/mở khóa kỳ công tháng. | `SHIFT`, `SHIFT_ASSIGNMENT`, `ATTENDANCE_REQUEST`, `TIMESHEET_PERIOD` |
| **Leave (Nghỉ phép)** | Phê duyệt đơn nghỉ, từ chối đơn nghỉ, cấu hình chính sách ngày phép, điều chỉnh số dư ngày phép thủ công. | `LEAVE_REQUEST`, `LEAVE_POLICY`, `LEAVE_BALANCE` |
| **Contract (Hợp đồng)** | Tạo hợp đồng, gia hạn, ký kết phụ lục, chấm dứt hợp đồng lao động trước hạn. | `CONTRACT`, `CONTRACT_APPENDIX` |
| **Employee (Nhân sự)** | Bổ nhiệm, miễn nhiệm, điều chuyển vị trí/phòng ban, cập nhật trạng thái làm việc (nghỉ việc, đình chỉ). | `EMPLOYEE`, `WORK_ASSIGNMENT` |
| **Recruitment (Tuyển dụng)** | Duyệt kế hoạch tuyển dụng, gửi Offer, chấp thuận Offer, từ chối ứng viên. | `JOB_OPENING`, `CANDIDATE_OFFER` |
| **Workflow (Luồng duyệt)** | Ủy quyền duyệt (`CREATE`, `DELETE`), can thiệp cưỡng chế luồng (`OVERRIDE`). | `WORKFLOW_DELEGATION`, `WORKFLOW_REQUEST` |

---

## 5. Quy Chuẩn Che Giấu Dữ Liệu Nhạy Cảm (PII Masking)

1. **Tuyệt đối không ghi thông tin nhạy cảm vào log:**
   - Mật khẩu (`password`), mã OTP, Private Key, Token xác thực (`accessToken`, `refreshToken`).
   - Thông tin cá nhân nhạy cảm cao: Số căn cước công dân (CCCD), tài khoản ngân hàng, mã số thuế cá nhân phải được che (masking) ví dụ: `001099******1234` qua `AuditMaskingUtils`.
2. **Không ghi dữ liệu nhị phân hoặc chuỗi Base64 dài:**
   - Trường ảnh Camera Base64 (`liveImageBase64`) khi chấm công không được serialize vào trường `newValues` của audit log để tránh làm phình CSDL. Chỉ ghi nhận metadata (mã giao dịch, toạ độ GPS, kết quả so khớp AI).
3. **Cơ chế JSON Diff:**
   - Sử dụng `JsonDiffUtils` để chỉ ghi nhận các trường có sự thay đổi giữa `oldValues` và `newValues` khi thực hiện `UPDATE`.

---

## 6. Tính Bất Đồng Bộ & Khả Năng Chống Lỗi (Resilience)

1. **Không chặn luồng chính:**
   - Việc ghi vết kiểm toán được thực hiện qua Spring Event `AuditLogEvent` và xử lý bất đồng bộ (`@Async`).
2. **Fail-Safe:**
   - Nếu quá trình ghi audit log gặp sự cố kỹ thuật (lỗi database ghi log hoặc quá tải), **tuyệt đối không được làm rollback transaction nghiệp vụ chính của người dùng**. Hệ thống phải ghi log lỗi `log.error(...)` và để luồng chính tiếp tục hoàn thành.

