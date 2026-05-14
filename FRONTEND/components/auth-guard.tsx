"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/app/services/auth";

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [verified, setVerified] = useState(() => PUBLIC_PATHS.includes(pathname));

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) {
      setVerified(true);
      return;
    }
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setVerified(true);
    }
  }, [router, pathname]);

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
