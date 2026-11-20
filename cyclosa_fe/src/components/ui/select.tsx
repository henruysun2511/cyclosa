"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "cn"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

// =============================================================================
// BỘ TỪ ĐIỂN MAPPING TỰ ĐỘNG CÁC ENUMS / VALUE TIẾNG ANH SANG TIẾNG VIỆT
// =============================================================================
export const COMMON_SELECT_LABELS: Record<string, string> = {
  // Trạng thái hoạt động chung
  ALL: "Tất cả",
  all: "Tất cả",
  NONE: "Không có",
  none: "Không có",
  GLOBAL: "Toàn công ty",
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Tạm ngưng",
  active: "Đang hoạt động",
  inactive: "Tạm ngưng",
  true: "Đang kích hoạt",
  false: "Ngừng kích hoạt",
  LOCKED: "Đã bị khóa",
  DEACTIVATED: "Đã hủy kích hoạt",

  // Quy trình phê duyệt & Trạng thái văn bản
  DRAFT: "Bản nháp",
  PENDING: "Chờ phê duyệt",
  PENDING_APPROVAL: "Chờ phê duyệt",
  WAITING_FOR_APPROVAL: "Chờ phê duyệt",
  PENDING_ACTIVATION: "Chờ kích hoạt",
  IN_PROGRESS: "Đang xử lý",
  PROCESSING: "Đang xử lý",
  UNDER_REVIEW: "Đang xem xét",
  APPROVED: "Đã phê duyệt",
  REJECTED: "Đã từ chối",
  CANCELLED: "Đã hủy bỏ",
  COMPLETED: "Đã hoàn tất",
  SUBMITTED: "Đã gửi",
  EXECUTED: "Đã áp dụng",
  APPLIED: "Đã áp dụng",
  EXPIRED: "Đã hết hạn",
  TERMINATED: "Đã chấm dứt",
  CLOSED: "Đã đóng",
  OPEN: "Đang mở",
  RESOLVED: "Đã giải quyết",
  INVESTIGATING: "Đang xác minh",

  // Giới tính & Tình trạng hôn nhân
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
  SINGLE: "Độc thân",
  MARRIED: "Đã kết hôn",
  DIVORCED: "Đã ly hôn",

  // Hợp đồng & Hình thức nhân sự
  FULL_TIME: "Toàn thời gian (Full-time)",
  PART_TIME: "Bán thời gian (Part-time)",
  CONTRACT: "Hợp đồng",
  CONTRACTOR: "Cộng tác viên (Contractor)",
  INTERN: "Thực tập sinh",
  INTERNSHIP: "Thực tập sinh",
  PROBATION: "Thử việc",
  OFFICIAL: "Chính thức",
  SEASONAL: "Thời vụ / Mùa vụ",
  FIXED_TERM: "Xác định thời hạn",
  INDEFINITE: "Không xác định thời hạn",
  SERVICE: "Hợp đồng dịch vụ / Khoán",
  COLLABORATOR: "Hợp đồng cộng tác viên",
  APPRENTICESHIP: "Học nghề / Đào tạo",
  RESIGNED: "Đã thôi việc",
  ON_LEAVE: "Nghỉ chế độ",
  SUSPENDED: "Tạm đình chỉ",
  ELECTRONIC: "Ký điện tử (E-Contract)",
  WET_INK: "Ký giấy truyền thống",
  HYBRID: "Linh hoạt (Hybrid)",
  REMOTE: "Từ xa (Remote)",
  ONSITE: "Tại văn phòng (On-site)",
  ON_SITE: "Tại văn phòng (On-site)",

  // Mức độ ưu tiên & Đánh giá
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  CRITICAL: "Khẩn cấp",
  URGENT: "Khẩn cấp",
  PASSED: "Đạt yêu cầu",
  FAILED: "Không đạt",

  // Điểm danh & Chấm công
  ON_TIME: "Đúng giờ (Chuẩn công)",
  LATE: "Đi muộn",
  EARLY: "Về sớm",
  HALF_DAY: "Nửa ngày công",
  ABSENT: "Vắng mặt",
  EXPLAINED: "Đã giải trình hợp lệ",
  MISSING_IN: "Thiếu quẹt vào",
  MISSING_OUT: "Thiếu quẹt ra",
  CHECK_IN: "Vào ca (Check-in)",
  CHECK_OUT: "Tan ca (Check-out)",
  SUCCESS: "Hợp lệ",
  OUT_OF_RANGE: "Ngoài phạm vi Geofence",
  FACE_MISMATCH: "Không khớp khuôn mặt",
  LIVENESS_FAILED: "Chống giả mạo thất bại",
  LOW_IMAGE_QUALITY: "Chất lượng ảnh kém",
  NO_FACE_DETECTED: "Không tìm thấy mặt",
  FORGOT_PUNCH: "Quên quẹt thẻ",
  TIME_DEVIATION: "Sai lệch thời gian",
  ATTENDANCE_EXPLANATION: "Giải trình đi muộn/về sớm",
  OVERTIME_REGISTRATION: "Đăng ký làm thêm giờ (OT)",

  // Quản lý tài sản (Asset)
  AVAILABLE: "Sẵn sàng cấp",
  ASSIGNED: "Đang cấp phát",
  IN_USE: "Đang sử dụng",
  IN_STORAGE: "Trong kho lưu trữ",
  MAINTENANCE: "Đang bảo trì",
  IN_REPAIR: "Đang sửa chữa",
  DAMAGED: "Hỏng hóc",
  BROKEN: "Bị hỏng",
  DISPOSED: "Đã thanh lý",
  LOST: "Đã mất",
  NEW: "Mới 100%",
  GOOD: "Tốt",
  FAIR: "Trung bình",
  POOR: "Kém",
  MAINTENANCE_REQUIRED: "Cần bảo trì",

  // Thôi việc & Kỷ luật / Khen thưởng
  RESIGNATION: "Thôi việc tự nguyện",
  DECISION: "Quyết định chấm dứt HĐLĐ",
  KHIEN_TRACH: "Khiển trách",
  KEO_DAI_THOI_HAN_NANG_LUONG: "Kéo dài thời hạn nâng lương",
  CACH_CHUC: "Cách chức",
  SA_THAI: "Sa thải",
  GIAY_KHEN: "Giấy khen",
  BANG_KHEN: "Bằng khen",
  TIEN_MAT: "Thưởng tiền mặt",
  CO_PHIEU: "Thưởng cổ phiếu / ESOP",
  MONETARY_BONUS: "Thưởng tiền mặt / Chuyển khoản",
  CERTIFICATE: "Bằng khen / Giấy khen",

  // Khiếu nại, phản ánh & Vi phạm nội quy
  SALARY_BENEFIT: "Tiền lương, phụ cấp & chế độ phúc lợi",
  COLLEAGUE_CONFLICT: "Mâu thuẫn đồng nghiệp, quản lý trực tiếp",
  HARASSMENT_BULLYING: "Quấy rối, bắt nạt hoặc phân biệt đối xử",
  WORKING_CONDITIONS: "Điều kiện làm việc, cơ sở vật chất & ATLD",
  APPRAISAL_PROMOTION: "Đánh giá KPI, xếp loại & thăng tiến",
  ATTENDANCE_BREACH: "Vi phạm thời giờ làm việc & chấm công",
  PROCESS_POLICY_VIOLATION: "Vi phạm quy trình, quy chuẩn nội bộ",
  INTERNAL_SECURITY_DISCLOSURE: "Tiết lộ thông tin, vi phạm bảo mật",
  FINANCIAL_ASSET_SECRET: "Xâm phạm tài sản, tài chính, bí mật KD",
  HARASSMENT_DISORDER: "Quấy rối, gây mất trật tự nơi làm việc",
  INSUBORDINATION_DEFIANCE: "Không chấp hành lệnh điều hành",

  // Điều chuyển nhân sự
  TRANSFER: "Điều chuyển vị trí",
  PROMOTION: "Bổ nhiệm thăng chức",
  DEMOTION: "Miễn nhiệm / Giáng cấp",
  ROTATION: "Luân chuyển định kỳ",
  SECONDMENT: "Biệt phái tạm thời",
  INTERNAL_DEPARTMENT: "Nội bộ phòng ban",
  BRANCH_TRANSFER: "Điều chuyển chi nhánh",
  INTER_COMPANY: "Điều chuyển công ty thành viên",

  // Tuyển dụng (Recruitment)
  SCREENING: "Sàng lọc hồ sơ",
  INTERVIEW: "Phỏng vấn",
  OFFER: "Đề xuất Offer",
  HIRED: "Đã tuyển dụng",
  SCHEDULED: "Đã lên lịch",
  ACCEPTED: "Ứng viên đã nhận việc",
  DECLINED: "Ứng viên từ chối",

  // Kế nhiệm (Career)
  READY_NOW: "Sẵn sàng ngay",
  READY_1_YEAR: "Sẵn sàng trong 1 năm",
  READY_2_YEARS: "Sẵn sàng trong 2 năm",
  HIGH_POTENTIAL: "Tiềm năng cao (HiPo)",
  CRITICAL_ROLE: "Vị trí trọng yếu",
  KEY_TALENT: "Nhân sự then chốt",

  // Tái cơ cấu (Restructure)
  CORP_WIDE: "Toàn tổng công ty",
  DEPT_LEVEL: "Cấp phòng ban",
  DIVISION_LEVEL: "Cấp khối chuyên môn",
  CREATED: "Mới tạo",
  MERGED: "Sáp nhập",
  SPLIT: "Chia tách",
  MOVED: "Điều chuyển",
  DISSOLVED: "Giải thể",
  UNCHANGED: "Giữ nguyên",
  TRANSFERRED: "Chuyển đơn vị",
  PROMOTED_RESTRUCTURE: "Bổ nhiệm thăng chức",
  LOW_SEVERITY: "Mức độ nhẹ",
  MEDIUM_SEVERITY: "Mức độ vừa",
  HIGH_SEVERITY: "Mức độ nghiêm trọng",

  // Nơi làm việc & Cơ sở vật chất (Workplace)
  DEDICATED: "Bàn cố định",
  HOT_DESK: "Bàn linh hoạt (Hot-desk)",
  VISITOR: "Bàn khách / Vãng lai",
  IN_SERVICE: "Đang hoạt động",
  BLOCKED: "Tạm khóa",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã Check-in",
  ELECTRICAL: "Điện & Ổ cắm",
  FURNITURE: "Bàn ghế & Nội thất",
  AIR_CONDITIONING: "Điều hòa nhiệt độ",
  HARDWARE: "Thiết bị phần cứng / Màn hình",
  CLEANING: "Vệ sinh môi trường",
  REPORTED: "Mới tiếp nhận",
  SEAT: "Vị trí Bàn làm việc",
  MEETING_ROOM: "Phòng họp",
  ROOM: "Phòng họp",
}

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  className,
  children,
  placeholder,
  ...props
}: SelectPrimitive.Value.Props) {
  const formatValue = React.useCallback(
    (val: any) => {
      // 1. Nếu developer truyền hàm format tùy chỉnh thì ưu tiên cao nhất
      if (typeof children === "function") {
        return children(val);
      }
      if (children != null) {
        return children;
      }

      // 2. Chưa chọn giá trị hoặc rỗng -> hiện placeholder
      if (val === null || val === undefined || val === "") {
        return placeholder;
      }

      const strVal = String(val);

      // 3. Xử lý "ALL" / "all": Trả về placeholder nếu là chuỗi tiếng Việt hoặc "Tất cả"
      if (strVal === "ALL" || strVal === "all") {
        if (typeof placeholder === "string" && placeholder.trim()) {
          return placeholder;
        }
        return "Tất cả";
      }

      // 4. Xử lý "NONE" / "none"
      if (strVal === "NONE" || strVal === "none") {
        return "Không có";
      }

      // 5. Kiểm tra từ điển Enums CYCLOSA toàn cục
      if (COMMON_SELECT_LABELS[strVal]) {
        return COMMON_SELECT_LABELS[strVal];
      }

      // 6. Xử lý boolean
      if (strVal === "true") return "Đang kích hoạt";
      if (strVal === "false") return "Ngừng kích hoạt";

      return val;
    },
    [children, placeholder]
  );

  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      placeholder={placeholder}
      {...props}
    >
      {formatValue}
    </SelectPrimitive.Value>
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
