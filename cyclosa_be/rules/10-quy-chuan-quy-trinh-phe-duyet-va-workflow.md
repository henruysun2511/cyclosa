# Quy chuẩn 10: Tích Hợp Quy Trình Phê Duyệt & Workflow Engine

> **Áp dụng cho:** Tất cả các module và lập trình viên / AI Agent khi phát triển trong `cyclosa_be`.

---

## 1. Kiến Trúc Workflow Engine Trong CYCLOSA HRM

Trong CYCLOSA HRM, các nghiệp vụ cần phê duyệt (như: Đơn xin nghỉ phép, Đơn giải trình chấm công, Phê duyệt ký hợp đồng, Đề xuất tuyển dụng, Đề xuất tăng lương...) **không được tự xây dựng bảng duyệt riêng rẽ** mà phải tích hợp với module lõi **Workflow Engine** (`com.cyclosa.workflow`).

### 1.1. Mục tiêu
- **Chuẩn hóa luồng phê duyệt:** Hỗ trợ quy trình 1 cấp hoặc đa cấp (Manager -> Head -> HR).
- **Linh hoạt cấu hình:** Cho phép tùy biến người duyệt theo vai trò công việc (`DIRECT_MANAGER`, `DEPARTMENT_HEAD`, `HR_MANAGER`) hoặc người dùng cụ thể.
- **Ủy quyền minh bạch:** Tự động chuyển quyền duyệt khi người quản lý đi công tác hoặc nghỉ phép có cấu hình `WorkflowDelegation`.
- **Thống nhất giao diện người dùng:** Cung cấp Hộp thư phê duyệt tập trung (Approval Inbox) cho người quản lý.

---

## 2. Nguyên Tắc Tích Hợp Giữa Các Module Nghiệp Vụ & Workflow

1. **Giao tiếp qua Public Service duy nhất:**
   - Các module nghiệp vụ (`leave`, `attendance`, `recruitment`, `contract`...) **CHỈ ĐƯỢC GỌI** qua Public Service:
     `com.cyclosa.workflow.service.WorkflowExecutionService`
   - **TUYỆT ĐỐI CẤM** việc inject trực tiếp các repository của module workflow (như `WorkflowRequestRepository`, `WorkflowDefinitionRepository`).
2. **Không nhân bản cấu trúc trạng thái:**
   - Trạng thái tổng quát của quy trình tuân thủ enum chuẩn: `com.cyclosa.workflow.enums.WorkflowOverallStatus` (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`).

---

## 3. Vòng Đời Luồng Phê Duyệt (Workflow Lifecycle)

```
[Nhân viên gửi yêu cầu] 
        │
        ▼  submitRequest(...)
   ┌─────────┐
   │ PENDING │ ◄── [Sinh các bước duyệt WorkflowRequestStep]
   └────┬────┘
        │
        ├──────────────────────┬──────────────────────┐
        ▼ approveStep(...)      ▼ rejectStep(...)      ▼ cancelRequest(...)
  ┌──────────┐            ┌──────────┐           ┌───────────┐
  │ APPROVED │            │ REJECTED │           │ CANCELLED │
  └─────┬────┘            └──────────┘           └───────────┘
        │
        ▼ Bắn WorkflowCompletedEvent
[Module nghiệp vụ cập nhật trạng thái thực thể gốc]
```

### 3.1. Khởi tạo đơn duyệt (`submitRequest`)
Khi người dùng gửi đơn (vd: đơn giải trình công, đơn nghỉ phép):
```java
SubmitWorkflowRequest workflowReq = SubmitWorkflowRequest.builder()
        .requestType(RequestType.ATTENDANCE_EXPLANATION) // Hoặc LEAVE_REQUEST, CONTRACT_PROPOSAL
        .entityId(savedRequest.getId())                 // ID của thực thể nghiệp vụ gốc
        .requesterEmployeeId(employee.getId())          // Nhân viên gửi đơn
        .title("Đơn giải trình chấm công ngày " + req.getWorkDate())
        .build();

WorkflowRequestResponse workflowRes = workflowExecutionService.submitRequest(workflowReq);
```

### 3.2. Phê duyệt bước (`approveStep`)
Người có thẩm quyền hoặc người được ủy quyền duyệt:
```java
ApproveStepRequest approveReq = ApproveStepRequest.builder()
        .notes("Đã đối chiếu với lịch hẹn khách hàng, đồng ý phê duyệt.")
        .build();

workflowExecutionService.approveStep(workflowRequestId, approveReq);
```
- Nếu còn bước duyệt tiếp theo: Chuyển sang bước kế tiếp và gửi thông báo cho người duyệt tiếp theo.
- Nếu là bước duyệt cuối cùng: Trạng thái tổng chuyển thành `APPROVED` và hệ thống tự động phát ra `WorkflowCompletedEvent`.

### 3.3. Từ chối đơn (`rejectStep`)
Người duyệt từ chối đơn:
```java
RejectStepRequest rejectReq = RejectStepRequest.builder()
        .rejectionReason("Không có tài liệu hoặc minh chứng hợp lệ đi kèm.") // BẮT BUỘC
        .build();

workflowExecutionService.rejectStep(workflowRequestId, rejectReq);
```
- Ngay khi có 1 bước bị từ chối, toàn bộ luồng chuyển sang `REJECTED` và phát ra `WorkflowCompletedEvent`.

### 3.4. Hủy đơn (`cancelRequest`)
Người tạo đơn có thể hủy đơn khi luồng vẫn đang ở trạng thái `PENDING`:
```java
workflowExecutionService.cancelRequest(workflowRequestId, CancelWorkflowRequest.builder()
        .reason("Tôi đã trao đổi lại với quản lý và không cần giải trình ngày này nữa.")
        .build());
```

---

## 4. Cơ Chế Tự Động Tra Cứu Người Duyệt (Approver Resolver)

Module Workflow tích hợp `ApproverResolverService` để tự động xác định người duyệt dựa trên sơ đồ tổ chức:
1. `DIRECT_MANAGER`: Tra cứu từ `EmployeeWorkAssignment.getManagerEmployeeId()` của nhân viên tại thời điểm tạo đơn.
2. `DEPARTMENT_HEAD`: Tra cứu Trưởng phòng của phòng ban mà nhân viên đang công tác.
3. `HR_MANAGER`: Tra cứu người dùng mang quyền quản trị nhân sự `attendance.approve` hoặc `leave.approve`.
4. `SPECIFIC_USER`: Người dùng cụ thể được gán cố định trong cấu hình bước duyệt.

---

## 5. Cơ Chế Ủy Quyền Phê Duyệt (Workflow Delegation)

Trong trường hợp người quản lý vắng mặt (nghỉ phép, công tác nước ngoài):
- Người quản lý thiết lập ủy quyền qua `WorkflowDelegationService.createDelegation(...)` với khoảng thời gian `effectiveFrom` đến `effectiveTo`.
- Khi người duyệt kiểm tra quyền tại `WorkflowExecutionService.approveStep(...)`, hệ thống tự động kiểm tra bảng `workflow_delegations`:
  ```java
  // Nếu người duyệt hiện tại không phải là approver gốc,
  // nhưng có bản ghi ủy quyền hợp lệ trong thời gian hiệu lực -> Chấp thuận thao tác
  boolean isDelegated = delegationService.isDelegated(originalApproverId, currentUserId, requestType, now);
  ```
- Bản ghi lịch sử bước duyệt (`WorkflowRequestStep`) phải lưu lại rõ:
  - `originalApproverId`: Người duyệt theo phân công gốc.
  - `actualActionUserId`: Người thực tế đã click nút duyệt (người được ủy quyền).

---

## 6. Đồng Bộ Trạng Thái Qua `WorkflowCompletedEvent`

Khi quy trình phê duyệt hoàn tất (`APPROVED` hoặc `REJECTED`), module Workflow **không trực tiếp sửa CSDL của module nghiệp vụ**, mà bắn ra một sự kiện:

```java
public record WorkflowCompletedEvent(
    UUID workflowRequestId,
    RequestType requestType,
    UUID entityId,
    WorkflowOverallStatus finalStatus,
    UUID reviewedByUserId,
    String rejectionReason
) {}
```

Module nghiệp vụ nguồn lắng nghe sự kiện này bằng `@TransactionalEventListener`:

```java
@Component
@RequiredArgsConstructor
public class AttendanceWorkflowEventListener {

    private final AttendanceRequestRepository attendanceRequestRepository;
    private final AttendanceAdjustmentRepository adjustmentRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onWorkflowCompleted(WorkflowCompletedEvent event) {
        if (event.requestType() != RequestType.ATTENDANCE_EXPLANATION) {
            return;
        }

        AttendanceRequest request = attendanceRequestRepository.findById(event.entityId())
                .orElse(null);
        if (request == null) return;

        if (event.finalStatus() == WorkflowOverallStatus.APPROVED) {
            request.setStatus(AttendanceRequestStatus.APPROVED);
            // Tự động sinh bản ghi điều chỉnh công AttendanceAdjustment
            createAdjustmentRecord(request);
        } else if (event.finalStatus() == WorkflowOverallStatus.REJECTED) {
            request.setStatus(AttendanceRequestStatus.REJECTED);
            request.setRejectionReason(event.rejectionReason());
        }

        attendanceRequestRepository.save(request);
    }
}
```
**Lợi ích:** Module Workflow và Module Nghiệp vụ hoàn toàn độc lập (Decoupled), không xảy ra tình trạng Circular Dependency hay vi phạm ranh giới Domain.

