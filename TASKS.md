# Decomposição da Especificação em Tarefas (TASKS)

Este documento contém o detalhamento de todas as tarefas derivadas da especificação técnica (`spec.md`) e das diretrizes do agente (`agents.md`), mapeando os Requisitos Funcionais (RF), Requisitos Não-Funcionais (RNF) e Regras de Negócio (RN) para o código implementado.

---

## 1. Módulo: Configuração & Segurança Obfustada de APIs
- [x] **TASK-001**: Criar modulo de configuração com credenciais de API obfustadas em XOR hex encoding (`src/js/config.js`).
  - *Mapeamento*: Integração segura da chave publishable (`sb_publishable_rlA3JwAZNqBSk9r3iS767g_eCrI_Vco`) e endpoint REST Supabase (`https://gftpbgbfttupayjfzdmm.supabase.co/rest/v1/`).
- [x] **TASK-002**: Implementar cliente de API (`src/js/api.js`) com integração e fallback resiliente.

---

## 2. Módulo: Landing Page (Pré-Login)
- [x] **TASK-003**: Implementar carrossel de slides rotativo automático a cada 5 segundos com navegação manual e indicadores (`src/js/components/landing.js`).
  - *Mapeamento*: RF-01, RF-02, RF-40, RNF-06.
- [x] **TASK-004**: Incluir botões de acesso direto "Fazer Pedido (Mesa)" e "Área do Funcionário" (`src/js/components/landing.js`).
  - *Mapeamento*: RF-03.
- [x] **TASK-005**: Exibir cardápio completo com imagem, título, descrição, preço e badges de disponibilidade em tempo real (`src/js/components/landing.js`).
  - *Mapeamento*: RF-04, RF-12.

---

## 3. Módulo: Autenticação e Perfis
- [x] **TASK-006**: Criar gerenciador de sessão e autenticação separando login de Cliente (Mesa) e Funcionário (`src/js/auth.js`).
  - *Mapeamento*: RF-05, RF-08, RF-09.
- [x] **TASK-007**: Restringir criação de login de mesa exclusivamente ao Gerente (sem auto-cadastro) (`src/js/store.js`, `src/js/components/managerAccounts.js`).
  - *Mapeamento*: RF-06, RF-07, RN-10.
- [x] **TASK-008**: Implementar CRUD de contas de mesas com inativação/reativação e alteração de senha (`src/js/components/managerAccounts.js`).
  - *Mapeamento*: RF-10, RN-05.
- [x] **TASK-009**: Implementar CRUD de contas de funcionários (Gerente / Atendente) com definição de privilégios (`src/js/components/managerAccounts.js`).
  - *Mapeamento*: RF-11, RN-05.

---

## 4. Módulo: Cardápio e Pedidos
- [x] **TASK-010**: Implementar regra de cálculo automático de disponibilidade baseada no estoque de ingredientes (`src/js/store.js` -> `isPratoDisponivel`).
  - *Mapeamento*: RF-13, RN-01, RN-02.
- [x] **TASK-011**: Estilizar pratos indisponíveis com badge visual e proibir adição ao carrinho (`src/js/components/clientMenu.js`).
  - *Mapeamento*: RF-14, RN-01.
- [x] **TASK-012**: Criar carrinho de compras interativo com ajuste de quantidades e confirmação de pedido (`src/js/components/clientMenu.js`).
  - *Mapeamento*: RF-15, RF-16.
- [x] **TASK-013**: Executar débito automático de ingredientes no estoque ao confirmar pedido (`src/js/store.js` -> `fazerPedido`).
  - *Mapeamento*: RF-17, RN-03.
- [x] **TASK-014**: Exibir histórico de pedidos realizados pela mesa logada (`src/js/components/clientOrders.js`).
  - *Mapeamento*: RF-18, RN-07.
- [x] **TASK-015**: Criar painel de pedidos ativos para atendentes e gerentes com atualização de status (`src/js/components/staffOrders.js`).
  - *Mapeamento*: RF-19, RF-20, RN-06.
- [x] **TASK-016**: Implementar estorno automático de ingredientes do estoque em pedidos cancelados (`src/js/store.js` -> `atualizarStatusPedido`).
  - *Mapeamento*: RN-04.

---

## 5. Módulo: Controle de Estoque
- [x] **TASK-017**: Criar tela de controle de estoque de ingredientes para gerentes (`src/js/components/managerStock.js`).
  - *Mapeamento*: RF-21, RF-25, RN-05.
- [x] **TASK-018**: Implementar inclusão e edição de quantidade/unidades de ingredientes (`src/js/components/managerStock.js`).
  - *Mapeamento*: RF-22, RF-23.
- [x] **TASK-019**: Mapear ficha técnica de pratos vinculando ingredientes necessários por porção (`src/js/components/managerMenu.js`).
  - *Mapeamento*: RF-24.

---

## 6. Módulo: Chamados e Comunicação
- [x] **TASK-020**: Inserir botão flutuante e modal "Chamar Funcionário" disponível para a mesa logada (`src/js/components/callStaff.js`).
  - *Mapeamento*: RF-26, RF-27.
- [x] **TASK-021**: Criar painel de chamados pendentes para atendentes e gerentes (`src/js/components/staffCalls.js`).
  - *Mapeamento*: RF-28, RN-06.
- [x] **TASK-022**: Integrar alerta sonoro via Web Audio API com botão para ativação manual de áudio (`src/js/components/staffCalls.js`).
  - *Mapeamento*: RF-29, RF-30.
- [x] **TASK-023**: Permitir marcar chamados como "Atendido" (`src/js/components/staffCalls.js`).
  - *Mapeamento*: RF-31.

---

## 7. Módulo: Faturamento e Métricas
- [x] **TASK-024**: Criar dashboard exclusiva para Gerentes com faturamento do mês atual (`src/js/components/managerBilling.js`).
  - *Mapeamento*: RF-32, RF-36, RN-05, RN-08.
- [x] **TASK-025**: Implementar filtros de período (hoje, 7 dias, mês atual, total) (`src/js/components/managerBilling.js`).
  - *Mapeamento*: RF-33.
- [x] **TASK-026**: Exibir métricas de faturamento total, quantidade de pedidos, ticket médio e pratos mais vendidos, desconsiderando pedidos cancelados (`src/js/components/managerBilling.js`).
  - *Mapeamento*: RF-34, RF-35, RN-04, RN-09.

---

## 8. Módulo: Gerenciamento do Cardápio (CRUD)
- [x] **TASK-027**: Implementar cadastro de novos pratos com nome, descrição, preço, imagem e destaque (`src/js/components/managerMenu.js`).
  - *Mapeamento*: RF-37, RN-05.
- [x] **TASK-028**: Implementar edição e remoção de pratos (`src/js/components/managerMenu.js`).
  - *Mapeamento*: RF-38, RF-39.

---

## 9. Módulo: Backup & Exportação
- [x] **TASK-029**: Implementar exportação de todos os dados do localStorage em arquivo JSON (`src/js/store.js`, `src/js/components/managerBackup.js`).
  - *Mapeamento*: RF-41.
- [x] **TASK-030**: Implementar importação de dados a partir de arquivo JSON (`src/js/store.js`, `src/js/components/managerBackup.js`).
  - *Mapeamento*: RF-42.

---

## 10. Requisitos Não-Funcionais e UI/UX
- [x] **TASK-031**: Aplicar paleta de cores gastronômicas corporativas (Laranja `#E85D04`, Vermelho `#D00000`, Amarelo `#FFBA08`, Café `#6F4E37`, Creme `#FFF8F0`) (`src/css/styles.css`).
  - *Mapeamento*: RNF-01, RNF-07.
- [x] **TASK-032**: Garantir layout totalmente responsivo para mobile, tablet e desktop (`src/css/styles.css`).
  - *Mapeamento*: RNF-02.
- [x] **TASK-033**: Manter arquitetura 100% Vanilla JS SPA sem dependências externas pesadas (`index.html`, `src/js/app.js`).
  - *Mapeamento*: RNF-03, RNF-04, RNF-05.
