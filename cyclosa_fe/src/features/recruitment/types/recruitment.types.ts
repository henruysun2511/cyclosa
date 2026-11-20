// ============================================================================
// RECRUITMENT & TALENT ACQUISITION MODULE TYPES (MATCHING SPRING BOOT DTOs)
// ============================================================================

import type { BaseFilterParams } from "@/types/api.types";

// ── Enums ───────────────────────────────────────────────────────────────────

export type RecruitmentRequestStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type JobOpeningStatus =
  | "DRAFT"
  | "OPEN"
  | "ON_HOLD"
  | "CLOSED"
  | "CANCELLED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY";

export type WorkplaceType = "ONSITE" | "HYBRID" | "REMOTE";

export type ApplicationStage =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export type InterviewRoundType =
  | "HR"
  | "TECHNICAL"
  | "CULTURE_FIT"
  | "EXECUTIVE"
  | "FINAL";

export type InterviewFormat = "ONLINE" | "OFFLINE" | "HYBRID";

export type InterviewStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";

export type ScorecardRecommendation =
  | "STRONG_YES"
  | "YES"
  | "NO"
  | "STRONG_NO";

export type OfferStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED";

export type ChannelType = "JOB_BOARD" | "SOCIAL_MEDIA" | "INTERNAL" | "AGENCY";

export type JobPostingStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "EXPIRED"
  | "WITHDRAWN"
  | "FAILED";

export type InternalOpportunityType = "TRANSFER" | "PROMOTION" | "SHORT_TERM_PROJECT";

export type InternalOpportunityAppStatus = "APPLIED" | "REVIEWING" | "APPROVED" | "REJECTED";

// ── 1. Recruitment Request (Đề xuất tuyển dụng) ─────────────────────────────

export interface RecruitmentRequestDto {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  headcount: number;
  employmentType: EmploymentType;
  reason: string;
  jobDescription?: string;
  requirements?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  targetDate?: string;
  status: RecruitmentRequestStatus;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  creatorId?: string;
  creatorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecruitmentRequestPayload {
  title: string;
  departmentId: string;
  positionId?: string;
  headcount: number;
  employmentType: EmploymentType;
  reason: string;
  jobDescription?: string;
  requirements?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  targetDate?: string;
}

export type UpdateRecruitmentRequestPayload = Partial<CreateRecruitmentRequestPayload>;

// ── 2. Job Opening & Interview Rounds (Vị trí tuyển dụng) ────────────────────

export interface InterviewCriterionDto {
  id?: string;
  name: string;
  description?: string;
  weight: number;
  maxScore: number;
}

export interface InterviewRoundDto {
  id?: string;
  roundNo: number;
  name: string;
  roundType: InterviewRoundType;
  description?: string;
  passScore?: number;
  criteria?: InterviewCriterionDto[];
}

export interface JobOpeningDto {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  jobTitleId?: string;
  jobTitleName?: string;
  totalNeeded: number;
  hiredCount: number;
  applicantCount: number;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  location?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  isSalaryNegotiable?: boolean;
  landingSlug?: string;
  deadline?: string;
  status: JobOpeningStatus;
  rounds?: InterviewRoundDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobOpeningPayload {
  title: string;
  departmentId: string;
  jobTitleId?: string;
  totalNeeded: number;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  location?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  isSalaryNegotiable?: boolean;
  landingSlug?: string;
  deadline?: string;
  rounds?: InterviewRoundDto[];
}

export type UpdateJobOpeningPayload = Partial<CreateJobOpeningPayload>;

// ── 3. Recruitment Channels & Postings (Kênh tuyển dụng & Đăng tin) ─────────

export interface RecruitmentChannelDto {
  id: string;
  name: string;
  code: string;
  channelType: ChannelType;
  apiConfig?: string;
  isActive: boolean;
}

export interface JobPostingDto {
  id: string;
  jobOpeningId: string;
  channelId: string;
  channelName?: string;
  externalPostingId?: string;
  postingUrl?: string;
  postedAt?: string;
  expiresAt?: string;
  status: JobPostingStatus;
}

export interface PublishJobPostingPayload {
  jobOpeningId: string;
  channelId: string;
  externalPostingId?: string;
  postingUrl?: string;
  expiresAt?: string;
}

// ── 4. Candidate & Profile (Hồ sơ ứng viên) ─────────────────────────────────

export interface CandidateSkillDto {
  id?: string;
  skillName: string;
  yearsExperience?: number;
  proficiencyLevel?: string;
}

export interface CandidateWorkExperienceDto {
  id?: string;
  companyName: string;
  position: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface CandidateEducationDto {
  id?: string;
  institutionName: string;
  major?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
}

export interface CandidateDto {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  currency?: string;
  resumeUrl?: string;
  skills?: CandidateSkillDto[];
  workExperiences?: CandidateWorkExperienceDto[];
  educations?: CandidateEducationDto[];
  isBlacklisted: boolean;
  blacklistReason?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCandidatePayload {
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  currency?: string;
  resumeUrl?: string;
  source?: string;
  skills?: CandidateSkillDto[];
  workExperiences?: CandidateWorkExperienceDto[];
  educations?: CandidateEducationDto[];
}

export type UpdateCandidatePayload = Partial<CreateCandidatePayload>;

export interface CvParsedProfileResponse {
  fullName?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  yearsOfExperience?: number;
  workExperiences?: {
    companyName: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  educations?: {
    institutionName: string;
    degree?: string;
    major?: string;
    graduationYear?: number;
  }[];
  rawText?: string;
  parsedSummary?: string;
}

// ── 5. Application & ATS Pipeline (Đơn ứng tuyển & Phễu) ─────────────────────

export interface AiScreeningLogDto {
  id?: string;
  applicationId?: string;
  score: number; // 0 - 100
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: "STRONG_MATCH" | "POTENTIAL_MATCH" | "NOT_A_MATCH" | string;
  notes?: string;
  screenedAt?: string;
}

export interface ApplicationDto {
  id: string;
  code: string;
  applicationCode?: string;
  jobOpeningId: string;
  jobOpeningTitle?: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  currentStage: ApplicationStage;
  appliedDate?: string;
  source?: string;
  rejectionReason?: string;
  notes?: string;
  aiMatchScore?: number;
  aiScreeningLog?: AiScreeningLogDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApplicationPayload {
  jobOpeningId: string;
  candidateId: string;
  source?: string;
  notes?: string;
}

export interface UpdateApplicationStagePayload {
  stage: ApplicationStage;
  notes?: string;
}

export interface RejectApplicationPayload {
  reason: string;
  sendEmailNotification?: boolean;
}

// ── 6. Interview & Scorecard (Lịch phỏng vấn & Phiếu chấm điểm) ──────────────

export interface InterviewPanelistDto {
  id?: string;
  employeeId: string;
  employeeName?: string;
  employeeEmail?: string;
  isLeadInterviewer?: boolean;
  hasSubmittedScorecard?: boolean;
}

export interface InterviewDto {
  id: string;
  code: string;
  applicationId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobOpeningTitle?: string;
  roundId?: string;
  roundName?: string;
  roundType?: InterviewRoundType;
  roundNo?: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  location?: string;
  meetingLink?: string;
  interviewFormat: InterviewFormat;
  status: InterviewStatus;
  cancellationReason?: string;
  notes?: string;
  panelists?: InterviewPanelistDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleInterviewPayload {
  applicationId: string;
  roundId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  location?: string;
  meetingLink?: string;
  interviewFormat: InterviewFormat;
  notes?: string;
  panelistEmployeeIds: string[];
  leadEmployeeId?: string;
}

export interface RescheduleInterviewPayload {
  scheduledStartTime: string;
  scheduledEndTime: string;
  location?: string;
  meetingLink?: string;
  reason?: string;
}

export interface ScorecardEvaluationDto {
  id?: string;
  criterionId: string;
  criterionName?: string;
  score: number; // e.g. 1 - 5
  comments?: string;
}

export interface ScorecardDto {
  id: string;
  interviewId: string;
  interviewerEmployeeId: string;
  interviewerName?: string;
  recommendation: ScorecardRecommendation;
  overallNotes?: string;
  evaluations: ScorecardEvaluationDto[];
  submittedAt?: string;
}

export interface SubmitScorecardPayload {
  interviewId: string;
  interviewerEmployeeId: string;
  recommendation: ScorecardRecommendation;
  overallNotes?: string;
  evaluations: {
    criterionId: string;
    score: number;
    comments?: string;
  }[];
}

export interface AiGeneratedQuestionDto {
  question: string;
  competency: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  expectedAnswerGuideline: string;
}

// ── 7. Offer & Onboarding Conversion (Thư mời nhận việc) ─────────────────────

export interface OfferAllowanceDto {
  id?: string;
  allowanceType: string;
  amount: number;
}

export interface OfferDto {
  id: string;
  code: string;
  applicationId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobOpeningTitle?: string;
  baseSalary: number;
  probationSalary?: number;
  probationPeriodMonths?: number;
  currency: string;
  startDate: string;
  expiryDate?: string;
  status: OfferStatus;
  notes?: string;
  allowances?: OfferAllowanceDto[];
  employeeId?: string;
  employeeCode?: string;
  onboardingProcessId?: string;
  isConvertedToEmployee?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConvertOfferToEmployeeResponse {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  onboardingProcessId?: string;
  message: string;
}

export interface CreateOfferPayload {
  applicationId: string;
  baseSalary: number;
  probationSalary?: number;
  probationPeriodMonths?: number;
  currency?: string;
  startDate: string;
  expiryDate?: string;
  notes?: string;
  allowances?: {
    allowanceType: string;
    amount: number;
  }[];
}

// ── 8. Internal Opportunities (Cơ hội nội bộ) ───────────────────────────────

export interface InternalOpportunityDto {
  id: string;
  code: string;
  jobOpeningId: string;
  jobOpeningTitle?: string;
  departmentName?: string;
  opportunityType: InternalOpportunityType;
  description?: string;
  applicationDeadline?: string;
  isActive: boolean;
  applicantCount: number;
  createdAt?: string;
}

export interface InternalOpportunityApplicationDto {
  id: string;
  opportunityId: string;
  employeeId: string;
  employeeName?: string;
  departmentName?: string;
  coverLetter?: string;
  status: InternalOpportunityAppStatus;
  appliedAt?: string;
}

export interface CreateInternalOpportunityPayload {
  jobOpeningId: string;
  opportunityType: InternalOpportunityType;
  description?: string;
  applicationDeadline?: string;
}

export interface ApplyInternalOpportunityPayload {
  coverLetter: string;
}

// ── 9. Filter Params ────────────────────────────────────────────────────────

export interface RecruitmentRequestFilterParams extends BaseFilterParams {
  status?: RecruitmentRequestStatus;
  departmentId?: string;
}

export interface JobOpeningFilterParams extends BaseFilterParams {
  status?: JobOpeningStatus;
  departmentId?: string;
  employmentType?: EmploymentType;
}

export interface CandidateFilterParams extends BaseFilterParams {
  isBlacklisted?: boolean;
  minExperience?: number;
}

export interface ApplicationFilterParams extends BaseFilterParams {
  jobOpeningId?: string;
  stage?: ApplicationStage;
  minAiScore?: number;
}

export interface InterviewFilterParams extends BaseFilterParams {
  status?: InterviewStatus;
  roundType?: InterviewRoundType;
  startDate?: string;
  endDate?: string;
}

export interface OfferFilterParams extends BaseFilterParams {
  status?: OfferStatus;
}

// ── 10. Public Career Portal Types ──────────────────────────────────────────

export interface PublicJobOpening {
  id: string;
  title: string;
  companyId: string;
  departmentId?: string;
  departmentName?: string;
  workLocation?: string;
  employmentType?: string;
  workplaceType?: string;
  salaryBandMin?: number;
  salaryBandMax?: number;
  isSalaryNegotiable?: boolean;
  deadlineDate?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  landingSlug: string;
  status: JobOpeningStatus;
  publishedAt?: string;
  targetQuantity?: number;
}

export interface PublicApplyPayload {
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  linkedinUrl?: string;
  aiScreeningConsent: boolean;
  resumeUrl?: string;
}

