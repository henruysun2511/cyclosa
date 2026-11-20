"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assetFormSchema,
  type AssetFormValues,
} from "../schemas/asset.schema";
import {
  ASSET_CONDITION_LABELS,
} from "../constants/asset.constants";
import type {
  AssetCategory,
  AssetDetail,
  AssetSummary,
} from "../types/asset.types";

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: AssetDetail | AssetSummary | null;
  categories: AssetCategory[];
  onSubmit: (values: AssetFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AssetFormDialog({
  open,
  onOpenChange,
  asset,
  categories,
  onSubmit,
  isLoading = false,
}: AssetFormDialogProps) {
  const isEditing = Boolean(asset);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema) as any,
    defaultValues: {
      assetCode: "",
      categoryId: "",
      name: "",
      serialNumber: "",
      model: "",
      manufacturer: "",
      specifications: "",
      purchaseDate: "",
      purchasePrice: 0,
      conditionStatus: "NEW",
      location: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (asset) {
        form.reset({
          assetCode: asset.assetCode,
          categoryId: asset.categoryId,
          name: asset.name,
          serialNumber: asset.serialNumber || "",
          model: asset.model || "",
          manufacturer: asset.manufacturer || "",
          specifications: (asset as AssetDetail).specifications || "",
          purchaseDate: asset.purchaseDate || "",
          purchasePrice: asset.purchasePrice || 0,
          conditionStatus: asset.conditionStatus,
          location: asset.location || "",
          notes: (asset as AssetDetail).notes || "",
        });
      } else {
        form.reset({
          assetCode: `AST-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
          )}`,
          categoryId: categories[0]?.id || "",
          name: "",
          serialNumber: "",
          model: "",
          manufacturer: "",
          specifications: "",
          purchaseDate: new Date().toISOString().split("T")[0],
          purchasePrice: 0,
          conditionStatus: "NEW",
          location: "",
          notes: "",
        });
      }
    }
  }, [open, asset, categories, form]);

  const handleSubmit = async (values: AssetFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {isEditing ? "Chỉnh sửa thông tin tài sản" : "Thêm mới tài sản vào kho"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEditing
              ? "Cập nhật các thông số kỹ thuật, loại hoặc vị trí của tài sản."
              : "Khai báo tài sản mới nhập kho để bắt đầu theo dõi và cấp phát."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mã tài sản */}
              <FormField
                control={form.control}
                name="assetCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Mã tài sản <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: AST-2026-0001"
                        {...field}
                        disabled={isEditing}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Loại tài sản */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Loại tài sản <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn loại tài sản" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name} ({cat.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tên tài sản */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Tên tài sản / Thiết bị <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: MacBook Pro 16 M3 Pro / Màn hình Dell U2723QE"
                      {...field}
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Serial Number */}
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Số Serial</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: C02G1234MD6R"
                        {...field}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: A2991"
                        {...field}
                        className="h-9 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hãng sản xuất */}
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Hãng sản xuất</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Apple / Dell / Lenovo"
                        {...field}
                        className="h-9 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Ngày mua */}
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Ngày mua / tiếp nhận</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-9 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giá mua */}
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Nguyên giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className="h-9 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tình trạng ban đầu */}
              <FormField
                control={form.control}
                name="conditionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Tình trạng hiện vật</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn tình trạng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ASSET_CONDITION_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vị trí */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Vị trí lưu kho / Văn phòng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Kho IT - Tầng 5 Keangnam"
                      {...field}
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thông số kỹ thuật */}
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Thông số kỹ thuật</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD: Apple M3 Pro 12-core CPU, 18-core GPU, 36GB RAM, 512GB SSD..."
                      rows={2}
                      {...field}
                      className="text-xs resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Ghi chú bổ sung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú thêm về phụ kiện đi kèm, tình trạng thùng hộp..."
                      rows={2}
                      {...field}
                      className="text-xs resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="text-xs">
                {isLoading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Lưu vào kho"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
