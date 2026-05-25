import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Transaction } from "@/lib/types";
import { useSpending } from "@/lib/spending-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const { getCategoryById, settings } = useSpending();
  const colors = useColors();
  const category = getCategoryById(transaction.category);

  const formattedValue = `${settings.currency} ${transaction.value.toFixed(2)}`;
  const formattedDate = new Date(transaction.date).toLocaleDateString("pt-BR");

  const handleDelete = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDelete?.(transaction.id);
  };

  return (
    <View className="flex-row items-center justify-between bg-surface rounded-lg p-4 mb-3 border border-border">
      {/* Ícone e Informações */}
      <View className="flex-row items-center flex-1 gap-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: category.color + "20" }}
        >
          <MaterialIcons name={category.icon as any} size={24} color={category.color} />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{category.name}</Text>
          <Text className="text-sm text-muted">{transaction.description}</Text>
          <Text className="text-xs text-muted mt-1">{formattedDate}</Text>
        </View>
      </View>

      {/* Valor e Botão Deletar */}
      <View className="items-end gap-2">
        <Text className="text-lg font-bold text-foreground">{formattedValue}</Text>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialIcons name="delete-outline" size={20} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
}
