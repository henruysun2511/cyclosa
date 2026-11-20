// ============================================================================
// RECRUITMENT FEATURE BARREL EXPORTS
// ============================================================================

// 1. API Slice & RTK Query Hooks
export * from "./api/recruitment-api";

// 2. Types & Interfaces
export * from "./types/recruitment.types";

// 3. Constants & Enums
export * from "./constants/recruitment.constants";

// 4. Schemas & Form Values
export * from "./schemas/recruitment.schema";

// 5. Custom Filter Hooks
export * from "./hooks/use-recruitment-request-filters";
export * from "./hooks/use-job-opening-filters";
export * from "./hooks/use-candidate-filters";
export * from "./hooks/use-application-filters";
export * from "./hooks/use-interview-filters";
export * from "./hooks/use-offer-filters";

// 6. Shared Components
export * from "./components/shared/recruitment-page-header";
export * from "./components/shared/recruitment-kpi-cards";

// 7. Recruitment Requests Components
export * from "./components/requests/request-status-badge";
export * from "./components/requests/request-stats-cards";
export * from "./components/requests/request-filters";
export * from "./components/requests/request-table";
export * from "./components/requests/request-columns";
export * from "./components/requests/request-form-dialog";
export * from "./components/requests/request-detail-drawer";

// 8. Job Openings Components
export * from "./components/job-openings/job-opening-status-badge";
export * from "./components/job-openings/job-opening-stats-cards";
export * from "./components/job-openings/job-opening-filters";
export * from "./components/job-openings/job-opening-table";
export * from "./components/job-openings/job-posting-dialog";
export * from "./components/job-openings/interview-round-config-card";
export * from "./components/job-openings/job-opening-form";

// 9. Candidates & AI CV Parser Components
export * from "./components/candidates/candidate-filters";
export * from "./components/candidates/candidate-table";
export * from "./components/candidates/candidate-form-dialog";
export * from "./components/candidates/candidate-blacklist-dialog";
export * from "./components/candidates/ai-cv-parser-dropzone";
export * from "./components/candidates/cv-preview-comparator";

// 10. ATS Applications & AI Screening Components
export * from "./components/applications/ats-candidate-card";
export * from "./components/applications/ats-kanban-board";
export * from "./components/applications/ai-screening-scorecard";
export * from "./components/applications/application-table";

// 11. Interviews & Blind Grading Components
export * from "./components/interviews/interview-table";
export * from "./components/interviews/interview-schedule-dialog";
export * from "./components/interviews/blind-grading-scorecard";
export * from "./components/interviews/ai-star-questions-modal";

// 12. Offers Components
export * from "./components/offers/offer-status-badge";
export * from "./components/offers/offer-filters";
export * from "./components/offers/offer-table";
export * from "./components/offers/offer-form-dialog";
export * from "./components/offers/offer-decline-dialog";

// 13. Internal Opportunities Components
export * from "./components/internal-opportunities/internal-opp-card";
export * from "./components/internal-opportunities/internal-opp-apply-dialog";
export * from "./components/internal-opportunities/internal-opp-form-dialog";

