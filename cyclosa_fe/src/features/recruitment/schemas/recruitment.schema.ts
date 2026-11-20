import { z } from "zod";

// ── 1. Đề xuất tuyển dụng Schema ──────────────────────────────────────────

export const recruitmentRequestFormSchema = z.object({
  title: z
    .string({ required_error: "Vui lòng nhập tiêu đề đề xuất" })
    .trim()
    .min(3, "Tiêu đề tối thiểu 3 ký tự")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  departmentId: z
    .string({ required_error: "Vui lòng chọn phòng ban đề xuất" })
    .min(1, "Vui lòng chọn phòng ban"),
  positionId: z.string().optional().or(z.literal("")),
  headcount: z.coerce
    .number({ invalid_type_error: "Số lượng chỉ tiêu phải là số" })
    .int("Số lượng phải là số nguyên")
    .min(1, "Số lượng chỉ tiêu tối thiểu là 1"),
  employmentType: z.enum(
    ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"],
    { required_error: "Vui lòng chọn loại hình làm việc" }
  ),
  reason: z
    .string({ required_error: "Vui lòng nhập lý do tuyển dụng" })
    .trim()
    .min(5, "Lý do tuyển dụng tối thiểu 5 ký tự"),
  jobDescription: z.string().trim().optional().or(z.literal("")),
  requirements: z.string().trim().optional().or(z.literal("")),
  minSalary: z.coerce.number().min(0, "Lương tối thiểu không được âm").optional(),
  maxSalary: z.coerce.number().min(0, "Lương tối đa không được âm").optional(),
  currency: z.string(),
  targetDate: z.string().optional().or(z.literal("")),
});

export type RecruitmentRequestFormValues = z.infer<typeof recruitmentRequestFormSchema>;

// ── 2. Vị trí tuyển dụng Schema (Job Opening) ──────────────────────────────

export const jobOpeningFormSchema = z.object({
  title: z
    .string({ required_error: "Vui lòng nhập tên vị trí tuyển dụng" })
    .trim()
    .min(3, "Tên vị trí tối thiểu 3 ký tự")
    .max(255, "Tên vị trí tối đa 255 ký tự"),
  departmentId: z
    .string({ required_error: "Vui lòng chọn phòng ban" })
    .min(1, "Vui lòng chọn phòng ban"),
  jobTitleId: z.string().optional().or(z.literal("")),
  totalNeeded: z.coerce
    .number({ invalid_type_error: "Chỉ tiêu cần tuyển phải là số" })
    .int("Chỉ tiêu phải là số nguyên")
    .min(1, "Chỉ tiêu cần tuyển tối thiểu là 1"),
  employmentType: z.enum(
    ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"],
    { required_error: "Vui lòng chọn loại hình công việc" }
  ),
  workplaceType: z.enum(["ONSITE", "HYBRID", "REMOTE"], {
    required_error: "Vui lòng chọn hình thức làm việc",
  }),
  location: z.string().trim().optional().or(z.literal("")),
  description: z
    .string({ required_error: "Vui lòng nhập mô tả công việc (JD)" })
    .trim()
    .min(10, "Mô tả công việc tối thiểu 10 ký tự"),
  requirements: z.string().trim().optional().or(z.literal("")),
  benefits: z.string().trim().optional().or(z.literal("")),
  minSalary: z.coerce.number().min(0).optional(),
  maxSalary: z.coerce.number().min(0).optional(),
  currency: z.string(),
  isSalaryNegotiable: z.boolean(),
  deadline: z.string().optional().or(z.literal("")),
});

export type JobOpeningFormValues = z.infer<typeof jobOpeningFormSchema>;

// ── 3. Hồ sơ ứng viên Schema ───────────────────────────────────────────────

export const candidateFormSchema = z.object({
  fullName: z
    .string({ required_error: "Vui lòng nhập họ và tên ứng viên" })
    .trim()
    .min(2, "Họ tên tối thiểu 2 ký tự"),
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .email("Email không đúng định dạng"),
  phone: z.string().trim().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  currentPosition: z.string().trim().optional().or(z.literal("")),
  currentCompany: z.string().trim().optional().or(z.literal("")),
  yearsOfExperience: z.coerce.number().min(0),
  expectedSalary: z.coerce.number().min(0).optional(),
  currency: z.string(),
  source: z.string(),
  resumeUrl: z.string().optional().or(z.literal("")),
});

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;

// ── 4. Lên lịch phỏng vấn Schema ───────────────────────────────────────────

export const scheduleInterviewFormSchema = z.object({
  applicationId: z
    .string({ required_error: "Vui lòng chọn hồ sơ ứng tuyển" })
    .min(1, "Vui lòng chọn ứng viên"),
  roundId: z.string().optional().or(z.literal("")),
  scheduledStartTime: z
    .string({ required_error: "Vui lòng chọn thời gian bắt đầu" })
    .min(1, "Vui lòng chọn giờ bắt đầu"),
  scheduledEndTime: z
    .string({ required_error: "Vui lòng chọn thời gian kết thúc" })
    .min(1, "Vui lòng chọn giờ kết thúc"),
  interviewFormat: z.enum(["ONLINE", "OFFLINE", "HYBRID"], {
    required_error: "Vui lòng chọn hình thức phỏng vấn",
  }),
  location: z.string().trim().optional().or(z.literal("")),
  meetingLink: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  panelistEmployeeIds: z
    .array(z.string())
    .min(1, "Cần chỉ định ít nhất 1 thành viên hội đồng phỏng vấn"),
  leadEmployeeId: z.string().optional().or(z.literal("")),
});

export type ScheduleInterviewFormValues = z.infer<typeof scheduleInterviewFormSchema>;

// ── 5. Phiếu chấm điểm Blind Grading Schema ────────────────────────────────

export const submitScorecardFormSchema = z.object({
  recommendation: z.enum(["STRONG_YES", "YES", "NO", "STRONG_NO"], {
    required_error: "Vui lòng chọn khuyến nghị quyết định",
  }),
  overallNotes: z.string().trim().optional().or(z.literal("")),
  evaluations: z.array(
    z.object({
      criterionId: z.string(),
      score: z.coerce.number().min(1, "Điểm tối thiểu là 1").max(5, "Điểm tối đa là 5"),
      comments: z.string().optional().or(z.literal("")),
    })
  ),
});

export type SubmitScorecardFormValues = z.infer<typeof submitScorecardFormSchema>;

// ── 6. Thư mời nhận việc Schema ───────────────────────────────────────────

export const offerFormSchema = z.object({
  applicationId: z
    .string({ required_error: "Vui lòng chọn hồ sơ ứng tuyển trúng tuyển" })
    .min(1, "Vui lòng chọn ứng viên"),
  baseSalary: z.coerce
    .number({ invalid_type_error: "Lương cơ bản phải là số" })
    .min(1, "Lương cơ bản phải lớn hơn 0"),
  probationSalary: z.coerce.number().min(0).optional(),
  probationPeriodMonths: z.coerce.number().min(0).max(12),
  currency: z.string(),
  startDate: z
    .string({ required_error: "Vui lòng chọn ngày tiếp nhận dự kiến" })
    .min(1, "Vui lòng chọn ngày đi làm"),
  expiryDate: z.string().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type OfferFormValues = z.infer<typeof offerFormSchema>;

// ── 7. Cơ hội nội bộ Schema ────────────────────────────────────────────────

export const internalOppFormSchema = z.object({
  jobOpeningId: z
    .string({ required_error: "Vui lòng chọn vị trí tuyển dụng tương ứng" })
    .min(1, "Vui lòng chọn vị trí"),
  opportunityType: z.enum(["TRANSFER", "PROMOTION", "SHORT_TERM_PROJECT"], {
    required_error: "Vui lòng chọn loại cơ hội nội bộ",
  }),
  description: z
    .string({ required_error: "Vui lòng nhập mô tả chi tiết cơ hội" })
    .trim()
    .min(10, "Mô tả tối thiểu 10 ký tự"),
  applicationDeadline: z.string().optional().or(z.literal("")),
});

export type InternalOppFormValues = z.infer<typeof internalOppFormSchema>;

export const internalOppApplyFormSchema = z.object({
  coverLetter: z
    .string({ required_error: "Vui lòng viết thư ngỏ bày tỏ nguyện vọng" })
    .trim()
    .min(20, "Thư ngỏ tối thiểu 20 ký tự để nêu rõ nguyện vọng và kinh nghiệm"),
});

export type InternalOppApplyFormValues = z.infer<typeof internalOppApplyFormSchema>;
