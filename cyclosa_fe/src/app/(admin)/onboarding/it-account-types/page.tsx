"use client";

import React, { useState } from "react";
import { KeyRound, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetItAccountTypesQuery,
  useCreateItAccountTypeMutation,
  useUpdateItAccountTypeMutation,
  useDeleteItAccountTypeMutation,
  OnboardingPageHeader,
  ItAccountTypeTable,
  ItAccountTypeDialog,
  type ItAccountTypeDto,
  type ItAccountTypeFormValues,
} from "@/features/onboarding";

export default function ItAccountTypesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ONBOARDING.MANAGE);

  const { data: types = [], isLoading } = useGetItAccountTypesQuery();
  const [createType] = useCreateItAccountTypeMutation();
  const [updateType] = useUpdateItAccountTypeMutation();
  const [deleteType] = useDeleteItAccountTypeMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ItAccountTypeDto | null>(null);

  const handleOpenCreate = () => {
    setEditingType(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (type: ItAccountTypeDto) => {
    setEditingType(type);
    setDialogOpen(true);
  };

  const handleConfirm = async (values: ItAccountTypeFormValues) => {
    try {
      if (editingType) {
        await updateType({ id: editingType.id, body: values }).unwrap();
        toast.success("Đã cập nhật loại tài khoản CNTT thành công!");
      } else {
        await createType(values).unwrap();
        toast.success("Đã tạo mới loại tài khoản CNTT thành công!");
      }
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể lưu loại tài khoản CNTT"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại tài khoản CNTT này?")) {
      return;
    }
    try {
      await deleteType(id).unwrap();
      toast.success("Đã xóa loại tài khoản CNTT.");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể xóa loại tài khoản"
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Danh mục loại tài khoản CNTT"
        icon={KeyRound}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Loại tài khoản CNTT" },
        ]}
        actions={
          canManage && (
            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Thêm loại tài khoản</span>
            </Button>
          )
        }
      />

      <ItAccountTypeTable
        types={types}
        isLoading={isLoading}
        canManage={canManage}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <ItAccountTypeDialog
        initialData={editingType}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

