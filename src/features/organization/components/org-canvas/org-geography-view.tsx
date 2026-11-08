"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllRegionsQuery,
  useDeleteRegionMutation,
} from "../../api/region-api";
import {
  useGetBranchesByCompanyQuery,
  useDeleteBranchMutation,
} from "../../api/branch-api";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Region } from "../../types/region.types";
import type { Branch } from "../../types/branch.types";

interface OrgGeographyViewProps {
  companyId: string;
  onOpenCreateRegion: () => void;
  onOpenCreateBranch: (regionId?: string) => void;
  onOpenEditRegion: (region: Region) => void;
  onOpenEditBranch: (branch: Branch) => void;
  className?: string;
}

export function OrgGeographyView({
  companyId,
  onOpenCreateRegion,
  onOpenCreateBranch,
  onOpenEditRegion,
  onOpenEditBranch,
  className,
}: OrgGeographyViewProps) {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ORG.MANAGE);

  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "region" | "branch";
    id: string;
    name: string;
  } | null>(null);

  const { data: regions = [], isLoading: isRegionsLoading } = useGetAllRegionsQuery(companyId);
  const { data: branches = [], isLoading: isBranchesLoading } = useGetBranchesByCompanyQuery(companyId);

  const [deleteRegion] = useDeleteRegionMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "region") {
        await deleteRegion(deleteTarget.id).unwrap();
        toast.success(`Đã xóa vùng miền ${deleteTarget.name}`);
      } else {
        await deleteBranch(deleteTarget.id).unwrap();
        toast.success(`Đã xóa chi nhánh ${deleteTarget.name}`);
      }
    } catch {
      toast.error("Thao tác thất bại, vui lòng kiểm tra ràng buộc dữ liệu!");
    } finally {
      setDeleteTarget(null);
    }
  };

  const isLoading = isRegionsLoading || isBranchesLoading;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Đang nạp dữ liệu Địa lý & Chi nhánh...
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Dimension Sub-bar */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Cây Địa lý & Chi nhánh làm việc (F-C03)</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {regions.length} vùng miền · {branches.length} chi nhánh GPS
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCreateRegion}
              className="h-8 text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm vùng</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onOpenCreateBranch()}
              className="h-8 text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm chi nhánh</span>
            </Button>
          </div>
        )}
      </div>

      {/* Root Node: Toàn quốc */}
      <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-mono text-[10px] font-bold">
            ◈
          </span>
          <span className="text-xs font-semibold text-slate-900">
            Toàn quốc (Trụ sở chính & Mạng lưới chi nhánh)
          </span>
          <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 text-slate-500">
            GEO-00
          </Badge>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {branches.length} điểm làm việc
        </span>
      </div>

      {/* Regions List */}
      <div className="space-y-1.5">
        {regions.map((region) => {
          const regionBranches = branches.filter((b) => b.regionId === region.id);
          const isExpanded = expandedRegions[region.id] !== false; // Mặc định mở

          return (
            <div key={region.id} className="select-none">
              {/* Region Node Card */}
              <div className="ml-4 flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleRegion(region.id)}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                    ▣
                  </span>

                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {region.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    {region.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {regionBranches.length} chi nhánh
                  </span>

                  {canManage && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-primary"
                        title="Thêm chi nhánh vào vùng"
                        onClick={() => onOpenCreateBranch(region.id)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="w-3 h-3 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onOpenEditRegion(region)}>
                            <Pencil className="w-3.5 h-3.5 mr-2" />
                            <span>Chỉnh sửa vùng</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteTarget({
                                type: "region",
                                id: region.id,
                                name: region.name,
                              })
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            <span>Xóa vùng miền</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>

              {/* Child Branches */}
              {isExpanded && regionBranches.length > 0 && (
                <div className="ml-10 mt-1 space-y-1">
                  {regionBranches.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-4 h-4 rounded-xs bg-slate-200 text-slate-600 flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                          ▪
                        </span>
                        <div className="truncate">
                          <span className="font-medium text-slate-800">
                            {branch.name}
                          </span>
                          <span className="font-mono text-[10.5px] text-slate-400 ml-1.5">
                            {branch.code}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {branch.attendanceRadiusMeters && (
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] px-1.5 py-0 bg-white text-slate-500 border-slate-200 hidden sm:flex items-center gap-1"
                          >
                            <Navigation className="w-2.5 h-2.5 text-primary" />
                            <span>{branch.attendanceRadiusMeters}m</span>
                          </Badge>
                        )}

                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 font-normal",
                            branch.isActive
                              ? "text-emerald-700 bg-emerald-50/50 border-emerald-200"
                              : "text-slate-400 border-slate-200"
                          )}
                        >
                          {branch.isActive ? "Hoạt động" : "Ngừng"}
                        </Badge>

                        {canManage && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="w-3 h-3 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onOpenEditBranch(branch)}>
                                <Pencil className="w-3.5 h-3.5 mr-2" />
                                <span>Chỉnh sửa chi nhánh</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "branch",
                                    id: branch.id,
                                    name: branch.name,
                                  })
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                <span>Xóa chi nhánh</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Xác nhận xóa ${deleteTarget?.type === "region" ? "vùng miền" : "chi nhánh"}`}
        description={`Bạn có chắc chắn muốn xóa ${deleteTarget?.name}? Hành động này không thể hoàn tác nếu không còn liên kết.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
