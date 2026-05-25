# Spending Control App - Design Plan

## Overview
Um aplicativo simples e elegante para controle de gastos, otimizado para apresentação escolar. Foco em facilidade de uso, visual limpo e fluxos intuitivos.

---

## Screen List

### 1. **Home Screen** (Principal)
- Saldo total em destaque no topo
- Resumo do mês atual (gastos totais, limite se houver)
- Lista de transações recentes (últimas 5-10)
- Botão flutuante para adicionar nova despesa
- Ícone de configurações no header

### 2. **Add Expense Screen** (Modal)
- Campo de entrada de valor (com teclado numérico)
- Seleção de categoria (dropdown ou grid de ícones)
- Campo de descrição (opcional)
- Data da transação (padrão: hoje)
- Botão "Salvar" e "Cancelar"

### 3. **Transactions Screen** (Aba)
- Lista completa de todas as transações
- Filtro por período (semana, mês, todos)
- Filtro por categoria
- Cada item mostra: ícone da categoria, descrição, valor, data
- Swipe para deletar (ou ícone de lixeira)

### 4. **Statistics Screen** (Aba)
- Gráfico de pizza com distribuição por categoria
- Total gasto por categoria (listado abaixo do gráfico)
- Comparação mês anterior vs. mês atual
- Gastos diários (gráfico de barras simples)

### 5. **Settings Screen** (Aba)
- Limite de orçamento mensal (input)
- Moeda/formato de número
- Tema (claro/escuro)
- Limpar todos os dados (com confirmação)
- Versão do app

---

## Primary Content and Functionality

### Home Screen
- **Saldo Total**: Exibido em grande, com cor verde (positivo) ou vermelho (negativo)
- **Card de Resumo**: Mostra gastos do mês, limite (se configurado), e percentual utilizado
- **Lista de Transações**: Rolável, mostra últimas transações com ícone, descrição, valor, data
- **Botão Flutuante (+)**: Abre modal para adicionar nova despesa

### Add Expense Modal
- **Valor**: Campo numérico com máscara de moeda
- **Categoria**: 6-8 categorias principais (Alimentação, Transporte, Lazer, Saúde, Educação, Outros)
- **Descrição**: Campo de texto curto (opcional)
- **Data**: Seletor de data, padrão = hoje
- **Ações**: Salvar (verde) e Cancelar (cinza)

### Transactions Screen
- **Filtros**: Período (Semana, Mês, Tudo) + Categoria (Todas, Alimentação, etc.)
- **Lista**: FlatList com transações, cada uma deletável com swipe ou ícone
- **Agrupamento**: Opcional por data (hoje, ontem, semana passada, etc.)

### Statistics Screen
- **Gráfico de Pizza**: Distribuição visual por categoria
- **Tabela de Resumo**: Categoria | Valor | % do Total
- **Comparação**: Mês atual vs. mês anterior (cards lado a lado)
- **Gráfico de Barras**: Gastos diários dos últimos 7 dias

### Settings Screen
- **Limite Mensal**: Input numérico, salvo em AsyncStorage
- **Moeda**: Seletor (R$, $, €, etc.)
- **Tema**: Toggle claro/escuro
- **Dados**: Botão "Limpar Tudo" com confirmação
- **Info**: Versão do app

---

## Key User Flows

### Flow 1: Adicionar uma Despesa
1. Usuário toca no botão flutuante (+) na Home
2. Modal "Add Expense" abre
3. Usuário insere valor (ex: 25.50)
4. Usuário seleciona categoria (ex: Alimentação)
5. Usuário adiciona descrição (ex: "Café com amigos")
6. Usuário toca "Salvar"
7. Modal fecha, transação aparece no topo da lista na Home
8. Saldo total é atualizado

### Flow 2: Visualizar Todas as Transações
1. Usuário toca na aba "Transações"
2. Lista completa de transações é exibida
3. Usuário pode filtrar por período ou categoria
4. Usuário toca em uma transação para ver detalhes (opcional)
5. Usuário pode deletar com swipe ou ícone

### Flow 3: Ver Estatísticas
1. Usuário toca na aba "Estatísticas"
2. Gráfico de pizza mostra distribuição por categoria
3. Usuário vê comparação mês atual vs. anterior
4. Usuário vê gráfico de gastos diários

### Flow 4: Configurar Limite
1. Usuário toca na aba "Configurações"
2. Usuário insere limite mensal (ex: 500)
3. Usuário toca "Salvar"
4. Na Home, o card de resumo agora mostra: "Gastos: R$ 150 / Limite: R$ 500 (30%)"

---

## Color Choices

| Elemento | Cor (Light) | Cor (Dark) | Uso |
|----------|------------|-----------|-----|
| Primary | #0a7ea4 (Azul) | #0a7ea4 (Azul) | Botões, destaques, ícones ativos |
| Background | #ffffff | #151718 (Quase preto) | Fundo da tela |
| Surface | #f5f5f5 | #1e2022 (Cinza escuro) | Cards, modals |
| Foreground | #11181c (Preto) | #ecedee (Branco) | Texto principal |
| Muted | #687076 (Cinza médio) | #9ba1a6 (Cinza claro) | Texto secundário |
| Border | #e5e7eb | #334155 | Divisores, bordas |
| Success | #22c55e (Verde) | #4ade80 | Saldo positivo, ações bem-sucedidas |
| Warning | #f59e0b (Laranja) | #fbbf24 | Alertas, limite próximo |
| Error | #ef4444 (Vermelho) | #f87171 | Saldo negativo, erros |

### Categorias (Cores Secundárias)
- **Alimentação**: #FF6B6B (Vermelho)
- **Transporte**: #4ECDC4 (Teal)
- **Lazer**: #FFE66D (Amarelo)
- **Saúde**: #95E1D3 (Menta)
- **Educação**: #C7CEEA (Roxo)
- **Outros**: #B0B0B0 (Cinza)

---

## Design Principles

1. **Simplicidade**: Máximo 3 abas, fluxos diretos, sem navegação complexa
2. **Clareza Visual**: Ícones grandes, cores distintas por categoria
3. **Responsividade**: Layout otimizado para retrato (9:16), uso com uma mão
4. **Feedback Imediato**: Transações aparecem instantaneamente, animações suaves
5. **Acessibilidade**: Texto legível, contraste adequado, botões grandes
6. **Apresentação Escolar**: Visual profissional mas não corporativo, amigável

---

## Typography

- **Heading 1 (Saldo Total)**: 32px, bold, foreground
- **Heading 2 (Títulos de Seção)**: 20px, semibold, foreground
- **Body (Texto Principal)**: 16px, regular, foreground
- **Caption (Texto Secundário)**: 14px, regular, muted
- **Small (Datas, Valores)**: 12px, regular, muted

---

## Spacing & Layout

- **Padding Padrão**: 16px (p-4 em Tailwind)
- **Gap entre Elementos**: 12px (gap-3)
- **Raio de Borda**: 12px (rounded-lg)
- **Altura de Botão**: 48px (py-3)
- **Altura de Input**: 44px (py-2.5)

---

## Next Steps

1. ✅ Design plan criado
2. ⬜ Implementar Home Screen com lista de transações
3. ⬜ Implementar Add Expense Modal
4. ⬜ Implementar Transactions Screen com filtros
5. ⬜ Implementar Statistics Screen com gráficos
6. ⬜ Implementar Settings Screen
7. ⬜ Integrar AsyncStorage para persistência
8. ⬜ Testar fluxos completos
9. ⬜ Criar guia passo a passo para Notion
