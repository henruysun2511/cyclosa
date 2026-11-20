# Quy chuẩn 05: Xử lý Ngoại lệ & Hệ thống Mã lỗi Đa hình (Modular ErrorCode)

> **Mục tiêu:** Chuẩn hóa việc phân loại, đóng gói và trả về mã lỗi kinh doanh (Business Error) rõ ràng cho Frontend mà không làm phình to một file enum dùng chung.

---

## 1. Kiến trúc Mã Lỗi Đa hình (`ErrorCode` Interface)

Để tránh tình trạng file mã lỗi dùng chung bị phình to vô hạn (God Object), CYCLOSA áp dụng thiết kế đa hình:

### 1.1. Interface `ErrorCode` Công khai
```java
package com.cyclosa.common.exception;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
    int getCode();
    String getMessage();
    HttpStatus getHttpStatus();
}
```

### 1.2. Mã lỗi Dùng chung Hệ thống (`CommonErrorCode`)
Nằm tại `com.cyclosa.common.exception.CommonErrorCode`:
- `INTERNAL_ERROR (5000, HttpStatus.INTERNAL_SERVER_ERROR)`
- `VALIDATION_FAILED (4000, HttpStatus.BAD_REQUEST)`
- `RESOURCE_NOT_FOUND (4004, HttpStatus.NOT_FOUND)`
- `CONFLICT (4009, HttpStatus.CONFLICT)`
- `FORBIDDEN (4003, HttpStatus.FORBIDDEN)`
- `UNAUTHORIZED (4001, HttpStatus.UNAUTHORIZED)`

### 1.3. Mã lỗi Riêng của từng Module
Mỗi module tự khai báo enum lỗi nghiệp vụ của riêng mình bên trong `com.cyclosa.<module>.exception.<Module>ErrorCode.java` implements `ErrorCode`:

```java
package com.cyclosa.contract.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ContractErrorCode implements ErrorCode {

    CONTRACT_NOT_FOUND(4101, "Không tìm thấy hợp đồng lao động", HttpStatus.NOT_FOUND),
    CONTRACT_ALREADY_ACTIVE(4102, "Hợp đồng đã có hiệu lực, không thể chỉnh sửa", HttpStatus.CONFLICT),
    CONTRACT_CANNOT_BE_TERMINATED(4103, "Hợp đồng đã hết hạn hoặc đã chấm dứt trước đó", HttpStatus.BAD_REQUEST),
    CONTRACT_NUMBER_DUPLICATE(4104, "Mã số hợp đồng đã tồn tại trong công ty", HttpStatus.CONFLICT);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
```

---

## 2. Ném Lỗi Nghiệp vụ thông qua `AppException`

- **TUYỆT ĐỐI CẤM** ném `RuntimeException` chung chung không có thông điệp hoặc mã lỗi.
- **TUYỆT ĐỐI CẤM** nuốt exception bằng `catch (Exception e) {}` rỗng mà không ghi log hoặc xử lý.
- Luôn ném `AppException` với `ErrorCode` cụ thể hoặc sử dụng các static helper methods có sẵn:

```java
// 1. Sử dụng Enum ErrorCode cụ thể của module:
throw new AppException(ContractErrorCode.CONTRACT_ALREADY_ACTIVE);

// 2. Sử dụng các static helper method thông dụng:
Contract contract = contractRepository.findById(id)
        .orElseThrow(() -> AppException.notFound("Không tìm thấy hợp đồng với ID: " + id));

if (contractRepository.existsByContractNumberAndCompanyId(req.getContractNumber(), companyId)) {
    throw AppException.conflict("Mã hợp đồng " + req.getContractNumber() + " đã tồn tại");
}

if (!canAccessContract(contract)) {
    throw AppException.forbidden("Bạn không có quyền truy cập vào hợp đồng này");
}
```

---

## 3. Chuyển Đổi Tự Động tại `GlobalExceptionHandler`

Khi `AppException` được ném ra, `GlobalExceptionHandler` của hệ thống sẽ tự động bắt và trả về phản hồi chuẩn:

```json
{
  "success": false,
  "code": "4102",
  "message": "Hợp đồng đã có hiệu lực, không thể chỉnh sửa",
  "data": null,
  "timestamp": "2026-11-15T10:15:30Z"
}
```
Frontend chỉ cần đọc `response.data.message` để hiển thị thông báo Toast chuẩn xác cho người dùng.

