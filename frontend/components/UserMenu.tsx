"use client";

import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

type UserMenuProps = {
  tone?: "hero" | "dark" | "light";
};

export default function UserMenu({ tone = "light" }: UserMenuProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const textClass = tone === "light" ? "text-ink" : "text-white";
  const mutedClass = tone === "light" ? "text-slate-500" : "text-white/65";
  const loginHoverClass = tone === "light" ? "hover:text-pine" : "hover:text-white";

  function logout() {
    signOut();
    router.push("/login");
  }

  if (loading) {
    return <span className="h-9 w-28 animate-pulse rounded-full bg-white/15" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm font-extrabold">
        <Link href="/login" className={`${mutedClass} ${loginHoverClass} transition`}>
          Masuk
        </Link>
        <Link href="/register" className="rounded-full bg-white px-4 py-2.5 text-ink transition hover:bg-teal-50">
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold ${textClass} transition hover:bg-white/10`}
      >
        <UserCircleIcon className="h-5 w-5 text-teal-300" />
        Hai, {user.name.split(" ")[0]}
      </Link>
      <button
        onClick={logout}
        className={`grid h-9 w-9 place-items-center rounded-full ${mutedClass} transition hover:bg-white/10 hover:text-coral`}
        aria-label="Keluar dari akun"
        title="Keluar"
      >
        <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
