"use client";

import Image from "next/image";
import {
  ArrowRightIcon,
  Bars3Icon,
  CalendarDaysIcon,
  CheckCircleIcon,
  MapPinIcon,
  SparklesIcon,
  WalletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const destinations = [
  { city: "Ubud", note: "Hening di antara sawah", tone: "from-[#315c50] to-[#83a66b]", emoji: "🌿" },
  { city: "Labuan Bajo", note: "Laut, senja, dan pulau", tone: "from-[#1f6170] to-[#ef9d71]", emoji: "⛵" },
  { city: "Yogyakarta", note: "Cerita di setiap sudut", tone: "from-[#694c3f] to-[#d59b64]", emoji: "🏛️" },
];

const steps = [
  ["01", "Ceritakan perjalananmu", "Pilih tujuan, durasi, dan budget yang nyaman."],
  ["02", "KelanaAI merangkai", "AI menyesuaikan ritme dan rekomendasi untukmu."],
  ["03", "Berangkat tanpa ragu", "Dapatkan rencana harian yang jelas dan fleksibel."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function planTrip(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      destination: form.get("destination"),
      days: Number(form.get("days")),
      budget: Number(form.get("budget")),
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("API belum siap");
      setResult(await response.json());
    } catch {
      setError("Backend belum terhubung. Jalankan FastAPI di port 8000 lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[760px] text-white lg:min-h-[820px]">
        <Image src="/kelana-hero.png" alt="Pesisir tropis Indonesia saat matahari terbit" fill priority className="object-cover object-[64%_center]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071f24]/95 via-[#0d3538]/65 to-[#102a2e]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f24]/60 via-transparent to-[#071f24]/20" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <a href="#" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" aria-label="KelanaAI beranda">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-white"><SparklesIcon className="h-5 w-5" /></span>
            Kelana<span className="text-[#9bd2c5]">AI</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label="Navigasi utama">
            <a href="#inspirasi" className="transition hover:text-[#9bd2c5]">Inspirasi</a>
            <a href="#cara-kerja" className="transition hover:text-[#9bd2c5]">Cara kerja</a>
            <a href="#tentang" className="transition hover:text-[#9bd2c5]">Tentang kami</a>
            <a href="#rencanakan" className="rounded-full border border-white/40 px-5 py-2.5 transition hover:bg-white hover:text-ink">Mulai merencanakan</a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/30 p-2.5 md:hidden" aria-label="Buka menu" aria-expanded={menuOpen}>
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
          {menuOpen && (
            <nav className="absolute left-5 right-5 top-20 rounded-3xl bg-white p-5 text-ink shadow-float md:hidden">
              {[["Inspirasi", "#inspirasi"], ["Cara kerja", "#cara-kerja"], ["Tentang kami", "#tentang"]].map(([label, href]) => (
                <a key={label} onClick={() => setMenuOpen(false)} href={href} className="block rounded-xl px-4 py-3 font-semibold hover:bg-sand">{label}</a>
              ))}
            </nav>
          )}
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-44 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#bde4d9]"><span className="h-px w-10 bg-coral" />Perjalananmu, caramu</p>
            <h1 className="font-[var(--font-playfair)] text-5xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
              Pergi lebih jauh.<br /><span className="italic text-[#f8c1ae]">Pulang lebih utuh.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 sm:text-lg">KelanaAI merangkai destinasi, ritme, dan budget menjadi perjalanan yang terasa benar-benar milikmu.</p>
          </div>
        </div>
      </section>

      <section id="rencanakan" className="relative z-20 mx-auto -mt-28 max-w-7xl px-5 sm:px-8 lg:px-12">
        <form onSubmit={planTrip} className="rounded-[2rem] bg-white p-5 shadow-float sm:p-7 lg:flex lg:items-end lg:gap-4">
          <label className="mb-4 block flex-1 lg:mb-0">
            <span className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-pine"><MapPinIcon className="h-4 w-4 text-coral" />Destinasi</span>
            <input required name="destination" defaultValue="Labuan Bajo" placeholder="Mau ke mana?" className="w-full rounded-2xl border border-[#dfe6e1] bg-[#fbfcfa] px-4 py-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-lagoon focus:ring-4 focus:ring-lagoon/10" />
          </label>
          <label className="mb-4 block flex-1 lg:mb-0">
            <span className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-pine"><CalendarDaysIcon className="h-4 w-4 text-coral" />Durasi</span>
            <select name="days" className="w-full rounded-2xl border border-[#dfe6e1] bg-[#fbfcfa] px-4 py-4 text-sm font-semibold outline-none focus:border-lagoon focus:ring-4 focus:ring-lagoon/10">
              <option value="3">3 hari</option><option value="5">5 hari</option><option value="7">7 hari</option><option value="10">10 hari</option>
            </select>
          </label>
          <label className="mb-5 block flex-1 lg:mb-0">
            <span className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-pine"><WalletIcon className="h-4 w-4 text-coral" />Budget (USD)</span>
            <input required name="budget" type="number" min="1" defaultValue="2000" className="w-full rounded-2xl border border-[#dfe6e1] bg-[#fbfcfa] px-4 py-4 text-sm font-semibold outline-none focus:border-lagoon focus:ring-4 focus:ring-lagoon/10" />
          </label>
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-coral px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-coral/20 transition hover:-translate-y-0.5 hover:bg-[#df6b54] disabled:cursor-wait disabled:opacity-60 lg:w-auto lg:min-w-52">
            {loading ? "Merangkai perjalanan..." : "Rancang perjalananku"}<ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>
        {(error || result) && (
          <div className={`mx-auto mt-4 flex max-w-3xl items-start gap-3 rounded-2xl border px-5 py-4 text-sm shadow-sm ${result ? "border-lagoon/20 bg-[#eaf5f1] text-pine" : "border-coral/20 bg-[#fff0eb] text-[#8b4437]"}`} role="status">
            {result ? <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" /> : <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0" />}
            <p>{result ? `Rencana ${result.destination} selama ${result.days} hari tersimpan. Budget harianmu: USD ${Number(result.daily_budget).toFixed(2)} (${result.category}).` : error}</p>
          </div>
        )}
      </section>

      <section id="inspirasi" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Dekat, namun berbeda</p><h2 className="max-w-2xl font-[var(--font-playfair)] text-4xl font-semibold leading-tight sm:text-5xl">Tempat yang membuatmu ingin tinggal sedikit lebih lama.</h2></div>
          <a href="#rencanakan" className="flex shrink-0 items-center gap-2 font-bold text-pine">Jelajahi destinasi <ArrowRightIcon className="h-4 w-4" /></a>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {destinations.map((item, index) => (
            <article key={item.city} className={`group relative min-h-[340px] overflow-hidden rounded-[2rem] bg-gradient-to-br ${item.tone} p-7 text-white shadow-lg ${index === 1 ? "md:-translate-y-5" : ""}`}>
              <div className="absolute -right-10 -top-12 text-[11rem] opacity-20 transition duration-500 group-hover:scale-110 group-hover:rotate-6">{item.emoji}</div>
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="relative flex h-full min-h-[286px] flex-col justify-end"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">Pilihan Kelana</p><h3 className="font-[var(--font-playfair)] text-4xl font-semibold">{item.city}</h3><p className="mt-2 text-sm text-white/80">{item.note}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div><p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8ed0c0]">Sederhana dari awal</p><h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-tight sm:text-5xl">Dari angan menjadi itinerary.</h2><p className="mt-5 max-w-md leading-7 text-white/60">Tidak perlu membuka dua belas tab. KelanaAI membantu menyusun titik-titik perjalananmu dalam satu alur yang mudah dipahami.</p></div>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {steps.map(([number, title, text]) => <li key={number} className="grid gap-3 py-7 sm:grid-cols-[70px_1fr_1.4fr] sm:items-center"><span className="text-sm font-bold text-coral">{number}</span><h3 className="text-lg font-extrabold">{title}</h3><p className="text-sm leading-6 text-white/55">{text}</p></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section id="tentang" className="relative bg-sand">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-28">
          <div className="animate-drift rounded-[2.5rem] bg-coral p-8 text-white sm:p-10"><SparklesIcon className="h-10 w-10" /><p className="mt-16 font-[var(--font-playfair)] text-3xl leading-snug sm:text-4xl">“Bukan perjalanan yang paling padat, melainkan yang paling terasa.”</p><p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-white/70">Filosofi KelanaAI</p></div>
          <div className="flex flex-col justify-center lg:pl-10"><p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-coral">Teknologi yang mengerti ritme</p><h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-tight sm:text-5xl">Lebih sedikit merencanakan. Lebih banyak mengalami.</h2><p className="mt-6 leading-8 text-slate-600">Kami percaya AI seharusnya membuat perjalanan terasa lebih manusiawi: memberi pilihan yang relevan, ruang untuk spontan, dan kendali tetap di tanganmu.</p></div>
        </div>
      </section>

      <footer className="bg-[#0a2024] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-10 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-xl font-extrabold">Kelana<span className="text-[#8ed0c0]">AI</span></div><p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Teman cerdas untuk setiap langkah perjalananmu.</p></div><div className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/70"><a href="#inspirasi" className="hover:text-white">Inspirasi</a><a href="#cara-kerja" className="hover:text-white">Cara kerja</a><a href="#tentang" className="hover:text-white">Tentang</a><a href="mailto:halo@kelana.ai" className="hover:text-white">Kontak</a></div></div>
          <div className="flex flex-col gap-3 pt-7 text-xs text-white/40 sm:flex-row sm:justify-between"><p>© 2026 KelanaAI. Hak cipta dilindungi.</p><p>Dibuat untuk perjalanan yang lebih bermakna.</p></div>
        </div>
      </footer>
    </main>
  );
}
