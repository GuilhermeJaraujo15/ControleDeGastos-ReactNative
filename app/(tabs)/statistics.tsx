import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useSpending } from "@/lib/spending-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

export default function StatisticsScreen() {
  const {
    transactions,
    getMonthlyStats,
    getCategories,
    settings,
    isLoading,
  } = useSpending();
  const colors = useColors();
  const categories = getCategories();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const currentStats = getMonthlyStats(currentYear, currentMonth);
  const previousStats = getMonthlyStats(previousYear, previousMonth);

  // Calcular dados para o gráfico de pizza
  const chartData = useMemo(() => {
    const data = Object.entries(currentStats.byCategory)
      .filter(([_, value]) => value > 0)
      .map(([category, value]) => ({
        category: category as keyof typeof currentStats.byCategory,
        value,
        percentage: (value / currentStats.totalSpent) * 100,
      }))
      .sort((a, b) => b.value - a.value);
    return data;
  }, [currentStats]);

  // Calcular dados para o gráfico de barras (últimos 7 dias)
  const dailyData = useMemo(() => {
    const data: Record<string, number> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      data[dateStr] = 0;
    }

    transactions.forEach((t) => {
      if (data.hasOwnProperty(t.date)) {
        data[t.date] += t.value;
      }
    });

    return Object.entries(data).map(([date, value]) => ({
      date: new Date(date).toLocaleDateString("pt-BR", {
        weekday: "short",
      }),
      value,
    }));
  }, [transactions]);

  const maxDailyValue = Math.max(...dailyData.map((d) => d.value), 1);

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-4">
          {/* Título */}
          <Text className="text-2xl font-bold text-foreground mb-6">Estatísticas</Text>

          {/* Comparação Mês Atual vs Anterior */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-2">Mês Atual</Text>
              <Text className="text-2xl font-bold text-foreground">
                {settings.currency} {currentStats.totalSpent.toFixed(2)}
              </Text>
              <Text className="text-xs text-muted mt-1">
                {currentStats.transactionCount} transações
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-2">Mês Anterior</Text>
              <Text className="text-2xl font-bold text-foreground">
                {settings.currency} {previousStats.totalSpent.toFixed(2)}
              </Text>
              <Text className="text-xs text-muted mt-1">
                {previousStats.transactionCount} transações
              </Text>
            </View>
          </View>

          {/* Gráfico de Barras - Últimos 7 dias */}
          <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-4">
              Gastos dos Últimos 7 Dias
            </Text>
            <View className="flex-row items-end justify-between h-40 gap-2">
              {dailyData.map((item, index) => (
                <View key={index} className="flex-1 items-center">
                  <View className="w-full items-center justify-end" style={{ height: 140 }}>
                    <View
                      className="w-full bg-primary rounded-t-md"
                      style={{
                        height: maxDailyValue > 0
                          ? (item.value / maxDailyValue) * 120
                          : 0,
                      }}
                    />
                  </View>
                  <Text className="text-xs text-muted mt-2">{item.date}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Distribuição por Categoria */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-4">
              Distribuição por Categoria
            </Text>

            {chartData.length > 0 ? (
              <View className="gap-3">
                {chartData.map((item) => {
                  const category = categories[item.category];
                  return (
                    <View key={item.category}>
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2 flex-1">
                          <View
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <Text className="text-sm text-foreground flex-1">
                            {category.name}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-sm font-semibold text-foreground">
                            {settings.currency} {item.value.toFixed(2)}
                          </Text>
                          <Text className="text-xs text-muted">
                            {item.percentage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="items-center py-8">
                <MaterialIcons name="inbox" size={40} color={colors.muted} />
                <Text className="text-muted text-center mt-2">
                  Nenhuma transação neste mês
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
