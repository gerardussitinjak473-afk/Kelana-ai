import type { BudgetCategory } from "@/types/trip";
// Aligned with backend/services/trip_service.py: total budget in USD.
export function getBudgetCategory(budget: number): BudgetCategory { return budget < 1000 ? "Backpacker" : budget <= 3000 ? "Standard" : "Luxury"; }
export function getTravelIcon(category: BudgetCategory): string { return category === "Luxury" ? "plane" : category === "Backpacker" ? "backpack" : "compass"; }
