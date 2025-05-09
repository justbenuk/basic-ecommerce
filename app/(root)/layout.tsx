import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import type { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "Welcome",
  description: "Modern Ecommerce platform build with NextJS",
};

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
