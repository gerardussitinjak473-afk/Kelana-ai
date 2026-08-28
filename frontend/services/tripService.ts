import type { CreateTripInput, Trip } from "@/types/trip";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getTrips() {
  return requestJson<Trip[]>("/trips");
}

export function getTrip(id: number | string) {
  return requestJson<Trip>(`/trips/${id}`);
}

export function createTrip(data: CreateTripInput) {
  return requestJson<Trip>("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function generateTrip(id: number) {
  return requestJson<{ trip_id: number; destination: string; recommendation: string }>(
    `/trips/${id}/generate`,
    { method: "POST" },
  );
}
