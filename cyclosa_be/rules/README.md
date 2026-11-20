# CYCLOSA Backend — Bộ Quy Chuẩn Kỹ Thuật & Kiến Trúc Module (Master Rules)

> **Mục đích:** Bộ quy chuẩn toàn diện này là kim chỉ nam **BẮT BUỘC** cho tất cả các lập trình viên và AI Agent khi làm việc với hệ thống backend `cyclosa_be` (CYCLOSA HRM Spring Boot API).
> Trước khi khởi tạo module mới hoặc chỉnh sửa mã nguồn backend, **BẮT BUỘC ĐỌC LẠI** các quy chuẩn liên quan dưới đây để đảm bảo kiến trúc vững chắc, bảo mật an toàn và không phát sinh lỗi.

---

## Danh mục Các Tệp Quy Chuẩn Backend

| Mã tệp | Tên tài liệu quy chuẩn | Nội dung chính |
| :--- | :--- | :--- |
| [**01**](./01-kien-truc-modular-monolith-va-cau-truc-module.md) | **Kiến trúc Modular Monolith & Cấu trúc Thư mục** | Nguyên tắc đóng gói module, giao tiếp chỉ qua Public Service, Domain Events chống vòng lặp phụ thuộc, cấu trúc thư mục chuẩn `com.cyclosa.<module>`. |
| [**02**](./02-quy-chuan-controller-va-api-response.md) | **REST Controller & Định dạng ApiResponse** | `@Tag` Swagger không chứa số thứ tự, `@Operation` Tiếng Việt, 100% endpoint trả về `ResponseEntity<ApiResponse<T>>`, cấm trả về JPA Entity trực tiếp. |
| [**03**](./03-quy-chuan-phan-quyen-rbac-va-datascope.md) | **Phân quyền RBAC, Data Scope & Endpoint** | Mã quyền `<module>.<action>`, cặp đôi `@PreAuthorize` và `@RequirePermission`, lọc 5 cấp độ DataScope tại Service, đồng bộ `RolePermissionDataInitializer`. |
| [**04**](./04-quy-chuan-entity-jpa-va-multi-tenancy.md) | **JPA Entity, Repository & Multi-tenancy** | Kế thừa `BaseEntity`, soft delete qua `@SQLDelete` và `@SQLRestriction`, dùng `JOIN FETCH` chống lỗi N+1, quy tắc lọc `companyId` an toàn chống rò rỉ dữ liệu. |
| [**05**](./05-quy-chuan-ngoai-le-va-ma-loi-da-hinh.md) | **Xử lý Ngoại lệ & Mã lỗi Đa hình (ErrorCode)** | Interface `ErrorCode`, mã lỗi riêng từng module trong enum, ném ngoại lệ chuẩn qua `AppException`, tự động bắt lỗi tại GlobalExceptionHandler. |
| [**06**](./06-quy-chuan-phan-trang-va-tim-kiem.md) | **Phân trang, Tìm kiếm & Lọc Dữ liệu** | Filter DTO kế thừa `BaseFilterRequest`, danh sách trắng `ALLOWED_SORT_FIELDS`, chuẩn hóa từ khóa tìm kiếm, trả về `PageData<T>` phân trang 0-based. |
| [**07**](./07-quy-chuan-dto-validation-va-mapstruct.md) | **DTO, Jakarta Validation & MapStruct** | Validation `@NotBlank`, `@NotNull` 100% bằng Tiếng Việt có dấu, che giấu dữ liệu nhạy cảm ở Response DTO, ánh xạ đối tượng tự động qua MapStruct Spring Model. |
| [**08**](./08-checklist-kiem-thu-va-nghiem-thu-backend.md) | **Checklist Kiểm thử & Nghiệm thu Backend (DoD)** | Bảng kiểm tra 7 hạng mục bắt buộc trước khi bàn giao: Swagger, RBAC/DataScope, Kiến trúc Modular, Phân trang, Mã lỗi, `./mvnw test-compile` và **Quy định BẮT BUỘC luôn cập nhật `cyclosa_fe/docs/API_TRACKING.md`**. |
| [**09**](./09-quy-chuan-audit-log-va-ghi-vet-kiem-toan.md) | **Ghi Vết Kiểm Toán (Audit Log) & @Auditable** | 13 mã `AuditAction`, SpEL `entityIdExpression`, quy tắc ghi vết bắt buộc khi thay đổi ca, giải trình, khóa kỳ, bảo vệ PII và cơ chế Non-blocking. |
| [**10**](./10-quy-chuan-quy-trinh-phe-duyet-va-workflow.md) | **Tích hợp Quy trình Phê duyệt & Workflow Engine** | Tích hợp qua `WorkflowExecutionService`, vòng đời duyệt đa cấp, tra cứu `ApproverResolverService`, ủy quyền duyệt `WorkflowDelegation`, đồng bộ qua `WorkflowCompletedEvent`. |
| [**11**](./11-quy-chuan-thong-bao-va-bat-dong-bo-event-driven.md) | **Thông Báo & Xử Lý Bất Đồng Bộ (Event-Driven)** | Bắn sự kiện `SendNotificationEvent` qua Spring Event/RabbitMQ, tách rời ranh giới domain, xử lý `@Async` sau khi commit CSDL (`AFTER_COMMIT`), đảm bảo không lỗi transaction chính. |


