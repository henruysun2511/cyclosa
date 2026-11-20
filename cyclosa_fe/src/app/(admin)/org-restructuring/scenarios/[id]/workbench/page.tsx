"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SlidersHorizontal, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { OrgWorkbenchToolbar } from "@/features/org-restructuring/components/org-workbench-toolbar";
import { OrgWorkbenchCanvas } from "@/features/org-restructuring/components/org-workbench-canvas";
import { OrgImpactPanel } from "@/features/org-restructuring/components/org-impact-panel";
import { MergeDialog } from "@/features/org-restructuring/components/merge-dialog";
import { SplitDialog } from "@/features/org-restructuring/components/split-dialog";
import {
  useGetScenarioDetailQuery,
  useGetScenarioTreeQuery,
  useGetWhatIfImpactQuery,
  useGetConflictsQuery,
  useCreateDepartmentMutation,
  useMergeDepartmentsMutation,
  useSplitDepartmentMutation,
  useDissolveDepartmentMutation,
  useSubmitScenarioMutation,
  useApproveScenarioMutation,
  useRejectScenarioMutation,
  useExecuteScenarioMutation,
} from "@/features/org-restructuring/api/org-restructuring-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function OrgWorkbenchPage() {
  const params = useParams();
  const scenarioId = params.id as string;

  const { data: scenario, isLoading: isLoadingScenario } = useGetScenarioDetailQuery(scenarioId);
  const { data: treeData = [], isLoading: isLoadingTree } = useGetScenarioTreeQuery(scenarioId);
  const { data: impact, isLoading: isLoadingImpact } = useGetWhatIfImpactQuery(scenarioId);
  const { data: conflicts, isLoading: isLoadingConflicts } = useGetConflictsQuery(scenarioId);

  // Mutations
  const [createDept, { isLoading: isCreatingDept }] = useCreateDepartmentMutation();
  const [mergeDepts, { isLoading: isMerging }] = useMergeDepartmentsMutation();
  const [splitDept, { isLoading: isSplitting }] = useSplitDepartmentMutation();
  const [dissolveDept] = useDissolveDepartmentMutation();

  const [submitScenario, { isLoading: isSubmitting }] = useSubmitScenarioMutation();
  const [approveScenario] = useApproveScenarioMutation();
  const [rejectScenario] = useRejectScenarioMutation();
  const [executeScenario] = useExecuteScenarioMutation();

  // State Dialogs
  const [openAddDept, setOpenAddDept] = useState(false);
  const [openMerge, setOpenMerge] = useState(false);
  const [openSplit, setOpenSplit] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Add dept form state
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptTarget, setNewDeptTarget] = useState(10);
  const [newDeptNotes, setNewDeptNotes] = useState("");

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    try {
      await createDept({
        scenarioId,
        body: {
          name: newDeptName,
          code: newDeptCode.toUpperCase(),
          targetHeadcount: newDeptTarget,
          isPermissionInherited: true,
          notes: newDeptNotes,
        },
      }).unwrap();
      toast.success("Thêm mới phòng ban vào kịch bản thành công!");
      setOpenAddDept(false);
      setNewDeptName("");
      setNewDeptCode("");
      setNewDeptNotes("");
    } catch (err) {
      showApiErrorToast(err, "Không thể thêm phòng ban vào kịch bản. Vui lòng thử lại!");
    }
  };

  const handleMergeDepartments = async (values: any) => {
    try {
      await mergeDepts({ scenarioId, body: values }).unwrap();
      toast.success("Sáp nhập phòng ban thành công!");
    } catch (err) {
      showApiErrorToast(err, "Không thể sáp nhập phòng ban. Vui lòng thử lại!");
    }
  };

  const handleSplitDepartment = async (values: any) => {
    try {
      await splitDept({ scenarioId, body: values }).unwrap();
      toast.success("Tách phòng ban thành công!");
    } catch (err) {
      showApiErrorToast(err, "Không thể tách phòng ban. Vui lòng thử lại!");
    }
  };

  const handleDissolveDepartment = async (deptId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn giải thể phòng ban này trong kịch bản?")) {
      try {
        await dissolveDept({ scenarioId, deptId }).unwrap();
        toast.success("Giải thể phòng ban trong kịch bản thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể giải thể phòng ban. Vui lòng thử lại!");
      }
    }
  };

  const handleSubmitScenario = async () => {
    if (window.confirm("Bạn có chắc chắn muốn trình kịch bản này lên Ban Lãnh đạo thẩm định?")) {
      try {
        await submitScenario(scenarioId).unwrap();
        toast.success("Trình kịch bản tái cơ cấu thẩm định thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể trình kịch bản tái cơ cấu. Vui lòng thử lại!");
      }
    }
  };

  const handleApproveScenario = async () => {
    if (window.confirm("Phê duyệt chính thức phương án tái cơ cấu này?")) {
      try {
        await approveScenario(scenarioId).unwrap();
        toast.success("Phê duyệt kịch bản tái cơ cấu thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể phê duyệt kịch bản tái cơ cấu. Vui lòng thử lại!");
      }
    }
  };

  const handleRejectScenario = async () => {
    if (!rejectReason.trim()) return;
    try {
      await rejectScenario({ id: scenarioId, body: { reason: rejectReason } }).unwrap();
      toast.success("Từ chối kịch bản tái cơ cấu thành công!");
      setOpenReject(false);
      setRejectReason("");
    } catch (err) {
      showApiErrorToast(err, "Không thể từ chối kịch bản. Vui lòng thử lại!");
    }
  };

  const handleExecuteScenario = async () => {
    if (
      window.confirm(
        "CẢNH BÁO: Thao tác này sẽ áp dụng toàn bộ sơ đồ To-Be vào cơ sở dữ liệu thực tế! Bạn có chắc chắn muốn thực thi?"
      )
    ) {
      try {
        await executeScenario(scenarioId).unwrap();
        toast.success("Áp dụng sơ đồ To-Be vào cơ sở dữ liệu thực tế thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể thực thi kịch bản tái cơ cấu. Vui lòng thử lại!");
      }
    }
  };

  if (isLoadingScenario) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
          <SlidersHorizontal className="h-8 w-8 text-primary" />
          <p className="text-sm">Đang tải bàn làm việc Sandbox kịch bản tái cơ cấu...</p>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-muted-foreground">Không tìm thấy kịch bản tái cơ cấu yêu cầu.</p>
        <Button variant="outline" size="sm" asChild className="mt-4">
          <Link href="/org-restructuring/scenarios">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Header & Breadcrumbs chuẩn Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <SlidersHorizontal className="w-6 h-6 text-primary shrink-0" />
            <span>Bàn làm việc Tái cơ cấu: {scenario.name}</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/organization" className="hover:text-primary transition-colors">
              Quản lý tổ chức
            </Link>
            <span>/</span>
            <Link href="/org-restructuring/scenarios" className="hover:text-primary transition-colors">
              Kịch bản tái cơ cấu
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Bàn làm việc Sandbox</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button variant="outline" size="sm" asChild className="h-9 text-xs">
            <Link href="/org-restructuring/scenarios">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Danh sách kịch bản</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Action Toolbar */}
      <OrgWorkbenchToolbar
        scenario={scenario}
        conflicts={conflicts}
        onOpenAddDept={() => setOpenAddDept(true)}
        onOpenMerge={() => setOpenMerge(true)}
        onOpenSplit={() => setOpenSplit(true)}
        onSubmitScenario={handleSubmitScenario}
        onApproveScenario={handleApproveScenario}
        onRejectScenario={() => setOpenReject(true)}
        onExecuteScenario={handleExecuteScenario}
        isSubmitting={isSubmitting}
      />

      {/* 3. Split Layout: 70% Canvas, 30% What-If Impact Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <OrgWorkbenchCanvas
            treeData={treeData}
            onSelectDepartment={(id) => console.log("Selected dept:", id)}
            onDissolveDepartment={handleDissolveDepartment}
            isLoading={isLoadingTree}
          />
        </div>

        <div className="lg:col-span-4">
          <OrgImpactPanel
            impact={impact}
            conflicts={conflicts}
            isLoading={isLoadingImpact || isLoadingConflicts}
          />
        </div>
      </div>

      {/* Dialog Thêm phòng ban mới */}
      <Dialog open={openAddDept} onOpenChange={setOpenAddDept}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Thành lập Đơn vị mới trong Kịch bản</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDepartment} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs">Tên phòng ban <span className="text-destructive">*</span></Label>
              <Input
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="VD: Trung tâm AI & Robotics"
                className="text-xs h-8"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Mã đơn vị <span className="text-destructive">*</span></Label>
                <Input
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                  placeholder="VD: AI-LAB"
                  className="text-xs h-8 uppercase font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chỉ tiêu Định biên</Label>
                <Input
                  type="number"
                  value={newDeptTarget}
                  onChange={(e) => setNewDeptTarget(Number(e.target.value))}
                  className="text-xs h-8"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ghi chú mục tiêu thành lập</Label>
              <Textarea
                value={newDeptNotes}
                onChange={(e) => setNewDeptNotes(e.target.value)}
                rows={2}
                className="text-xs resize-none"
              />
            </div>
            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpenAddDept(false)} className="text-xs">
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isCreatingDept} className="text-xs">
                {isCreatingDept && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Thành lập
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Sáp nhập */}
      <MergeDialog
        open={openMerge}
        onOpenChange={setOpenMerge}
        departments={treeData}
        onSubmit={handleMergeDepartments}
        isLoading={isMerging}
      />

      {/* Dialog Chia tách */}
      <SplitDialog
        open={openSplit}
        onOpenChange={setOpenSplit}
        departments={treeData}
        onSubmit={handleSplitDepartment}
        isLoading={isSplitting}
      />

      {/* Dialog Từ chối kịch bản */}
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-rose-600">Từ chối Phê duyệt Kịch bản</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Lý do từ chối / Yêu cầu hiệu chỉnh <span className="text-destructive">*</span></Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nêu rõ các điểm chưa hợp lý cần Ban Soạn thảo điều chỉnh lại..."
                rows={3}
                className="text-xs resize-none"
                required
              />
            </div>
            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpenReject(false)} className="text-xs">
                Hủy
              </Button>
              <Button type="button" variant="destructive" size="sm" onClick={handleRejectScenario} disabled={!rejectReason.trim()} className="text-xs">
                Xác nhận từ chối
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
