import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  JobTitle,
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitleFilterParams,
} from "../types/job-title.types";
import { toBackendPaginationParams } from "./api-helper";

export const jobTitleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetJobTitlesQuery,
  useGetAllJobTitlesQuery,
  useGetJobTitleByIdQuery,
  useCreateJobTitleMutation,
  useUpdateJobTitleMutation,
  useDeleteJobTitleMutation,
} = jobTitleApi;

