import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSpending } from "@/lib/spending-context";
import { CategoryType } from "@/lib/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddExpenseModal({ visible, onClose, onSuccess }: AddExpenseModalProps) {
  const { addTransaction, getCategories } = useSpending();
  const colors = useColors();
  const categories = getCategories();

  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleAddTransaction = async () => {
    if (!value || isNaN(parseFloat(value))) {
      alert("Por favor, insira um valor válido");
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        value: parseFloat(value),
        category: selectedCategory,
        description: description || "Sem descrição",
        date,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Resetar formulário
      setValue("");
      setDescription("");
      setSelectedCategory("food");
      setDate(new Date().toISOString().split("T")[0]);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar despesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="bg-background rounded-t-3xl p-6 gap-4"
          style={{ maxHeight: "90%" }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-foreground">Adicionar Despesa</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={28} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Valor */}
            <View className="gap-2 mb-4">
              <Text className="text-sm font-semibold text-muted">Valor (R$)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-lg"
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={value}
                onChangeText={setValue}
                editable={!loading}
              />
            </View>

            {/* Data */}
            <View className="gap-2 mb-4">
              <Text className="text-sm font-semibold text-muted">Data</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.muted}
                value={date}
                onChangeText={setDate}
                editable={!loading}
              />
            </View>

            {/* Categoria */}
            <View className="gap-2 mb-4">
              <Text className="text-sm font-semibold text-muted">Categoria</Text>
              <View className="flex-row flex-wrap gap-2">
                {Object.entries(categories).map(([key, category]) => (
                  <Pressable
                    key={key}
                    onPress={() => setSelectedCategory(key as CategoryType)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <View
                      className={`flex-row items-center gap-2 px-4 py-2 rounded-full border-2 ${
                        selectedCategory === key
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <MaterialIcons
                        name={category.icon as any}
                        size={18}
                        color={selectedCategory === key ? category.color : colors.muted}
                      />
                      <Text
                        className={`text-sm font-medium ${
                          selectedCategory === key ? "text-foreground" : "text-muted"
                        }`}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Descrição */}
            <View className="gap-2 mb-6">
              <Text className="text-sm font-semibold text-muted">Descrição (opcional)</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Ex: Café com amigos"
                placeholderTextColor={colors.muted}
                value={description}
                onChangeText={setDescription}
                editable={!loading}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-border rounded-lg py-3 items-center justify-center"
                onPress={onClose}
                disabled={loading}
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary rounded-lg py-3 items-center justify-center"
                onPress={handleAddTransaction}
                disabled={loading}
              >
                <Text className="text-background font-semibold">
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
