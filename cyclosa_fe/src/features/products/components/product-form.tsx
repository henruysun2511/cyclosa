"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from "../constants/product.constants";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../api/product-api";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../types/product.types";

export interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
  defaultValues?: Partial<CreateProductInput>;
  onSubmit?: (data: CreateProductInput) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  mode,
  initialData,
  defaultValues,
  onSubmit: externalOnSubmit,
  isLoading: externalLoading,
}: ProductFormProps) {
  const router = useRouter();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSubmitting = externalLoading || isCreating || isUpdating;

  const defaultFormValues: CreateProductInput = {
    sku: initialData?.sku ?? defaultValues?.sku ?? "",
    name: initialData?.name ?? defaultValues?.name ?? "",
    category:
      initialData?.category ??
      defaultValues?.category ??
      PRODUCT_CATEGORY_OPTIONS[0].value,
    price: initialData?.price ?? defaultValues?.price ?? 0,
    stockQuantity:
      initialData?.stockQuantity ?? defaultValues?.stockQuantity ?? 0,
    status: initialData?.status ?? defaultValues?.status ?? "ACTIVE",
    description: initialData?.description ?? defaultValues?.description ?? "",
  };

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultFormValues,
  });

  const handleSubmit = async (data: CreateProductInput) => {
    if (externalOnSubmit) {
      await externalOnSubmit(data);
      return;
    }

    try {
      if (mode === "create") {
        const created = await createProduct(data).unwrap();
        toast.success(`Sản phẩm "${created.name}" đã được tạo thành công.`);
        router.push("/products");
      } else if (initialData) {
        const updated = await updateProduct({
          id: initialData.id,
          body: data,
        }).unwrap();
        toast.success(`Cập nhật sản phẩm "${updated.name}" thành công.`);
        router.push(`/products/${initialData.id}`);
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMsg);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ── Mã SKU ─────────────────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mã SKU <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="VD: LAPTOP-DELL-5520"
                    disabled={mode === "edit" || isSubmitting}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>
                  {mode === "edit"
                    ? "Mã định danh duy nhất (không được phép sửa)"
                    : "Chỉ gồm chữ cái, số, gạch ngang và gạch dưới"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Tên sản phẩm ───────────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên sản phẩm <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="VD: Laptop Dell Latitude 5520 Core i7"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Danh mục sản phẩm ───────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Danh mục <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Trạng thái sản phẩm ─────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Trạng thái <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_STATUS_OPTIONS.map((st) => (
                      <SelectItem key={st.value} value={st.value}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Đơn giá ────────────────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Đơn giá (VNĐ) <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Số lượng tồn kho ───────────────────────────────────────── */}
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số lượng tồn kho <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Mô tả chi tiết ───────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả chi tiết</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                  placeholder="Thông số kỹ thuật, cấu hình, xuất xứ sản phẩm..."
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
