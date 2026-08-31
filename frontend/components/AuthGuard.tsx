"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-sand">
        <div className="text-center text-pine">
          <span className="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-full bg-coral text-white shadow-float">
            <PaperAirplaneIcon className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm font-extrabold">Memeriksa sesi perjalananmu...</p>
        </div>
      </main>
    );
  }

  return children;
}
