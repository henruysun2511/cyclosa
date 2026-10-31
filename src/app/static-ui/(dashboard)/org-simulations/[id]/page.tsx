"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  GitFork,
  AlertTriangle,
  Merge,
  Split,
  Plus,
  Users,
  Save,
  CheckCircle,
  FileCheck,
  Building2,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  OrgTree,
  DepartmentNode,
  MOCK_ORG_TREE,
  StatusBadge,
  EmployeePicker,
} from "@/components/shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrgSimulationEditorPage() {
  const [selectedNode, setSelectedNode] = useState<DepartmentNode | null>(MOCK_ORG_TREE[0]);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [moveEmployeeModalOpen, setMoveEmployeeModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Simulated pending moves in sandbox
  const [simulatedMoves, setSimulatedMoves] = useState([
    { employeeName: "Lê Thúy Hằng", currentDept: "Trung Tâm Nghiên Cứu AI", targetDept: "Khối Đổi Mới Sáng Tạo (Mới)", effectiveSalary: "55,000,000 ₫" },
    { employeeName: "Nguyễn Kim Ngân", currentDept: "Phòng Đảm Bảo Chất Lượng", targetDept: "Khối Đổi Mới Sáng Tạo (Mới)", effectiveSalary: "35,000,000 ₫" },
  ]);

  const handleSave = () => {
    setIsSaved(true);
    toast.success("Đã lưu các điều chỉnh vào bản nháp Sandbox!");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header & Breadcrumb ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Trình chỉnh sửa Sơ đồ Sandbox
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              SCN-2026-Q4-TECH
            </Badge>
          </div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link
              href="/org-simulations"
              className="hover:text-primary transition-colors"
            >
              Mô phỏng cơ cấu
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Visual Sandbox</span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setMergeModalOpen(true)}
          >
            <Merge className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            <span>Sáp nhập đơn vị</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSplitModalOpen(true)}
          >
            <Split className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
            <span>Chia tách đơn vị</span>
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
            onClick={() => setMoveEmployeeModalOpen(true)}
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>Điều chuyển giả lập</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Sandbox Alert Banner ──────────────────────────────────── */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <span>MÔI TRƯỜNG SANDBOX MÔ PHỎNG — SCN-2026-Q4-TECH</span>
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[10px] px-1.5 py-0 h-4">
                DRAFT
              </Badge>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
              Tất cả thay đổi cấu trúc cây đơn vị và nhân sự tại đây là giả lập thử nghiệm, chưa áp dụng vào cơ cấu thật của doanh nghiệp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 text-xs bg-card border-amber-300 dark:border-amber-700"
          >
            <Link href="/org-simulations/sc_01/impact">
              <FileCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Phân tích tác động</span>
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            <span>{isSaved ? "Đã lưu nháp!" : "Lưu kịch bản"}</span>
          </Button>
        </div>
      </div>

      {/* ── 3. Main Workspace ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Tree Sandbox (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="shadow-xs border-border bg-card">
            <CardHeader className="py-3 px-5 border-b border-border flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <GitFork className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Cơ cấu phòng ban Sandbox</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                Nhấp để chọn đơn vị
              </Badge>
            </CardHeader>
            <CardContent className="p-3">
              <OrgTree selectedId={selectedNode?.id} onSelect={setSelectedNode} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Selected Node Properties & Simulated Moves (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Node detail card */}
          {selectedNode && (
            <Card className="shadow-xs border-border bg-card">
              <CardHeader className="py-3 px-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Thuộc tính đơn vị giả lập</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">{selectedNode.code}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Tên phòng ban
                  </label>
                  <Input defaultValue={selectedNode.name} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Người quản lý đứng đầu
                  </label>
                  <Input defaultValue={selectedNode.managerName || ""} className="h-8 text-xs" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Nhân sự trực thuộc:</span>
                  <strong className="text-foreground font-mono text-xs">{selectedNode.employeeCount} người</strong>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simulated Employee Moves Panel */}
          <Card className="shadow-xs border-border bg-card">
            <CardHeader className="py-3 px-5 border-b border-border flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Nhân sự điều chuyển giả lập ({simulatedMoves.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border text-xs">
              {simulatedMoves.map((m, idx) => (
                <div key={idx} className="p-3 hover:bg-muted/50 transition-colors flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">{m.employeeName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Từ: <strong>{m.currentDept}</strong>
                    </div>
                    <div className="text-xs text-primary font-medium mt-0.5">
                      Sang: <strong>{m.targetDept}</strong>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setSimulatedMoves(simulatedMoves.filter((_, i) => i !== idx));
                      toast.info(`Đã hủy điều chuyển ${m.employeeName}`);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 4. Modals ────────────────────────────────────────────────── */}
      {/* Modal: Sáp nhập đơn vị */}
      <Dialog open={mergeModalOpen} onOpenChange={setMergeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Sáp nhập đơn vị phòng ban</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Chọn các đơn vị cần gộp chung vào một đơn vị đích. Nhân sự và chức danh sẽ tự động chuyển về đơn vị mới.
            </p>
            <div className="space-y-1">
              <label className="font-medium text-foreground block">Đơn vị tiếp nhận sau sáp nhập *</label>
              <Input placeholder="VD: Khối Kỹ Thuật & Vận Hành Tổng Hợp" className="text-xs h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setMergeModalOpen(false)}>
              Hủy
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                toast.success("Đã ghi nhận yêu cầu sáp nhập đơn vị trong Sandbox");
                setMergeModalOpen(false);
              }}
            >
              Thực hiện sáp nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Chia tách đơn vị */}
      <Dialog open={splitModalOpen} onOpenChange={setSplitModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Chia tách đơn vị phòng ban</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Tạo đơn vị mới từ phòng ban hiện tại. Nhân sự có thể được phân bổ trong bước tiếp theo.
            </p>
            <div className="space-y-1">
              <label className="font-medium text-foreground block">Tên đơn vị mới tách ra *</label>
              <Input placeholder="VD: Trung Tâm Đổi Mới Sáng Tạo AI" className="text-xs h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setSplitModalOpen(false)}>
              Hủy
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                toast.success("Đã chia tách đơn vị mới trong Sandbox");
                setSplitModalOpen(false);
              }}
            >
              Tạo đơn vị tách
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Điều chuyển nhân sự giả lập */}
      <Dialog open={moveEmployeeModalOpen} onOpenChange={setMoveEmployeeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Điều chuyển nhân sự trong Sandbox</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground block">Chọn nhân sự</label>
              <EmployeePicker value={null} onChange={() => {}} />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-foreground block">Chuyển sang đơn vị Sandbox mới</label>
              <Input placeholder="VD: Trung Tâm Đổi Mới Sáng Tạo" className="text-xs h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setMoveEmployeeModalOpen(false)}>
              Hủy
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                toast.success("Đã ghi nhận điều chuyển nhân sự giả lập!");
                setMoveEmployeeModalOpen(false);
              }}
            >
              Ghi nhận giả lập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
