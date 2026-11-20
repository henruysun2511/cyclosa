import { z } from "zod";

// ── 1. Chu kỳ đánh giá (Performance Cycle) ──────────────────────────────────
export const cycleFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên kỳ đánh giá không được để trống")
      .max(150, "Tên kỳ đánh giá tối đa 150 ký tự"),
    cycleType: z.enum(
      ["MONTHLY", "QUARTERLY", "HALF_YEAR", "ANNUAL", "PROBATION"],
      {
        message: "Vui lòng chọn loại kỳ đánh giá hợp lệ",
      }
    ),
    year: z.coerce
      .number()
      .min(2000, "Năm đánh giá phải từ năm 2000 trở đi")
      .max(2100, "Năm đánh giá không hợp lệ"),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu kỳ"),
    endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc kỳ"),
    selfReviewDeadline: z.string().optional().or(z.literal("")),
    managerReviewDeadline: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "Ngày bắt đầu không được sau ngày kết thúc kỳ đánh giá",
      path: ["endDate"],
    }
  );

export type CycleFormValues = z.infer<typeof cycleFormSchema>;

// ── 2. Chỉ số KPI (KPI Catalog) ──────────────────────────────────────────────
export const kpiFormSchema = z.object({
  code: z
    .string()
    .min(1, "Mã chỉ số KPI không được để trống")
    .max(50, "Mã chỉ số KPI tối đa 50 ký tự")
    .regex(/^[A-Za-z0-9_-]+$/, "Mã chỉ số chỉ được chứa chữ cái, số, gạch ngang và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên chỉ số KPI không được để trống")
    .max(150, "Tên chỉ số KPI tối đa 150 ký tự"),
  description: z.string().optional().or(z.literal("")),
  unit: z
    .string()
    .min(1, "Đơn vị tính không được để trống")
    .max(30, "Đơn vị tính tối đa 30 ký tự"),
  defaultTarget: z.coerce
    .number()
    .min(0, "Giá trị mục tiêu mặc định không được âm")
    .optional(),
  departmentId: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type KpiFormValues = z.infer<typeof kpiFormSchema>;

// ── 3. Khởi tạo danh sách phiếu đánh giá (Initialize Reviews) ────────────────
export const initializeReviewsSchema = z.object({
  employeeIds: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một nhân sự để khởi tạo phiếu đánh giá"),
});

export type InitializeReviewsFormValues = z.infer<typeof initializeReviewsSchema>;

// ── 4. Mục tiêu đánh giá (Performance Goal) ──────────────────────────────────
export const goalFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tên mục tiêu đánh giá không được để trống")
    .max(200, "Tên mục tiêu tối đa 200 ký tự"),
  targetValue: z.coerce
    .number()
    .min(0, "Chỉ tiêu cần đạt không được âm")
    .optional(),
  kpiId: z.string().optional().or(z.literal("")),
  weight: z.coerce
    .number()
    .min(0.01, "Trọng số tối thiểu là 0.01%")
    .max(100.0, "Trọng số tối đa không được vượt quá 100.00%"),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

// ── 5. Đánh giá & Chấm điểm của Quản lý (Manager Assessment) ────────────────
export const managerAssessmentItemSchema = z.object({
  goalId: z.string(),
  managerScore: z.coerce
    .number()
    .min(0, "Điểm chấm tối thiểu là 0")
    .max(100, "Điểm chấm tối đa là 100"),
  managerComment: z.string().optional().or(z.literal("")),
});

export const managerAssessmentFormSchema = z.object({
  generalComment: z.string().optional().or(z.literal("")),
  goalScores: z.array(managerAssessmentItemSchema),
});

export type ManagerAssessmentFormValues = z.infer<typeof managerAssessmentFormSchema>;
