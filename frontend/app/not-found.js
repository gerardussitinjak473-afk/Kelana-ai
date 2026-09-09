import Link from "next/link";
export default function NotFound(){return <main className="fallback"><img src="/travel/icons/compass.svg" alt=""/><p>404 · Di luar rute</p><h1>Sepertinya kita salah belok.</h1><p>Halaman ini belum ada. Perjalananmu bisa dimulai lagi dari beranda.</p><Link className="primary" href="/">Kembali ke beranda</Link></main>}
