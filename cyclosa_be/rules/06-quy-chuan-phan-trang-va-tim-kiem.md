# Quy chuẩn 06: Phân trang, Tìm kiếm & Lọc Dữ liệu (BaseFilterRequest & PageData)

> **Mục tiêu:** Đồng bộ tuyệt đối cơ chế phân trang 0-based với Frontend, bảo vệ chống SQL Injection qua trường sắp xếp (`sortBy`), và chuẩn hóa cấu trúc dữ liệu trả về `PageData<T>`.

---

## 1. DTO Bộ lọc Bắt buộc Kế thừa `BaseFilterRequest`

Mọi DTO nhận tham số tìm kiếm và phân trang từ Client **BẮT BUỘC phải kế thừa `BaseFilterRequest`**:

```java
package com.cyclosa.contract.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.contract.entity.ContractStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số tìm kiếm và phân trang hợp đồng")
public class ContractFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo phòng ban của nhân viên", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID departmentId;

    @Schema(description = "Lọc theo trạng thái hợp đồng", example = "ACTIVE")
    private ContractStatus status;

    @Schema(description = "Lọc theo loại hợp đồng", example = "PROBATION")
    private String contractType;
}
```

> **Các trường có sẵn từ `BaseFilterRequest`:**
> - `String keyword`: Từ khóa tìm kiếm tự do (họ tên, mã, email...).
> - `Integer page`: Số trang (0-based từ Client RTK Query gửi lên: `0, 1, 2...`).
> - `Integer size`: Số bản ghi trên một trang (mặc định 10 hoặc 20).
> - `String sortBy`: Tên trường cần sắp xếp (ví dụ: `createdAt`).
> - `String direction`: Hướng sắp xếp (`ASC` hoặc `DESC`).
> - Phương thức `toPageable(...)`: Tự động build ra Spring `Pageable`.

---

## 2. Xử lý Phân trang & Tìm kiếm An toàn tại Tầng Service

Tại Service, xử lý theo 4 bước chuẩn:
1. Khai báo danh sách các trường được phép sắp xếp (`ALLOWED_SORT_FIELDS`) để chống SQL Injection.
2. Chuẩn hóa từ khóa tìm kiếm qua `PageableUtils.normalizeKeyword`.
3. Tạo đối tượng `Pageable` qua `filter.toPageable()`.
4. Bọc kết quả Spring `Page<Entity>` thành `PageData<Response>` qua `PageData.of()`.

```java
@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;

    // 1. Danh sách trắng các trường được phép sắp xếp
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "startDate", "endDate", "contractNumber", "status"
    );

    @Transactional(readOnly = true)
    public PageData<ContractResponse> getList(ContractFilter filter) {
        // 2. Chuẩn hóa từ khóa (xóa khoảng trắng thừa, hạ chữ thường nếu cần)
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());

        // 3. Khởi tạo Pageable (mặc định sort theo "createdAt" DESC nếu client không truyền)
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        // 4. Thực thi truy vấn phân trang
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Page<Contract> pageResult = contractRepository.search(
                kw, companyId, filter.getDepartmentId(), filter.getStatus(), pageable
        );

        // 5. Bọc sang PageData<T>
        return PageData.of(pageResult, contractMapper::toResponse);
    }
}
```

---

## 3. Cấu trúc `PageData<T>` Trả về cho Frontend

Đối tượng `PageData<T>` trả về có cấu trúc khớp 100% với Frontend TypeScript interface:

```json
{
  "items": [
    { "id": "...", "contractNumber": "HD-2026-001", "status": "ACTIVE" }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "total": 45,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
- **Lưu ý 0-based:** `pagination.page = 0` là trang 1 trên giao diện người dùng. Frontend sẽ tự cộng 1 để hiển thị "Trang 1 / 5".

