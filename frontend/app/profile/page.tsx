"use client";

import {
  ArrowLeftIcon,
  EnvelopeIcon,
  MapIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-white">
              <PaperAirplaneIcon className="h-5 w-5" />
            </span>
            Kelana<span className="-ml-2 text-teal-300">AI</span>
          </Link>
          <UserMenu tone="dark" />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        <Link href="/trips" className="inline-flex items-center gap-2 text-sm font-bold text-pine hover:text-coral">
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke perjalanan
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2.25rem] bg-white shadow-float">
          <div className="bg-gradient-to-br from-ink via-pine to-lagoon p-7 text-white sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="grid h-24 w-24 shrink-0 place-items-center rounded-[1.75rem] bg-white/10 ring-1 ring-white/20">
                <UserCircleIcon className="h-14 w-14 text-teal-200" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-200">Profil traveler</p>
                <h1 className="mt-2 font-[var(--font-playfair)] text-4xl font-semibold sm:text-5xl">
                  {user.name}
                </h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
                  <EnvelopeIcon className="h-4 w-4" /> {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-[#ded8cc] sm:grid-cols-2">
            <div className="bg-white p-7 sm:p-9">
              <MapIcon className="h-7 w-7 text-coral" />
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Total perjalanan</p>
              <p className="mt-2 font-[var(--font-playfair)] text-5xl font-semibold text-ink">{user.trip_count}</p>
              <p className="mt-2 text-sm text-slate-500">Itinerary yang kamu miliki dan hanya dapat diakses oleh akunmu.</p>
            </div>
            <div className="bg-white p-7 sm:p-9">
              <ShieldCheckIcon className="h-7 w-7 text-pine" />
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Privasi akun</p>
              <p className="mt-2 text-2xl font-extrabold text-ink">Ruang privat aktif</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">API memeriksa identitas dan kepemilikan pada setiap akses perjalanan.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/trips" className="inline-flex items-center justify-center rounded-full bg-pine px-6 py-3 text-sm font-extrabold text-white hover:bg-lagoon">
            Lihat perjalanan saya
          </Link>
          <Link href="/#rencanakan" className="inline-flex items-center justify-center rounded-full border border-[#ded8cc] bg-white px-6 py-3 text-sm font-extrabold text-ink hover:border-lagoon">
            Buat itinerary baru
          </Link>
        </div>
      </section>
    </main>
  );
}
