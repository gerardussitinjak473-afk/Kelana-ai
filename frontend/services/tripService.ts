import type { CreateTripInput, Trip } from "@/types/trip";
import { requestJson } from "@/services/apiClient";

export function getTrips() {
  return requestJson<Trip[]>("/trips", {}, { auth: true });
}

export function getTrip(id: number | string) {
  return requestJson<Trip>(`/trips/${id}`, {}, { auth: true });
}

export function createTrip(data: CreateTripInput) {
  return requestJson<Trip>("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  }, { auth: true });
}

export function generateTrip(id: number) {
  return requestJson<{ trip_id: number; destination: string; recommendation: string }>(
    `/trips/${id}/generate`,
    { method: "POST" },
    { auth: true },
  );
}

export function updateTripBudget(id: number, budget: number) {
  return requestJson<Trip>(`/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify({ budget }),
  }, { auth: true });
}

export function deleteTrip(id: number) {
  return requestJson<{ message: string }>(`/trips/${id}`, {
    method: "DELETE",
  }, { auth: true });
}
