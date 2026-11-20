"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAssignComplaintHandlerMutation } from "../../api/reward-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import type { Complaint } from "../../types/reward.types";
import { toast } from "sonner";

interface AssignComplaintDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignComplaintDialog({
  complaint,
  open,
  onOpenChange,
}: AssignComplaintDialogProps) {
  const [handlerId, setHandlerId] = useState("");
  const [assignHandler, { isLoading }] = useAssignComplaintHandlerMutation();
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, size: 100 });
  const employees = employeesData?.items || [];

  const handleAssign = async () => {
    if (!complaint || !handlerId) return;
    try {
      await assignHandler({
        id: complaint.id,
        body: { handlerEmployeeId: handlerId },
      }).unwrap();

      toast.success("Phân công cán bộ thụ lý thành công");
      onOpenChange(false);
      setHandlerId("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra khi phân công");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Phân công cán bộ HR thụ lý khiếu nại
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
            <span className="font-semibold text-muted-foreground">Khiếu nại:</span>
            <p className="font-medium text-foreground">{complaint?.subject}</p>
            <p className="text-muted-foreground">
              Người gửi: {complaint?.complainantEmployeeName} ({complaint?.complainantEmployeeCode})
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">
              Cán bộ nhân sự thụ lý <span className="text-destructive">*</span>
            </label>
            <Select value={handlerId} onValueChange={(val) => setHandlerId(val || "")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn cán bộ HR phụ trách điều tra">
                  {employees.find((e) => e.id === handlerId)
                    ? `${employees.find((e) => e.id === handlerId)?.fullName} (${employees.find((e) => e.id === handlerId)?.employeeCode})`
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id} className="text-xs">
                    {emp.fullName} ({emp.employeeCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-8 text-xs"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAssign}
            disabled={isLoading || !handlerId}
            className="h-8 text-xs gap-1.5"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Xác nhận phân công</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
