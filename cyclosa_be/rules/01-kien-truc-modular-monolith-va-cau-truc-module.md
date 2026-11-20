# Quy chuẩn 01: Kiến trúc Modular Monolith & Cấu trúc Thư mục Module Chuẩn

> **Áp dụng cho:** Tất cả các module và lập trình viên / AI Agent khi phát triển trong `cyclosa_be`.

---

## 1. Kiến trúc Modular Monolith & Giao tiếp Liên Module

Hệ thống Backend `cyclosa_be` được thiết kế theo mô hình **Modular Monolith** trên nền tảng **Spring Boot 3.x, Java 21**. Mỗi nghiệp vụ lớn là một module độc lập (ví dụ: `auth`, `role`, `organization`, `employee`, `contract`, `attendance`, `leave`, `recruitment`, `onboarding`, `payroll`...).

### 1.1. Nguyên tắc Đóng gói (Encapsulation)
- Mỗi module tự quản lý trọn vẹn: `entity`, `repository`, `service`, `mapper`, `dto`, `controller`, và `exception` của riêng mình.
- Dữ liệu nội bộ và bảng database của module không được để module khác can thiệp tự do.

### 1.2. Nguyên tắc Giao tiếp giữa các Module
1. **Chỉ gọi qua Public Service:**
   - Module A cần dữ liệu hoặc hành vi của Module B **CHỈ ĐƯỢC PHÉP INJECT VÀO `Service` CÔNG KHAI CỦA MODULE B**.
   - **TUYỆT ĐỐI CẤM** việc inject trực tiếp `Repository` hoặc truy cập trực tiếp `Entity` bảng khác của module lân cận.
   ```
   [Module A: Service]  --->  [Module B: Service]  --->  [Module B: Repository]
            |
       (CẤM HOÀN TOÀN)
            x
   [Module B: Repository]
   ```
2. **Giao tiếp bất đồng bộ qua Domain Events (Event-Driven Decoupling):**
   - Khi Module A sinh ra một hành động có tác động phụ (side-effect) sang Module B (ví dụ: Tạo User mới cần kích hoạt phân quyền mặc định; Duyệt Offer tuyển dụng cần tự động tạo Hồ sơ Nhân sự và kích hoạt Onboarding):
   - Sử dụng Spring `ApplicationEventPublisher` phát ra Domain Event (ví dụ: `OfferAcceptedEvent`, `UserCreatedEvent`).
   - Module B lắng nghe bằng `@EventListener` hoặc `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`.
   - **Mục tiêu:** Giảm tối đa khớp nối cứng (tight coupling) và triệt tiêu hoàn toàn vòng lặp phụ thuộc (Circular Dependency).
3. **Tuyệt đối không để xảy ra Circular Dependency:**
   - Cấm `ServiceA` inject `ServiceB` đồng thời `ServiceB` lại inject `ServiceA`. Nếu cần chia sẻ dữ liệu chung, chuyển vào package `common` hoặc sử dụng Event Bus.

---

## 2. Cấu trúc Thư mục Chuẩn cho Một Module (`com.cyclosa.<module_name>`)

Mọi module mới trong package `com.cyclosa.<module_name>` **bắt buộc tuân thủ 100% cấu trúc phân tầng** sau:

```
com.cyclosa.<module_name>/
├── controller/                 # REST Controllers (@RestController)
│   └── XxxController.java
├── service/                    # Business Logic Services (@Service, @Transactional)
│   └── XxxService.java         # Concrete Service trực tiếp (KHÔNG tạo interface + impl thừa thãi)
├── repository/                 # Data Access Layer (JpaRepository + JpaSpecificationExecutor)
│   └── XxxRepository.java
├── entity/                     # JPA Entities (extends BaseEntity)
│   └── Xxx.java
├── mapper/                     # MapStruct Mappers (Spring Component Model)
│   └── XxxMapper.java
├── dto/                        # Data Transfer Objects
│   ├── request/                # DTO nhận từ Client (@Valid)
│   │   ├── CreateXxxRequest.java
│   │   ├── UpdateXxxRequest.java
│   │   └── XxxFilter.java      # Kế thừa BaseFilterRequest
│   └── response/               # DTO trả về cho Client
│       ├── XxxResponse.java
│       └── XxxDetailResponse.java
└── exception/                  # Mã lỗi riêng của module (nếu có)
    └── XxxErrorCode.java       # Implements ErrorCode interface
```

### Mô tả trách nhiệm từng tầng:
1. **`controller/`**: Điểm tiếp nhận HTTP Request, kiểm tra phân quyền (`@PreAuthorize`, `@RequirePermission`), validate DTO (`@Valid`), tài liệu hóa Swagger (`@Tag`, `@Operation`), và trả về `ResponseEntity<ApiResponse<T>>`.
2. **`service/`**: Xử lý logic nghiệp vụ thuần túy, transaction management (`@Transactional`), lọc dữ liệu theo `DataScope`, ném ngoại lệ nghiệp vụ (`AppException`). 
   - **Quy tắc Service tinh gọn:** Viết trực tiếp `XxxService.java` (Concrete Class), không sinh thêm interface `XxxService` và class `XxxServiceImpl` nếu module không có yêu cầu đa hình đa triển khai.
3. **`repository/`**: Kế thừa `JpaRepository<Entity, UUID>` và `JpaSpecificationExecutor<Entity>`. Định nghĩa các truy vấn JPQL/Native với `JOIN FETCH` để chống lỗi N+1.
4. **`entity/`**: Định nghĩa bảng CSDL, kế thừa `BaseEntity`, khai báo Soft Delete qua `@SQLDelete` và `@SQLRestriction`.
5. **`mapper/`**: Sử dụng MapStruct với `componentModel = MappingConstants.ComponentModel.SPRING`.
6. **`dto/`**: Phân tách rõ ràng DTO nhận vào (`request/`) và DTO trả ra (`response/`). Filter request bắt buộc kế thừa `BaseFilterRequest`.
7. **`exception/`**: Khai báo enum lỗi đặc thù của module implement `ErrorCode` interface.

