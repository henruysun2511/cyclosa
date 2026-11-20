# Quy chuẩn 04: Tiêu chuẩn JPA Entity, Repository & An toàn Multi-tenancy

> **Mục tiêu:** Đảm bảo toàn vẹn dữ liệu, hiệu năng truy vấn tối ưu (chống N+1 query) và cách ly dữ liệu nhiều công ty (Multi-tenancy) an toàn tuyệt đối.

---

## 1. Kế thừa `BaseEntity` & Soft Delete Chuẩn

Mọi Entity bảng dữ liệu chính trong CYCLOSA **bắt buộc phải kế thừa `BaseEntity`** để sở hữu sẵn các trường kiểm toán (Audit Fields):
- `UUID id`
- `Instant createdAt`, `Instant updatedAt`
- `UUID createdBy`, `UUID updatedBy`
- `Instant deletedAt`

```java
package com.cyclosa.contract.entity;

import com.cyclosa.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "contracts", indexes = {
    @Index(name = "idx_contracts_company_id", columnList = "company_id"),
    @Index(name = "idx_contracts_employee_id", columnList = "employee_id"),
    @Index(name = "idx_contracts_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE contracts SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "contract_number", nullable = false, length = 50)
    private String contractNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ContractStatus status;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
```

---

## 2. Phòng chống Triệt để Lỗi N+1 Query

1. **Mặc định LAZY:** Toàn bộ quan hệ `@ManyToOne`, `@OneToOne`, `@OneToMany` **bắt buộc khai báo `fetch = FetchType.LAZY`**. Tuyệt đối không để mặc định `EAGER`.
2. **Sử dụng `JOIN FETCH` khi cần tải dữ liệu liên kết:**
   Khi trả về DTO cần thông tin của bảng quan hệ (ví dụ: lấy Hợp đồng kèm thông tin Nhân viên và Phòng ban), Repository bắt buộc sử dụng `JOIN FETCH` trong JPQL:

```java
public interface ContractRepository extends JpaRepository<Contract, UUID>, JpaSpecificationExecutor<Contract> {

    @Query("SELECT c FROM Contract c " +
           "JOIN FETCH c.employee e " +
           "JOIN FETCH e.department d " +
           "WHERE c.id = :id")
    Optional<Contract> findByIdWithDetails(@Param("id") UUID id);
}
```

---

## 3. Quy tắc Truy vấn Multi-tenancy An toàn Tuyệt đối

Trong hệ thống SaaS đa người thuê (Multi-tenant), có các tài nguyên dùng chung cho toàn hệ thống (`company_id IS NULL`, ví dụ vai trò mặc định, mẫu biểu chuẩn) và tài nguyên riêng của từng công ty (`company_id = :companyId`).

### ✅ CÚ PHÁP ĐÚNG:
```sql
WHERE (r.companyId IS NULL OR r.companyId = :companyId)
```
- Nếu `:companyId` có giá trị $\rightarrow$ Lấy tài nguyên dùng chung + tài nguyên riêng của công ty đó.
- Nếu `:companyId` là `null` $\rightarrow$ Chỉ lấy tài nguyên hệ thống dùng chung.

### ❌ CẤM KỴ TUYỆT ĐỐI (LỖ HỔNG RÒ RỈ DỮ LIỆU):
```sql
WHERE (:companyId IS NULL OR r.companyId = :companyId OR r.companyId IS NULL) -- CẤM KỴ!
```
> ⚠️ **GIẢI THÍCH:** Mệnh đề `:companyId IS NULL` sẽ biến toàn bộ biểu thức logic thành **TRUE** khi người dùng hoặc API không truyền `companyId`. Kết quả là câu lệnh sẽ quét và trả về dữ liệu của **TẤT CẢ CÁC CÔNG TY KHÁC**, gây rò rỉ thông tin bảo mật nghiêm trọng!

