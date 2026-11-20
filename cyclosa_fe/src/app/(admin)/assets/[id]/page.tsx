"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  ChevronRight,
  Home,
  ArrowLeft,
  Calendar,
  User,
  History,
  Building,
  UserPlus,
  RotateCcw,
  Edit,
  Tag,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAssetByIdQuery,
  useGetAssetCategoriesQuery,
  useUpdateAssetMutation,
  useAssignAssetMutation,
  useReturnAssetMutation,
} from "@/features/asset/api/asset-api";
import {
  ASSET_STATUS_COLORS,
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_COLORS,
  ASSET_CONDITION_LABELS,
} from "@/features/asset/constants/asset.constants";
import { AssetFormDialog } from "@/features/asset/components/asset-form-dialog";
import { AssignAssetDialog } from "@/features/asset/components/assign-asset-dialog";
import { ReturnAssetDialog } from "@/features/asset/components/return-asset-dialog";
import type {
  AssetFormValues,
  AssignAssetFormValues,
  ReturnAssetFormValues,
} from "@/features/asset/schemas/asset.schema";

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: asset, isLoading, isError } = useGetAssetByIdQuery(id, {
    skip: !id,
  });
  const { data: categories = [] } = useGetAssetCategoriesQuery();

  const [updateAsset, { isLoading: isUpdating }] = useUpdateAssetMutation();
  const [assignAsset, { isLoading: isAssigning }] = useAssignAssetMutation();
  const [returnAsset, { isLoading: isReturning }] = useReturnAssetMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs">Đang tải chi tiết tài sản...</p>
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-medium text-destructive">
          Không tìm thấy thông tin tài sản yêu cầu
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/assets")}
          className="text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusColor = ASSET_STATUS_COLORS[asset.status];
  const conditionColor = ASSET_CONDITION_COLORS[asset.conditionStatus];

  const handleEditSubmit = async (values: AssetFormValues) => {
    try {
      await updateAsset({ id: asset.id, body: values }).unwrap();
      toast.success("Cập nhật thông tin tài sản thành công!");
      setEditOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể cập nhật tài sản. Vui lòng thử lại!");
    }
  };

  const handleAssignSubmit = async (values: AssignAssetFormValues) => {
    try {
      await assignAsset({ assetId: asset.id, body: values }).unwrap();
      toast.success("Cấp phát tài sản thành công!");
      setAssignOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể cấp phát tài sản. Vui lòng thử lại!");
    }
  };

  const handleReturnSubmit = async (values: ReturnAssetFormValues) => {
    const assignmentId = asset.currentAssignmentId;
    if (!assignmentId) return;
    try {
      await returnAsset({
        assignmentId,
        assetId: asset.id,
        body: values,
      }).unwrap();
      toast.success("Thu hồi tài sản thành công!");
      setReturnOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể thu hồi tài sản. Vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Rule 02: Breadcrumbs 4 cấp */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Trang chủ</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <Link
          href="/assets"
          className="hover:text-foreground transition-colors"
        >
          Quản trị nhân sự
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <Link
          href="/assets"
          className="hover:text-foreground transition-colors"
        >
          Quản lý tài sản
        </Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
        <span className="font-medium text-foreground truncate max-w-[200px]">
          {asset.name}
        </span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-start gap-3.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/assets")}
            className="h-9 w-9 shrink-0 mt-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Package className="h-6 w-6 text-primary shrink-0" />
                {asset.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                {asset.assetCode}
              </span>
              <Badge
                variant="outline"
                className={`text-xs font-normal border ${statusColor.bg} ${statusColor.border}`}
              >
                {ASSET_STATUS_LABELS[asset.status]}
              </Badge>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md ${conditionColor.bg}`}
              >
                {ASSET_CONDITION_LABELS[asset.conditionStatus]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nhóm: <span className="font-medium text-foreground">{asset.categoryName}</span> ({asset.categoryCode})
              {asset.location && ` • Vị trí: ${asset.location}`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="h-9 text-xs"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Chỉnh sửa
          </Button>

          {asset.status === "AVAILABLE" && (
            <Button
              size="sm"
              onClick={() => setAssignOpen(true)}
              className="h-9 text-xs bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              Cấp phát cho nhân sự
            </Button>
          )}

          {asset.status === "ASSIGNED" && (
            <Button
              size="sm"
              onClick={() => setReturnOpen(true)}
              className="h-9 text-xs bg-amber-600 hover:bg-amber-700"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Thu hồi thiết bị
            </Button>
          )}
        </div>
      </div>

      {/* Grid: Thông tin chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái (2/3): Thông số kỹ thuật & Thông tin máy */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Thông số & Thông tin xuất xứ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">Hãng sản xuất:</span>
                <p className="font-medium text-foreground">
                  {asset.manufacturer || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Model thiết bị:</span>
                <p className="font-medium text-foreground font-mono">
                  {asset.model || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Số Serial:</span>
                <p className="font-medium text-foreground font-mono">
                  {asset.serialNumber || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Vị trí lưu trữ:</span>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {asset.location || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Ngày mua:</span>
                <p className="font-medium text-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {asset.purchaseDate || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Nguyên giá:</span>
                <p className="font-medium text-foreground font-mono flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  {asset.purchasePrice
                    ? `${asset.purchasePrice.toLocaleString("vi-VN")} VNĐ`
                    : "—"}
                </p>
              </div>
            </div>

            {asset.specifications && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">
                  Cấu hình chi tiết:
                </span>
                <div className="rounded-lg bg-muted/40 p-3 text-xs font-mono whitespace-pre-wrap text-foreground">
                  {asset.specifications}
                </div>
              </div>
            )}

            {asset.notes && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">
                  Ghi chú:
                </span>
                <p className="text-xs text-muted-foreground">
                  {asset.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải (1/3): Người đang sử dụng */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Nhân sự đang nắm giữ
            </h3>

            {asset.currentEmployeeName ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {asset.currentEmployeeName.slice(-2)}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-foreground">
                        {asset.currentEmployeeName}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {asset.currentEmployeeCode}
                      </p>
                    </div>
                  </div>

                  {asset.currentDepartmentName && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] pt-1">
                      <Building className="h-3 w-3" />
                      <span>{asset.currentDepartmentName}</span>
                    </div>
                  )}

                  {asset.currentAssignedAt && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Bàn giao:{" "}
                        {new Date(asset.currentAssignedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReturnOpen(true)}
                  className="w-full text-xs text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Ghi nhận thu hồi
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground space-y-3">
                <p className="text-xs">Hiện tại tài sản chưa cấp phát cho ai.</p>
                <Button
                  size="sm"
                  onClick={() => setAssignOpen(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Cấp phát ngay
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lịch sử cấp phát và hoàn trả */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Lịch sử bàn giao & thu hồi qua các thời kỳ
        </h3>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center text-xs">STT</TableHead>
                <TableHead className="text-xs font-semibold">Nhân viên tiếp nhận</TableHead>
                <TableHead className="text-xs font-semibold">Ngày bàn giao</TableHead>
                <TableHead className="text-xs font-semibold">Tình trạng lúc giao</TableHead>
                <TableHead className="text-xs font-semibold">Ngày hoàn trả</TableHead>
                <TableHead className="text-xs font-semibold">Tình trạng lúc nhận</TableHead>
                <TableHead className="text-xs font-semibold">Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asset.assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-xs text-muted-foreground py-8"
                  >
                    Chưa có lượt cấp phát nào được ghi nhận cho tài sản này
                  </TableCell>
                </TableRow>
              ) : (
                asset.assignments.map((item, idx) => {
                  const assignCond = item.conditionOnAssign
                    ? ASSET_CONDITION_LABELS[item.conditionOnAssign]
                    : "—";
                  const returnCond = item.conditionOnReturn
                    ? ASSET_CONDITION_LABELS[item.conditionOnReturn]
                    : "—";

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/20 text-xs">
                      <TableCell className="text-center font-mono text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {item.employeeName}
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          {item.employeeCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(item.assignedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>{assignCond}</TableCell>
                      <TableCell>
                        {item.returnedAt ? (
                          new Date(item.returnedAt).toLocaleDateString("vi-VN")
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Đang sử dụng
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{returnCond}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {item.notes || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <AssetFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        asset={asset}
        categories={categories}
        onSubmit={handleEditSubmit}
        isLoading={isUpdating}
      />

      <AssignAssetDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        asset={asset}
        onSubmit={handleAssignSubmit}
        isLoading={isAssigning}
      />

      <ReturnAssetDialog
        open={returnOpen}
        onOpenChange={setReturnOpen}
        asset={asset}
        onSubmit={handleReturnSubmit}
        isLoading={isReturning}
      />
    </div>
  );
}
