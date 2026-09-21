import { baseApi } from "@/lib/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/types/api.types";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilterParams,
} from "../types/product.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /products (list + filter + pagination) ───────────────────────
    getProducts: builder.query<
      PaginatedResponse<Product>,
      Partial<ProductFilterParams>
    >({
      query: (params = {}) => ({
        url: `/products?${buildQueryString(params)}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // ── GET /products/:id ────────────────────────────────────────────────
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // ── POST /products ───────────────────────────────────────────────────
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // ── PATCH /products/:id ──────────────────────────────────────────────
    updateProduct: builder.mutation<
      Product,
      { id: string; body: UpdateProductInput }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // ── DELETE /products/:id ─────────────────────────────────────────────
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
