import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Joska Skin Care Products — Natural Skincare", template: "%s | Joska Skin Care Products" },
  description: "Premium natural skincare products handcrafted in Uganda. Organic, cruelty-free, and made with love for radiant, healthy skin.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Joska Skin Care Products — Natural Skincare",
    description: "Premium natural skincare products handcrafted in Uganda. Organic, cruelty-free, and made with love.",
    type: "website",
    locale: "en_US",
    siteName: "Joska Skin Care Products",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joska Skin Care Products — Natural Skincare",
    description: "Premium natural skincare products handcrafted in Uganda.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
