import "./globals.css";
import { constructMetadata } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ConfettiProvider } from "@/providers/confetti-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";

export const metadata = constructMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "h-full scroll-smooth antialiased",
          GeistSans.variable
        )}
      >
        <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white h-full">
          <ThemeProvider
            themes={["dark", "custom", "light"]}
            attribute="class"
            enableSystem
            defaultTheme="system"
            disableTransitionOnChange
          >
            <ConfettiProvider />
            <Toaster />
            <ToastProvider />
            <Analytics />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
