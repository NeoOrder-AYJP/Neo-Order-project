# Backlog — Registro de Alteracoes e Quebra de Tarefas

Projeto: Sistema de Gerenciamento de Pedidos de Restaurante
Data de atualização: 15/09/2026
Versao da Spec: 1.2

---

## 1. Visão Geral do Backlog

Este documento contém a quebra completa e detalhada da especificação técnica (`spec.md`) em tarefas de desenvolvimento, agrupadas por módulos/épicos. Todas as tarefas possuem prioridade, requisitos mapeados (RFs, RNs, RNFs) e critérios de aceite claros.

---

## 2. Historico de Alteracoes

| Data | Versao | Tipo | Modulo | Descricao | Autor | Status |
|------|--------|------|--------|-----------|-------|--------|
| 27/08/2026 | 1.0 | Adicionado | Especificacao | Criacao da especificacao inicial com requisitos funcionais, nao-funcionais, regras de negocio, modelo de dados e arquitetura. | Stakeholder | Concluido |
| 27/08/2026 | 1.0 | Adicionado | Design | Inclusao do requisito RNF-07: interface corporativa, limpa e minimalista. | Stakeholder | Concluido |
| 27/08/2026 | 1.0 | Adicionado | Design | Criacao da secao de Diretrizes de Design com paleta de cores e principios visuais. | Stakeholder | Concluido |
| 03/09/2026 | 1.1 | Refatoracao | Estrutura | Separacao da especificacao em dois documentos: spec.md (requisitos) e agents.md (diretrizes de design). Tema e cores removidos da spec. | Stakeholder | Concluido |
| 03/09/2026 | 1.1 | Adicionado | Design | Criacao do agents.md com diretrizes completas de UI/UX corporativo, limpo e minimalista. | Stakeholder | Concluido |
| 03/09/2026 | 1.1 | Adicionado | Gerenciamento | Criacao do backlog.md para rastreamento formal de alteracoes. | Stakeholder | Concluido |
| 15/09/2026 | 1.2 | Refatoracao | Planejamento | Detalhamento e decomposição completa da especificação v1.2 em 15 tarefas funcionais e técnicas com critérios de aceite. | Jules | Concluido |

---

## 3. Quebra de Tarefas (Task Breakdown)

### Épico 1: Infraestrutura e Camada de Dados

#### [TSK-01] Persistência em `localStorage` e Estrutura de Estado Inicial
- **Prioridade:** Alta
- **Mapeamento:** RNF-04, Modelo de Dados (Seção 8)
- **Descrição:** Criar a camada de persistência e gerenciamento de estado (`Store`) utilizando `localStorage`. Inicializar a estrutura de dados padrão (com dados seed para demonstração/primeiro acesso: gerente padrão, pratos, ingredientes, contas de mesa) se o `localStorage` estiver vazio.
- **Critérios de Aceite:**
  - [ ] Implementa as coleções: `usuarios`, `pratos`, `ingredientes`, `pedidos`, `chamados`.
  - [ ] Garante dados iniciais preenchidos na primeira inicialização.
  - [ ] Fornece métodos auxiliares de leitura, escrita, atualização e deleção para cada entidade.
  - [ ] Inclui utilitários para geração de IDs únicos e manipulação segura de JSON.

---

### Épico 2: Módulo Landing Page (Pré-Login)

#### [TSK-02] Landing Page com Slides Rotativos e Cardápio Aberto
- **Prioridade:** Alta
- **Mapeamento:** RF-01, RF-02, RF-03, RF-04, RNF-03, RNF-06, RNF-07
- **Descrição:** Desenvolver a página inicial pública contendo o carrossel/slides automáticos de pratos em destaque e a exibição completa do cardápio do restaurante.
- **Critérios de Aceite:**
  - [ ] Slides rotativos alternando automaticamente a cada 5 segundos com transição suave.
  - [ ] Opção de navegação manual nos slides (botões/indicadores de próximo e anterior).
  - [ ] Exibição de imagem, nome e breve descrição nos slides para pratos marcados com `destaque: true`.
  - [ ] Botões visíveis e destacados para "Fazer Pedido" (redireciona para login de mesa) e "Área do Funcionário" (redireciona para login de funcionário).
  - [ ] Seção do cardápio completo listando todos os pratos ativos com nome, descrição, preço, imagem e badge/indicador visual de disponibilidade.

---

### Épico 3: Módulo Autenticação e Gestão de Contas

#### [TSK-03] Autenticação Separada e Roteamento por Perfil
- **Prioridade:** Alta
- **Mapeamento:** RF-05, RF-07, RF-08, RF-09, RN-05, RN-06, RN-07, RN-10
- **Descrição:** Criar telas de login distintas para Clientes (Mesas) e Funcionários (Atendente/Gerente), com controle de sessão e redirecionamento apropriado conforme o perfil.
- **Critérios de Aceite:**
  - [ ] Tela de login de Mesa solicitando identificador da mesa e senha.
  - [ ] Tela de login de Funcionário solicitando usuário e senha.
  - [ ] Não existe auto-cadastro de clientes na tela de login.
  - [ ] Redirecionamento automático pós-login:
    - Cliente -> Dashboard da Mesa
    - Atendente -> Dashboard do Atendente (Pedidos Ativos / Chamados)
    - Gerente -> Dashboard do Gerente (Painel Administrativo completo)
  - [ ] Validação de rotas e bloqueio de acesso não autorizado por perfil.

#### [TSK-04] Gerenciamento de Contas de Mesas (Gerente)
- **Prioridade:** Alta
- **Mapeamento:** RF-06, RF-10, RN-05, RN-10
- **Descrição:** Desenvolver interface exclusiva para Gerentes para criação, edição e inativação/reativação de contas de login de mesas.
- **Critérios de Aceite:**
  - [ ] Formulário para criação de nova mesa com nome/identificador e senha.
  - [ ] Edição de nome da mesa e redefinição de senha.
  - [ ] Opção de inativar ou reativar uma conta de mesa.
  - [ ] Mesas inativas não conseguem realizar login.

#### [TSK-05] Gerenciamento de Contas de Funcionários (Gerente)
- **Prioridade:** Alta
- **Mapeamento:** RF-11, RN-05
- **Descrição:** Desenvolver interface exclusiva para Gerentes para cadastro e controle de funcionários (Atendentes e Gerentes).
- **Critérios de Aceite:**
  - [ ] Cadastro de novos funcionários com nome, usuário, senha e perfil (`atendente` ou `gerente`).
  - [ ] Edição de dados, senha e alteração de perfil de funcionários existentes.
  - [ ] Possibilidade de inativar/reativar acesso de funcionários.
  - [ ] Funcionários inativos têm o login bloqueado.

---

### Épico 4: Módulo Cardápio e Gestão de Pratos

#### [TSK-06] Gerenciamento do Cardápio / CRUD de Pratos (Gerente)
- **Prioridade:** Alta
- **Mapeamento:** RF-24, RF-37, RF-38, RF-39, RF-40, RN-05
- **Descrição:** Criar a tela de gerenciamento de pratos do cardápio, permitindo inclusão, alteração, exclusão/inativação e associação de ingredientes consumidos.
- **Critérios de Aceite:**
  - [ ] Formulário de cadastro/edição contendo: nome, descrição, preço, URL/base64 da imagem, flag de destaque (para os slides da landing page).
  - [ ] Seleção de ingredientes e definição da quantidade necessária de cada ingrediente por unidade servida (ex: 0.3 kg de feijão).
  - [ ] Remoção ou inativação de pratos do cardápio.
  - [ ] Pratos marcados como "destaque" entram automaticamente no carrossel da landing page.

---

### Épico 5: Módulo Estoque de Ingredientes

#### [TSK-07] Controle de Estoque e Cálculo de Disponibilidade
- **Prioridade:** Alta
- **Mapeamento:** RF-13, RF-21, RF-22, RF-23, RF-25, RN-02, RN-05
- **Descrição:** Desenvolver a tela de gestão de estoque de ingredientes e a regra de cálculo automático de disponibilidade de pratos com base na receita.
- **Critérios de Aceite:**
  - [ ] Listagem de ingredientes cadastrados com nome, unidade de medida (kg, g, L, un, etc.) e quantidade atual em estoque.
  - [ ] Formulário para adicionar novos ingredientes (nome, unidade, quantidade inicial).
  - [ ] Funcionalidade de reposição/ajuste manual de quantidade de ingrediente em estoque.
  - [ ] Função central que calcula a disponibilidade do prato: `disponivel = estoque / quantidade_necessaria`. Se qualquer ingrediente da receita estiver com estoque insuficiente para 1 unidade, o prato é marcado como indisponível.
  - [ ] Restrição rigorosa: Clientes e Atendentes não possuem acesso a esta tela ou às quantidades em estoque.

---

### Épico 6: Módulo Pedidos e Carrinho (Cliente / Mesa)

#### [TSK-08] Visualização do Cardápio, Carrinho e Seleção de Itens (Mesa)
- **Prioridade:** Alta
- **Mapeamento:** RF-12, RF-14, RF-15, RF-16, RN-01
- **Descrição:** Construir a visão do cliente logado na mesa para navegar pelo cardápio, verificar disponibilidade em tempo real e montar o carrinho de compras.
- **Critérios de Aceite:**
  - [ ] Cardápio dinâmico atualizado conforme disponibilidade em estoque.
  - [ ] Pratos indisponíveis exibem badge visual "Indisponível", visual acinzentado e botão de adicionar ao carrinho desabilitado.
  - [ ] Cliente seleciona quantidade de pratos disponíveis e adiciona ao carrinho.
  - [ ] Carrinho permite visualizar os itens selecionados, alterar quantidades, remover itens e ver o subtotal/total.
  - [ ] Exige sessão ativa de conta de mesa válida para prosseguir.

#### [TSK-09] Confirmação de Pedido, Baixa Automática e Histórico de Pedidos
- **Prioridade:** Alta / Média
- **Mapeamento:** RF-17, RF-18, RN-03, RN-07
- **Descrição:** Implementar o fluxo de finalização do pedido pelo cliente, com baixa automática nos ingredientes em estoque e tela de histórico de pedidos da mesa.
- **Critérios de Aceite:**
  - [ ] Ao confirmar o pedido, o sistema calcula o consumo total de ingredientes (`quantidade_pedido * quantidade_receita`) e reduz automaticamente do estoque.
  - [ ] Registra o novo pedido no `localStorage` com status inicial "Recebido", data/hora, itens e valor total.
  - [ ] Limpa o carrinho de compras após confirmação bem-sucedida.
  - [ ] Tela "Meus Pedidos" onde o cliente visualiza histórico exclusivo de sua mesa com detalhes de itens, valores, datas e status do pedido.

---

### Épico 7: Módulo Atendimento e Gestão de Pedidos (Funcionários)

#### [TSK-10] Dashboard de Pedidos Ativos, Atualização de Status e Estorno
- **Prioridade:** Alta
- **Mapeamento:** RF-19, RF-20, RN-04, RN-06
- **Descrição:** Desenvolver o painel para Atendentes e Gerentes visualizarem todos os pedidos ativos do restaurante e atualizarem seus status.
- **Critérios de Aceite:**
  - [ ] Listagem de todos os pedidos ativos em tempo real com identificação da mesa, itens, quantidades, valor total, hora e status atual.
  - [ ] Permite alterar o status do pedido: "Recebido", "Em preparo", "Pronto", "Entregue", "Cancelado".
  - [ ] Caso o pedido seja alterado para "Cancelado", o sistema estorna automaticamente os ingredientes para o estoque.
  - [ ] Pedidos cancelados são marcados adequadamente e desconsiderados do faturamento.

---

### Épico 8: Módulo Chamados e Comunicação

#### [TSK-11] Botão e Modal "Chamar Funcionário" (Cliente)
- **Prioridade:** Alta
- **Mapeamento:** RF-26, RF-27
- **Descrição:** Implementar no ambiente do cliente um botão persistente/visível para solicitar atendimento de funcionário com justificativa.
- **Critérios de Aceite:**
  - [ ] Botão "Chamar Funcionário" visível em todas as telas da área do cliente.
  - [ ] Ao clicar, abre modal solicitando preenchimento do campo de justificativa (ex: "Mesa precisa de água", "Erro no pedido").
  - [ ] Salva o chamado no `localStorage` vinculado à mesa com status "Pendente" e horário da criação.

#### [TSK-12] Dashboard de Chamados, Notificação Sonora e Resolução
- **Prioridade:** Alta / Média
- **Mapeamento:** RF-28, RF-29, RF-30, RF-31, RN-06, Limitações Conhecidas
- **Descrição:** Desenvolver o painel de chamados pendentes para Atendentes e Gerentes com emissão de alerta sonoro e opção de atendimento.
- **Critérios de Aceite:**
  - [ ] Dashboard de chamados listando solicitações pendentes com horário, identificação da mesa e justificativa.
  - [ ] Botão destacado "Ativar Notificações Sonoras" no topo para liberar permissão de áudio no navegador.
  - [ ] Emissão de aviso sonoro sempre que um novo chamado pendente for detectado/recebido.
  - [ ] Ação de "Marcar como Atendido", alterando o status e removendo da lista de solicitações pendentes.

---

### Épico 9: Módulo Faturamento e Métricas (Gerente)

#### [TSK-13] Dashboard de Faturamento, Métricas e Filtros por Período
- **Prioridade:** Alta / Média
- **Mapeamento:** RF-32, RF-33, RF-34, RF-35, RF-36, RN-04, RN-05, RN-08, RN-09
- **Descrição:** Criar painel gerencial de análise financeira do restaurante com métricas consolidadas e filtros temporais.
- **Critérios de Aceite:**
  - [ ] Exibição das métricas: Total Faturado, Quantidade de Pedidos Finalizados, Ticket Médio (`faturamento / qtd_pedidos_finalizados`) e Pratos mais vendidos.
  - [ ] Considera no cálculo apenas pedidos com status "Entregue" (finalizados) no período selecionado.
  - [ ] Pedidos com status "Cancelado" ou em andamento não entram no faturamento.
  - [ ] Filtro funcional por período: Dia, Semana, Mês Atual.
  - [ ] Bloqueio total de acesso para Clientes e Atendentes.

---

### Épico 10: Módulo Backup, Exportação e Importação

#### [TSK-14] Exportação e Importação de Dados em JSON (Gerente)
- **Prioridade:** Alta
- **Mapeamento:** RF-41, RF-42, RN-05
- **Descrição:** Implementar funcionalidade de backup completo do banco de dados local (`localStorage`) para arquivo JSON e restauração via upload.
- **Critérios de Aceite:**
  - [ ] Botão "Exportar Dados (JSON)" no painel do Gerente que realiza download de arquivo `.json` com todas as coleções (pedidos, estoque, contas, cardápio, chamados).
  - [ ] Funcionalidade de "Importar Dados (JSON)" aceitando arquivo válido, validando o esquema JSON e substituindo/restaurando o estado no `localStorage`.
  - [ ] Feedback visual claro de sucesso ou erro na validação do arquivo importado.

---

### Épico 11: Design System, UI/UX e Responsividade

#### [TSK-15] Aplicação das Diretrizes de UI/UX, Design System e Responsividade
- **Prioridade:** Alta
- **Mapeamento:** RNF-01, RNF-02, RNF-05, RNF-07, `agents.md` (Todas as seções)
- **Descrição:** Garantir a aplicação rigorosa do design system corporativo, minimalista e limpo em toda a aplicação front-end.
- **Critérios de Aceite:**
  - [ ] Paleta de cores aplicada conforme `agents.md`: Laranja (#E85D04), Vermelho (#D00000), Amarelo (#FFBA08), Marrom (#6F4E37), Creme (#FFF8F0), Grafite (#2B2D42), Verde (#2A9D8F).
  - [ ] Tipografia Google Fonts (Poppins / Roboto) respeitando hierarquia visual e tamanhos.
  - [ ] Espaçamento baseado na escala de 8px (tokens xs a 3xl).
  - [ ] Componentes padronizados (botões com border-radius 8px, inputs, cards com bordas sutis e sombras leves, badges de pilula).
  - [ ] Responsividade total para Smartphone (até 767px), Tablet (768px-1023px) e Desktop (1024px+).
  - [ ] Navegação inferior para dispositivos móveis e fixada no topo em desktops.

---

## 4. Matriz de Rastreabilidade de Requisitos

| Requisito | Tarefa(s) Associada(s) |
|-----------|------------------------|
| RF-01, RF-02, RF-03, RF-04 | TSK-02 |
| RF-05, RF-07, RF-08, RF-09 | TSK-03 |
| RF-06, RF-10 | TSK-04 |
| RF-11 | TSK-05 |
| RF-12, RF-14, RF-15, RF-16 | TSK-08 |
| RF-13, RF-21, RF-22, RF-23, RF-25 | TSK-07 |
| RF-17, RF-18 | TSK-09 |
| RF-19, RF-20 | TSK-10 |
| RF-24, RF-37, RF-38, RF-39, RF-40 | TSK-06 |
| RF-26, RF-27 | TSK-11 |
| RF-28, RF-29, RF-30, RF-31 | TSK-12 |
| RF-32, RF-33, RF-34, RF-35, RF-36 | TSK-13 |
| RF-41, RF-42 | TSK-14 |
| RNF-01 a RNF-07 | TSK-01, TSK-02, TSK-15 |
| RN-01 a RN-10 | TSK-03 a TSK-14 |

---

## 5. Próximos Passos

1. Iniciar o desenvolvimento respeitando a sequência de épicos (Infra/Store -> Landing Page -> Autenticação -> CRUDs Administrativos -> Pedidos/Carrinho -> Atendimento -> Faturamento/Backup).
2. Atualizar o status das tarefas na tabela de histórico conforme o progresso.
