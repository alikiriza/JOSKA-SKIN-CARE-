"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/zustand-cart";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.itemCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sage-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-sage-600" strokeWidth={1.5} />
            <span className="font-display text-xl font-bold text-sage-700">Joska Skin Care Products</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-sage-600",
                  pathname === link.href ? "text-sage-600" : "text-neutral-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-600 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            
            {session?.user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/account">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <span className="text-sm text-neutral-600">{session.user.name || session.user.email}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sage-600 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-sage-600",
                        pathname === link.href ? "text-sage-600" : "text-neutral-700"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="border-t border-sage-100 pt-6 space-y-3">
                    {session?.user ? (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-lg font-medium text-neutral-700 hover:text-sage-600"
                        >
                          My Account
                        </Link>
                        <p className="text-sm text-neutral-500">{session.user.email}</p>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full">
                          <Link href="/auth/sign-in" onClick={() => setMobileMenuOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}