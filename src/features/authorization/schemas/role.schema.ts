import { z } from "zod";

export const roleFormSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Mã vai trò phải có ít nhất 2 ký tự" })
    .max(50, { message: "Mã vai trò không được vượt quá 50 ký tự" })
    .regex(/^[A-Z0-9_]+$/, {
      message: "Mã vai trò chỉ được chứa chữ cái in hoa, chữ số và dấu gạch dưới (_)",
    }),
  name: z
    .string()
    .min(2, { message: "Tên vai trò phải có ít nhất 2 ký tự" })
    .max(100, { message: "Tên vai trò không được vượt quá 100 ký tự" }),
  description: z
    .string()
    .max(500, { message: "Mô tả không được vượt quá 500 ký tự" })
    .optional()
    .or(z.literal("")),
});

export const roleCreateDialogSchema = roleFormSchema.extend({
  cloneFromRoleId: z.string().optional(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
export type RoleCreateDialogValues = z.infer<typeof roleCreateDialogSchema>;
export type CreateRoleFormValues = RoleFormValues;
export type UpdateRoleFormValues = RoleFormValues;
export const createRoleSchema = roleFormSchema;
export const updateRoleSchema = roleFormSchema;
