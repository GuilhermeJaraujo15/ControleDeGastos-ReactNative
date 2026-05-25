import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useSpending } from "@/lib/spending-context";
import { useThemeContext } from "@/lib/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const {
    settings,
    updateSettings,
    transactions,
    clearAllTransactions,
    isLoading,
  } = useSpending();
  const { colorScheme, setColorScheme } = useThemeContext();
  const colors = useColors();

  const [budget, setBudget] = useState(settings.monthlyBudget?.toString() || "");
  const [currency, setCurrency] = useState(settings.currency);
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [saving, setSaving] = useState(false);

  const handleSaveBudget = async () => {
    setSaving(true);
    try {
      const budgetValue = budget ? parseFloat(budget) : null;
      if (budgetValue !== null && budgetValue <= 0) {
        alert("O limite deve ser maior que 0");
        setSaving(false);
        return;
      }

      await updateSettings({
        monthlyBudget: budgetValue,
        currency,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      alert("Configurações salvas com sucesso!");
    } catch {
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    setColorScheme(value ? "dark" : "light");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Limpar Dados",
      "Tem certeza que deseja deletar TODAS as transações? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllTransactions();
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              alert("Todos os dados foram apagados com sucesso!");
            } catch {
              alert("Erro ao limpar os dados.");
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 py-4">
          {/* Título */}
          <Text className="text-2xl font-bold text-foreground mb-6">Configurações</Text>

          {/* Seção: Orçamento */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-3">Orçamento Mensal</Text>
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View>
                <Text className="text-xs text-muted mb-2">Limite Mensal (opcional)</Text>
                <View className="flex-row items-center bg-background rounded-lg px-3 py-2 border border-border">
                  <Text className="text-foreground font-semibold mr-2">{currency}</Text>
                  <TextInput
                    className="flex-1 text-foreground text-base"
                    placeholder="Ex: 500.00"
                    placeholderTextColor={colors.muted}
                    keyboardType="decimal-pad"
                    value={budget}
                    onChangeText={setBudget}
                    editable={!saving}
                  />
                </View>
              </View>

              <TouchableOpacity
                className={`py-3 rounded-lg items-center justify-center ${
                  saving ? "bg-primary/50" : "bg-primary"
                }`}
                onPress={handleSaveBudget}
                disabled={saving}
              >
                <Text className="text-background font-semibold">
                  {saving ? "Salvando..." : "Salvar Limite"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seção: Moeda */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-3">Moeda</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row flex-wrap gap-2">
                {["R$", "$", "€", "£"].map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    className={`px-4 py-2 rounded-lg border ${
                      currency === curr
                        ? "bg-primary border-primary"
                        : "bg-background border-border"
                    }`}
                    onPress={() => setCurrency(curr)}
                  >
                    <Text
                      className={`font-semibold ${
                        currency === curr ? "text-background" : "text-foreground"
                      }`}
                    >
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Seção: Tema */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-3">Aparência</Text>
            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <MaterialIcons
                  name={isDarkMode ? "dark-mode" : "light-mode"}
                  size={24}
                  color={colors.primary}
                />
                <Text className="text-foreground font-medium">
                  {isDarkMode ? "Modo Escuro" : "Modo Claro"}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          {/* Seção: Informações */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-3">Informações</Text>
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <View className="flex-row justify-between">
                <Text className="text-foreground">Total de Transações</Text>
                <Text className="font-semibold text-foreground">{transactions.length}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-foreground">Versão do App</Text>
                <Text className="font-semibold text-foreground">1.0.0</Text>
              </View>
            </View>
          </View>

          {/* Seção: Dados */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted mb-3">Dados</Text>
            <TouchableOpacity
              className="bg-surface rounded-lg p-4 border border-error/50 flex-row items-center justify-between"
              onPress={handleClearData}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="delete-outline" size={24} color={colors.error} />
                <Text className="text-error font-semibold">Limpar Todos os Dados</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>

          {/* Rodapé */}
          <View className="items-center py-6">
            <Text className="text-xs text-muted text-center">
              Spending Control App v1.0.0{"\n"}
              Desenvolvido para apresentação escolar
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
