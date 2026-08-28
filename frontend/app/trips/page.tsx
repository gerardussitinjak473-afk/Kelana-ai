"use client";

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MapIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import TripCard from "@/components/TripCard";
import { getTrips } from "@/services/tripService";
import type { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 10;

type SortMode = "latest" | "oldest" | "highest-budget";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  async function loadTrips() {
    setLoading(true);
    setError("");
    try {
      setTrips(await getTrips());
    } catch (requestError) {
      setError(
        requestError instanceof Error && requestError.message === "Failed to fetch"
          ? "Dashboard belum dapat terhubung ke backend. Pastikan FastAPI berjalan di port 8000."
          : requestError instanceof Error
            ? requestError.message
            : "Riwayat perjalanan gagal dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortMode]);

  const filteredTrips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = trips.filter((trip) =>
      `${trip.destination} ${trip.travel_style}`.toLowerCase().includes(normalizedQuery),
    );

    return result.sort((first, second) => {
      if (sortMode === "oldest") return first.id - second.id;
      if (sortMode === "highest-budget") return second.budget - first.budget;
      return second.id - first.id;
    });
  }, [query, sortMode, trips]);

  const pageCount = Math.max(1, Math.ceil(filteredTrips.length / ITEMS_PER_PAGE));
  const visibleTrips = filteredTrips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-coral">✦</span>
            Kelana<span className="-ml-3 text-[#8ed0c0]">AI</span>
          </Link>
          <Link href="/#rencanakan" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-ink transition hover:bg-[#eaf5f1]">
            <PlusIcon className="h-4 w-4" />
            Perjalanan baru
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-pine hover:text-coral">
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke beranda
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Koleksi perjalananmu</p>
            <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Trip History</h1>
            <p className="mt-3 text-slate-600">{trips.length} itinerary tersimpan dan siap dikunjungi kembali.</p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:max-w-2xl">
            <label className="relative block">
              <span className="sr-only">Cari destinasi atau gaya perjalanan</span>
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari destinasi atau travel style..."
                className="w-full rounded-2xl border border-[#dfe6e1] bg-white py-3.5 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
              />
            </label>
            <label>
              <span className="sr-only">Urutkan perjalanan</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="w-full rounded-2xl border border-[#dfe6e1] bg-white px-4 py-3.5 text-sm font-semibold text-ink outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/10"
              >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="highest-budget">Budget tertinggi</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid min-h-80 place-items-center rounded-[2rem] border border-[#dfe6e1] bg-white">
            <div className="text-center text-slate-500">
              <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-lagoon" />
              <p className="mt-3 font-semibold">Memuat riwayat perjalanan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-10 grid min-h-80 place-items-center rounded-[2rem] border border-coral/20 bg-white p-8 text-center">
            <div>
              <p className="font-extrabold text-[#8b4437]">Riwayat belum dapat dimuat</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{error}</p>
              <button onClick={loadTrips} className="mt-5 inline-flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-sm font-extrabold text-white hover:bg-lagoon">
                <ArrowPathIcon className="h-4 w-4" /> Coba lagi
              </button>
            </div>
          </div>
        ) : trips.length === 0 ? (
          <div className="mt-10 grid min-h-96 place-items-center rounded-[2rem] bg-gradient-to-br from-pine to-lagoon p-8 text-center text-white shadow-float">
            <div>
              <MapIcon className="mx-auto h-14 w-14 text-[#bde4d9]" />
              <h2 className="mt-5 font-[var(--font-playfair)] text-3xl font-semibold">Belum ada perjalanan</h2>
              <p className="mt-2 text-white/70">Buat itinerary pertamamu dan temukan ritme perjalanan yang pas.</p>
              <Link href="/#rencanakan" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-pine hover:bg-[#fff0eb]">
                <PlusIcon className="h-4 w-4" /> Rencanakan perjalanan
              </Link>
            </div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="mt-10 grid min-h-72 place-items-center rounded-[2rem] border border-[#dfe6e1] bg-white p-8 text-center">
            <div>
              <MagnifyingGlassIcon className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-4 text-xl font-extrabold text-ink">Perjalanan tidak ditemukan</h2>
              <p className="mt-2 text-sm text-slate-500">Coba nama destinasi atau travel style yang berbeda.</p>
              <button onClick={() => setQuery("")} className="mt-5 text-sm font-extrabold text-coral hover:text-pine">Hapus pencarian</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {visibleTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
            </div>

            {filteredTrips.length > ITEMS_PER_PAGE && (
              <nav className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#dfe6e1] bg-white px-5 py-4 sm:flex-row" aria-label="Paginasi perjalanan">
                <p className="text-sm text-slate-500">
                  Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTrips.length)} dari {filteredTrips.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-pine transition hover:border-lagoon hover:bg-[#eaf5f1] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <span className="min-w-24 text-center text-sm font-extrabold text-ink">{currentPage} / {pageCount}</span>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                    disabled={currentPage === pageCount}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-pine transition hover:border-lagoon hover:bg-[#eaf5f1] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
