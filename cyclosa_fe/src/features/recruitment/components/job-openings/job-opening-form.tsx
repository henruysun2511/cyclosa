"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, ArrowRight, Check, Briefcase, FileText, Layers } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  jobOpeningFormSchema,
  type JobOpeningFormValues,
} from "../../schemas/recruitment.schema";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
} from "../../constants/recruitment.constants";
import { InterviewRoundConfigCard } from "./interview-round-config-card";
import { useGetDepartmentsQuery } from "@/features/organization/api";
import type {
  InterviewRoundDto,
  CreateJobOpeningPayload,
  EmploymentType,
  WorkplaceType,
} from "../../types/recruitment.types";

interface JobOpeningFormProps {
  initialValues?: Partial<CreateJobOpeningPayload>;
  onSubmit: (payload: CreateJobOpeningPayload) => Promise<void>;
  isLoading?: boolean;
}

export function JobOpeningForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: JobOpeningFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { data: deptData } = useGetDepartmentsQuery({ size: 100 });
  const departments = deptData?.items || [];

  const [rounds, setRounds] = useState<InterviewRoundDto[]>(
    initialValues?.rounds && initialValues.rounds.length > 0
      ? initialValues.rounds
      : [
          {
            roundNo: 1,
            name: "Vòng 1: Sơ loại Hồ sơ & Phỏng vấn Nhân sự",
            roundType: "HR",
            passScore: 70,
            criteria: [
              { name: "Kinh nghiệm phù hợp JD", weight: 50, maxScore: 100 },
              { name: "Giao tiếp & Định hướng nghề nghiệp", weight: 50, maxScore: 100 },
            ],
          },
          {
            roundNo: 2,
            name: "Vòng 2: Phỏng vấn Kỹ thuật Chuyên sâu",
            roundType: "TECHNICAL",
            passScore: 75,
            criteria: [
              { name: "Năng lực chuyên môn", weight: 40, maxScore: 100 },
              { name: "Tư duy thuật toán & Giải quyết vấn đề", weight: 30, maxScore: 100 },
              { name: "Kiến trúc hệ thống", weight: 30, maxScore: 100 },
            ],
          },
        ]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<JobOpeningFormValues>({
    resolver: zodResolver(jobOpeningFormSchema),
    defaultValues: {
      title: initialValues?.title || "",
      departmentId: initialValues?.departmentId || "",
      totalNeeded: initialValues?.totalNeeded || 1,
      employmentType: initialValues?.employmentType || "FULL_TIME",
      workplaceType: initialValues?.workplaceType || "ONSITE",
      location: initialValues?.location || "Tầng 5, Tòa nhà FSI, Hà Nội",
      description: initialValues?.description || "",
      requirements: initialValues?.requirements || "",
      benefits: initialValues?.benefits || "",
      minSalary: initialValues?.minSalary,
      maxSalary: initialValues?.maxSalary,
      currency: initialValues?.currency || "VND",
      isSalaryNegotiable: initialValues?.isSalaryNegotiable || false,
      deadline: initialValues?.deadline ? initialValues.deadline.split("T")[0] : "",
    },
  });

  const selectedDeptId = watch("departmentId");
  const selectedEmpType = watch("employmentType");
  const selectedWorkType = watch("workplaceType");
  const isSalaryNegotiable = watch("isSalaryNegotiable");

  const handleNextStep = async () => {
    if (step === 1) {
      const valid = await trigger([
        "title",
        "departmentId",
        "totalNeeded",
        "employmentType",
        "workplaceType",
      ]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["description"]);
      if (valid) setStep(3);
    }
  };

  const onFinalSubmit = async (values: JobOpeningFormValues) => {
    const payload: CreateJobOpeningPayload = {
      ...values,
      rounds,
    };
    await onSubmit(payload);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Stepper Navigation */}
      <div className="grid grid-cols-3 gap-3 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
            step === 1 ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              step === 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div>
            <p className="text-xs font-semibold leading-none">Thông tin chung</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Vị trí, chỉ tiêu, nơi làm việc</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNextStep()}
          className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
            step === 2 ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <div>
            <p className="text-xs font-semibold leading-none">Mô tả công việc (JD)</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Yêu cầu & đãi ngộ lương</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNextStep()}
          className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
            step === 3 ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              step === 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <div>
            <p className="text-xs font-semibold leading-none">Vòng phỏng vấn</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tiêu chí chấm điểm năng lực</p>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6">
        {/* BƯỚC 1: THÔNG TIN CHUNG */}
        {step === 1 && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Briefcase className="h-4 w-4 text-primary" />
              Bước 1: Thiết lập Thông tin chung Vị trí tuyển dụng
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium">
                Tên chức danh tuyển dụng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="VD: Senior Backend Engineer (Java / Spring Boot)"
                className="h-9 text-xs"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-[11px] text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Phòng ban tiếp nhận <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedDeptId}
                  onValueChange={(val) => setValue("departmentId", val || "", { shouldValidate: true })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Chọn phòng ban">
                      {departments.find((d) => d.id === selectedDeptId)?.name || "Chọn phòng ban"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="text-xs">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && (
                  <p className="text-[11px] text-destructive">{errors.departmentId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="totalNeeded" className="text-xs font-medium">
                  Chỉ tiêu số lượng tuyển dụng <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalNeeded"
                  type="number"
                  min={1}
                  className="h-9 text-xs font-mono"
                  {...register("totalNeeded")}
                />
                {errors.totalNeeded && (
                  <p className="text-[11px] text-destructive">{errors.totalNeeded.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Loại hình hợp đồng <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedEmpType}
                  onValueChange={(val) => {
                    if (val)
                      setValue("employmentType", val as EmploymentType, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Chọn loại hình">
                      {EMPLOYMENT_TYPE_LABELS[selectedEmpType] || "Toàn thời gian"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(EMPLOYMENT_TYPE_LABELS) as (keyof typeof EMPLOYMENT_TYPE_LABELS)[]).map(
                      (key) => (
                        <SelectItem key={key} value={key} className="text-xs">
                          {EMPLOYMENT_TYPE_LABELS[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Hình thức làm việc <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedWorkType}
                  onValueChange={(val) => {
                    if (val)
                      setValue("workplaceType", val as WorkplaceType, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Chọn hình thức">
                      {WORKPLACE_TYPE_LABELS[selectedWorkType] || "Tại văn phòng"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(WORKPLACE_TYPE_LABELS) as (keyof typeof WORKPLACE_TYPE_LABELS)[]).map(
                      (key) => (
                        <SelectItem key={key} value={key} className="text-xs">
                          {WORKPLACE_TYPE_LABELS[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs font-medium">
                  Hạn chót nhận hồ sơ
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  className="h-9 text-xs"
                  {...register("deadline")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-medium">
                Địa điểm làm việc cụ thể
              </Label>
              <Input
                id="location"
                placeholder="VD: Tầng 5, Tòa nhà FSI, Số 11 Phạm Hùng, Cầu Giấy, Hà Nội"
                className="h-9 text-xs"
                {...register("location")}
              />
            </div>
          </div>
        )}

        {/* BƯỚC 2: MÔ TẢ CÔNG VIỆC (JD) & KHUNG LƯƠNG */}
        {step === 2 && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <FileText className="h-4 w-4 text-primary" />
              Bước 2: Bản Mô tả Công việc (JD) & Chế độ Đãi ngộ
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-medium">
                Mô tả trách nhiệm & Công việc chính <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Liệt kê các nhiệm vụ, trách nhiệm công việc cốt lõi của vị trí..."
                className="text-xs resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-[11px] text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="requirements" className="text-xs font-medium">
                Yêu cầu trình độ & Kỹ năng ứng viên (Dành cho AI Matching so khớp)
              </Label>
              <Textarea
                id="requirements"
                rows={5}
                placeholder="Yêu cầu số năm kinh nghiệm, bằng cấp, kỹ năng bắt buộc và kỹ năng ưu tiên..."
                className="text-xs resize-none"
                {...register("requirements")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="benefits" className="text-xs font-medium">
                Chế độ phúc lợi & Đãi ngộ (Benefits)
              </Label>
              <Textarea
                id="benefits"
                rows={3}
                placeholder="Bảo hiểm sức khỏe cao cấp, thưởng tháng 13, phụ cấp dự án..."
                className="text-xs resize-none"
                {...register("benefits")}
              />
            </div>

            {/* Khung dải lương */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isSalaryNegotiable"
                  checked={isSalaryNegotiable}
                  onCheckedChange={(checked) =>
                    setValue("isSalaryNegotiable", !!checked)
                  }
                />
                <label
                  htmlFor="isSalaryNegotiable"
                  className="text-xs font-medium leading-none cursor-pointer"
                >
                  Lương thỏa thuận (Không công khai dải lương trên tin đăng)
                </label>
              </div>

              {!isSalaryNegotiable && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="minSalary" className="text-xs font-medium">
                      Lương tối thiểu (VND/tháng)
                    </Label>
                    <Input
                      id="minSalary"
                      type="number"
                      step={1000000}
                      placeholder="VD: 25000000"
                      className="h-9 text-xs font-mono"
                      {...register("minSalary")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="maxSalary" className="text-xs font-medium">
                      Lương tối đa (VND/tháng)
                    </Label>
                    <Input
                      id="maxSalary"
                      type="number"
                      step={1000000}
                      placeholder="VD: 45000000"
                      className="h-9 text-xs font-mono"
                      {...register("maxSalary")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BƯỚC 3: CẤU HÌNH VÒNG PHỎNG VẤN */}
        {step === 3 && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
            <InterviewRoundConfigCard rounds={rounds} onChange={setRounds} />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
              else router.back();
            }}
            disabled={isLoading}
            className="h-9 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            <span>{step === 1 ? "Quay lại danh sách" : "Bước trước"}</span>
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNextStep}
              className="h-9 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang khởi tạo vị trí...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Hoàn tất & Tạo Vị trí tuyển dụng</span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
