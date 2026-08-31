"use client";

import { ArrowRightIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import AuthShell from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";

function requestedDestination() {
  if (typeof window === "undefined") return "/trips";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/trips";
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistered(params.get("registered") === "1");
    setEmail(params.get("email") || "");
  }, []);

  useEffect(() => {
    if (!authLoading && user) router.replace(requestedDestination());
  }, [authLoading, router, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signIn(email, password);
      router.replace(requestedDestination());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Login gagal. Silakan coba kembali.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Selamat datang kembali"
      title="Lanjutkan perjalananmu."
      description="Masuk untuk membuat itinerary AI dan membuka koleksi perjalanan pribadimu."
    >
      {registered && (
        <div className="mb-5 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-pine">
          Akun berhasil dibuat. Silakan masuk dengan akun barumu.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-pine">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
          />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-pine">
            Password
            <LockClosedIcon className="h-4 w-4 text-coral" />
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
            className="w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
          />
        </label>
        <button
          disabled={submitting || authLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pine px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-teal-800/15 transition hover:-translate-y-0.5 hover:bg-[#255a58] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Memeriksa akun..." : "Masuk ke KelanaAI"}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-extrabold text-pine hover:text-coral">
          Daftar sekarang
        </Link>
      </p>
    </AuthShell>
  );
}
