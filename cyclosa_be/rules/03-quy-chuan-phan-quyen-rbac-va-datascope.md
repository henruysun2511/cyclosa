# Quy chuẩn 03: Phân quyền RBAC, Data Scope & Bảo vệ Endpoint

> **Mục tiêu:** Kiểm soát truy cập chặt chẽ theo vai trò (RBAC) kết hợp phạm vi dữ liệu đa cấp độ (Data Scope: OWN, TEAM, DEPARTMENT, COMPANY, ALL).

---

## 1. Định dạng Mã Quyền (Permission Code)

Mọi mã quyền trong hệ thống Backend tuân thủ nghiêm ngặt định dạng:
$$\text{FORMAT: } \texttt{<module>.<action>}$$
*(Chữ thường, phân tách bằng dấu chấm)*.

**Ví dụ chuẩn:**
- `role.view`, `role.create`, `role.update`, `role.delete`, `role.assign`
- `employee.view`, `employee.manage`, `employee.view_salary`
- `contract.view`, `contract.create`, `contract.sign`, `contract.terminate`
- `recruitment.view`, `recruitment.manage`, `recruitment.interview`
- `onboarding.view`, `onboarding.manage`, `onboarding.task_complete`
- `attendance.view`, `attendance.check_in`, `attendance.approve`
- `leave.view`, `leave.apply`, `leave.approve`
- `payroll.view`, `payroll.calculate`, `payroll.approve`

---

## 2. Chốt chặn Endpoint tại Tầng Controller

Mọi endpoint nghiệp vụ (ngoại trừ các public endpoint trong `SecurityConfig`) **BẮT BUỘC** phải có cặp đôi `@PreAuthorize` và `@RequirePermission`:

```java
// 1. Endpoint Đọc/Xem danh sách thông thường
@GetMapping
@PreAuthorize("@perm.has('contract.view')")
@RequirePermission("contract.view")
public ResponseEntity<ApiResponse<PageData<ContractResponse>>> getList(@Valid ContractFilter filter) { ... }

// 2. Endpoint Thao tác Ghi/Tạo mới/Chỉnh sửa
@PostMapping
@PreAuthorize("@perm.has('contract.create')")
@RequirePermission("contract.create")
public ResponseEntity<ApiResponse<ContractResponse>> create(@Valid @RequestBody CreateContractRequest req) { ... }

// 3. Endpoint Phê duyệt / Quản lý yêu cầu DataScope tối thiểu
@PutMapping("/{id}/approve")
@PreAuthorize("@perm.has('leave.approve', T(com.cyclosa.common.enums.DataScope).TEAM)")
@RequirePermission(value = "leave.approve", minScope = DataScope.TEAM)
public ResponseEntity<ApiResponse<Void>> approve(@PathVariable UUID id) { ... }
```

---

## 3. Lọc Dữ liệu tại Tầng Service theo DataScope (5 Cấp Độ)

Khi truy vấn danh sách bản ghi có gắn liền với người dùng / phòng ban / công ty, Service **bắt buộc** gọi `SecurityPermissionEvaluator.getDataScope("<module>.view")` và áp dụng `switch-case`:

```java
@Service
@RequiredArgsConstructor
public class ContractService {

    private final SecurityPermissionEvaluator perm;
    private final ContractRepository repository;
    private final ContractMapper mapper;

    @Transactional(readOnly = true)
    public PageData<ContractResponse> getList(ContractFilter filter) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DataScope scope = perm.getDataScope("contract.view");
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Page<Contract> result = switch (scope) {
            case OWN -> repository.findByEmployeeUserId(currentUserId, pageable);
            case TEAM -> {
                UUID teamId = getTeamIdOfUser(currentUserId);
                yield repository.findByTeamId(teamId, pageable);
            }
            case DEPARTMENT -> {
                UUID deptId = getDepartmentIdOfUser(currentUserId);
                yield repository.findByDepartmentId(deptId, pageable);
            }
            case COMPANY -> {
                UUID companyId = SecurityUtils.getCurrentUserCompanyId();
                yield repository.findByCompanyId(companyId, pageable);
            }
            case ALL -> repository.findAll(pageable);
        };

        return PageData.of(result, mapper::toResponse);
    }
}
```

---

## 4. BẮT BUỘC: Đồng bộ Data Initializer khi có Permission Mới

Khi phát triển bất kỳ API nào có gắn mã quyền mới, lập trình viên/AI Agent **bắt buộc phải thực hiện ngay 2 việc**:

1. **Khai báo quyền mới** vào phương thức `seedPermissions()` trong [RolePermissionDataInitializer.java](file:///f:/Project/CYCLOSA/cyclosa_be/src/main/java/com/cyclosa/common/config/RolePermissionDataInitializer.java).
2. **Gán quyền mặc định** cho các vai trò tương ứng (`SUPER_ADMIN`, `COMPANY_ADMIN`, `HR_ADMIN`, `EMPLOYEE`...) trong `seedRolePermissions()`.

> ⚠️ **HẬU QUẢ NẾU BỎ QUA:** Bảng `permissions` trong cơ sở dữ liệu sẽ thiếu mã quyền này, dẫn tới tài khoản người dùng bình thường luôn bị lỗi **`403 Forbidden`** dù đã được cấp vai trò quản trị.

---

## 5. Bảo vệ Tuyệt đối `SecurityConfig.PUBLIC_ENDPOINTS`

- **Chỉ mở public** những endpoint thực sự không cần Bearer token:
  - `/api/v1/auth/login`
  - `/api/v1/auth/activate`
  - `/api/v1/auth/refresh`
  - Swagger UI / OpenAPI docs (`/v3/api-docs/**`, `/swagger-ui/**`)
  - Actuator Health check (`/actuator/health`)
- **TUYỆT ĐỐI CẤM** đưa các endpoint nghiệp vụ (`/api/v1/contracts`, `/api/v1/employees`...) vào danh sách public để "tiện test".

