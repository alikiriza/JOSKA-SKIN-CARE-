"use client";

import { Sidebar, getCustomerNavItems } from "@/components/layout/sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const navItems = getCustomerNavItems();

  return (
    <div className="min-h-screen">
      <Sidebar navItems={navItems} type="customer" />
      <main className="lg:pl-[260px] min-h-screen transition-all duration-300">
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
