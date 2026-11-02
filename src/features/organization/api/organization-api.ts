import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyFilterParams,
  Region,
  CreateRegionInput,
  UpdateRegionInput,
  RegionFilterParams,
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
  BranchFilterParams,
  CostCenter,
  CreateCostCenterInput,
  UpdateCostCenterInput,
  CostCenterFilterParams,
  JobTitle,
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitleFilterParams,
  JobLevel,
  CreateJobLevelInput,
  UpdateJobLevelInput,
  JobLevelFilterParams,
  Department,
  DepartmentNode,
  DepartmentVersion,
  DepartmentImpact,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  MoveDepartmentInput,
  DepartmentFilterParams,
} from "../types/organization.types";

// Helper chuẩn hóa 1-based UI page sang 0-based Spring Boot backend page
function toBackendPaginationParams<T extends { page?: number }>(params: T): Record<string, unknown> {
  const { page, ...rest } = params;
  return {
    ...rest,
    page: page !== undefined && page > 0 ? page - 1 : 0,
  };
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ═════════════════════════════════════════════════════════════════════════
    // 1. COMPANIES (CÔNG TY / PHÁP NHÂN)
    // ═════════════════════════════════════════════════════════════════════════
    getCompanies: builder.query<PageData<Company>, Partial<CompanyFilterParams>>({
      query: (params = {}) => ({
        url: `/companies?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Company>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Company" as const, id })),
              { type: "Company", id: "LIST" },
            ]
          : [{ type: "Company", id: "LIST" }],
    }),

    getCompanyById: builder.query<Company, string>({
      query: (id) => ({ url: `/companies/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Company>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Company", id }],
    }),

    createCompany: builder.mutation<Company, CreateCompanyInput>({
      query: (body) => ({ url: "/companies", method: "POST", body }),
      transformResponse: (res: ApiResponse<Company>) => res.data,
      invalidatesTags: [{ type: "Company", id: "LIST" }],
    }),

    updateCompany: builder.mutation<Company, { id: string; body: UpdateCompanyInput }>({
      query: ({ id, body }) => ({ url: `/companies/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Company>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Company", id },
        { type: "Company", id: "LIST" },
      ],
    }),

    deleteCompany: builder.mutation<void, string>({
      query: (id) => ({ url: `/companies/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Company", id: "LIST" }],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 2. REGIONS (KHU VỰC / VÙNG MIỀN)
    // ═════════════════════════════════════════════════════════════════════════
    getRegions: builder.query<PageData<Region>, RegionFilterParams>({
      query: (params) => ({
        url: `/regions?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Region>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Region" as const, id })),
              { type: "Region", id: "LIST" },
            ]
          : [{ type: "Region", id: "LIST" }],
    }),

    getAllRegions: builder.query<Region[], string>({
      query: (companyId) => ({ url: `/regions/all?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Region[]>) => res.data,
      providesTags: [{ type: "Region", id: "LIST" }],
    }),

    getRegionById: builder.query<Region, string>({
      query: (id) => ({ url: `/regions/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Region>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Region", id }],
    }),

    createRegion: builder.mutation<Region, CreateRegionInput>({
      query: (body) => ({ url: "/regions", method: "POST", body }),
      transformResponse: (res: ApiResponse<Region>) => res.data,
      invalidatesTags: [{ type: "Region", id: "LIST" }],
    }),

    updateRegion: builder.mutation<Region, { id: string; body: UpdateRegionInput }>({
      query: ({ id, body }) => ({ url: `/regions/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Region>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Region", id },
        { type: "Region", id: "LIST" },
      ],
    }),

    deleteRegion: builder.mutation<void, string>({
      query: (id) => ({ url: `/regions/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Region", id: "LIST" }],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 3. BRANCHES (CHI NHÁNH & GPS GEOFENCE)
    // ═════════════════════════════════════════════════════════════════════════
    getBranches: builder.query<PageData<Branch>, BranchFilterParams>({
      query: (params) => ({
        url: `/branches?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Branch>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Branch" as const, id })),
              { type: "Branch", id: "LIST" },
            ]
          : [{ type: "Branch", id: "LIST" }],
    }),

    getBranchesByCompany: builder.query<Branch[], string>({
      query: (companyId) => ({ url: `/branches/by-company?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Branch[]>) => res.data,
      providesTags: [{ type: "Branch", id: "LIST" }],
    }),

    getBranchById: builder.query<Branch, string>({
      query: (id) => ({ url: `/branches/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Branch>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Branch", id }],
    }),

    createBranch: builder.mutation<Branch, CreateBranchInput>({
      query: (body) => ({ url: "/branches", method: "POST", body }),
      transformResponse: (res: ApiResponse<Branch>) => res.data,
      invalidatesTags: [{ type: "Branch", id: "LIST" }, { type: "Region", id: "LIST" }],
    }),

    updateBranch: builder.mutation<Branch, { id: string; body: UpdateBranchInput }>({
      query: ({ id, body }) => ({ url: `/branches/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Branch>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Branch", id },
        { type: "Branch", id: "LIST" },
      ],
    }),

    deleteBranch: builder.mutation<void, string>({
      query: (id) => ({ url: `/branches/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }, { type: "Region", id: "LIST" }],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 4. COST CENTERS (TRUNG TÂM CHI PHÍ)
    // ═════════════════════════════════════════════════════════════════════════
    getCostCenters: builder.query<PageData<CostCenter>, CostCenterFilterParams>({
      query: (params) => ({
        url: `/cost-centers?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<CostCenter>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "CostCenter" as const, id })),
              { type: "CostCenter", id: "LIST" },
            ]
          : [{ type: "CostCenter", id: "LIST" }],
    }),

    getAllCostCenters: builder.query<CostCenter[], string>({
      query: (companyId) => ({ url: `/cost-centers/all?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<CostCenter[]>) => res.data,
      providesTags: [{ type: "CostCenter", id: "LIST" }],
    }),

    getCostCenterById: builder.query<CostCenter, string>({
      query: (id) => ({ url: `/cost-centers/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<CostCenter>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "CostCenter", id }],
    }),

    createCostCenter: builder.mutation<CostCenter, CreateCostCenterInput>({
      query: (body) => ({ url: "/cost-centers", method: "POST", body }),
      transformResponse: (res: ApiResponse<CostCenter>) => res.data,
      invalidatesTags: [{ type: "CostCenter", id: "LIST" }],
    }),

    updateCostCenter: builder.mutation<CostCenter, { id: string; body: UpdateCostCenterInput }>({
      query: ({ id, body }) => ({ url: `/cost-centers/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<CostCenter>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "CostCenter", id },
        { type: "CostCenter", id: "LIST" },
      ],
    }),

    deleteCostCenter: builder.mutation<void, string>({
      query: (id) => ({ url: `/cost-centers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "CostCenter", id: "LIST" }],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 5. JOB TITLES (CHỨC DANH CÔNG VIỆC)
    // ═════════════════════════════════════════════════════════════════════════
    getJobTitles: builder.query<PageData<JobTitle>, JobTitleFilterParams>({
      query: (params) => ({
        url: `/job-titles?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<JobTitle>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "JobTitle" as const, id })),
              { type: "JobTitle", id: "LIST" },
            ]
          : [{ type: "JobTitle", id: "LIST" }],
    }),

    getAllJobTitles: builder.query<JobTitle[], string>({
      query: (companyId) => ({ url: `/job-titles/all?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<JobTitle[]>) => res.data,
      providesTags: [{ type: "JobTitle", id: "LIST" }],
    }),

    getJobTitleById: builder.query<JobTitle, string>({
      query: (id) => ({ url: `/job-titles/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<JobTitle>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "JobTitle", id }],
    }),

    createJobTitle: builder.mutation<JobTitle, CreateJobTitleInput>({
      query: (body) => ({ url: "/job-titles", method: "POST", body }),
      transformResponse: (res: ApiResponse<JobTitle>) => res.data,
      invalidatesTags: [{ type: "JobTitle", id: "LIST" }],
    }),

    updateJobTitle: builder.mutation<JobTitle, { id: string; body: UpdateJobTitleInput }>({
      query: ({ id, body }) => ({ url: `/job-titles/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<JobTitle>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "JobTitle", id },
        { type: "JobTitle", id: "LIST" },
      ],
    }),

    deleteJobTitle: builder.mutation<void, string>({
      query: (id) => ({ url: `/job-titles/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "JobTitle", id: "LIST" }],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 6. JOB LEVELS (CẤP BẬC CHỨC DANH)
    // ═════════════════════════════════════════════════════════════════════════
    getJobLevels: builder.query<PageData<JobLevel>, JobLevelFilterParams>({
      query: (params) => ({
        url: `/job-levels?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<JobLevel>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "JobLevel" as const, id })),
              { type: "JobLevel", id: "LIST" },
            ]
          : [{ type: "JobLevel", id: "LIST" }],
    }),

    getAllJobLevels: builder.query<JobLevel[], string>({
      query: (companyId) => ({ url: `/job-levels/all?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<JobLevel[]>) => res.data,
      providesTags: [{ type: "JobLevel", id: "LIST" }],
    }),

    getJobLevelById: builder.query<JobLevel, string>({
      query: (id) => ({ url: `/job-levels/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<JobLevel>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "JobLevel", id }],
    }),

    createJobLevel: builder.mutation<JobLevel, CreateJobLevelInput>({
      query: (body) => ({ url: "/job-levels", method: "POST", body }),
      transformResponse: (res: ApiResponse<JobLevel>) => res.data,
      invalidatesTags: [{ type: "JobLevel", id: "LIST" }],
    }),

    updateJobLevel: builder.mutation<JobLevel, { id: string; body: UpdateJobLevelInput }>({
      query: ({ id, body }) => ({ url: `/job-levels/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<JobLevel>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "JobLevel", id },
        { type: "JobLevel", id: "LIST" },
      ],
    }),

    deleteJobLevel: builder.mutation<void, string>({
      query: (id) => ({ url: `/job-levels/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "JobLevel", id: "LIST" }],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 7. DEPARTMENTS & ORG TREE (PHÒNG BAN & SƠ ĐỒ CƠ CẤU)
    // ═════════════════════════════════════════════════════════════════════════
    getDepartments: builder.query<PageData<Department>, DepartmentFilterParams>({
      query: (params) => ({
        url: `/departments?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Department>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Department" as const, id })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),

    getDepartmentTree: builder.query<DepartmentNode[], { companyId: string; asOfDate?: string }>({
      query: ({ companyId, asOfDate }) => {
        const query = asOfDate
          ? `companyId=${companyId}&asOfDate=${asOfDate}`
          : `companyId=${companyId}`;
        return { url: `/departments/tree?${query}`, method: "GET" };
      },
      transformResponse: (res: ApiResponse<DepartmentNode[]>) => res.data,
      providesTags: [{ type: "DepartmentTree", id: "TREE" }],
    }),

    getDepartmentById: builder.query<Department, { id: string; asOfDate?: string }>({
      query: ({ id, asOfDate }) => {
        const query = asOfDate ? `?asOfDate=${asOfDate}` : "";
        return { url: `/departments/${id}${query}`, method: "GET" };
      },
      transformResponse: (res: ApiResponse<Department>) => res.data,
      providesTags: (_res, _err, { id }) => [{ type: "Department", id }],
    }),

    getDepartmentHistory: builder.query<DepartmentVersion[], string>({
      query: (id) => ({ url: `/departments/${id}/history`, method: "GET" }),
      transformResponse: (res: ApiResponse<DepartmentVersion[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Department", id: `HISTORY_${id}` }],
    }),

    calculateMoveImpact: builder.query<
      DepartmentImpact,
      { departmentId: string; targetParentId?: string | null }
    >({
      query: ({ departmentId, targetParentId }) => {
        const query = targetParentId ? `?targetParentId=${targetParentId}` : "";
        return { url: `/departments/${departmentId}/move-impact${query}`, method: "GET" };
      },
      transformResponse: (res: ApiResponse<DepartmentImpact>) => res.data,
    }),

    createDepartment: builder.mutation<Department, CreateDepartmentInput>({
      query: (body) => ({ url: "/departments", method: "POST", body }),
      transformResponse: (res: ApiResponse<Department>) => res.data,
      invalidatesTags: [
        { type: "Department", id: "LIST" },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    updateDepartment: builder.mutation<Department, { id: string; body: UpdateDepartmentInput }>({
      query: ({ id, body }) => ({ url: `/departments/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Department>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Department", id: `HISTORY_${id}` },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    moveDepartment: builder.mutation<Department, { id: string; body: MoveDepartmentInput }>({
      query: ({ id, body }) => ({ url: `/departments/${id}/move`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Department>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Department", id: `HISTORY_${id}` },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    updatePermissionInheritance: builder.mutation<
      void,
      { id: string; isPermissionInherited: boolean }
    >({
      query: ({ id, isPermissionInherited }) => ({
        url: `/departments/${id}/permission-inheritance`,
        method: "PUT",
        body: { isPermissionInherited },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Department", id },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    dissolveDepartment: builder.mutation<void, { id: string; dissolvedDate?: string }>({
      query: ({ id, dissolvedDate }) => {
        const query = dissolvedDate ? `?dissolvedDate=${dissolvedDate}` : "";
        return { url: `/departments/${id}${query}`, method: "DELETE" };
      },
      invalidatesTags: [
        { type: "Department", id: "LIST" },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),
  }),
});

export const {
  // Companies
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,

  // Regions
  useGetRegionsQuery,
  useGetAllRegionsQuery,
  useGetRegionByIdQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,

  // Branches
  useGetBranchesQuery,
  useGetBranchesByCompanyQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,

  // Cost Centers
  useGetCostCentersQuery,
  useGetAllCostCentersQuery,
  useGetCostCenterByIdQuery,
  useCreateCostCenterMutation,
  useUpdateCostCenterMutation,
  useDeleteCostCenterMutation,

  // Job Titles
  useGetJobTitlesQuery,
  useGetAllJobTitlesQuery,
  useGetJobTitleByIdQuery,
  useCreateJobTitleMutation,
  useUpdateJobTitleMutation,
  useDeleteJobTitleMutation,

  // Job Levels
  useGetJobLevelsQuery,
  useGetAllJobLevelsQuery,
  useGetJobLevelByIdQuery,
  useCreateJobLevelMutation,
  useUpdateJobLevelMutation,
  useDeleteJobLevelMutation,

  // Departments & Org Tree
  useGetDepartmentsQuery,
  useGetDepartmentTreeQuery,
  useGetDepartmentByIdQuery,
  useGetDepartmentHistoryQuery,
  useLazyCalculateMoveImpactQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useMoveDepartmentMutation,
  useUpdatePermissionInheritanceMutation,
  useDissolveDepartmentMutation,
} = organizationApi;

