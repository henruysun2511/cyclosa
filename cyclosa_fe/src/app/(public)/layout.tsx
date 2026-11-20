import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicCareersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/careers" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-foreground">CYCLOSA</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  CAREERS
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Cổng thông tin tuyển dụng & cơ hội nghề nghiệp
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-medium">
            <Link
              href="/careers"
              className="text-foreground hover:text-primary transition-colors font-semibold"
            >
              Vị trí tuyển dụng
            </Link>
            <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Link href="/login">
                <span>Dành cho nhân viên</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-muted/20 py-8 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
              C
            </div>
            <span>© 2026 CYCLOSA Enterprise HRM. Bản quyền thuộc về Tập đoàn Công nghệ CYCLOSA.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-foreground cursor-pointer">Chính sách bảo mật dữ liệu</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer">Quy trình tuyển dụng thông minh</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
