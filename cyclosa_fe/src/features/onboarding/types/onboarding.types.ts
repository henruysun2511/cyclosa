/**
 * CYCLOSA - Phân hệ 06: Hội nhập Nhân sự (Onboarding)
 * TypeScript Types & Data Transfer Objects (Hợp đồng dữ liệu 1:1 với Backend)
 */

export type OnboardingTaskGroup =
  | "DOCS"
  | "EQUIPMENT"
  | "ACCOUNTS"
  | "TRAINING"
  | "ORIENTATION";

export type OnboardingStatus =
  | "PREPARING"
  | "IN_PROGRESS"
  | "REVIEW_PENDING"
  | "COMPLETED"
  | "CANCELLED";

export type OnboardingTaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SKIPPED"
  | "CANCELLED";

export type OrientationSessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type ItAccountRequestStatus =
  | "PENDING"
  | "PROVISIONED"
  | "FAILED"
  | "CANCELLED";

// ───────────────────────────────────────────────────────────
// 1. MẪU CHECKLIST (ONBOARDING TEMPLATE & ITEMS)
// ───────────────────────────────────────────────────────────

export interface OnboardingTemplateItemDto {
  id: string;
  templateId: string;
  title: string;
  description?: string;
  taskGroup: OnboardingTaskGroup;
  targetDayOffset: number;
  sequenceOrder: number;
  isMandatory: boolean;
  defaultAssigneeRole?: string;
  itAccountTypeId?: string;
  itAccountTypeName?: string;
  documentRequired?: boolean;
}

export interface OnboardingTemplateDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  departmentId?: string;
  departmentName?: string;
  isActive: boolean;
  itemCount: number;
  items?: OnboardingTemplateItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateItemPayload {
  title: string;
  description?: string;
  taskGroup: OnboardingTaskGroup;
  targetDayOffset: number;
  sequenceOrder: number;
  isMandatory: boolean;
  defaultAssigneeRole?: string;
  itAccountTypeId?: string;
  documentRequired?: boolean;
}

export interface CreateOnboardingTemplatePayload {
  name: string;
  description?: string;
  departmentId?: string;
  isActive: boolean;
  items?: CreateTemplateItemPayload[];
}

export interface UpdateOnboardingTemplatePayload {
  name?: string;
  description?: string;
  departmentId?: string;
  isActive?: boolean;
  items?: CreateTemplateItemPayload[];
}

// ───────────────────────────────────────────────────────────
// 2. LOẠI TÀI KHOẢN CNTT (IT ACCOUNT TYPE)
// ───────────────────────────────────────────────────────────

export interface ItAccountTypeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  usernamePattern?: string;
  requiresVpn: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateItAccountTypePayload {
  name: string;
  description?: string;
  usernamePattern?: string;
  requiresVpn?: boolean;
  isActive?: boolean;
}

export interface UpdateItAccountTypePayload {
  name?: string;
  description?: string;
  usernamePattern?: string;
  requiresVpn?: boolean;
  isActive?: boolean;
}

// ───────────────────────────────────────────────────────────
// 3. BUỔI ĐÀO TẠO ĐỊNH HƯỚNG (ORIENTATION SESSION)
// ───────────────────────────────────────────────────────────

export interface OrientationSessionDto {
  id: string;
  title: string;
  description?: string;
  trainerName: string;
  trainerEmail?: string;
  location?: string;
  meetingLink?: string;
  startTime: string;
  endTime: string;
  status: OrientationSessionStatus;
  maxAttendees: number;
  attendeeCount: number;
  attendeeEmployeeIds: string[];
  attendeeNames?: string[];
  notes?: string;
  createdAt: string;
}

export interface CreateOrientationSessionPayload {
  title: string;
  description?: string;
  trainerName: string;
  trainerEmail?: string;
  location?: string;
  meetingLink?: string;
  startTime: string;
  endTime: string;
  maxAttendees?: number;
  attendeeEmployeeIds?: string[];
}

export interface BatchAttendancePayload {
  attendedEmployeeIds: string[];
  notes?: string;
}

// ───────────────────────────────────────────────────────────
// 4. TIẾN TRÌNH HỘI NHẬP (ONBOARDING PROCESS & TASKS)
// ───────────────────────────────────────────────────────────

export interface OnboardingTaskDto {
  id: string;
  processId: string;
  templateItemId?: string;
  title: string;
  description?: string;
  taskGroup: OnboardingTaskGroup;
  status: OnboardingTaskStatus;
  isMandatory: boolean;
  dueDate: string;
  assigneeRole?: string;
  assignedToEmployeeId?: string;
  assignedToEmployeeName?: string;
  itAccountRequestId?: string;
  orientationSessionId?: string;
  completedAt?: string;
  completedByEmployeeId?: string;
  completedByName?: string;
  completionNotes?: string;
  documentRequired: boolean;
  documentFileUrl?: string;
  sequenceOrder: number;
}

export interface OnboardingProcessDto {
  id: string;
  code: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeEmail?: string;
  employeePhone?: string;
  jobTitle?: string;
  departmentId?: string;
  departmentName?: string;
  templateId?: string;
  templateName?: string;
  mentorId?: string;
  mentorName?: string;
  directManagerId?: string;
  directManagerName?: string;
  startDate: string;
  probationEndDate: string;
  status: OnboardingStatus;
  completedTasks: number;
  totalTasks: number;
  mandatoryUnfinishedTasks: number;
  progressPercentage: number;
  acceptedAt?: string;
  acceptedByName?: string;
  acceptanceNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  tasks?: OnboardingTaskDto[];
}

export interface CreateOnboardingProcessPayload {
  employeeId: string;
  templateId: string;
  startDate: string;
  probationEndDate: string;
  mentorId?: string;
  directManagerId?: string;
  notes?: string;
}

export interface AcceptOnboardingProcessPayload {
  notes?: string;
}

export interface CancelOnboardingProcessPayload {
  reason: string;
}

export interface CreateAdHocTaskPayload {
  title: string;
  description?: string;
  taskGroup: OnboardingTaskGroup;
  dueDate: string;
  isMandatory: boolean;
  assigneeRole?: string;
  assignedToEmployeeId?: string;
  documentRequired?: boolean;
}

export interface CompleteTaskPayload {
  notes?: string;
  documentFileUrl?: string;
}

// ───────────────────────────────────────────────────────────
// 5. YÊU CẦU CẤP TÀI KHOẢN IT (IT ACCOUNT REQUEST)
// ───────────────────────────────────────────────────────────

export interface ItAccountRequestDto {
  id: string;
  processId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeDepartment?: string;
  itAccountTypeId: string;
  itAccountTypeName: string;
  requiresVpn: boolean;
  status: ItAccountRequestStatus;
  provisionedUsername?: string;
  provisionedEmail?: string;
  initialPasswordNote?: string;
  failureReason?: string;
  provisionedAt?: string;
  provisionedByName?: string;
  createdAt: string;
}

export interface ProvisionItAccountPayload {
  provisionedUsername: string;
  provisionedEmail?: string;
  initialPasswordNote?: string;
  notes?: string;
}

export interface FailItAccountPayload {
  failureReason: string;
}

// ───────────────────────────────────────────────────────────
// 6. THÔNG SỐ TÌM KIẾM & BỘ LỌC (FILTERS)
// ───────────────────────────────────────────────────────────

export interface OnboardingTemplateFilterParams {
  keyword?: string;
  departmentId?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface OnboardingProcessFilterParams {
  keyword?: string;
  departmentId?: string;
  mentorId?: string;
  status?: OnboardingStatus | "ALL" | string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface OrientationSessionFilterParams {
  keyword?: string;
  status?: OrientationSessionStatus | "ALL" | string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface ItAccountRequestFilterParams {
  keyword?: string;
  status?: ItAccountRequestStatus | "ALL" | string;
  itAccountTypeId?: string;
  page?: number;
  size?: number;
}

