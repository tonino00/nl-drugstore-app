---
name: nl-drugstore-app
description: Sistema visual para consulta comunitária e controle operacional de medicamentos.
colors:
  primary: "#2E7D32"
  primary-dark: "#1B5E20"
  primary-light: "#81C784"
  secondary: "#FFA000"
  secondary-dark: "#FF6F00"
  danger: "#D32F2F"
  warning: "#FFC107"
  info: "#1976D2"
  success: "#4CAF50"
  stock-critical: "#B71C1C"
  stock-low: "#F57C00"
  stock-normal: "#2E7D32"
  stock-expired: "#616161"
  stock-expiring: "#E65100"
  background: "#F8F9FA"
  surface: "#FFFFFF"
  border: "#E5E7EB"
  hover: "#F3F4F6"
  text-primary: "#111827"
  text-secondary: "#6B7280"
  text-tertiary: "#9CA3AF"
  text-strong: "#212121"
typography:
  display:
    fontFamily: "Poppins, Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Poppins, Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Poppins, Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Poppins, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.025em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    typography: "{typography.label}"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px 8px 40px"
    typography: "{typography.label}"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge-normal:
    backgroundColor: "#EAF4EB"
    textColor: "{colors.stock-normal}"
    rounded: "{rounded.circle}"
    padding: "4px 8px"
  badge-critical:
    backgroundColor: "#F8E8E8"
    textColor: "{colors.stock-critical}"
    rounded: "{rounded.circle}"
    padding: "4px 8px"
---

# Design System: nl-drugstore-app

## 1. Overview

**Creative North Star: "Estoque Vivo da Comunidade"**

O sistema visual comunica uma farmácia comunitária em operação constante: medicamentos disponíveis, estoque em movimento, vencimentos monitorados e alertas visíveis no momento certo. A interface deve parecer confiável e institucional, mas nunca fria; moradores precisam localizar informação sem fricção, enquanto farmacêuticos precisam agir rápido em telas densas.

A base é um produto funcional, não uma superfície promocional. O verde institucional sustenta ações primárias e estados saudáveis, enquanto laranjas e vermelhos aparecem somente quando há risco operacional. Cards, tabelas, filtros e badges formam o vocabulário principal; decoração deve ceder espaço para disponibilidade, validade, lote, localização e próxima ação.

**Key Characteristics:**
- **Operacional:** cada bloco visual deve ajudar consulta, triagem, cadastro, controle ou decisão.
- **Estado explícito:** disponibilidade, estoque baixo, crítico, vencido e vencendo precisam ser distinguíveis sem interpretação extra.
- **Densidade legível:** dashboards e tabelas aceitam informação densa, desde que espaçamento, contraste e hierarquia preservem leitura rápida.
- **Consistência institucional:** botões, campos, cards, navegação e alertas devem repetir o mesmo vocabulário de cor, raio, sombra e tipografia.

## 2. Colors

A paleta é restrita e semântica: verde para confiança e disponibilidade, laranja para atenção operacional, vermelho para risco, azul para informação e neutros claros para estrutura.

### Primary
- **Verde Farmácia**: ação primária, navegação ativa, foco de campos e indicadores de estoque normal.
- **Verde Profundo**: hover de ações primárias e texto ativo sobre fundos verdes claros.
- **Verde Claro de Seleção**: item de navegação ativo e superfícies leves de confirmação.

### Secondary
- **Âmbar de Atenção**: avisos gerais e marcação de cuidado sem gravidade crítica.
- **Laranja de Vencimento**: alertas de vencimento próximo, estoque baixo e mensagens que exigem revisão.
- **Azul de Informação**: métricas informativas e estados de apoio que não são sucesso nem risco.

### Tertiary
- **Vermelho de Risco**: erro, falha, estoque crítico, vencido e alertas que exigem ação imediata.
- **Verde de Sucesso**: confirmações, disponibilidade e feedback positivo.

### Neutral
- **Fundo Operacional**: tela base para áreas autenticadas e páginas de estoque.
- **Superfície Branca**: cards, tabelas, formulários e painéis.
- **Borda Suave**: separação entre cards, linhas de tabela, inputs e divisores.
- **Texto Primário**: títulos, nomes de medicamentos, valores principais e células críticas.
- **Texto Secundário**: metadados, subtítulos, labels auxiliares e descrições.
- **Texto Terciário**: placeholders, ícones vazios e conteúdo indisponível.

### Named Rules

**The Semantic Color Rule.** Verde, laranja, vermelho e azul não são decoração; cada uso deve carregar ação, estado ou prioridade operacional.

**The Risk Visibility Rule.** Estoque crítico, vencido e vencendo nunca podem depender apenas de texto pequeno; combine cor semântica com badge, rótulo ou posição clara.

## 3. Typography

**Display Font:** Poppins (with Roboto, sans-serif fallback)  
**Body Font:** Poppins (with Roboto, sans-serif fallback)  
**Label/Mono Font:** nenhum distinto

**Character:** Uma única família sem serifa sustenta o produto inteiro. A tipografia deve parecer limpa, administrativa e previsível, com peso suficiente para leitura rápida de nomes, valores e ações.

### Hierarchy
- **Display** (700, 2rem, 1.2): títulos principais de página e métricas grandes de dashboard.
- **Headline** (700, 1.5rem, 1.2): cabeçalhos de áreas, telas de autenticação e grupos de conteúdo relevantes.
- **Title** (600, 1.25rem, 1.3): títulos de cards, nomes de medicamentos e cabeçalhos de tabelas/painéis.
- **Body** (400, 1rem, 1.5): conteúdo de página, descrições, células de tabela e mensagens de estado.
- **Label** (500, 0.875rem, 0.025em): labels de formulário, botões, filtros, navegação e metadados. Uppercase é permitido em badges de status e cabeçalhos de tabela curtos.

### Named Rules

**The Product Scale Rule.** Não use tipografia fluida ou display expressivo em áreas de tarefa; mantenha rem fixo, pesos previsíveis e contraste de escala moderado.

## 4. Elevation

O sistema usa elevação leve com sombras discretas e bordas claras. Cards e tabelas ficam em superfícies brancas com `1px` de borda; sombras aparecem para separar camadas e responder ao hover, não para criar dramatização visual.

### Shadow Vocabulary
- **Baixa Elevação** (`0 1px 3px rgba(0,0,0,0.12)`): cards, tabelas e containers em repouso.
- **Elevação Média** (`0 4px 6px rgba(0,0,0,0.1)`): hover de cards, botões primários e painéis com foco operacional.
- **Elevação Alta** (`0 10px 15px rgba(0,0,0,0.1)`): menus móveis e cards de medicamento em hover.
- **Foco Verde** (`0 0 0 3px rgba(46, 125, 50, 0.1)`): campos de busca, inputs e selects ativos.

### Named Rules

**The Flat First Rule.** Superfícies ficam planas por padrão; sombra maior só aparece como resposta a hover, foco, menu móvel ou camada temporária.

## 5. Components

### Buttons
- **Shape:** cantos médios e funcionais (8px), com variações maiores em autenticação legada (12px).
- **Primary:** fundo Verde Farmácia, texto branco, padding horizontal amplo (8px 24px), peso 600 e transição de 0.2s.
- **Hover / Focus:** Verde Profundo, elevação média e deslocamento leve de -1px; foco deve preservar anel visível.
- **Secondary / Ghost / Tertiary:** fundo branco, borda suave, texto secundário; no hover pode virar Verde Farmácia quando a ação for operacional.

### Chips
- **Style:** badges compactos com padding 4px 8px, peso 600, texto curto e cor semântica.
- **State:** status de estoque usa cápsulas circulares; categorias usam fundos tintados e texto colorido por família.

### Cards / Containers
- **Corner Style:** raio grande consistente (12px), com cards de autenticação usando 20px como exceção de entrada.
- **Background:** superfície branca sobre fundo operacional claro.
- **Shadow Strategy:** baixa elevação em repouso, elevação média/alta no hover conforme importância.
- **Border:** `1px solid` Borda Suave em cards, tabelas e painéis.
- **Internal Padding:** 16px para cards compactos; 24px para cards de dashboard, tabela e gráficos.

### Inputs / Fields
- **Style:** fundo branco, borda suave, raio médio (8px), texto de 0.875rem em áreas densas e 1rem em autenticação.
- **Focus:** borda Verde Farmácia e anel verde translúcido de 3px.
- **Error / Disabled:** erro usa Vermelho de Risco com texto pequeno e peso 500; disabled reduz opacidade e remove transformações.

### Navigation
- **Style, typography, default/hover/active states, mobile treatment.** A navegação lateral usa fundo branco, itens em coluna, ícones `react-icons/fa`, gap de 8px, padding de 8px e raio de 8px. O item ativo usa Verde Claro de Seleção com texto Verde Profundo. No mobile, o menu vira painel fixo de 260px com overlay escuro e sombra alta.

### Tables

Tabelas são o componente operacional principal. Cabeçalhos usam fundo neutro claro, texto secundário em uppercase curto, 0.75rem, peso 600 e letter-spacing de 0.025em. Linhas usam borda inferior suave, hover neutro e células com padding 16px 24px, reduzindo no mobile.

### Status and Empty States

Estados vazios usam ícone grande de 48px, texto secundário, padding 48px e título claro. Loading usa spinner verde sobre trilho cinza; em tabelas deve ocupar o conteúdo sem deslocar o layout principal.

## 6. Do's and Don'ts

### Do:
- **Do** usar Verde Farmácia para ações primárias, foco, navegação ativa e disponibilidade real.
- **Do** usar Vermelho de Risco para estoque crítico, vencido, erro e falhas que exigem ação imediata.
- **Do** manter cards, tabelas, formulários e navegação com o mesmo raio, borda e sombra para preservar consistência entre telas.
- **Do** mostrar estados vazios, carregamento, erro e ausência de permissão com texto que oriente a próxima ação.
- **Do** preservar densidade em dashboards e tabelas quando ela ajuda farmacêuticos a agir mais rápido.

### Don't:
- **Don't** parecer um site promocional, uma landing page chamativa ou um dashboard genérico cheio de métricas decorativas.
- **Don't** usar excesso de emojis, cores sem função, jargão técnico para usuários comuns ou placeholders permanentes.
- **Don't** esconder estados críticos como estoque baixo, vencimento, erro de carregamento ou permissão negada.
- **Don't** usar gradiente, vidro ou sombra pesada como linguagem padrão em áreas autenticadas de tarefa.
- **Don't** criar botões, campos ou badges com estilos divergentes para a mesma função em telas diferentes.
