import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyFilterParams,
} from "../types/company.types";
import { toBackendPaginationParams } from "./api-helper";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;

