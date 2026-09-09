import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import FlightTransition from "@/components/FlightTransition";
export const metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
 title: {default: "KelanaAI - Perjalananmu, caramu", template: "%s | KelanaAI"},
 description: "Susun itinerary personal, simpan perjalanan, dan temukan jawaban dari asisten perjalanan KelanaAI.",
 icons: {icon: "/icon.svg"},
 openGraph: {title: "KelanaAI - Perjalananmu, caramu", description: "Mulai perjalanan berikutnya bersama KelanaAI", images: [{url: "/kelana-hero.png", width:1672, height:941}]}
};
export default function RootLayout({children}) {return <html lang="id"><body><AuthProvider><FlightTransition/>{children}</AuthProvider></body></html>}
