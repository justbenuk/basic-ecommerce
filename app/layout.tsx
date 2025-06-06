import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

//construct the way the metadata works
export const metadata: Metadata = {
  title: {
    template: `%s | Basic Store`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
};

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          defaultTheme="light"
          attribute="class"
          disableTransitionOnChange
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
