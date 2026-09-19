"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  UserCog,
  Leaf,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  User,
  MapPin,
  Star,
  Menu,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  navItems: NavItem[];
  type: "admin" | "customer" | "rider";
}

export function Sidebar({ navItems, type }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const roleBadge = type === "admin" ? "Admin" : type === "rider" ? "Rider" : "Customer";

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-[10px] bg-card border border-border shadow-sm lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex h-[72px] items-center border-b border-border px-4", collapsed && "justify-center")}>
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-sage-600" strokeWidth={1.5} />
            {!collapsed && (
              <span className="font-display text-xl font-bold text-sage-700">Joska Skin Care</span>
            )}
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-11 items-center rounded-[10px] px-3 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-sage-100 text-sage-700"
                      : "text-neutral-700 hover:bg-sage-50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className={cn("flex items-center", collapsed ? "" : "min-w-[18px]")}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className={cn("border-t border-border p-4", collapsed && "px-2")}>
          {!collapsed && user && (
            <div className="mb-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sage-100 text-sage-700 text-sm">
                  {getInitials(user.name || user.email || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                <p className="text-xs text-neutral-400">{roleBadge}</p>
              </div>
            </div>
          )}

          <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-9", collapsed ? "w-9" : "flex-1")}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.5} /> : <Moon className="h-4 w-4" strokeWidth={1.5} />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn("h-9 hidden lg:flex", collapsed ? "w-9" : "flex-1")}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" strokeWidth={1.5} /> : <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />}
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

export function getAdminNavItems(): NavItem[] {
  return [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Products", href: "/dashboard/products", icon: <Package className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Categories", href: "/dashboard/categories", icon: <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Orders", href: "/dashboard/orders", icon: <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Deliveries", href: "/dashboard/deliveries", icon: <Truck className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Users", href: "/dashboard/users", icon: <Users className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Riders", href: "/dashboard/riders", icon: <UserCog className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
  ];
}

export function getCustomerNavItems(): NavItem[] {
  return [
    { label: "Profile", href: "/account", icon: <User className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Orders", href: "/account/orders", icon: <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Addresses", href: "/account/addresses", icon: <MapPin className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
    { label: "Reviews", href: "/account/reviews", icon: <Star className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
  ];
}

export function getRiderNavItems(): NavItem[] {
  return [
    { label: "Deliveries", href: "/rider", icon: <Truck className="h-[18px] w-[18px]" strokeWidth={1.5} /> },
  ];
}
