"use client";
import Link from "next/link";
export default function ErrorPage({reset}){return <main className="fallback"><img src="/travel/icons/luggage.svg" alt=""/><p>Perjalanan terhenti sebentar</p><h1>Kita coba sekali lagi?</h1><p>Halaman belum berhasil dimuat. Rencana yang sudah tersimpan tetap ada.</p><button className="primary" onClick={reset}>Coba lagi</button><Link href="/">Kembali ke beranda</Link></main>}
