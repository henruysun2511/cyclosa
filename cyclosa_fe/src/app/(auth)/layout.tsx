import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {children}
    </main>
  );
}

