# Guia de Apresentação: Spending Control App

## Visão Geral do Projeto

O **Spending Control App** é um aplicativo mobile desenvolvido em React Native com Expo, projetado para ajudar usuários a gerenciar suas despesas pessoais de forma simples e intuitiva. O aplicativo foi desenvolvido especificamente para apresentação em contexto escolar, priorizando clareza, funcionalidade e design limpo.

**Tecnologias Utilizadas:**
- React Native 0.81 com Expo SDK 54
- TypeScript 5.9
- NativeWind (Tailwind CSS para React Native)
- AsyncStorage para persistência de dados
- Expo Router para navegação

---

## Estrutura do Aplicativo

O aplicativo é organizado em **4 abas principais**, cada uma com uma função específica:

### 1. **Home** (Tela Inicial)
A tela inicial apresenta um resumo visual do mês atual com as seguintes informações:

- **Saldo Total do Mês**: Exibido em destaque com a cor azul primária
- **Barra de Progresso do Orçamento**: Mostra o percentual de gastos em relação ao limite mensal configurado (verde < 50%, amarelo 50-80%, vermelho > 80%)
- **Card de Resumo**: Exibe o número total de transações e o valor total gasto
- **Transações Recentes**: Lista as 5 últimas despesas com ícone, categoria, descrição, valor e data
- **Botão Flutuante (+)**: Permite adicionar rapidamente uma nova despesa

### 2. **Transações**
Tela dedicada à visualização completa de todas as transações com funcionalidades de filtro:

- **Filtro por Período**: Semana, Mês ou Todas as transações
- **Filtro por Categoria**: Todas, Alimentação, Transporte, Lazer, Saúde, Educação ou Outros
- **Lista Completa**: Exibe todas as transações que correspondem aos filtros selecionados
- **Deletar Transações**: Cada transação possui um ícone de lixeira para remover
- **Contagem**: Mostra quantas transações foram encontradas com os filtros aplicados

### 3. **Estatísticas**
Tela com visualizações gráficas dos gastos:

- **Comparação Mês Atual vs Anterior**: Cards lado a lado mostrando o total gasto em cada mês
- **Gráfico de Barras**: Exibe os gastos diários dos últimos 7 dias
- **Distribuição por Categoria**: Gráfico com barras de progresso mostrando quanto foi gasto em cada categoria, com percentuais
- **Tabela de Resumo**: Lista cada categoria com o valor total e percentual do total

### 4. **Configurações**
Tela para personalizar o aplicativo:

- **Limite Mensal**: Campo para definir um orçamento máximo (opcional)
- **Seleção de Moeda**: Escolha entre R$, $, €, £
- **Tema**: Toggle para alternar entre modo claro e escuro
- **Informações**: Exibe o total de transações e versão do app
- **Limpar Dados**: Opção para deletar todas as transações (com confirmação)

---

## Fluxo de Uso Principal

### Adicionando uma Despesa

1. Na **Home Screen**, toque no botão flutuante (+) no canto inferior direito
2. Um modal desliza de baixo para cima com o formulário
3. Preencha os campos:
   - **Valor**: Digite o valor da despesa (ex: 25.50)
   - **Data**: A data padrão é hoje, mas pode ser alterada
   - **Categoria**: Selecione uma das 6 categorias disponíveis
   - **Descrição**: Adicione uma descrição opcional (ex: "Café com amigos")
4. Toque em **Salvar** para adicionar a transação
5. O modal fecha automaticamente e a transação aparece no topo da lista

### Visualizando Todas as Transações

1. Toque na aba **Transações** no menu inferior
2. Use os filtros para refinar a visualização:
   - Selecione o período (Semana, Mês, Tudo)
   - Selecione a categoria desejada
3. A lista atualiza automaticamente com as transações filtradas
4. Para deletar uma transação, toque no ícone de lixeira

### Analisando Estatísticas

1. Toque na aba **Estatísticas**
2. Visualize a comparação entre mês atual e anterior
3. Analise o gráfico de barras dos últimos 7 dias
4. Observe a distribuição de gastos por categoria com percentuais

### Configurando o Aplicativo

1. Toque na aba **Configurações**
2. Defina seu limite mensal (opcional)
3. Escolha a moeda desejada
4. Alterne entre tema claro e escuro
5. Toque em **Salvar Limite** para aplicar as mudanças

---

## Estrutura de Dados

### Transação
Cada transação é armazenada com as seguintes informações:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único (timestamp) |
| `value` | number | Valor da despesa em reais |
| `category` | string | Categoria da despesa |
| `description` | string | Descrição da despesa |
| `date` | string | Data no formato YYYY-MM-DD |
| `timestamp` | number | Unix timestamp para ordenação |

### Categorias Disponíveis

| Categoria | Ícone | Cor | Uso |
|-----------|-------|-----|-----|
| Alimentação | 🍽️ | Vermelho (#FF6B6B) | Comidas, bebidas, restaurantes |
| Transporte | 🚗 | Teal (#4ECDC4) | Uber, ônibus, combustível |
| Lazer | 🎬 | Amarelo (#FFE66D) | Cinema, jogos, diversão |
| Saúde | 🏥 | Menta (#95E1D3) | Medicamentos, consultas, academia |
| Educação | 🎓 | Roxo (#C7CEEA) | Cursos, livros, materiais |
| Outros | 📦 | Cinza (#B0B0B0) | Despesas diversas |

### Configurações
As configurações são salvas localmente no dispositivo:

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `monthlyBudget` | number \| null | null | Limite mensal em reais |
| `currency` | string | "R$" | Símbolo de moeda exibido |
| `theme` | string | "auto" | Tema (light, dark, auto) |

---

## Recursos Técnicos Implementados

### Armazenamento Local
- **AsyncStorage**: Todas as transações e configurações são salvas localmente no dispositivo
- **Persistência**: Os dados são mantidos mesmo após fechar o aplicativo
- **Sincronização**: Atualizações são refletidas instantaneamente na interface

### Validação de Dados
- Valores devem ser positivos
- Datas devem estar no formato correto
- Categorias são limitadas às 6 opções disponíveis
- Descrições são opcionais

### Feedback do Usuário
- **Haptic Feedback**: Vibração ao adicionar transações (em dispositivos iOS/Android)
- **Loading States**: Indicadores de carregamento durante operações
- **Mensagens de Erro**: Alertas informativos em caso de problemas
- **Animações**: Transições suaves ao abrir/fechar modais

### Tema e Acessibilidade
- **Modo Claro/Escuro**: Suporte completo para ambos os temas
- **Cores Contrastantes**: Texto legível em todos os fundos
- **Tamanhos de Fonte**: Hierarquia visual clara
- **Ícones Significativos**: Cada categoria tem um ícone representativo

---

## Casos de Uso para Apresentação

### Demonstração 1: Adicionando Despesas
**Objetivo**: Mostrar como o usuário adiciona uma despesa rapidamente

1. Abra o aplicativo na Home Screen
2. Toque no botão (+)
3. Adicione uma despesa de teste (ex: R$ 25.50, Alimentação, "Café")
4. Salve e mostre como a transação aparece imediatamente na lista
5. Repita com 2-3 categorias diferentes

**Tempo**: ~2 minutos

### Demonstração 2: Filtrando Transações
**Objetivo**: Mostrar a flexibilidade de visualização dos dados

1. Navegue para a aba Transações
2. Aplique filtro por período (Semana, Mês)
3. Aplique filtro por categoria (Alimentação, Transporte)
4. Mostre como a lista se atualiza dinamicamente
5. Combine filtros para resultados mais específicos

**Tempo**: ~2 minutos

### Demonstração 3: Analisando Estatísticas
**Objetivo**: Demonstrar insights visuais dos gastos

1. Navegue para a aba Estatísticas
2. Mostre a comparação entre mês atual e anterior
3. Aponte o gráfico de barras dos últimos 7 dias
4. Explique a distribuição por categoria
5. Destaque como o percentual de cada categoria é calculado

**Tempo**: ~2 minutos

### Demonstração 4: Configurando o Aplicativo
**Objetivo**: Mostrar personalização e controle

1. Navegue para Configurações
2. Defina um limite mensal (ex: R$ 500)
3. Mude a moeda para $ ou €
4. Alterne o tema (claro/escuro)
5. Retorne à Home e mostre como o limite aparece na barra de progresso

**Tempo**: ~1.5 minutos

---

## Pontos-Chave para Destacar na Apresentação

### Simplicidade
- Interface limpa com apenas 4 abas principais
- Fluxo intuitivo para adicionar despesas
- Sem configurações complexas ou confusas

### Funcionalidade
- Armazenamento local de dados sem necessidade de internet
- Filtros avançados para análise de gastos
- Gráficos visuais para melhor compreensão

### Design
- Cores harmônicas e significativas
- Ícones claros e representativos
- Responsivo para diferentes tamanhos de tela
- Suporte a tema claro/escuro

### Feedback do Usuário
- Confirmações visuais de ações
- Mensagens de erro claras
- Animações suaves e agradáveis

---

## Tecnologias e Ferramentas

| Ferramenta | Versão | Propósito |
|-----------|--------|----------|
| React Native | 0.81 | Framework mobile |
| Expo | 54 | Plataforma de desenvolvimento |
| TypeScript | 5.9 | Tipagem estática |
| NativeWind | 4 | Styling com Tailwind CSS |
| Expo Router | 6 | Navegação |
| AsyncStorage | 2.2 | Persistência local |
| Material Icons | 15 | Ícones |

---

## Próximos Passos (Opcional)

Se houver tempo ou interesse em expandir o projeto:

1. **Sincronização em Nuvem**: Adicionar backend para sincronizar dados entre dispositivos
2. **Exportação de Dados**: Permitir exportar transações em CSV ou PDF
3. **Notificações**: Alertar quando o limite mensal está próximo
4. **Metas de Poupança**: Adicionar funcionalidade de metas por categoria
5. **Relatórios Avançados**: Gráficos mais detalhados e análises comparativas

---

## Conclusão

O **Spending Control App** demonstra como um aplicativo mobile bem estruturado pode resolver um problema real (controle de gastos) com uma interface simples e intuitiva. O projeto utiliza tecnologias modernas e boas práticas de desenvolvimento, sendo um excelente exemplo de aplicação prática de React Native e design mobile.

**Tempo Total de Apresentação**: ~10 minutos (incluindo demonstrações)

**Público-Alvo**: Estudantes, educadores e profissionais interessados em desenvolvimento mobile
