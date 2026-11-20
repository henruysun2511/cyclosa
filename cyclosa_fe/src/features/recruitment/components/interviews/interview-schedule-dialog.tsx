"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Video, MapPin, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  scheduleInterviewFormSchema,
  type ScheduleInterviewFormValues,
} from "../../schemas/recruitment.schema";
import { INTERVIEW_FORMAT_LABELS } from "../../constants/recruitment.constants";
import { useGetApplicationsQuery } from "../../api/recruitment-api";
import { useGetEmployeesQuery } from "@/features/employee";

interface InterviewScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ScheduleInterviewFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function InterviewScheduleDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: InterviewScheduleDialogProps) {
  const { data: appsData } = useGetApplicationsQuery({ size: 100 });
  const applications = appsData?.items || [];

  const { data: empData } = useGetEmployeesQuery({ size: 100 });
  const employees = empData?.items || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScheduleInterviewFormValues>({
    resolver: zodResolver(scheduleInterviewFormSchema),
    defaultValues: {
      applicationId: "",
      scheduledStartTime: "",
      scheduledEndTime: "",
      interviewFormat: "ONLINE",
      location: "",
      meetingLink: "",
      notes: "",
      panelistEmployeeIds: [],
      leadEmployeeId: "",
    },
  });

  const selectedAppId = watch("applicationId");
  const selectedFormat = watch("interviewFormat");
  const selectedPanelists = watch("panelistEmployeeIds");

  const onFormSubmit = async (values: ScheduleInterviewFormValues) => {
    await onSubmit(values);
    reset();
  };

  const handleTogglePanelist = (empId: string) => {
    const current = selectedPanelists || [];
    if (current.includes(empId)) {
      setValue(
        "panelistEmployeeIds",
        current.filter((id) => id !== empId),
        { shouldValidate: true }
      );
    } else {
      setValue("panelistEmployeeIds", [...current, empId], { shouldValidate: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            Lên Lịch Phỏng vấn & Chỉ định Hội đồng Giám khảo
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Xác lập buổi phỏng vấn trực tuyến hoặc tại văn phòng, gửi lời mời và cấu hình phiếu chấm điểm kín.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Chọn ứng viên ứng tuyển */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Ứng viên ứng tuyển <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedAppId}
              onValueChange={(val) => setValue("applicationId", val || "", { shouldValidate: true })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn ứng viên phỏng vấn">
                  {applications.find((a) => a.id === selectedAppId)
                    ? `${applications.find((a) => a.id === selectedAppId)?.candidateName} (${applications.find((a) => a.id === selectedAppId)?.jobOpeningTitle})`
                    : "Chọn ứng viên phỏng vấn"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id} className="text-xs">
                    {app.candidateName} — {app.jobOpeningTitle} ({app.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.applicationId && (
              <p className="text-[11px] text-destructive">{errors.applicationId.message}</p>
            )}
          </div>

          {/* Thời gian bắt đầu & kết thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="scheduledStartTime" className="text-xs font-medium">
                Thời gian bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scheduledStartTime"
                type="datetime-local"
                className="h-9 text-xs"
                {...register("scheduledStartTime")}
              />
              {errors.scheduledStartTime && (
                <p className="text-[11px] text-destructive">{errors.scheduledStartTime.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheduledEndTime" className="text-xs font-medium">
                Thời gian kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scheduledEndTime"
                type="datetime-local"
                className="h-9 text-xs"
                {...register("scheduledEndTime")}
              />
              {errors.scheduledEndTime && (
                <p className="text-[11px] text-destructive">{errors.scheduledEndTime.message}</p>
              )}
            </div>
          </div>

          {/* Hình thức phỏng vấn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Hình thức phỏng vấn <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedFormat}
                onValueChange={(val) => {
                  if (val)
                    setValue("interviewFormat", val as "ONLINE" | "OFFLINE" | "HYBRID", {
                      shouldValidate: true,
                    });
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Chọn hình thức">
                    {INTERVIEW_FORMAT_LABELS[selectedFormat] || "Phỏng vấn Trực tuyến (Online)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONLINE" className="text-xs">
                    Phỏng vấn Trực tuyến (Online)
                  </SelectItem>
                  <SelectItem value="OFFLINE" className="text-xs">
                    Phỏng vấn Trực tiếp (Offline)
                  </SelectItem>
                  <SelectItem value="HYBRID" className="text-xs">
                    Kết hợp (Hybrid)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meetingLink" className="text-xs font-medium">
                Link họp trực tuyến (Google Meet / MS Teams)
              </Label>
              <Input
                id="meetingLink"
                placeholder="https://meet.google.com/..."
                className="h-9 text-xs font-mono"
                {...register("meetingLink")}
              />
            </div>
          </div>

          {/* Phòng họp / Địa điểm */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-medium">
              Phòng họp / Địa điểm phỏng vấn
            </Label>
            <Input
              id="location"
              placeholder="VD: Phòng Meeting A, Tầng 5, Tòa nhà FSI"
              className="h-9 text-xs"
              {...register("location")}
            />
          </div>

          {/* Hội đồng giám khảo (Panelists) */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Thành viên Hội đồng phỏng vấn (Panelists) <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">
                Đã chọn: {selectedPanelists.length} giám khảo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 border border-border rounded-lg bg-muted/20">
              {employees.slice(0, 15).map((emp) => {
                const isChecked = selectedPanelists.includes(emp.id);
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleTogglePanelist(emp.id)}
                    className={`flex items-center gap-2 p-2 rounded text-left text-xs transition-colors border ${
                      isChecked
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-card border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 opacity-80" />
                    <span className="truncate">{emp.fullName}</span>
                  </button>
                );
              })}
            </div>
            {errors.panelistEmployeeIds && (
              <p className="text-[11px] text-destructive">{errors.panelistEmployeeIds.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-9 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-9 text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang lên lịch...</span>
                </>
              ) : (
                <span>Xác nhận Lên lịch</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
