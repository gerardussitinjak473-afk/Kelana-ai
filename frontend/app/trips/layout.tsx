import AuthGuard from "@/components/AuthGuard";

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
