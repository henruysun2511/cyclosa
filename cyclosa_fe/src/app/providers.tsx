"use client";

import { StoreProvider } from "@/store/provider";
import { AuthInitializer } from "@/features/auth/components/auth-initializer";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <AuthInitializer>
        {children}
        <Toaster />
      </AuthInitializer>
    </StoreProvider>
  );
}
