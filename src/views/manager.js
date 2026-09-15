import { store } from '../store.js';
import { isManager } from '../auth.js';

let activeTab = 'faturamento'; // Tabs: faturamento, pratos, estoque, mesas, funcionarios, backup

export function renderManagerView(container) {
  if (!isManager()) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto my-12 p-8 bg-surface-container-low rounded-2xl border border-surface-variant text-center flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-5xl text-error">admin_panel_settings</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Acesso Exclusivo à Gerência</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant">Você precisa se autenticar como Gerente para acessar esta área.</p>
        <button onclick="window.openStaffLoginModal()" class="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold hover:bg-primary-container transition-all">
          Login de Gerente
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="w-full px-margin-mobile lg:px-margin-desktop py-space-lg max-w-7xl mx-auto flex flex-col gap-space-lg">
      <!-- Manager Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40">
        <div class="flex items-center gap-space-md">
          <div class="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl">
            <span class="material-symbols-outlined">analytics</span>
          </div>
          <div>
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Painel do Gerente Operacional</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Gestão unificada de cardápio, estoque, contas e faturamento.</p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap- space-xs bg-surface-container-low p-1.5 rounded-2xl border border-surface-variant/40 overflow-x-auto">
        <button class="tab-btn px-space-md py-space-xs rounded-xl font-label-md font-semibold transition-all ${activeTab === 'faturamento' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}" data-tab="faturamento">Faturamento &amp; Métricas</button>
        <button class="tab-btn px-space-md py-space-xs rounded-xl font-label-md font-semibold transition-all ${activeTab === 'pratos' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}" data-tab="pratos">Cardápio (Pratos)</button>
        <button class="tab-btn px-space-md py-space-xs rounded-xl font-label-md font-semibold transition-all ${activeTab === 'estoque' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}" data-tab="estoque">Estoque (Ingredientes)</button>
        <button class="tab-btn px-space-md py-space-xs rounded-xl font-label-md font-semibold transition-all ${activeTab === 'mesas' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}" data-tab="mesas">Contas de Mesas</button>
        <button class="tab-btn px-space-md py-space-xs rounded-xl font-label-md font-semibold transition-all ${activeTab === 'funcionarios' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}" data-tab="funcionarios">Funcionários</button>
        <button class="tab-btn px-space-md py-space-xs rounded-xl font-label-md font-semibold transition-all ${activeTab === 'backup' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:text-on-surface'}" data-tab="backup">Backup JSON</button>
      </div>

      <!-- Tab Content Area -->
      <div id="manager-tab-content"></div>
    </div>
  `;

  const contentArea = container.querySelector('#manager-tab-content');

  // Render specific tab content
  if (activeTab === 'faturamento') renderFaturamentoTab(contentArea);
  else if (activeTab === 'pratos') renderPratosTab(contentArea);
  else if (activeTab === 'estoque') renderEstoqueTab(contentArea);
  else if (activeTab === 'mesas') renderMesasTab(contentArea);
  else if (activeTab === 'funcionarios') renderFuncionariosTab(contentArea);
  else if (activeTab === 'backup') renderBackupTab(contentArea);

  // Tab button click events
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = e.currentTarget.getAttribute('data-tab');
      renderManagerView(container);
    });
  });
}

// 1. Faturamento Tab
function renderFaturamentoTab(container) {
  const pedidos = store.state.pedidos;
  // Exclude Canceled orders for billing calculations (RF-35)
  const validPedidos = pedidos.filter(p => p.status !== 'Cancelado');
  const totalFaturado = validPedidos.reduce((sum, p) => sum + p.valor_total, 0);
  const ticketMedio = validPedidos.length > 0 ? (totalFaturado / validPedidos.length) : 0;

  // Dish Sales Ranking
  const salesMap = {};
  validPedidos.forEach(p => {
    p.itens.forEach(item => {
      salesMap[item.nome] = (salesMap[item.nome] || 0) + item.quantidade;
    });
  });
  const topDishes = Object.entries(salesMap).sort((a, b) => b[1] - a[1]);

  container.innerHTML = `
    <div class="flex flex-col gap-space-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-1">
          <span class="font-label-md text-on-surface-variant font-medium">Total Faturado</span>
          <span class="font-display-lg text-display-lg font-bold text-primary">R$ ${totalFaturado.toFixed(2).replace('.', ',')}</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Exclui pedidos cancelados</span>
        </div>
        <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-1">
          <span class="font-label-md text-on-surface-variant font-medium">Total de Pedidos Validos</span>
          <span class="font-display-lg text-display-lg font-bold text-on-surface">${validPedidos.length}</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Pedidos ativos / entregues</span>
        </div>
        <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-1">
          <span class="font-label-md text-on-surface-variant font-medium">Ticket Medio</span>
          <span class="font-display-lg text-display-lg font-bold text-emerald-700">R$ ${ticketMedio.toFixed(2).replace('.', ',')}</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant">Valor medio por pedido</span>
        </div>
      </div>

      <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Pratos Mais Vendidos</h2>
        ${topDishes.length === 0 ? `
          <p class="font-body-md text-on-surface-variant">Nenhum dado de vendas ainda.</p>
        ` : `
          <div class="flex flex-col gap-space-xs">
            ${topDishes.map(([nome, qty], idx) => `
              <div class="flex items-center justify-between p-space-xs bg-surface-container-low rounded-xl border border-surface-variant/30">
                <div class="flex items-center gap-space-xs">
                  <span class="font-bold text-primary w-6">${idx + 1}.</span>
                  <span class="font-label-md font-semibold text-on-surface">${nome}</span>
                </div>
                <span class="font-label-md font-bold bg-primary-container/20 text-primary px-3 py-1 rounded-full">${qty} unidades</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// 2. Pratos Tab (CRUD)
function renderPratosTab(container) {
  const pratos = store.state.pratos;
  const ingredientes = store.state.ingredientes;

  container.innerHTML = `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Cardapio de Pratos</h2>
        <button id="add-prato-btn" class="px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all">
          + Novo Prato
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        ${pratos.map(p => `
          <div class="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-variant/40 shadow-sm flex flex-col justify-between gap-space-sm">
            <div class="flex flex-col gap-space-xs">
              <div class="flex items-center justify-between">
                <span class="font-title-md font-bold text-on-surface">${p.nome} ${p.emoji || ''}</span>
                ${p.destaque ? `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Destaque</span>` : ''}
              </div>
              <p class="font-body-sm text-on-surface-variant line-clamp-2">${p.descricao}</p>
              <span class="font-title-md font-bold text-primary">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="flex items-center justify-end gap-2 pt-space-xs border-t border-surface-variant/30">
              <button class="edit-prato-btn px-3 py-1 rounded-lg border text-xs font-semibold hover:bg-surface-container-high transition-all" data-id="${p.id}">Editar</button>
              <button class="delete-prato-btn px-3 py-1 rounded-lg bg-red-800 text-white text-xs font-semibold hover:bg-red-900 transition-all" data-id="${p.id}">Excluir</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Dish Modal -->
    <div id="dish-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden">
      <div class="bg-surface-container-lowest p-space-lg rounded-2xl max-w-lg w-full shadow-2xl border border-surface-variant/40 mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-space-md border-b border-surface-variant/30">
          <h2 id="dish-modal-title" class="font-headline-sm text-headline-sm text-on-surface">Cadastrar Prato</h2>
          <button id="close-dish-modal" class="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="dish-form" class="flex flex-col gap-space-md pt-space-md">
          <input type="hidden" id="dish-id">
          <div class="flex flex-col gap-1">
            <label class="font-label-md font-semibold text-on-surface">Nome do Prato</label>
            <input type="text" id="dish-nome" required class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label-md font-semibold text-on-surface">Descricao</label>
            <textarea id="dish-descricao" required rows="2" class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-space-sm">
            <div class="flex flex-col gap-1">
              <label class="font-label-md font-semibold text-on-surface">Preco (R$)</label>
              <input type="number" step="0.01" id="dish-preco" required class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-label-md font-semibold text-on-surface">Emoji</label>
              <input type="text" id="dish-emoji" placeholder="Ex: 🍝" class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label-md font-semibold text-on-surface">URL da Imagem</label>
            <input type="url" id="dish-imagem" class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="dish-destaque" class="w-4 h-4 text-primary rounded">
            <label for="dish-destaque" class="font-label-md font-semibold text-on-surface">Destaque na Landing Page</label>
          </div>
          <button type="submit" class="w-full py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md hover:bg-primary-container transition-all">
            Salvar Prato
          </button>
        </form>
      </div>
    </div>
  `;

  // Dish Modal Events
  const dishModal = container.querySelector('#dish-modal');
  container.querySelector('#add-prato-btn')?.addEventListener('click', () => {
    container.querySelector('#dish-modal-title').textContent = 'Cadastrar Prato';
    container.querySelector('#dish-id').value = '';
    container.querySelector('#dish-form').reset();
    dishModal.classList.remove('hidden');
  });
  container.querySelector('#close-dish-modal')?.addEventListener('click', () => {
    dishModal.classList.add('hidden');
  });

  container.querySelectorAll('.edit-prato-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const p = pratos.find(item => item.id === id);
      if (p) {
        container.querySelector('#dish-modal-title').textContent = 'Editar Prato';
        container.querySelector('#dish-id').value = p.id;
        container.querySelector('#dish-nome').value = p.nome;
        container.querySelector('#dish-descricao').value = p.descricao;
        container.querySelector('#dish-preco').value = p.preco;
        container.querySelector('#dish-emoji').value = p.emoji || '';
        container.querySelector('#dish-imagem').value = p.imagem_url || '';
        container.querySelector('#dish-destaque').checked = !!p.destaque;
        dishModal.classList.remove('hidden');
      }
    });
  });

  container.querySelectorAll('.delete-prato-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este prato?')) {
        store.deletePrato(id);
        window.showToast?.('Prato removido!', 'success');
        renderPratosTab(container);
      }
    });
  });

  container.querySelector('#dish-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = container.querySelector('#dish-id').value;
    const pratoData = {
      id: id || undefined,
      nome: container.querySelector('#dish-nome').value.trim(),
      descricao: container.querySelector('#dish-descricao').value.trim(),
      preco: parseFloat(container.querySelector('#dish-preco').value),
      emoji: container.querySelector('#dish-emoji').value.trim(),
      imagem_url: container.querySelector('#dish-imagem').value.trim(),
      destaque: container.querySelector('#dish-destaque').checked
    };
    store.savePrato(pratoData);
    dishModal.classList.add('hidden');
    window.showToast?.('Prato salvo com sucesso!', 'success');
    renderPratosTab(container);
  });
}

// 3. Estoque Tab (CRUD)
function renderEstoqueTab(container) {
  const ingredientes = store.state.ingredientes;

  container.innerHTML = `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Controle de Estoque</h2>
        <button id="add-ing-btn" class="px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all">
          + Novo Ingrediente
        </button>
      </div>

      <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant/40 shadow-sm overflow-hidden">
        <table class="w-full text-left font-body-md border-collapse">
          <thead>
            <tr class="bg-surface-container-low text-on-surface font-semibold border-b border-surface-variant/30">
              <th class="p-space-sm">Ingrediente</th>
              <th class="p-space-sm">Quantidade Atual</th>
              <th class="p-space-sm">Unidade</th>
              <th class="p-space-sm text-right">Acoes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-variant/20">
            ${ingredientes.map(ing => `
              <tr class="hover:bg-surface-container-low/50 transition-colors">
                <td class="p-space-sm font-semibold text-on-surface">${ing.nome}</td>
                <td class="p-space-sm">
                  <span class="font-bold ${ing.quantidade < 2.0 ? 'text-error font-extrabold' : 'text-on-surface'}">
                    ${ing.quantidade.toFixed(2)}
                  </span>
                </td>
                <td class="p-space-sm text-on-surface-variant">${ing.unidade}</td>
                <td class="p-space-sm text-right">
                  <button class="edit-ing-btn px-3 py-1 rounded-lg border text-xs font-semibold hover:bg-surface-container-high transition-all" data-id="${ing.id}">Ajustar Estoque</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Ingrediente Modal -->
    <div id="ing-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden">
      <div class="bg-surface-container-lowest p-space-lg rounded-2xl max-w-md w-full shadow-2xl border border-surface-variant/40 mx-4">
        <div class="flex items-center justify-between pb-space-md border-b border-surface-variant/30">
          <h2 id="ing-modal-title" class="font-headline-sm text-headline-sm text-on-surface">Novo Ingrediente</h2>
          <button id="close-ing-modal" class="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form id="ing-form" class="flex flex-col gap-space-md pt-space-md">
          <input type="hidden" id="ing-id">
          <div class="flex flex-col gap-1">
            <label class="font-label-md font-semibold text-on-surface">Nome do Ingrediente</label>
            <input type="text" id="ing-nome" required class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
          </div>
          <div class="grid grid-cols-2 gap-space-sm">
            <div class="flex flex-col gap-1">
              <label class="font-label-md font-semibold text-on-surface">Quantidade</label>
              <input type="number" step="0.01" id="ing-qtd" required class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-label-md font-semibold text-on-surface">Unidade</label>
              <input type="text" id="ing-unidade" required placeholder="Ex: kg, L, un" class="px-space-md py-space-xs rounded-xl bg-surface-container-low border border-outline-variant/60 font-body-md text-on-surface">
            </div>
          </div>
          <button type="submit" class="w-full py-space-sm rounded-xl bg-primary text-on-primary font-label-lg font-semibold shadow-md hover:bg-primary-container transition-all">
            Salvar Ingrediente
          </button>
        </form>
      </div>
    </div>
  `;

  const ingModal = container.querySelector('#ing-modal');
  container.querySelector('#add-ing-btn')?.addEventListener('click', () => {
    container.querySelector('#ing-modal-title').textContent = 'Novo Ingrediente';
    container.querySelector('#ing-id').value = '';
    container.querySelector('#ing-form').reset();
    ingModal.classList.remove('hidden');
  });
  container.querySelector('#close-ing-modal')?.addEventListener('click', () => ingModal.classList.add('hidden'));

  container.querySelectorAll('.edit-ing-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const ing = ingredientes.find(i => i.id === id);
      if (ing) {
        container.querySelector('#ing-modal-title').textContent = 'Ajustar Ingrediente';
        container.querySelector('#ing-id').value = ing.id;
        container.querySelector('#ing-nome').value = ing.nome;
        container.querySelector('#ing-qtd').value = ing.quantidade;
        container.querySelector('#ing-unidade').value = ing.unidade;
        ingModal.classList.remove('hidden');
      }
    });
  });

  container.querySelector('#ing-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = container.querySelector('#ing-id').value;
    const ingData = {
      id: id || undefined,
      nome: container.querySelector('#ing-nome').value.trim(),
      quantidade: parseFloat(container.querySelector('#ing-qtd').value),
      unidade: container.querySelector('#ing-unidade').value.trim()
    };
    store.saveIngrediente(ingData);
    ingModal.classList.add('hidden');
    window.showToast?.('Ingrediente salvo!', 'success');
    renderEstoqueTab(container);
  });
}

// 4. Mesas Tab (CRUD)
function renderMesasTab(container) {
  const mesas = store.state.mesas;

  container.innerHTML = `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Contas de Mesas</h2>
        <button id="add-mesa-btn" class="px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all">
          + Criar Conta de Mesa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        ${mesas.map(m => `
          <div class="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-variant/40 shadow-sm flex flex-col justify-between gap-2">
            <div class="flex items-center justify-between">
              <span class="font-title-md font-bold text-on-surface">${m.nome}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold ${m.ativo ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                ${m.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <div class="font-body-sm text-on-surface-variant">
              <span>Login: <strong>${m.login}</strong></span> •
              <span>Senha: <strong>${m.senha}</strong></span>
            </div>
            <div class="flex items-center justify-end gap-2 pt-space-xs border-t border-surface-variant/30">
              <button class="toggle-mesa-btn px-3 py-1 rounded-lg border text-xs font-semibold hover:bg-surface-container-high transition-all" data-id="${m.id}">
                ${m.ativo ? 'Inativar' : 'Ativar'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.toggle-mesa-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const m = mesas.find(item => item.id === id);
      if (m) {
        store.saveMesa({ id: m.id, ativo: !m.ativo });
        window.showToast?.('Status da mesa alterado.', 'success');
        renderMesasTab(container);
      }
    });
  });
}

// 5. Funcionarios Tab (CRUD)
function renderFuncionariosTab(container) {
  const funcs = store.state.funcionarios;

  container.innerHTML = `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Contas de Funcionarios</h2>
        <button id="add-func-btn" class="px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all">
          + Cadastrar Funcionario
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        ${funcs.map(f => `
          <div class="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-variant/40 shadow-sm flex flex-col justify-between gap-2">
            <div class="flex items-center justify-between">
              <span class="font-title-md font-bold text-on-surface">${f.nome}</span>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-primary-container/20 text-primary">
                ${f.perfil}
              </span>
            </div>
            <div class="font-body-sm text-on-surface-variant">
              <span>Usuario: <strong>${f.login}</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 6. Backup Tab (JSON Export / Import)
function renderBackupTab(container) {
  container.innerHTML = `
    <div class="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-surface-variant/40 flex flex-col gap-space-md max-w-2xl">
      <h2 class="font-headline-sm text-headline-sm text-on-surface">Exportacao e Importacao de Dados (JSON)</h2>
      <p class="font-body-md text-on-surface-variant">Exporte os dados completos do sistema para backup ou importe um arquivo prévio.</p>

      <div class="flex items-center gap-space-md pt-space-xs">
        <button id="export-json-btn" class="px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all flex items-center gap-2">
          <span class="material-symbols-outlined">download</span> Exportar Dados
        </button>
        <label class="px-space-md py-space-sm rounded-xl border border-outline text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-all cursor-pointer flex items-center gap-2">
          <span class="material-symbols-outlined">upload</span> Importar Arquivo JSON
          <input type="file" id="import-json-input" accept=".json" class="hidden">
        </label>
      </div>
    </div>
  `;

  container.querySelector('#export-json-btn')?.addEventListener('click', () => {
    const jsonStr = store.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neo_order_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    window.showToast?.('Backup baixado com sucesso!', 'success');
  });

  container.querySelector('#import-json-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const ok = store.importJSON(evt.target.result);
      if (ok) {
        window.showToast?.('Dados restaurados com sucesso!', 'success');
        renderManagerView(container);
      } else {
        window.showToast?.('Erro ao importar JSON. Verifique a estrutura.', 'error');
      }
    };
    reader.readAsText(file);
  });
}
