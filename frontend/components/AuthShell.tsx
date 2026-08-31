import { PaperAirplaneIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-sand lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden text-white lg:block">
        <Image
          src="/kelana-hero.png"
          alt="Pesisir tropis Indonesia"
          fill
          priority
          className="object-cover object-center saturate-75"
          sizes="55vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-pine/75 to-lagoon/35" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-coral">
              <PaperAirplaneIcon className="h-5 w-5" />
            </span>
            Kelana<span className="-ml-2 text-teal-200">AI</span>
          </Link>
          <div className="max-w-xl pb-10">
            <ShieldCheckIcon className="h-11 w-11 text-teal-200" />
            <p className="mt-8 font-[var(--font-playfair)] text-4xl leading-tight xl:text-5xl">
              Perjalanan yang personal dimulai dari ruang yang benar-benar milikmu.
            </p>
            <p className="mt-5 max-w-md leading-7 text-white/70">
              Akunmu menjaga itinerary tetap privat dan memastikan hanya kamu yang bisa melihat, mengubah, atau menghapusnya.
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-12 flex items-center gap-2 text-xl font-extrabold text-ink lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-coral text-white">
              <PaperAirplaneIcon className="h-5 w-5" />
            </span>
            Kelana<span className="-ml-2 text-pine">AI</span>
          </Link>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 leading-7 text-slate-600">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
