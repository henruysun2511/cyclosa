import { z } from "zod";

export const createOrgScenarioSchema = z.object({
  name: z.string().min(1, "Tên kịch bản không được để trống").max(150, "Tối đa 150 ký tự"),
  code: z.string().min(1, "Mã kịch bản không được để trống").max(50, "Tối đa 50 ký tự"),
  description: z.string().optional(),
  scope: z.enum(["COMPANY_WIDE", "DIVISION_LEVEL", "DEPARTMENT_LEVEL"], {
    required_error: "Vui lòng chọn phạm vi kịch bản",
  }),
  targetEffectiveDate: z.string().min(1, "Vui lòng chọn ngày hiệu lực dự kiến"),
});

export type CreateOrgScenarioFormValues = z.infer<typeof createOrgScenarioSchema>;

export const createScenarioDepartmentSchema = z.object({
  parentScenarioDeptId: z.string().optional(),
  code: z.string().min(1, "Mã phòng ban không được để trống").max(50, "Tối đa 50 ký tự"),
  name: z.string().min(1, "Tên phòng ban không được để trống").max(150, "Tối đa 150 ký tự"),
  managerEmployeeId: z.string().optional(),
  targetHeadcount: z.coerce.number().min(0, "Định biên không âm").default(0),
  isPermissionInherited: z.boolean().default(true),
  notes: z.string().optional(),
});

export type CreateScenarioDepartmentFormValues = z.infer<typeof createScenarioDepartmentSchema>;

export const mergeDepartmentsSchema = z.object({
  sourceDepartmentIds: z.array(z.string()).min(2, "Chọn tối thiểu 2 phòng ban cần sáp nhập"),
  targetDepartmentId: z.string().min(1, "Chọn phòng ban tiếp nhận sau sáp nhập"),
  newManagerEmployeeId: z.string().optional(),
  notes: z.string().optional(),
});

export type MergeDepartmentsFormValues = z.infer<typeof mergeDepartmentsSchema>;

export const rejectScenarioSchema = z.object({
  reason: z.string().min(1, "Vui lòng nhập lý do từ chối kịch bản"),
});

export type RejectScenarioFormValues = z.infer<typeof rejectScenarioSchema>;
