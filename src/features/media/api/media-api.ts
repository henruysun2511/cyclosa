import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse } from "@/types/api.types";
import { MEDIA_ENDPOINTS } from "../constants/media.constants";
import type {
  CloudinaryMediaResponse,
  UploadMediaPayload,
  DeleteMediaPayload,
} from "../types/media.types";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<ApiResponse<CloudinaryMediaResponse>, UploadMediaPayload>({
      query: ({ file, folder = "cyclosa/avatars" }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (folder) {
          formData.append("folder", folder);
        }

        return {
          url: MEDIA_ENDPOINTS.UPLOAD,
          method: "POST",
          body: formData,
        };
      },
    }),

    deleteMedia: builder.mutation<ApiResponse<void>, DeleteMediaPayload>({
      query: ({ publicId }) => ({
        url: MEDIA_ENDPOINTS.DELETE,
        method: "DELETE",
        params: { publicId },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
