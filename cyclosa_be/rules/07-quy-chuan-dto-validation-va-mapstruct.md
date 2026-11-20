# Quy chuẩn 07: Tiêu chuẩn DTO, Jakarta Validation & MapStruct Mapper

> **Mục tiêu:** Bảo vệ đầu vào với Jakarta Validation bằng Tiếng Việt, ánh xạ đối tượng hiệu năng cao qua MapStruct và che giấu hoàn toàn dữ liệu nhạy cảm ở đầu ra.

---

## 1. Request DTO & Jakarta Validation Tiếng Việt

Mọi trường nhận từ Client qua `@RequestBody` hoặc `@ModelAttribute` **BẮT BUỘC PHẢI CÓ VALIDATION RÕ RÀNG**:

```java
package com.cyclosa.contract.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu tạo mới hợp đồng lao động")
public class CreateContractRequest {

    @NotNull(message = "ID nhân viên không được để trống")
    @Schema(description = "ID của nhân viên", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID employeeId;

    @NotBlank(message = "Số hợp đồng không được để trống")
    @Size(max = 50, message = "Số hợp đồng tối đa 50 ký tự")
    @Schema(description = "Mã số hợp đồng", example = "HDLD-2026-001")
    private String contractNumber;

    @NotBlank(message = "Loại hợp đồng không được để trống")
    @Schema(description = "Loại hợp đồng (PROBATION, INDEFINITE, DEFINITE)", example = "DEFINITE")
    private String contractType;

    @NotNull(message = "Ngày bắt đầu hiệu lực không được để trống")
    @Schema(description = "Ngày bắt đầu", example = "2026-01-01")
    private LocalDate startDate;

    @Schema(description = "Ngày kết thúc (bắt buộc nếu hợp đồng xác định thời hạn)", example = "2027-01-01")
    private LocalDate endDate;

    @NotNull(message = "Mức lương cơ bản không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Mức lương cơ bản phải lớn hơn 0")
    @Schema(description = "Mức lương cơ bản", example = "15000000")
    private BigDecimal baseSalary;
}
```

### Yêu cầu bắt buộc:
1. **Thông điệp lỗi Tiếng Việt:** Tất cả các annotation validation (`@NotBlank`, `@NotNull`, `@Size`, `@Pattern`...) đều phải có thuộc tính `message = "..."` bằng Tiếng Việt có dấu chuẩn mực.
2. **Swagger Schema:** Khai báo `@Schema(description = "...", example = "...")` đầy đủ để tài liệu hóa API trên Swagger UI.

---

## 2. Response DTO: Che Giấu Tuyệt Đối Dữ Liệu Nhạy Cảm

- **Định danh ID:** Luôn sử dụng kiểu dữ liệu `UUID`.
- **CẤM KỴ:** Tuyệt đối không để lộ các trường nhạy cảm trong Response DTO (`passwordHash`, `salt`, `secretKey`, `refreshToken`, `rawTokens`...).
- **DTO Chi tiết vs DTO Danh sách:**
  - Danh sách (`XxxResponse`): Chỉ trả về các trường tóm tắt cần hiển thị trên bảng Table.
  - Chi tiết (`XxxDetailResponse`): Trả về đầy đủ thông tin chi tiết, lịch sử, phụ lục kèm theo.

---

## 3. MapStruct Mapper (Spring Component Model)

Tất cả các chuyển đổi giữa Entity $\leftrightarrow$ DTO **BẮT BUỘC sử dụng MapStruct**:

```java
package com.cyclosa.contract.mapper;

import com.cyclosa.contract.dto.request.CreateContractRequest;
import com.cyclosa.contract.dto.response.ContractDetailResponse;
import com.cyclosa.contract.dto.response.ContractResponse;
import com.cyclosa.contract.entity.Contract;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContractMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    Contract toEntity(CreateContractRequest request);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "departmentName", source = "employee.department.name")
    ContractResponse toResponse(Contract contract);

    ContractDetailResponse toDetailResponse(Contract contract);

    List<ContractResponse> toResponseList(List<Contract> contracts);
}
```

### Các điều cấm kỵ:
- **CẤM** viết các hàm mapper thủ công bằng tay (vòng lặp `for` gán từng thuộc tính `setName`, `setEmail`...) bên trong Service.
- **CẤM** inject mapper khác module nếu không thực sự cần thiết; ưu tiên mapping thông qua DTO của public service.

