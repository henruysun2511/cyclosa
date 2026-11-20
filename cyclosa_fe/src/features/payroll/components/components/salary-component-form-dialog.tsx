"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SALARY_COMPONENT_CATEGORY_LABELS,
  COMPONENT_FREQUENCY_LABELS,
} from "../../constants/payroll.constants";
import { useCreateSalaryComponentMutation } from "../../api/payroll-api";
import {
  createSalaryComponentSchema,
  type CreateSalaryComponentFormValues,
} from "../../schemas/payroll.schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ComponentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SalaryComponentFormDialog({ open, onOpenChange }: ComponentFormDialogProps) {
  const [createComponent, { isLoading }] = useCreateSalaryComponentMutation();

  const form = useForm<CreateSalaryComponentFormValues>({
    resolver: zodResolver(createSalaryComponentSchema),
    defaultValues: {
      code: "",
      name: "",
      category: "ALLOWANCE",
      frequency: "MONTHLY",
      defaultAmount: 0,
      isTaxable: true,
      isInsuranceSalary: false,
      description: "",
    },
  });

  const onSubmit = async (values: CreateSalaryComponentFormValues) => {
    try {
      await createComponent(values).unwrap();
      toast.success("Tạo cấu phần lương thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể tạo cấu phần");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo cấu phần thu nhập / phụ cấp / khấu trừ</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã cấu phần *</FormLabel>
                    <FormControl>
                      <Input placeholder="AN_TRUA, XANG_XE..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên cấu phần *</FormLabel>
                    <FormControl>
                      <Input placeholder="Phụ cấp ăn trưa..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhóm cấu phần *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(SALARY_COMPONENT_CATEGORY_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chu kỳ áp dụng *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chu kỳ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(COMPONENT_FREQUENCY_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="defaultAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức tiền mặc định (VNĐ)</FormLabel>
                  <FormControl>
                    <Input type="number" step="10000" placeholder="730000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6 pt-1">
              <FormField
                control={form.control}
                name="isTaxable"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">Chịu thuế TNCN</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isInsuranceSalary"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">Tính đóng BHXH</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Diễn giải thêm về cấu phần này..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu cấu phần
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

