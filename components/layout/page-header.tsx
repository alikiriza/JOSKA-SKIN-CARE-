"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3 text-sm text-neutral-400">
          <Link href="/" className="hover:text-sage-600 transition-colors">
            <Home className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-sage-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-600">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h1 text-neutral-900">{title}</h1>
          {description && (
            <p className="text-body text-neutral-500 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
