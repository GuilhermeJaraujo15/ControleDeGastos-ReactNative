import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useSpending } from "@/lib/spending-context";
import { TransactionItem } from "@/components/transaction-item";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { CategoryType } from "@/lib/types";

type PeriodFilter = "week" | "month" | "all";

export default function TransactionsScreen() {
  const {
    transactions,
    deleteTransaction,
    getCategories,
    isLoading,
  } = useSpending();
  const colors = useColors();
  const categories = getCategories();

  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("month");
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | "all">("all");

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    const now = new Date();

    // Filtro por período
    if (periodFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((t) => new Date(t.date) >= weekAgo);
    } else if (periodFilter === "month") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter((t) => new Date(t.date) >= monthAgo);
    }

    // Filtro por categoria
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    return filtered;
  }, [transactions, periodFilter, categoryFilter]);

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      "Deletar Transação",
      "Tem certeza que deseja deletar esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(id);
            } catch {
              alert("Erro ao deletar transação");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={handleDeleteTransaction}
          />
        )}
        ListHeaderComponent={
          <View className="px-6 pb-4">
            {/* Título */}
            <Text className="text-2xl font-bold text-foreground mb-6">Transações</Text>

            {/* Filtro por Período */}
            <View className="gap-3 mb-6">
              <Text className="text-sm font-semibold text-muted">Período</Text>
              <View className="flex-row gap-2">
                {(["week", "month", "all"] as const).map((period) => (
                  <TouchableOpacity
                    key={period}
                    className={`px-4 py-2 rounded-full border ${
                      periodFilter === period
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                    onPress={() => setPeriodFilter(period)}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        periodFilter === period ? "text-background" : "text-foreground"
                      }`}
                    >
                      {period === "week"
                        ? "Semana"
                        : period === "month"
                          ? "Mês"
                          : "Tudo"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtro por Categoria */}
            <View className="gap-3 mb-6">
              <Text className="text-sm font-semibold text-muted">Categoria</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  className={`px-4 py-2 rounded-full border ${
                    categoryFilter === "all"
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                  onPress={() => setCategoryFilter("all")}
                >
                  <Text
                    className={`text-sm font-medium ${
                      categoryFilter === "all" ? "text-background" : "text-foreground"
                    }`}
                  >
                    Todas
                  </Text>
                </TouchableOpacity>

                {Object.entries(categories).map(([key, category]) => (
                  <TouchableOpacity
                    key={key}
                    className={`px-3 py-2 rounded-full border flex-row items-center gap-1 ${
                      categoryFilter === key
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                    onPress={() => setCategoryFilter(key as CategoryType)}
                  >
                    <MaterialIcons
                      name={category.icon as any}
                      size={16}
                      color={
                        categoryFilter === key ? "white" : category.color
                      }
                    />
                    <Text
                      className={`text-xs font-medium ${
                        categoryFilter === key ? "text-background" : "text-foreground"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Contagem de Transações */}
            <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
              <Text className="text-sm text-muted">
                {filteredTransactions.length} transação
                {filteredTransactions.length !== 1 ? "s" : ""} encontrada
                {filteredTransactions.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="px-6 py-12 items-center">
            <MaterialIcons name="inbox" size={48} color={colors.muted} />
            <Text className="text-muted text-center mt-4">
              Nenhuma transação encontrada{"\n"}com os filtros selecionados.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScreenContainer>
  );
}
