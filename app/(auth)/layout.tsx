import { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex-center min-h-screen w-full">
      {children}
    </div>
  );
}
