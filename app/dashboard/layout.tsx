"use client";

import { Sidebar, getAdminNavItems } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = getAdminNavItems();

  return (
    <div className="min-h-screen">
      <Sidebar navItems={navItems} type="admin" />
      <main className="lg:pl-[260px] min-h-screen transition-all duration-300">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
