import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  JobLevel,
  CreateJobLevelInput,
  UpdateJobLevelInput,
  JobLevelFilterParams,
} from "../types/job-level.types";
import { toBackendPaginationParams } from "./api-helper";

export const jobLevelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetJobLevelsQuery,
  useGetAllJobLevelsQuery,
  useGetJobLevelByIdQuery,
  useCreateJobLevelMutation,
  useUpdateJobLevelMutation,
  useDeleteJobLevelMutation,
} = jobLevelApi;

