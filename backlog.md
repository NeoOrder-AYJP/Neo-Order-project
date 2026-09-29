# Backlog — Registro de Alteracoes e Correcoes

Projeto: Sistema de Gerenciamento de Pedidos de Restaurante
Data de criacao: 03/09/2026

---

## Como registrar uma entrada

Cada entrada deve conter:

- Data: data da alteracao no formato DD/MM/AAAA
- Versao: versao da spec ou do sistema afetada
- Tipo: Alteracao / Correcao / Adicionado / Removido / Refatoracao
- Modulo: area afetada (ex: Landing Page, Autenticacao, Pedidos, Estoque, etc.)
- Descricao: resumo claro do que foi modificado
- Autor: quem fez a alteracao
- Status: Pendente / Em andamento / Concluido / Revertido

---

## Historico

| Data | Versao | Tipo | Modulo | Descricao | Autor | Status |
|------|--------|------|--------|-----------|-------|--------|
| 27/08/2026 | 1.0 | Adicionado | Especificacao | Criacao da especificacao inicial com requisitos funcionais, nao-funcionais, regras de negocio, modelo de dados e arquitetura. | Stakeholder | Concluido |
| 27/08/2026 | 1.0 | Adicionado | Design | Inclusao do requisito RNF-07: interface corporativa, limpa e minimalista. | Stakeholder | Concluido |
| 27/08/2026 | 1.0 | Adicionado | Design | Criacao da secao de Diretrizes de Design com paleta de cores e principios visuais. | Stakeholder | Concluido |
| 03/09/2026 | 1.1 | Refatoracao | Estrutura | Separacao da especificacao em dois documentos: spec.md (requisitos) e agents.md (diretrizes de design). Tema e cores removidos da spec. | Stakeholder | Concluido |
| 03/09/2026 | 1.1 | Adicionado | Design | Criacao do agents.md com diretrizes completas de UI/UX corporativo, limpo e minimalista: filosofia, paleta, tipografia, espacamento, componentes, navegacao, responsividade, acessibilidade, iconografia e animacoes. | Stakeholder | Concluido |
| 03/09/2026 | 1.1 | Adicionado | Gerenciamento | Criacao do backlog.md para rastreamento formal de alteracoes, correcoes e evolucoes do projeto. | Stakeholder | Concluido |

---

## Pendencias

| ID | Data | Prioridade | Modulo | Descricao | Responsavel | Prazo |
|----|------|------------|--------|-----------|-------------|-------|
| P-001 | 03/09/2026 | Alta | Landing Page | Implementar slides automaticos rotativos com destaques do cardapio. | A definir | A definir |
| P-002 | 03/09/2026 | Alta | Autenticacao | Implementar login por mesa com credenciais criadas pelo gerente. | A definir | A definir |
| P-003 | 03/09/2026 | Alta | Pedidos | Implementar carrinho, selecao de quantidades e finalizacao de pedidos. | A definir | A definir |
| P-004 | 03/09/2026 | Alta | Estoque | Implementar controle de ingredientes e calculo automatico de disponibilidade de pratos. | A definir | A definir |
| P-005 | 03/09/2026 | Alta | Chamados | Implementar botao de chamada de funcionario com justificativa e dashboard de chamados com notificacao sonora. | A definir | A definir |
| P-006 | 03/09/2026 | Alta | Faturamento | Implementar dashboard de faturamento mensal exclusiva para gerentes. | A definir | A definir |
| P-007 | 03/09/2026 | Media | Backup | Implementar exportacao e importacao de dados em JSON. | A definir | A definir |
| P-008 | 03/09/2026 | Media | Responsividade | Garantir funcionamento correto em dispositivos moveis e desktops. | A definir | A definir |

---

## Notas

- Todas as alteracoes devem ser registradas neste documento antes de serem aplicadas no codigo.
- Entradas de correcao devem incluir a referencia ao bug ou problema que motivou a mudanca.
- Decisoes arquiteturais significativas devem ser documentadas na secao de Historico com tipo "Refatoracao".

---

# Backlog do Produto — Sistema de Gerenciamento de Pedidos (v2.0)

Este backlog foi estruturado com base na Especificação Técnica v2.0, focando na migração para a arquitetura Supabase e substituição completa do `localStorage` por persistência real no PostgreSQL.

---

## Epic 1: Infraestrutura e Banco de Dados (Supabase)
Configuração inicial do ambiente, modelagem de dados e políticas de segurança (RLS).

*   **[Task] Configuração do Projeto Supabase:** Criar projeto, configurar chaves de API públicas no frontend e inicializar o Supabase Client.
*   **[Task] Modelagem de Dados (PostgreSQL):** Criar as tabelas baseadas na especificação: `mesas`, `perfis`, `pratos`, `ingredientes`, `prato_ingredientes`, `pedidos`, `pedido_itens` e `chamados`.
*   **[Task] Configuração do Supabase Storage:** Criar bucket público para armazenamento de imagens de pratos e configurar políticas de acesso.
*   **[Task] Implementação de Row Level Security (RLS):** Criar políticas de segurança garantindo que:
    *   Clientes (Mesas) só leiam/escrevam dados de sua própria ID.
    *   Atendentes possam ler pedidos/chamados e atualizar seus status, mas não alterar cardápio/estoque.
    *   Gerentes tenham acesso total ao CRUD das entidades.
*   **[Task] Criação de Functions/RPCs (Transações):** Desenvolver funções no PostgreSQL para operações atômicas (ex: cálculo de disponibilidade de pratos e débito transacional de estoque na criação de pedidos).

---

## Epic 2: Autenticação e Gestão de Acessos
Implementação do fluxo de login via Supabase Auth e gerenciamento de contas.

*   **[Story] Login de Usuários:** Como usuário, quero fazer login usando credenciais (Mesa ou Funcionário) validadas pelo Supabase Auth para acessar o sistema.
    *   *Critérios de Aceite:* Telas separadas para clientes e funcionários. Sem uso de senhas no `localStorage`. Redirecionamento automático por perfil (`perfis.tipo`).
*   **[Story] Gestão de Contas de Funcionários:** Como Gerente, quero cadastrar, editar e inativar contas de funcionários (Atendentes e Gerentes) para controlar quem opera o sistema.
    *   *Critérios de Aceite:* Apenas perfil gerente acessa. Criação via fluxo seguro sem expor `service_role` no frontend.
*   **[Story] Gestão de Contas de Mesas:** Como Gerente, quero criar e gerenciar acessos (identificador e senha) de cada mesa física do restaurante.

---

## Epic 3: Landing Page e Catálogo de Pratos
Visualização pública dos produtos antes do login.

*   **[Story] Carrossel de Destaques:** Como cliente, quero ver pratos marcados como "destaque" rotacionando automaticamente na landing page.
    *   *Critérios de Aceite:* Dados e imagens consumidos do Supabase. Transição a cada 5 segundos.
*   **[Story] Exibição do Cardápio Público:** Como cliente, quero visualizar o cardápio completo com preços e disponibilidade antes de fazer login.
    *   *Critérios de Aceite:* Indicador visual de "Esgotado" calculado em tempo real pelo banco. Botões de ação para login/fazer pedido.

---

## Epic 4: Gestão de Cardápio e Estoque
Painel administrativo para controle de produtos e insumos.

*   **[Story] Gestão de Ingredientes:** Como Gerente, quero adicionar, editar e inativar ingredientes e suas quantidades no estoque.
    *   *Critérios de Aceite:* CRUD completo na tabela `ingredientes`. Acesso restrito via RLS.
*   **[Story] Gestão de Pratos e Ficha Técnica:** Como Gerente, quero gerenciar o cardápio, definindo nome, preço, imagem e os ingredientes/quantidades que compõem cada prato.
    *   *Critérios de Aceite:* Upload de imagem integrado ao Supabase Storage (proibido base64). Relacionamento salvo na tabela `prato_ingredientes`.
*   **[Story] Cálculo de Disponibilidade:** Como sistema, quero calcular a disponibilidade máxima de um prato com base no ingrediente limitante do estoque.
    *   *Critérios de Aceite:* Cálculo deve ocorrer via banco de dados e refletir em tempo real para os clientes.

---

## Epic 5: Fluxo de Pedidos
Seleção de itens, carrinho e processamento transacional.

*   **[Story] Carrinho de Compras:** Como cliente autenticado, quero adicionar pratos disponíveis ao carrinho e definir quantidades.
    *   *Critérios de Aceite:* Bloqueio de pratos indisponíveis. Validação final de estoque ao tentar confirmar.
*   **[Story] Checkout Transacional:** Como cliente, quero confirmar meu pedido para que a cozinha comece a prepará-lo.
    *   *Critérios de Aceite:* O sistema deve registrar o pedido, os itens e realizar a baixa do estoque em uma única transação no Supabase. Se o estoque não for suficiente, a transação deve falhar e alertar o cliente.
*   **[Story] Histórico do Cliente:** Como cliente, quero ver a lista e o status de todos os pedidos feitos pela minha mesa na sessão atual.

---

## Epic 6: Gestão Operacional em Tempo Real
Dashboards para funcionários acompanharem a operação do restaurante.

*   **[Story] Dashboard de Pedidos (Kanban/Lista):** Como funcionário, quero visualizar novos pedidos instantaneamente e atualizar seus status (Recebido, Em preparo, Pronto, Entregue, Cancelado).
    *   *Critérios de Aceite:* Uso obrigatório do **Supabase Realtime**. Ao mudar o status para Cancelado, o estoque deve ser estornado transacionalmente, se já tiver sido debitado.
*   **[Story] Criação de Chamados:** Como cliente, quero solicitar a ida de um funcionário à mesa com uma justificativa (ex: fechar conta, dúvida).
*   **[Story] Gestão de Chamados:** Como funcionário, quero receber alertas visuais e sonoros de novos chamados e poder marcá-los como "Atendido".
    *   *Critérios de Aceite:* Integração com Supabase Realtime. Opção de ativar áudio (opt-in do usuário).

---

## Epic 7: Faturamento e Administração de Dados
Relatórios gerenciais e backup de informações.

*   **[Story] Dashboard de Faturamento:** Como Gerente, quero visualizar o faturamento total, ticket médio e pratos mais vendidos filtrando por período (dia, semana, mês).
    *   *Critérios de Aceite:* Cálculo realizado no banco. Pedidos cancelados devem ser ignorados. Acesso bloqueado para Atendentes e Clientes.
*   **[Story] Exportação de Dados:** Como Gerente, quero baixar um arquivo JSON com os dados do sistema.
    *   *Critérios de Aceite:* O JSON é gerado a partir de consultas ao Supabase, não do armazenamento local.
*   **[Story] Importação de Dados:** Como Gerente, quero restaurar o sistema enviando um arquivo JSON válido.
    *   *Critérios de Aceite:* Validação dos dados antes de inserir. Inserção realizada via lote estruturado no Supabase, preservando relacionamentos e IDs.

