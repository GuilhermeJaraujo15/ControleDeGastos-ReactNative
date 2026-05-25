import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useSpending } from "@/lib/spending-context";
import { TransactionItem } from "@/components/transaction-item";
import { AddExpenseModal } from "@/components/add-expense-modal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const {
    transactions,
    settings,
    deleteTransaction,
    getMonthlyStats,
    isLoading,
  } = useSpending();

  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const monthlyStats = getMonthlyStats(currentYear, currentMonth);
  const recentTransactions = transactions.slice(0, 5);

  const balance = monthlyStats.totalSpent;

  const budgetPercentage = settings.monthlyBudget
    ? Math.min((balance / settings.monthlyBudget) * 100, 100)
    : 0;

  const handleAddExpense = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setModalVisible(true);
  };

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

              if (Platform.OS !== "web") {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }
            } catch {
              alert("Erro ao deletar transação");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={handleDeleteTransaction}
          />
        )}
        ListHeaderComponent={
          <View className="px-6 pb-4">

            {/* Saldo */}
            <View className="bg-primary rounded-2xl p-6 mb-6">
              <Text className="text-sm text-background/80 mb-2">
                Saldo do Mês
              </Text>

              <Text className="text-4xl font-bold text-background mb-4">
                {settings.currency} {balance.toFixed(2)}
              </Text>

              {settings.monthlyBudget && (
                <View className="gap-2">

                  <View className="flex-row justify-between">
                    <Text className="text-xs text-background/80">
                      Limite: {settings.currency}{" "}
                      {settings.monthlyBudget.toFixed(2)}
                    </Text>

                    <Text className="text-xs text-background/80">
                      {budgetPercentage.toFixed(0)}%
                    </Text>
                  </View>

                  <View className="h-2 bg-background/30 rounded-full overflow-hidden">
                    <View
                      className={`h-full rounded-full ${
                        budgetPercentage > 80
                          ? "bg-red-400"
                          : budgetPercentage > 50
                          ? "bg-yellow-400"
                          : "bg-green-400"
                      }`}
                      style={{
                        width: `${budgetPercentage}%`,
                      }}
                    />
                  </View>

                </View>
              )}
            </View>

            {/* Resumo */}
            <View className="bg-surface rounded-2xl p-4 mb-6 border border-border">

              <Text className="text-sm font-semibold text-muted mb-3">
                Resumo do Mês
              </Text>

              <View className="flex-row justify-between">

                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">
                    {monthlyStats.transactionCount}
                  </Text>

                  <Text className="text-xs text-muted">
                    Transações
                  </Text>
                </View>

                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">
                    {settings.currency}{" "}
                    {balance.toFixed(2)}
                  </Text>

                  <Text className="text-xs text-muted">
                    Total Gasto
                  </Text>
                </View>

              </View>

            </View>

            {/* Título */}
            <View className="flex-row justify-between items-center mb-4">

              <Text className="text-lg font-bold text-foreground">
                Transações Recentes
              </Text>

              <TouchableOpacity>
                <Text className="text-primary text-sm font-semibold">
                  Ver Tudo
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        }

        ListEmptyComponent={
          <View className="px-6 py-12 items-center">

            <MaterialIcons
              name="inbox"
              size={48}
              color={colors.muted}
            />

            <Text className="text-muted text-center mt-4">
              Nenhuma despesa registrada ainda.
              {"\n"}
              Comece adicionando uma!
            </Text>

          </View>
        }

        contentContainerStyle={{
          paddingBottom: 100,
        }}

        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Botão flutuante */}
      <TouchableOpacity
        className="absolute bottom-24 right-6 bg-primary rounded-full p-4 shadow-lg"
        onPress={handleAddExpense}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name="add"
          size={32}
          color="white"
        />
      </TouchableOpacity>

      {/* Modal */}
      <AddExpenseModal
        visible={modalVisible}
        onClose={() =>
          setModalVisible(false)
        }
        onSuccess={() => {}}
      />
    </ScreenContainer>
  );
}