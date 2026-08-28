import {
  ArrowRightIcon,
  CalendarDaysIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import type { BudgetCategory, TravelStyle, Trip } from "@/types/trip";

const categoryStyles: Record<BudgetCategory, string> = {
  Backpacker: "bg-[#fff0e8] text-[#b65332] ring-[#f6b99f]",
  Standard: "bg-[#e8f2fb] text-[#23658d] ring-[#a7cce5]",
  Luxury: "bg-[#e7f5ef] text-[#1f7568] ring-[#9fd4c6]",
};

const travelStyleIcons: Record<TravelStyle, string> = {
  Family: "👨‍👩‍👧",
  Solo: "🧭",
  Couple: "💞",
};

const destinationVisuals: Array<[string[], string]> = [
  [["japan", "tokyo", "kyoto", "osaka"], "🇯🇵"],
  [["bali", "ubud", "indonesia", "labuan bajo", "yogyakarta"], "🇮🇩"],
  [["singapore"], "🇸🇬"],
  [["france", "paris"], "🇫🇷"],
  [["italy", "rome", "venice"], "🇮🇹"],
  [["thailand", "bangkok", "phuket"], "🇹🇭"],
  [["korea", "seoul"], "🇰🇷"],
  [["australia", "sydney", "melbourne"], "🇦🇺"],
  [["england", "london", "united kingdom"], "🇬🇧"],
  [["usa", "united states", "new york", "los angeles"], "🇺🇸"],
];

export function getDestinationVisual(destination: string) {
  const normalized = destination.trim().toLowerCase();
  return destinationVisuals.find(([names]) =>
    names.some((name) => normalized.includes(name)),
  )?.[1] || "🗺️";
}

export function formatUsd(value: number) {
  return `USD ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function CategoryBadge({ category }: { category: BudgetCategory }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ring-inset ${categoryStyles[category]}`}>
      {category}
    </span>
  );
}

export function TravelStyleBadge({ travelStyle }: { travelStyle: TravelStyle }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-200">
      <span aria-hidden="true">{travelStyleIcons[travelStyle]}</span>
      {travelStyle}
    </span>
  );
}

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-[#dfe6e1] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-lagoon/40 hover:shadow-float sm:p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#eaf5f1] text-3xl shadow-inner" aria-label={`Ikon destinasi ${trip.destination}`}>
          {getDestinationVisual(trip.destination)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-[var(--font-playfair)] text-2xl font-semibold text-ink">
              {trip.destination}
            </h2>
            <CategoryBadge category={trip.category} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4 text-lagoon" />
              {trip.days} hari
            </span>
            <span className="inline-flex items-center gap-1.5 font-extrabold text-pine">
              <WalletIcon className="h-4 w-4 text-coral" />
              {formatUsd(trip.budget)}
            </span>
            <TravelStyleBadge travelStyle={trip.travel_style} />
          </div>
        </div>

        <Link
          href={`/trips/${trip.id}`}
          className="absolute inset-0 rounded-[1.75rem] focus:outline-none focus:ring-4 focus:ring-lagoon/20 sm:static sm:inline-flex sm:h-11 sm:w-11 sm:shrink-0 sm:items-center sm:justify-center sm:rounded-full sm:bg-pine sm:text-white sm:transition sm:group-hover:bg-coral"
          aria-label={`Lihat detail perjalanan ke ${trip.destination}`}
        >
          <ArrowRightIcon className="hidden h-5 w-5 sm:block" />
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 sm:hidden">
        <span>Ketuk untuk melihat itinerary</span>
        <ArrowRightIcon className="h-4 w-4 text-pine" />
      </div>
    </article>
  );
}
