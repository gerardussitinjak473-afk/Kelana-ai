"use client";

import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MapPinIcon,
  SparklesIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  CategoryBadge,
  formatUsd,
  getDestinationVisual,
  TravelStyleBadge,
} from "@/components/TripCard";
import { getTrip } from "@/services/tripService";
import type { Trip } from "@/types/trip";

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getTrip(params.id)
      .then((result) => active && setTrip(result))
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Perjalanan gagal dimuat.");
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-extrabold">Kelana<span className="text-[#8ed0c0]">AI</span></Link>
          <Link href="/trips" className="inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white">
            <ArrowLeftIcon className="h-4 w-4" /> Semua perjalanan
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        {loading ? (
          <div className="grid min-h-96 place-items-center rounded-[2rem] bg-white text-slate-500">Memuat detail perjalanan...</div>
        ) : error || !trip ? (
          <div className="grid min-h-96 place-items-center rounded-[2rem] bg-white p-8 text-center">
            <div>
              <h1 className="text-2xl font-extrabold text-ink">Perjalanan tidak ditemukan</h1>
              <p className="mt-2 text-sm text-slate-500">{error || "Data perjalanan ini tidak tersedia."}</p>
              <Link href="/trips" className="mt-5 inline-flex rounded-full bg-pine px-5 py-3 text-sm font-extrabold text-white">Kembali ke dashboard</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[2rem] bg-ink text-white shadow-float">
              <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
                <div className="grid h-24 w-24 place-items-center rounded-[1.75rem] bg-white/10 text-6xl ring-1 ring-white/15" aria-label={`Ikon destinasi ${trip.destination}`}>
                  {getDestinationVisual(trip.destination)}
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9bd2c5]"><MapPinIcon className="h-4 w-4" /> Detail perjalanan</p>
                  <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold sm:text-5xl">{trip.destination}</h1>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <CategoryBadge category={trip.category} />
                    <TravelStyleBadge travelStyle={trip.travel_style} />
                  </div>
                </div>
              </div>
              <div className="grid border-t border-white/10 sm:grid-cols-3">
                <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50"><CalendarDaysIcon className="h-4 w-4" /> Durasi</p>
                  <p className="mt-2 text-xl font-extrabold">{trip.days} hari</p>
                </div>
                <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50"><WalletIcon className="h-4 w-4" /> Total budget</p>
                  <p className="mt-2 text-xl font-extrabold">{formatUsd(trip.budget)}</p>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Budget harian</p>
                  <p className="mt-2 text-xl font-extrabold">{formatUsd(trip.daily_budget)}</p>
                </div>
              </div>
            </div>

            <article className="mt-6 overflow-hidden rounded-[2rem] border border-[#dfe6e1] bg-white">
              <div className="flex items-center gap-3 border-b border-[#dfe6e1] px-6 py-5 sm:px-8">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eaf5f1] text-lagoon"><SparklesIcon className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">Rekomendasi KelanaAI</p>
                  <h2 className="font-[var(--font-playfair)] text-2xl font-semibold text-ink">Itinerary perjalanan</h2>
                </div>
              </div>
              <div className="px-6 py-7 sm:px-8 sm:py-9">
                {trip.ai_recommendation ? (
                  <div className="whitespace-pre-wrap text-sm leading-8 text-slate-600">{trip.ai_recommendation}</div>
                ) : (
                  <p className="rounded-2xl bg-[#fff8f4] p-5 text-sm leading-6 text-slate-600">Itinerary AI belum dibuat untuk perjalanan ini.</p>
                )}
              </div>
            </article>
          </>
        )}
      </section>
    </main>
  );
}
