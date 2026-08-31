"use client";

import { ArrowRightIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AuthShell from "@/components/AuthShell";
import { registerAccount } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Konfirmasi password belum sama.");
      return;
    }

    setSubmitting(true);
    try {
      await registerAccount({ name, email, password });
      router.push(
        `/login?registered=1&email=${encodeURIComponent(email.trim().toLowerCase())}`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Registrasi gagal. Silakan coba kembali.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Mulai ruang pribadimu"
      title="Buat akun KelanaAI."
      description="Satu akun untuk itinerary yang privat, tersimpan, dan hanya bisa dikelola olehmu."
    >
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-pine">Nama</span>
          <input
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nama lengkap"
            className="w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-pine">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-pine">Password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
            className="w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
          />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-pine">
            Ulangi password
            <ShieldCheckIcon className="h-4 w-4 text-coral" />
          </span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Ketik ulang password"
            className="w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
          />
        </label>
        <button
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pine px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-teal-800/15 transition hover:-translate-y-0.5 hover:bg-[#255a58] disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Membuat akun..." : "Daftar dan lanjutkan"}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-extrabold text-pine hover:text-coral">
          Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
