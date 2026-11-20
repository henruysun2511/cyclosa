"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import {
  candidateFormSchema,
  type CandidateFormValues,
} from "../../schemas/recruitment.schema";
import type { CandidateDto, CvParsedProfileResponse } from "../../types/recruitment.types";

interface CandidateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CandidateDto | null;
  parsedData?: CvParsedProfileResponse | null;
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function CandidateFormDialog({
  open,
  onOpenChange,
  initialData,
  parsedData,
  onSubmit,
  isLoading = false,
}: CandidateFormDialogProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      currentPosition: "",
      currentCompany: "",
      yearsOfExperience: 0,
      expectedSalary: undefined,
      currency: "VND",
      source: "Nộp trực tiếp",
      resumeUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split("T")[0] : "",
        gender: initialData.gender || "",
        address: initialData.address || "",
        currentPosition: initialData.currentPosition || "",
        currentCompany: initialData.currentCompany || "",
        yearsOfExperience: initialData.yearsOfExperience || 0,
        expectedSalary: initialData.expectedSalary,
        currency: initialData.currency || "VND",
        source: initialData.source || "Nộp trực tiếp",
        resumeUrl: initialData.resumeUrl || "",
      });
    } else if (parsedData) {
      reset({
        fullName: parsedData.fullName || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        dateOfBirth: "",
        gender: "",
        address: "",
        currentPosition: parsedData.workExperiences?.[0]?.position || "",
        currentCompany: parsedData.workExperiences?.[0]?.companyName || "",
        yearsOfExperience: parsedData.yearsOfExperience || 0,
        expectedSalary: undefined,
        currency: "VND",
        source: "AI CV Parser",
        resumeUrl: "",
      });
    } else {
      reset({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        currentPosition: "",
        currentCompany: "",
        yearsOfExperience: 0,
        expectedSalary: undefined,
        currency: "VND",
        source: "Nộp trực tiếp",
        resumeUrl: "",
      });
    }
  }, [initialData, parsedData, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {isEdit
              ? "Chỉnh sửa Thông tin Ứng viên"
              : parsedData
              ? "Xác nhận Thông tin Bóc tách từ CV"
              : "Thêm Mới Hồ sơ Ứng viên"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-medium">
                Họ và tên ứng viên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="VD: Nguyễn Hoàng Long"
                className="h-9 text-xs"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-[11px] text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Địa chỉ Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="long.nh@gmail.com"
                className="h-9 text-xs"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[11px] text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium">
                Số điện thoại liên hệ
              </Label>
              <Input
                id="phone"
                placeholder="0912 888 777"
                className="h-9 text-xs font-mono"
                {...register("phone")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yearsOfExperience" className="text-xs font-medium">
                Số năm kinh nghiệm làm việc
              </Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min={0}
                placeholder="0"
                className="h-9 text-xs font-mono"
                {...register("yearsOfExperience")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="currentPosition" className="text-xs font-medium">
                Vị trí công việc hiện tại
              </Label>
              <Input
                id="currentPosition"
                placeholder="VD: Senior Frontend Engineer"
                className="h-9 text-xs"
                {...register("currentPosition")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currentCompany" className="text-xs font-medium">
                Công ty hiện tại / gần nhất
              </Label>
              <Input
                id="currentCompany"
                placeholder="VD: FPT Software"
                className="h-9 text-xs"
                {...register("currentCompany")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="expectedSalary" className="text-xs font-medium">
                Mức lương mong muốn (VND/tháng)
              </Label>
              <Input
                id="expectedSalary"
                type="number"
                step={1000000}
                placeholder="VD: 35000000"
                className="h-9 text-xs font-mono"
                {...register("expectedSalary")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="source" className="text-xs font-medium">
                Nguồn hồ sơ ứng viên
              </Label>
              <Input
                id="source"
                placeholder="LinkedIn, TopCV, Giới thiệu nội bộ..."
                className="h-9 text-xs"
                {...register("source")}
              />
            </div>
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
            <Button type="submit" size="sm" disabled={isLoading} className="h-9 text-xs">
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEdit ? "Cập nhật ứng viên" : "Lưu vào Talent Pool"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

