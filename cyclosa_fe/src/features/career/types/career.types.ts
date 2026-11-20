import { PaginationMeta } from "@/types/api.types";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Readiness =
  | "READY_NOW"
  | "WITHIN_1_YEAR"
  | "WITHIN_2_YEARS"
  | "MORE_THAN_2_YEARS";

export type TalentTag =
  | "HI_PO"
  | "TOP_TALENT"
  | "CRITICAL_SKILL"
  | "FLIGHT_RISK";

export interface CareerPathItem {
  id: string;
  companyId: string;
  fromJobTitleId: string;
  fromJobTitleCode: string;
  fromJobTitleName: string;
  toJobTitleId: string;
  toJobTitleCode: string;
  toJobTitleName: string;
  minExperienceYears: number;
  requirements?: string;
  createdAt: string;
}

export interface CareerGraphNode {
  id: string;
  label: string;
  code: string;
  isCurrent?: boolean;
}

export interface CareerGraphEdge {
  id: string;
  source: string;
  target: string;
  minYears: number;
  requirements?: string;
}

export interface CareerGraphResponse {
  nodes: CareerGraphNode[];
  edges: CareerGraphEdge[];
}

export interface CareerStatisticsResponse {
  totalKeyPositions: number;
  highRiskPositions: number;
  readyNowCandidates: number;
  totalTalents: number;
}

export interface SuccessionCandidateItem {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  currentDepartmentName?: string;
  currentJobTitleName?: string;
  readiness: Readiness;
  developmentNotes?: string;
  createdAt: string;
}

export interface SuccessionPlanItem {
  id: string;
  companyId: string;
  departmentId: string;
  departmentName: string;
  jobTitleId: string;
  jobTitleName: string;
  riskLevel: RiskLevel;
  reviewDate: string;
  currentHolderId?: string;
  currentHolderCode?: string;
  currentHolderName?: string;
  candidateCount: number;
  readyNowCount: number;
  createdAt: string;
}

export interface SuccessionPlanDetail extends SuccessionPlanItem {
  currentHolderPortraitUrl?: string;
  candidates: SuccessionCandidateItem[];
  updatedAt?: string;
}

export interface SuccessionSuggestionItem {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  currentDepartmentName?: string;
  jobTitleName?: string;
  currentJobTitleName?: string;
  matchScore: number;
  recommendedReadiness?: Readiness;
  recommendationReason?: string;
  matchingFactors?: string[];
  performanceRating?: number;
  experienceMonths?: number;
}

export interface TalentPoolItem {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  jobTitleName?: string;
  tag: TalentTag;
  reason: string;
  createdAt: string;
}

export interface NineBoxCell {
  boxCode: string;
  title: string;
  performanceLevel: "HIGH" | "MEDIUM" | "LOW";
  potentialLevel: "HIGH" | "MEDIUM" | "LOW";
  candidateCount: number;
  candidates: TalentPoolItem[];
}

export interface NineBoxGridResponse {
  cells: NineBoxCell[];
}

export interface CareerSimulationStepItem {
  id: string;
  stepOrder: number;
  jobTitleId: string;
  jobTitleCode: string;
  jobTitleName: string;
  matchPercent: number;
}

export interface CareerSimulationItem {
  id: string;
  employeeId: string;
  employeeName: string;
  startJobTitleId: string;
  startJobTitleName: string;
  tenureMonths: number;
  title?: string;
  totalSteps: number;
  createdAt: string;
}

export interface CareerSimulationDetail extends CareerSimulationItem {
  steps: CareerSimulationStepItem[];
}

export interface SimilarProfileItem {
  anonymousId: string;
  startJobTitleName: string;
  currentJobTitleName: string;
  totalTransitionMonths: number;
  averagePerformanceScore: number;
  careerMilestones: string[];
}

export interface CareerPathFilterParams {
  page?: number;
  size?: number;
  fromJobTitleId?: string;
  toJobTitleId?: string;
}

export interface SuccessionPlanFilterParams {
  page?: number;
  size?: number;
  departmentId?: string;
  riskLevel?: RiskLevel | "ALL";
}

export interface TalentPoolFilterParams {
  page?: number;
  size?: number;
  departmentId?: string;
  tag?: TalentTag | "ALL";
}
