"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Tags } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateAssetCategoryMutation,
  useDeleteAssetCategoryMutation,
} from "../api/asset-api";
import {
  assetCategoryFormSchema,
  type AssetCategoryFormValues,
} from "../schemas/asset.schema";
import type { AssetCategory } from "../types/asset.types";

interface AssetCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: AssetCategory[];
}

export function AssetCategoryDialog({
  open,
  onOpenChange,
  categories,
}: AssetCategoryDialogProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [createCategory, { isLoading: isCreating }] =
    useCreateAssetCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteAssetCategoryMutation();

  const form = useForm<AssetCategoryFormValues>({
    resolver: zodResolver(assetCategoryFormSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const handleCreate = async (values: AssetCategoryFormValues) => {
    try {
      await createCategory(values).unwrap();
      toast.success("Thêm mới loại tài sản thành công!");
      form.reset();
      setShowAddForm(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể thêm loại tài sản. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa loại tài sản này?")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Xóa loại tài sản thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa loại tài sản. Vui lòng thử lại!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold flex items-center gap-2">
                <Tags className="h-4.5 w-4.5 text-primary" />
                Danh mục loại tài sản
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Quản lý các nhóm trang thiết bị và công cụ dụng cụ trong doanh nghiệp.
              </DialogDescription>
            </div>
            {!showAddForm && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(true)}
                className="text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Thêm loại
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Form thêm mới loại tài sản */}
        {showAddForm && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
            <h4 className="text-xs font-semibold text-foreground">
              Tạo mới loại tài sản
            </h4>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreate)}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Mã loại <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: LAPTOP"
                            {...field}
                            className="h-8 text-xs font-mono uppercase"
                          />
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
                        <FormLabel className="text-xs">
                          Tên loại <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: Máy tính xách tay"
                            {...field}
                            className="h-8 text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Mô tả</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mô tả mục đích sử dụng..."
                          {...field}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      form.reset();
                    }}
                    className="h-7 text-xs"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isCreating}
                    className="h-7 text-xs"
                  >
                    {isCreating ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Danh sách loại hiện có */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-semibold">Mã</TableHead>
                <TableHead className="text-xs font-semibold">Tên loại</TableHead>
                <TableHead className="text-xs font-semibold">Mô tả</TableHead>
                <TableHead className="w-12 text-center text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-xs text-muted-foreground py-6"
                  >
                    Chưa có loại tài sản nào được định nghĩa
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs font-medium text-foreground">
                      {cat.code}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cat.id)}
                        disabled={isDeleting}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
