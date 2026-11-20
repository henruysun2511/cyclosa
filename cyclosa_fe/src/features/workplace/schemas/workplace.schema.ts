import { z } from "zod";

export const siteFormSchema = z.object({
  branchId: z.string().uuid("Vui lòng chọn chi nhánh hợp lệ"),
  code: z
    .string()
    .min(2, "Mã cơ sở phải có ít nhất 2 ký tự")
    .max(30, "Mã cơ sở tối đa 30 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã cơ sở chỉ chứa chữ in hoa, số và dấu gạch ngang"),
  name: z.string().min(3, "Tên tòa nhà phải có ít nhất 3 ký tự").max(150, "Tên tối đa 150 ký tự"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự").max(500, "Địa chỉ tối đa 500 ký tự"),
  description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").optional().or(z.literal("")),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;

export const floorFormSchema = z.object({
  siteId: z.string().uuid("Vui lòng chọn tòa nhà"),
  floorNumber: z.coerce.number().int("Số tầng phải là số nguyên").min(-5, "Số tầng không hợp lệ").max(100, "Số tầng tối đa 100"),
  name: z.string().min(2, "Tên tầng phải có ít nhất 2 ký tự").max(100, "Tên tầng tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional().or(z.literal("")),
});

export type FloorFormValues = z.infer<typeof floorFormSchema>;

export const seatFormSchema = z.object({
  seatRowId: z.string().uuid("Vui lòng chọn cụm bàn"),
  seatCode: z.string().min(2, "Mã bàn phải có ít nhất 2 ký tự").max(100, "Mã bàn tối đa 100 ký tự"),
  seatType: z.enum(["DEDICATED", "HOT_DESK", "VISITOR"]).default("DEDICATED"),
  status: z.enum(["IN_SERVICE", "MAINTENANCE", "BLOCKED"]).default("IN_SERVICE"),
});

export type SeatFormValues = z.infer<typeof seatFormSchema>;

export const assignSeatSchema = z.object({
  seatId: z.string().uuid("Vui lòng chọn bàn làm việc"),
  employeeId: z.string().uuid("Vui lòng chọn nhân viên"),
  note: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().or(z.literal("")),
});

export type AssignSeatValues = z.infer<typeof assignSeatSchema>;

export const bookDeskSchema = z.object({
  seatId: z.string().uuid("Vui lòng chọn bàn làm việc"),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày đặt bàn không hợp lệ"),
  note: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().or(z.literal("")),
});

export type BookDeskValues = z.infer<typeof bookDeskSchema>;

export const bookRoomSchema = z.object({
  meetingRoomId: z.string().uuid("Vui lòng chọn phòng họp"),
  title: z.string().min(3, "Tiêu đề cuộc họp ít nhất 3 ký tự").max(200, "Tiêu đề tối đa 200 ký tự"),
  attendeeCount: z.coerce.number().int().min(1, "Số người tham dự tối thiểu là 1"),
  startTime: z.string().min(10, "Thời gian bắt đầu không hợp lệ"),
  endTime: z.string().min(10, "Thời gian kết thúc không hợp lệ"),
  description: z.string().max(1000, "Ghi chú tối đa 1000 ký tự").optional().or(z.literal("")),
});

export type BookRoomValues = z.infer<typeof bookRoomSchema>;

export const issueFormSchema = z.object({
  issueType: z.enum(["ELECTRICAL", "AIR_CONDITIONING", "FURNITURE", "HARDWARE", "CLEANING", "OTHER"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  title: z.string().min(3, "Tiêu đề sự cố ít nhất 3 ký tự").max(200, "Tiêu đề tối đa 200 ký tự"),
  description: z.string().min(10, "Vui lòng mô tả chi tiết sự cố ít nhất 10 ký tự").max(2000, "Mô tả tối đa 2000 ký tự"),
  floorId: z.string().uuid().optional().or(z.literal("")),
  seatId: z.string().uuid().optional().or(z.literal("")),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;

export const resolveIssueSchema = z.object({
  resolutionNote: z.string().min(5, "Vui lòng nhập ghi chú nghiệm thu khắc phục ít nhất 5 ký tự").max(1000, "Ghi chú tối đa 1000 ký tự"),
});

export type ResolveIssueValues = z.infer<typeof resolveIssueSchema>;

export const amenityFormSchema = z.object({
  name: z.string().min(2, "Tên tiện ích ít nhất 2 ký tự").max(100, "Tên tối đa 100 ký tự"),
  iconName: z.string().max(50, "Tên biểu tượng tối đa 50 ký tự").optional().or(z.literal("")),
  description: z.string().max(255, "Mô tả tối đa 255 ký tự").optional().or(z.literal("")),
});

export type AmenityFormValues = z.infer<typeof amenityFormSchema>;
