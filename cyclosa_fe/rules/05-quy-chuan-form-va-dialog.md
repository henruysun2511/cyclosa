# Quy chuẩn 05: Tiêu chuẩn Biểu mẫu (Form), Dialog & Validation

> **Module chuẩn mực đối chiếu:**
> - [src/features/contract/components/contract-appendix-dialog.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract/components/contract-appendix-dialog.tsx)
> - [src/features/recruitment/components/offers/offer-form-dialog.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/recruitment/components/offers/offer-form-dialog.tsx)

---

## 1. Zod Schema là Nguồn Sự Thật Duy Nhất (Single Source of Truth)

Mọi form dữ liệu bắt buộc định nghĩa schema trong `src/features/<feature>/schemas/<feature>-schema.ts`:

- **CẤM** viết riêng một interface TypeScript rồi viết thêm một schema Zod trùng lặp.
- **BẮT BUỘC** trích xuất TypeScript Type trực tiếp từ schema qua `z.infer<typeof schema>`.
- **Thông báo lỗi validate:** 100% bằng Tiếng Việt có dấu, rõ nghĩa, chỉ rõ trường vi phạm.

```typescript
import { z } from "zod";

export const jobOpeningFormSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề vị trí tuyển dụng không được để trống")
    .max(150, "Tiêu đề tối đa 150 ký tự"),
  departmentId: z
    .string()
    .min(1, "Vui lòng chọn phòng ban trực thuộc"),
  headcount: z
    .coerce
    .number()
    .min(1, "Số lượng tuyển dụng tối thiểu là 1 người"),
  workLocation: z
    .string()
    .min(1, "Địa điểm làm việc không được để trống"),
  description: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type JobOpeningFormValues = z.infer<typeof jobOpeningFormSchema>;
```

---

## 2. Quy tắc Hợp nhất Dialog CRUD (Single Form Dialog)

Đối với các thực thể CRUD dùng cửa sổ pop-up (Modal/Dialog), **BẮT BUỘC hợp nhất Tạo mới và Cập nhật vào chung một Dialog component**:

```tsx
interface FeatureFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: FeatureDto | null; // Nếu null: Tạo mới; Nếu có dữ liệu: Chỉnh sửa
  onSubmit: (values: FeatureFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function FeatureFormDialog({
  open,
  onOpenChange,
  entity,
  onSubmit,
  isLoading,
}: FeatureFormDialogProps) {
  const isEditing = Boolean(entity);

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      title: "",
      departmentId: "",
      headcount: 1,
      workLocation: "",
      description: "",
    },
  });

  // Tự động reset giá trị khi entity thay đổi hoặc mở form
  useEffect(() => {
    if (entity) {
      form.reset({
        title: entity.title,
        departmentId: entity.departmentId,
        headcount: entity.headcount,
        workLocation: entity.workLocation || "",
        description: entity.description || "",
      });
    } else {
      form.reset({
        title: "",
        departmentId: "",
        headcount: 1,
        workLocation: "",
        description: "",
      });
    }
  }, [entity, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {isEditing ? "Chỉnh sửa vị trí tuyển dụng" : "Thêm mới vị trí tuyển dụng"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Cập nhật các thông tin chi tiết cho vị trí tuyển dụng hiện tại."
              : "Nhập thông tin để tạo mới vị trí tuyển dụng vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Nhãn trường thuần túy, sạch sẽ, không chèn icon */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Tên vị trí *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Ví dụ: Chuyên viên Tuyển dụng cấp cao"
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-border gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                <span>{isEditing ? "Lưu thay đổi" : "Tạo mới"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 3. Các Điều Cấm Kỵ khi Xây dựng Form

1. **CẤM chèn icon trang trí trước thẻ `<FormLabel>`:**
   - ❌ Sai: `<FormLabel className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Tên chức danh</FormLabel>`
   - ✅ Đúng: `<FormLabel className="text-xs font-semibold">Tên chức danh *</FormLabel>`
2. **CẤM để giá trị null không xử lý (Tránh lỗi uncontrolled input):**
   - Luôn sử dụng toán tử `?? ""` khi truyền vào ô input text/textarea:
     ```tsx
     <Input {...field} value={field.value ?? ""} />
     ```
3. **CẤM nhân bản nút hành động:**
   - Nút gửi form (Lưu / Cập nhật) chỉ xuất hiện duy nhất ở `DialogFooter` hoặc chân form. Không đưa thêm nút Lưu lên Page Header khi form đang mở dạng modal.

