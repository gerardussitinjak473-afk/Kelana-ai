export type BudgetCategory = "Backpacker" | "Standard" | "Luxury";
export type TravelStyle = "Family" | "Solo" | "Couple";

export interface Trip {
  id: number;
  user_id: number;
  destination: string;
  days: number;
  budget: number;
  category: BudgetCategory;
  travel_style: TravelStyle;
  daily_budget: number;
  ai_recommendation: string | null;
}

export interface CreateTripInput {
  destination: string;
  days: number;
  budget: number;
  travel_style: TravelStyle;
}
