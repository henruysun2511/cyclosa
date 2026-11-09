import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  icon?: React.ReactNode;
  action?: React.ReactNode;
  description?: string; // Kept for backward compatibility, not rendered per design standard
}

export function PageHeader({ title, breadcrumbs, icon, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
