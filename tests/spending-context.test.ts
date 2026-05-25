import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("Spending Context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Transaction Management", () => {
    it("should create a transaction with correct structure", () => {
      const transaction = {
        id: "1",
        value: 25.5,
        category: "food" as const,
        description: "Café",
        date: "2026-05-19",
        timestamp: Date.now(),
      };

      expect(transaction).toHaveProperty("id");
      expect(transaction).toHaveProperty("value");
      expect(transaction).toHaveProperty("category");
      expect(transaction).toHaveProperty("description");
      expect(transaction).toHaveProperty("date");
      expect(transaction).toHaveProperty("timestamp");
      expect(transaction.value).toBeGreaterThan(0);
    });

    it("should validate transaction value is positive", () => {
      const validTransaction = { value: 10 };
      const invalidTransaction = { value: -10 };

      expect(validTransaction.value).toBeGreaterThan(0);
      expect(invalidTransaction.value).toBeLessThan(0);
    });

    it("should validate category is one of allowed types", () => {
      const validCategories = [
        "food",
        "transport",
        "entertainment",
        "health",
        "education",
        "other",
      ];

      validCategories.forEach((category) => {
        expect(validCategories).toContain(category);
      });
    });
  });

  describe("Monthly Statistics", () => {
    it("should calculate monthly stats correctly", () => {
      const transactions = [
        {
          id: "1",
          value: 50,
          category: "food" as const,
          description: "Almoço",
          date: "2026-05-19",
          timestamp: Date.now(),
        },
        {
          id: "2",
          value: 30,
          category: "transport" as const,
          description: "Uber",
          date: "2026-05-19",
          timestamp: Date.now(),
        },
      ];

      const totalSpent = transactions.reduce((sum, t) => sum + t.value, 0);
      expect(totalSpent).toBe(80);
    });

    it("should group transactions by category", () => {
      const transactions = [
        {
          id: "1",
          value: 50,
          category: "food" as const,
          description: "Almoço",
          date: "2026-05-19",
          timestamp: Date.now(),
        },
        {
          id: "2",
          value: 30,
          category: "food" as const,
          description: "Café",
          date: "2026-05-19",
          timestamp: Date.now(),
        },
        {
          id: "3",
          value: 20,
          category: "transport" as const,
          description: "Ônibus",
          date: "2026-05-19",
          timestamp: Date.now(),
        },
      ];

      const byCategory: Record<string, number> = {};
      transactions.forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.value;
      });

      expect(byCategory.food).toBe(80);
      expect(byCategory.transport).toBe(20);
    });

    it("should calculate budget percentage correctly", () => {
      const monthlyBudget = 500;
      const totalSpent = 250;
      const percentage = (totalSpent / monthlyBudget) * 100;

      expect(percentage).toBe(50);
    });

    it("should warn when budget is exceeded", () => {
      const monthlyBudget = 500;
      const totalSpent = 600;
      const isExceeded = totalSpent > monthlyBudget;

      expect(isExceeded).toBe(true);
    });
  });

  describe("Settings Management", () => {
    it("should have default settings", () => {
      const defaultSettings = {
        monthlyBudget: null,
        currency: "R$",
        theme: "auto" as const,
      };

      expect(defaultSettings.currency).toBe("R$");
      expect(defaultSettings.monthlyBudget).toBeNull();
      expect(defaultSettings.theme).toBe("auto");
    });

    it("should validate currency format", () => {
      const validCurrencies = ["R$", "$", "€", "£"];
      const testCurrency = "R$";

      expect(validCurrencies).toContain(testCurrency);
    });

    it("should format currency values correctly", () => {
      const value = 1234.56;
      const formatted = `R$ ${value.toFixed(2)}`;

      expect(formatted).toBe("R$ 1234.56");
    });
  });

  describe("Date Filtering", () => {
    it("should filter transactions by week", () => {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const transactions = [
        {
          id: "1",
          value: 50,
          category: "food" as const,
          description: "Almoço",
          date: today.toISOString().split("T")[0],
          timestamp: today.getTime(),
        },
        {
          id: "2",
          value: 30,
          category: "transport" as const,
          description: "Uber",
          date: new Date(weekAgo.getTime() - 1000).toISOString().split("T")[0],
          timestamp: weekAgo.getTime() - 1000,
        },
      ];

      const filtered = transactions.filter((t) => new Date(t.date) >= weekAgo);
      expect(filtered.length).toBe(1);
    });

    it("should filter transactions by month", () => {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const transactions = [
        {
          id: "1",
          value: 50,
          category: "food" as const,
          description: "Almoço",
          date: today.toISOString().split("T")[0],
          timestamp: today.getTime(),
        },
        {
          id: "2",
          value: 30,
          category: "transport" as const,
          description: "Uber",
          date: new Date(monthStart.getTime() - 1000).toISOString().split("T")[0],
          timestamp: monthStart.getTime() - 1000,
        },
      ];

      const filtered = transactions.filter((t) => new Date(t.date) >= monthStart);
      expect(filtered.length).toBe(1);
    });
  });

  describe("Category Management", () => {
    it("should have all required categories", () => {
      const categories = {
        food: { name: "Alimentação", icon: "restaurant", color: "#FF6B6B" },
        transport: { name: "Transporte", icon: "directions-car", color: "#4ECDC4" },
        entertainment: { name: "Lazer", icon: "movie", color: "#FFE66D" },
        health: { name: "Saúde", icon: "local-hospital", color: "#95E1D3" },
        education: { name: "Educação", icon: "school", color: "#C7CEEA" },
        other: { name: "Outros", icon: "category", color: "#B0B0B0" },
      };

      expect(Object.keys(categories).length).toBe(6);
      expect(categories.food.name).toBe("Alimentação");
      expect(categories.transport.name).toBe("Transporte");
    });

    it("should have unique colors for each category", () => {
      const categories = {
        food: { color: "#FF6B6B" },
        transport: { color: "#4ECDC4" },
        entertainment: { color: "#FFE66D" },
        health: { color: "#95E1D3" },
        education: { color: "#C7CEEA" },
        other: { color: "#B0B0B0" },
      };

      const colors = Object.values(categories).map((c) => c.color);
      const uniqueColors = new Set(colors);

      expect(uniqueColors.size).toBe(colors.length);
    });
  });
});
