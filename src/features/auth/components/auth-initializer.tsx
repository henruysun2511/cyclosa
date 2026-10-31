"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  setInitialized,
  setUserProfile,
  logout,
} from "@/store/slices/auth.slice";
import { useLazyGetMeQuery } from "@/features/auth/api/auth-api";
import { tokenStorage } from "@/lib/token-storage";
import type { ApiResponse } from "@/types/api.types";
import type { UserProfileResponse } from "@/features/auth/types/auth.types";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const token = tokenStorage.getAccessToken();

    if (!token) {
      dispatch(setInitialized(true));
      return;
    }

    // Nếu có token lưu sẵn, gọi GET /api/v1/auth/me để đồng bộ profile mới nhất
    triggerGetMe()
      .unwrap()
      .then((response: ApiResponse<UserProfileResponse>) => {
        if (response.success && response.data) {
          dispatch(setUserProfile(response.data));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        // Nếu lỗi 401 không thể refresh hoặc token đã bị blacklist trên backend
        const remainingToken = tokenStorage.getAccessToken();
        if (!remainingToken) {
          dispatch(logout());
        } else {
          // Token vẫn tồn tại (đã được refresh ngầm thành công qua base-api)
          dispatch(setInitialized(true));
        }
      })
      .finally(() => {
        dispatch(setInitialized(true));
      });
  }, [dispatch, triggerGetMe]);

  return <>{children}</>;
}
