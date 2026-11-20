# Quy chuẩn 02: Tiêu chuẩn REST Controller & Định dạng Phản hồi API (ApiResponse)

> **Mục tiêu:** Đồng bộ 100% cấu trúc phản hồi API, tài liệu hóa OpenAPI/Swagger chuyên nghiệp và chuẩn hóa giao tiếp với Client.

---

## 1. Cấu trúc Chuẩn của REST Controller

```java
@RestController
@RequestMapping("/api/v1/job-openings")
@RequiredArgsConstructor
@Tag(name = "Job Openings", description = "Quản lý vị trí tuyển dụng và tin tuyển dụng")
public class JobOpeningController {

    private final JobOpeningService jobOpeningService;

    @GetMapping
    @PreAuthorize("@perm.has('recruitment.view')")
    @RequirePermission("recruitment.view")
    @Operation(summary = "Xem danh sách vị trí tuyển dụng", description = "Lọc theo phòng ban, trạng thái, từ khóa có phân trang")
    public ResponseEntity<ApiResponse<PageData<JobOpeningResponse>>> getList(@Valid JobOpeningFilter filter) {
        PageData<JobOpeningResponse> result = jobOpeningService.getList(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách vị trí tuyển dụng thành công"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.view')")
    @RequirePermission("recruitment.view")
    @Operation(summary = "Xem chi tiết vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<JobOpeningDetailResponse>> getById(@PathVariable UUID id) {
        JobOpeningDetailResponse result = jobOpeningService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết vị trí tuyển dụng thành công"));
    }

    @PostMapping
    @PreAuthorize("@perm.has('recruitment.create')")
    @RequirePermission("recruitment.create")
    @Operation(summary = "Tạo mới vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<JobOpeningResponse>> create(@Valid @RequestBody CreateJobOpeningRequest req) {
        JobOpeningResponse result = jobOpeningService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(result, "Tạo mới vị trí tuyển dụng thành công"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.update')")
    @RequirePermission("recruitment.update")
    @Operation(summary = "Cập nhật vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<JobOpeningResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateJobOpeningRequest req) {
        JobOpeningResponse result = jobOpeningService.update(id, req);
        return ResponseEntity.ok(ApiResponse.ok(result, "Cập nhật vị trí tuyển dụng thành công"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perm.has('recruitment.delete')")
    @RequirePermission("recruitment.delete")
    @Operation(summary = "Xóa vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        jobOpeningService.delete(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa vị trí tuyển dụng thành công"));
    }
}
```

---

## 2. Quy chuẩn Swagger / OpenAPI Documentation

### 2.1. Đặt tên `@Tag`: TUYỆT ĐỐI KHÔNG DÙNG TIỀN TỐ SỐ THỨ TỰ
- Tên tag trong `@Tag(name = "...")` chỉ ghi tên danh từ của module bằng tiếng Anh rõ nghĩa.
- **Đúng:**
  ```java
  @Tag(name = "Roles", description = "Quản lý vai trò và phân quyền")
  @Tag(name = "Employees", description = "Quản lý hồ sơ nhân viên")
  @Tag(name = "Contracts", description = "Quản lý hợp đồng lao động")
  ```
- **Sai:**
  ```java
  @Tag(name = "02. Roles", description = "...") // SAI: Cấm gắn số thứ tự!
  ```

### 2.2. `@Operation` trên từng API Method
Mọi API method đều phải có `@Operation(summary = "...")` tóm tắt hành vi bằng Tiếng Việt có dấu rõ ràng.

---

## 3. Cấu trúc Response: 100% sử dụng `ResponseEntity<ApiResponse<T>>`

Mọi endpoint trả về Client đều phải được bọc trong `ResponseEntity<ApiResponse<T>>`:

| Tình huống | HTTP Status | Code Java trả về |
| :--- | :--- | :--- |
| Lấy dữ liệu thành công | `200 OK` | `return ResponseEntity.ok(ApiResponse.ok(data, "Lấy thông tin thành công"));` |
| Tạo mới thành công | `201 CREATED` | `return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(data, "Tạo mới thành công"));` |
| Thao tác thành công (Xóa/Hủy) | `200 OK` | `return ResponseEntity.ok(ApiResponse.noContent("Xóa bản ghi thành công"));` |
| Danh sách phân trang | `200 OK` | `return ResponseEntity.ok(ApiResponse.ok(pageData, "Lấy danh sách thành công"));` |

### ⚠️ CÁC ĐIỀU CẤM KỴ TUYỆT ĐỐI:
1. **CẤM** trả về Entity JPA trực tiếp ra ngoài Controller (gây rò rỉ cấu trúc DB, lỗi LazyInitializationException, lộ trường nhạy cảm).
2. **CẤM** trả về raw `Object`, raw `List<T>`, hoặc Spring `Page<T>`. Phải luôn bọc bằng `ApiResponse<PageData<T>>`.

