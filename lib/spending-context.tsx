import { supabase } from "./supabase";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction, AppSettings, Category, CategoryType, MonthlyStats } from "./types";

const TRANSACTIONS_KEY = "spending_transactions";
const SETTINGS_KEY = "spending_settings";

const DEFAULT_SETTINGS: AppSettings = {
  monthlyBudget: null,
  currency: "R$",
  theme: "auto",
};

const CATEGORIES: Record<CategoryType, Category> = {
  food: {
    id: "food",
    name: "Alimentação",
    icon: "restaurant",
    color: "#FF6B6B",
  },
  transport: {
    id: "transport",
    name: "Transporte",
    icon: "directions-car",
    color: "#4ECDC4",
  },
  entertainment: {
    id: "entertainment",
    name: "Lazer",
    icon: "movie",
    color: "#FFE66D",
  },
  health: {
    id: "health",
    name: "Saúde",
    icon: "local-hospital",
    color: "#95E1D3",
  },
  education: {
    id: "education",
    name: "Educação",
    icon: "school",
    color: "#C7CEEA",
  },
  other: {
    id: "other",
    name: "Outros",
    icon: "category",
    color: "#B0B0B0",
  },
};

interface SpendingContextType {
  transactions: Transaction[];
  settings: AppSettings;
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearAllTransactions: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  getTransactionsByMonth: (year: number, month: number) => Transaction[];
  getCategories: () => Record<CategoryType, Category>;
  getCategoryById: (id: CategoryType) => Category;
  isLoading: boolean;
}

const SpendingContext = createContext<SpendingContextType | undefined>(undefined);

export function SpendingProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados ao iniciar
  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const formattedTransactions = data.map((item) => ({
      id: item.id,
      value: item.value,
      category: item.category,
      description: item.description,
      date: item.transaction_date,
      timestamp: new Date(item.created_at).getTime(),
    }));

    setTransactions(formattedTransactions);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    setIsLoading(false);
  }
};

  const addTransaction = async (
  transaction: Omit<Transaction, "id" | "timestamp">
) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          value: transaction.value,
          category: transaction.category,
          description: transaction.description,
          transaction_date: transaction.date,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    const newTransaction: Transaction = {
      id: data[0].id,
      value: data[0].value,
      category: data[0].category,
      description: data[0].description,
      date: data[0].transaction_date,
      timestamp: new Date(data[0].created_at).getTime(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    throw error;
  }
};

  const deleteTransaction = async (id: string) => {
  try {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      throw error;
    }

    setTransactions((prev) =>
      prev.filter((t) => t.id !== id)
    );
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
};

  const clearAllTransactions = async () => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .neq("id", "");

      if (error) {
        console.error(error);
        throw error;
      }

      setTransactions([]);
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      throw error;
    }
  };

  const getTransactionsByMonth = (year: number, month: number): Transaction[] => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  };

  const getMonthlyStats = (year: number, month: number): MonthlyStats => {
    const monthTransactions = getTransactionsByMonth(year, month);
    const stats: MonthlyStats = {
      totalSpent: 0,
      byCategory: {
        food: 0,
        transport: 0,
        entertainment: 0,
        health: 0,
        education: 0,
        other: 0,
      },
      transactionCount: monthTransactions.length,
    };

    monthTransactions.forEach((t) => {
      stats.totalSpent += t.value;
      stats.byCategory[t.category] += t.value;
    });

    return stats;
  };

  const getCategories = () => CATEGORIES;
  const getCategoryById = (id: CategoryType) => CATEGORIES[id];

  return (
    <SpendingContext.Provider
      value={{
        transactions,
        settings,
        addTransaction,
        deleteTransaction,
        clearAllTransactions,
        updateSettings,
        getMonthlyStats,
        getTransactionsByMonth,
        getCategories,
        getCategoryById,
        isLoading,
      }}
    >
      {children}
    </SpendingContext.Provider>
  );
}

export function useSpending() {
  const context = useContext(SpendingContext);
  if (!context) {
    throw new Error("useSpending deve ser usado dentro de SpendingProvider");
  }
  return context;
}
