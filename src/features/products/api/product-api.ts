import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilterParams,
} from "../types/product.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /products (danh sách + lọc + phân trang) ─────────────────────
    getProducts: builder.query<PageData<Product>, Partial<ProductFilterParams>>({
      query: (params = {}) => ({
        url: `/products?${buildQueryString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<PageData<Product>>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({
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

    // ── PUT /products/:id ────────────────────────────────────────────────
    updateProduct: builder.mutation<
      Product,
      { id: string; body: UpdateProductInput }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
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
