/**
 * Tipos e estruturas de dados para o aplicativo de controle de gastos
 */

export type CategoryType = 
  | "food" 
  | "transport" 
  | "entertainment" 
  | "health" 
  | "education" 
  | "other";

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  value: number;
  category: CategoryType;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number; // Unix timestamp for sorting
}

export interface AppSettings {
  monthlyBudget: number | null;
  currency: string;
  theme: "light" | "dark" | "auto";
}

export interface MonthlyStats {
  totalSpent: number;
  byCategory: Record<CategoryType, number>;
  transactionCount: number;
}
