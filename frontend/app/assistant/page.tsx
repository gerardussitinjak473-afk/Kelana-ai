"use client";

import AIContent from "@/components/AIContent";
import { ArrowLeftIcon, BookOpenIcon, PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FormEvent, useState } from "react";

import UserMenu from "@/components/UserMenu";
import { ApiError } from "@/services/apiClient";
import { askAssistant, type AssistantAnswer } from "@/services/assistantService";

const examples = [
  "Berapa harga KSC-72 untuk anak dan di mana lokasi pengambilannya?",
  "Apa batas waktu pemesanan KFS-24 dan berapa lama waktu tunggunya?",
  "Apa saja dokumen dalam Yellow Packet untuk perjalanan ke Jepang?",
];

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AssistantAnswer | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (question.trim().length < 3) return;
    setLoading(true);
    setError("");
    try {
      setResult(await askAssistant(question.trim()));
    } catch (caught) {
      setResult(null);
      setError(caught instanceof ApiError ? caught.message : "KelanaAI belum dapat menjawab.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-sand text-ink">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-coral"><PaperAirplaneIcon className="h-5 w-5" /></span>
            Kelana<span className="-ml-3 text-teal-200">AI</span>
          </Link>
          <UserMenu tone="dark" />
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-pine hover:text-coral"><ArrowLeftIcon className="h-4 w-4" /> Kembali ke beranda</Link>

        <div className="mt-8 rounded-[2rem] bg-pine px-6 py-9 text-white shadow-float sm:px-10">
          <div className="flex items-center gap-3 text-teal-200"><SparklesIcon className="h-6 w-6" /><p className="text-xs font-extrabold uppercase tracking-[0.2em]">Travel Assistant · RAG</p></div>
          <h1 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold sm:text-5xl">Jawaban dari pengetahuan tepercaya.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/75">Tanyakan kebijakan dan panduan perjalanan. KelanaAI mencari dokumen yang relevan sebelum menjawab.</p>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-[2rem] border border-[#ded8cc] bg-white p-6 shadow-sm sm:p-8">
          <label htmlFor="question" className="text-sm font-extrabold text-ink">Pertanyaan perjalanan</label>
          <textarea id="question" rows={4} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Contoh: Apa manfaat keterlambatan perjalanan dalam polis NS-2026?" className="mt-3 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine focus:ring-4 focus:ring-teal-50" />
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => <button key={example} type="button" onClick={() => setQuestion(example)} className="rounded-full bg-sand px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-teal-50">{example}</button>)}
          </div>
          <button disabled={loading || question.trim().length < 3} className="mt-5 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#df664d] disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Mencari dokumen..." : "Tanya KelanaAI"}<PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </form>

        {error && <p role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>}
        {result && (
          <article className="mt-6 rounded-[2rem] border border-[#ded8cc] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-pine"><SparklesIcon className="h-5 w-5" /><h2 className="font-extrabold">Jawaban berbasis Knowledge Base</h2></div>
            <div className="mt-5"><AIContent content={result.answer} /></div>
            <div className="mt-7 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 text-sm font-extrabold text-ink"><BookOpenIcon className="h-5 w-5" /> Sumber</div>
              {result.sources.length ? <ul className="mt-3 flex flex-wrap gap-2">{result.sources.map((source) => <li key={source} className="rounded-full bg-teal-50 px-3 py-2 text-xs font-bold text-pine">{source}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Tidak ada referensi yang dikembalikan.</p>}
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
