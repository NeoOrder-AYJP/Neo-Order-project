# Relatório de Alterações e Planejamento Futuro (Changelog & Roadmap)

**Projeto:** Sistema de Gerenciamento de Pedidos de Restaurante (Neo-Order)
**Data de Atualização:** 24/09/2026
**Status:** Ativo

---

## 1. Visão Geral

Este documento é o registro consolidado e oficial de todas as alterações realizadas no projeto até a presente data, bem como o planejamento de melhorias, correções e novas funcionalidades futuras.

O objetivo é fornecer transparência, rastreabilidade e histórico do ciclo de vida de desenvolvimento do sistema Neo-Order, servindo como ponto central para desenvolvedores, stakeholders e auditores.

---

## 2. Histórico de Alterações Realizadas (Changelog)

Abaixo estão registradas todas as alterações e evoluções do projeto em ordem cronológica.

### [27/08/2026] — Criação da Especificação Inicial (v1.0)
- **Tipo:** Adicionado / Especificação
- **Autor:** Stakeholder / NeoOrder
- **Descrição:**
  - Elaboração e aprovação da especificação inicial (v1.0), contendo requisitos funcionais (RF-01 a RF-42), requisitos não-funcionais (RNF-01 a RNF-07), regras de negócio (RN-01 a RN-10), arquitetura do sistema e modelo de dados.
  - Definição do requisito de interface corporativa, limpa e minimalista, bem como diretrizes visuais e paleta de cores voltadas para gastronomia.

### [03/09/2026] — Refatoração da Documentação e Criação das Diretrizes de Design (v1.1)
- **Tipo:** Refatoração / Documentação
- **Autor:** Stakeholder / NeoOrder
- **Descrição:**
  - Separação da especificação principal em dois documentos: `spec.md` (requisitos e arquitetura) e `agents.md` (diretrizes completas de UI/UX).
  - Criação do documento `agents.md` estabelecendo o Design System corporativo: filosofia, paleta de cores (Laranja `#E85D04`, Vermelho `#D00000`, Creme `#FFF8F0`, Grafite `#2B2D42`, etc.), escala de espaçamento de 8px, tipografia (Poppins/Roboto), componentes, responsividade e regras de acessibilidade.
  - Criação inicial do `backlog.md` para rastreamento de tarefas e pendências do projeto.

### [04/09/2026] — Implementação da SPA Inicial, Ofuscação de Chaves de API e TASKS.md
- **Commit / Ref:** `33c0521`
- **Tipo:** Adicionado / Funcionalidade / Segurança
- **Autor:** google-labs-jules[bot] / NeoOrder-AYJP
- **Descrição:**
  - Implementação da primeira versão funcional da Single Page Application (SPA) do restaurante.
  - Criação da camada de armazenamento local (`localStorage`) e integração com API REST em `src/js/store.js` e `src/js/api.js`.
  - Ofuscação de chaves de API e URLs de serviços externos para evitar exposição direta em texto puro na base de código.
  - Criação das visões e componentes iniciais para Cliente, Atendente e Gerente (Cardápio, Carrinho, Chamados, Gestão de Estoque e Contas).
  - Adição do arquivo `TASKS.md` com detalhamento das tarefas de desenvolvimento.

### [15/09/2026] — Desdobramento da Spec v1.2 no Backlog.md
- **Commit / Ref:** `83f43b3`
- **Tipo:** Documentação / Planejamento
- **Autor:** google-labs-jules[bot] / NeoOrder-AYJP
- **Descrição:**
  - Atualização da especificação técnica para a v1.2 em `spec.md`.
  - Mapeamento detalhado e estruturação da spec v1.2 em épicos e tarefas com critérios de aceite no `backlog.md` (TSK-01 a TSK-15), cobrindo do login ao backup JSON.

### [15/09/2026] — Segunda Iteração da SPA com Integração Supabase REST API
- **Commit / Ref:** `67ace16`
- **Tipo:** Adicionado / Refatoração
- **Autor:** google-labs-jules[bot] / NeoOrder-AYJP
- **Descrição:**
  - Reestruturação dos módulos front-end na pasta `src/` com router centralizado (`router.js`), modais de autenticação (`authModals.js`) e visões dedicadas (`landing.js`, `customer.js`, `attendant.js`, `manager.js`).
  - Integração aprimorada com API REST do Supabase para persistência assíncrona.
  - Inclusão dos layouts de referência e protótipos em HTML/CSS na pasta `themes/`.

### [15/09/2026] — Remoção de Diretório Obsoleto
- **Commit / Ref:** `ae5d56f`
- **Tipo:** Removido / Limpeza
- **Autor:** NeoOrder-AYJP
- **Descrição:**
  - Remoção do diretório legado `themes/abc` para manter o repositório limpo e organizado.

### [22/09/2026] — Sincronização em Tempo Real de Banco de Dados, Pagamentos e Suporte Multi-Dispositivo
- **Commit / Ref:** `e5967ab`
- **Tipo:** Adicionado / Funcionalidade / Arquitetura
- **Autor:** google-labs-jules[bot] / NeoOrder-AYJP
- **Descrição:**
  - Habilitação da sincronização em tempo real entre múltiplos dispositivos via Supabase REST API para todos os módulos do sistema (Pedidos, Chamados, Estoque, Contas e Cardápio).
  - Implementação do fluxo de pagamentos e liquidação de contas.
  - Reorganização e consolidação da estrutura de arquivos front-end para as pastas raiz `js/` (`api.js`, `app.js`, `store.js`, `views/`) e `css/style.css`.
  - Inclusão e expansão da suíte de testes unitários em `tests/store.test.js`.

---

## 3. Estrutura Atual do Repositório

O repositório está organizado da seguinte forma:

```
Neo-Order-project/
├── css/
│   └── style.css            # Estilos CSS customizados (Design System, temas e responsividade)
├── js/
│   ├── api.js               # Comunicação de baixo nível e ofuscação com a API Supabase
│   ├── app.js               # Inicialização da SPA, roteamento e gerenciamento de estado global
│   ├── store.js             # Gerenciamento de estado, armazenamento local e sync em tempo real
│   └── views/
│       ├── client.js        # Interface do cliente (Cardápio, Carrinho, Pedidos, Chamados, Pagamento)
│       ├── landing.js       # Carrossel/Slides e visualização pública do cardápio
│       ├── manager.js       # Painéis gerenciais (Pratos, Estoque, Contas, Faturamento, Backup)
│       └── staff.js         # Painel da equipe/atendentes (Pedidos ativos e Chamados pendentes)
├── tests/
│   └── store.test.js        # Testes unitários do store e regras de negócio
├── themes/                  # Protótipos de telas e guia visual do sistema
├── agents.md                # Diretrizes de design, cores, tipografia e UI/UX corporativo
├── backlog.md               # Detalhamento de épicos, tarefas (TSK-01 a TSK-15) e status
├── spec.md                  # Especificação técnica completa do sistema (v1.2)
├── RELATORIO_DE_ALTERACOES.md # Este documento (Histórico de alterações e roadmap)
└── README.md                # Documentação geral do repositório
```

---

## 4. Planejamento de Alterações e Funcionalidades Futuras (Roadmap)

As tarefas a seguir foram mapeadas e priorizadas para as próximas versões/sprints do sistema:

### 🔴 Alta Prioridade (Curto Prazo)

1. **[PEND-01] Refinamento dos Alertas Sonoros e Notificações Push**
   - **Mapeamento:** RF-29, RF-30, TSK-12
   - **Descrição:** Melhorar a resiliência da notificação sonora no painel do atendente quando novos chamados ou novos pedidos chegam, tratando bloqueios severos de autoplay de áudio nos navegadores móveis e adicionando alerta visual persistente (banner/toaster).

2. **[PEND-02] Testes Automatizados End-to-End (E2E) com Playwright**
   - **Mapeamento:** Qualidade & CI/CD
   - **Descrição:** Criar uma suíte de testes end-to-end simulando a jornada completa: cliente realizando pedido na mesa -> atendente recebendo e atualizando status -> gerente verificando baixa de estoque e faturamento.

3. **[PEND-03] Auditoria de Segurança e Validação de Sessão**
   - **Mapeamento:** RNF-04, Segurança
   - **Descrição:** Garantir que sessões expiradas ou inativas de contas de funcionários sejam encerradas automaticamente e reforçar a proteção contra injeção de dados no formulário de chamados e cadastro de pratos.

### 🟡 Média Prioridade (Médio Prazo)

4. **[PEND-04] Expansão do Módulo de Faturamento e Relatórios Exportáveis**
   - **Mapeamento:** RF-33, RF-34, TSK-13
   - **Descrição:** Adicionar gráficos interativos (ex: vendas por horário/dia da semana) e funcionalidade para exportar relatórios de faturamento em formato CSV e PDF.

5. **[PEND-05] Impressão Automática de Comandas de Cozinha**
   - **Mapeamento:** Operação de Restaurante
   - **Descrição:** Permitir a integração com impressoras térmicas/comandas de cozinha via navegador (Web Printing API) para impressão direta de novos pedidos recebidos.

6. **[PEND-06] Modo Off-line (PWA / Service Workers)**
   - **Mapeamento:** Resiliência / RNF-04
   - **Descrição:** Implementar um Service Worker para cache local de assets (HTML, CSS, JS, imagens), permitindo que o sistema continue funcionando em mesas mesmo durante instabilidades temporárias de rede.

### 🟢 Baixa Prioridade / Evoluções Futuras (Longo Prazo)

7. **[PEND-07] Suporte a Múltiplos Idiomas (i18n)**
   - **Descrição:** Suporte para inglês e espanhol no cardápio do cliente para atendimento a turistas.

8. **[PEND-08] Avaliação de Pratos e Feedback do Cliente**
   - **Descrição:** Permitir que clientes deixem avaliações de 1 a 5 estrelas e comentários sobre os pratos após o encerramento da conta.

---

## 5. Instruções para Registro de Novas Alterações

Sempre que uma nova alteração, funcionalidade ou correção for aplicada ao código-fonte, o responsável deve atualizar este documento seguindo as regras abaixo:

1. Adicionar uma nova entrada na seção **2. Histórico de Alterações Realizadas (Changelog)** informando:
   - **Data:** DD/MM/AAAA
   - **Commit / Ref:** Hash do commit ou identificador da branch
   - **Tipo:** (Adicionado / Alterado / Correção / Removido / Refatoração)
   - **Autor:** Nome / Identificador do responsável
   - **Descrição:** Resumo objetivo do que foi alterado e o impacto no sistema
2. Caso a alteração conclua um item do Roadmap, mover a pendência da seção **4. Planejamento de Alterações** para o **Histórico**.
3. Manter o idioma em português com tom técnico, claro e preciso.

---

*Documento mantido pela equipe de desenvolvimento Neo-Order.*
