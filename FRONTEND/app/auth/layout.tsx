"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/app/services/auth";

const PUBLIC_AUTH_PATHS = ["/auth/login", "/auth/register"];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Páginas de autenticación son públicas
    if (PUBLIC_AUTH_PATHS.includes(pathname)) {
      setVerified(true);
      return;
    }

    // Si el usuario está autenticado en otras rutas, redirige a dashboard
    if (isAuthenticated()) {
      router.replace("/dashboard");
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
