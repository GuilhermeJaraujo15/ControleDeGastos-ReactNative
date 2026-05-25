# Spending Control App - TODO

## Core Features

- [x] Home Screen com saldo total e transações recentes
- [x] Add Expense Modal (valor, categoria, descrição, data)
- [x] Transactions Screen com lista completa e filtros
- [x] Statistics Screen com gráficos (pizza, barras, comparação)
- [x] Settings Screen (limite, moeda, tema, limpar dados)
- [x] Tab bar navigation (Home, Transactions, Statistics, Settings)

## Data & Storage

- [x] AsyncStorage para persistência de transações
- [x] AsyncStorage para configurações (limite, moeda, tema)
- [x] Estrutura de dados para transações (id, valor, categoria, descrição, data)
- [x] Estrutura de dados para categorias (nome, ícone, cor)

## UI Components

- [x] Card de Resumo (saldo, limite, percentual)
- [x] Transaction Item (ícone, descrição, valor, data)
- [x] Category Selector (grid ou dropdown)
- [x] Numeric Input com máscara de moeda
- [x] Date Picker
- [x] Filter Buttons (período, categoria)
- [x] Chart Components (Pizza, Barras)

## Interactions & Feedback

- [x] Haptic feedback ao adicionar transação
- [x] Animação ao abrir/fechar modal
- [ ] Swipe to delete em transações
- [x] Press feedback em botões
- [x] Loading state ao salvar
- [x] Confirmação ao deletar transação

## Polish & Testing

- [x] Validação de entrada (valor positivo, descrição não vazia)
- [x] Tratamento de erros (AsyncStorage falhas)
- [x] Dark mode suporte completo
- [x] Responsividade em diferentes tamanhos de tela
- [x] Teste end-to-end de fluxos principais
- [ ] Performance (lista grande de transações)

## Branding & Deployment

- [ ] Gerar logo customizado do app
- [x] Atualizar app.config.ts com nome e logo
- [x] Criar guia passo a passo para Notion
- [x] Preparar para apresentação escolar
- [ ] Gerar APK/IPA para distribuição

## Known Issues

- (Nenhum no momento)

## Completed

- [x] Projeto inicializado com Expo
- [x] Design plan criado
- [x] Contexto de gastos implementado
- [x] Componentes principais desenvolvidos
- [x] Telas implementadas (Home, Transactions, Statistics, Settings)
- [x] Testes unitários criados e passando
