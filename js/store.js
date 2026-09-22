// js/store.js - Data Store & LocalStorage + Supabase REST API Sync Management

import { fetchTable, insertRow, updateRow, deleteRow } from './api.js';

const STORAGE_KEY = 'restaurant_system_db_v1';

const INITIAL_SEED = {
  usuarios: [
    {
      id: 'usr_admin',
      tipo: 'funcionario',
      nome: 'Gerente Geral',
      login: 'gerente',
      senha: '123',
      perfil: 'gerente',
      ativo: true,
      criado_em: new Date().toISOString()
    },
    {
      id: 'usr_atendente1',
      tipo: 'funcionario',
      nome: 'Carlos Atendente',
      login: 'atendente',
      senha: '123',
      perfil: 'atendente',
      ativo: true,
      criado_em: new Date().toISOString()
    },
    {
      id: 'usr_mesa01',
      tipo: 'mesa',
      nome: 'Mesa 01',
      login: 'mesa01',
      senha: '123',
      perfil: null,
      ativo: true,
      criado_em: new Date().toISOString()
    },
    {
      id: 'usr_mesa05',
      tipo: 'mesa',
      nome: 'Mesa 05',
      login: 'mesa05',
      senha: '123',
      perfil: null,
      ativo: true,
      criado_em: new Date().toISOString()
    }
  ],
  ingredientes: [
    { id: 'ing_feijao', nome: 'Feijão Preto', unidade: 'kg', quantidade: 15.0 },
    { id: 'ing_arroz', nome: 'Arroz Branco', unidade: 'kg', quantidade: 20.0 },
    { id: 'ing_picanha', nome: 'Picanha Bovina', unidade: 'kg', quantidade: 8.0 },
    { id: 'ing_salmao', nome: 'Salmão Fresco', unidade: 'kg', quantidade: 5.0 },
    { id: 'ing_massa', nome: 'Massa Fettuccine', unidade: 'kg', quantidade: 10.0 },
    { id: 'ing_cogumelos', nome: 'Cogumelos Paris', unidade: 'kg', quantidade: 2.5 }
  ],
  pratos: [
    {
      id: 'prato_feijoada',
      nome: 'Feijoada Completa Premium',
      descricao: 'Acompanha arroz, couve refogada, farofa artesanal e fatias de laranja.',
      preco: 68.90,
      categoria: 'Pratos Principais',
      imagem: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      destaque: true,
      ativo: true,
      ingredientes: [
        { ingrediente_id: 'ing_feijao', quantidade: 0.3, unidade: 'kg' },
        { ingrediente_id: 'ing_arroz', quantidade: 0.2, unidade: 'kg' }
      ]
    },
    {
      id: 'prato_picanha',
      nome: 'Picanha Grelhada na Brasa',
      descricao: 'Corte nobre com mandioca frita, farofa de alho e molho chimichurri da casa.',
      preco: 89.90,
      categoria: 'Pratos Principais',
      imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      destaque: true,
      ativo: true,
      ingredientes: [
        { ingrediente_id: 'ing_picanha', quantidade: 0.4, unidade: 'kg' }
      ]
    },
    {
      id: 'prato_salmao',
      nome: 'Salmão ao Molho de Maracujá',
      descricao: 'Filé de salmão grelhado servido com purê de mandioquinha e aspargos.',
      preco: 78.50,
      categoria: 'Peixes & Frutos do Mar',
      imagem: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      destaque: true,
      ativo: true,
      ingredientes: [
        { ingrediente_id: 'ing_salmao', quantidade: 0.25, unidade: 'kg' }
      ]
    },
    {
      id: 'prato_massa',
      nome: 'Fettuccine com Cogumelos',
      descricao: 'Massa fresca ao molho cremoso de queijo parmesão e cogumelos salteados.',
      preco: 54.00,
      categoria: 'Massas',
      imagem: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=600&q=80',
      destaque: false,
      ativo: true,
      ingredientes: [
        { ingrediente_id: 'ing_massa', quantidade: 0.2, unidade: 'kg' },
        { ingrediente_id: 'ing_cogumelos', quantidade: 0.1, unidade: 'kg' }
      ]
    }
  ],
  pedidos: [
    {
      id: 'ped_101',
      mesa_id: 'usr_mesa05',
      nome_mesa: 'Mesa 05',
      itens: [
        { prato_id: 'prato_feijoada', nome_prato: 'Feijoada Completa Premium', quantidade: 2, preco_unitario: 68.90 }
      ],
      valor_total: 137.80,
      status: 'Entregue',
      criado_em: new Date(Date.now() - 3600000 * 2).toISOString(),
      atualizado_em: new Date(Date.now() - 3600000 * 1.5).toISOString()
    },
    {
      id: 'ped_102',
      mesa_id: 'usr_mesa05',
      nome_mesa: 'Mesa 05',
      itens: [
        { prato_id: 'prato_picanha', nome_prato: 'Picanha Grelhada na Brasa', quantidade: 1, preco_unitario: 89.90 }
      ],
      valor_total: 89.90,
      status: 'Em preparo',
      criado_em: new Date(Date.now() - 1800000).toISOString(),
      atualizado_em: new Date(Date.now() - 900000).toISOString()
    }
  ],
  chamados: [
    {
      id: 'chm_01',
      mesa_id: 'usr_mesa05',
      nome_mesa: 'Mesa 05',
      justificativa: 'Mesa precisa de copos extras e gelo.',
      status: 'Pendente',
      criado_em: new Date(Date.now() - 600000).toISOString(),
      atendido_em: null
    }
  ],
  pagamentos: []
};

export class Store {
  constructor(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
    this.storage = storage;
    this.listeners = [];
    this.data = this._loadData();
    this.syncFromRemote().catch(e => console.warn('Initial remote sync warning:', e.message));
    this.startAutoSync();
  }

  _loadData() {
    if (!this.storage) {
      return JSON.parse(JSON.stringify(INITIAL_SEED));
    }
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      this._saveData(INITIAL_SEED);
      return JSON.parse(JSON.stringify(INITIAL_SEED));
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.pagamentos) parsed.pagamentos = [];
      return parsed;
    } catch (e) {
      console.error('Error parsing localStorage database, resetting to seed', e);
      this._saveData(INITIAL_SEED);
      return JSON.parse(JSON.stringify(INITIAL_SEED));
    }
  }

  _saveData(data = this.data) {
    this.data = data;
    if (this.storage) {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }
    this._notifyListeners();
  }

  // --- Real-Time Listener System ---
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  _notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.data); } catch (e) { console.error('Listener error:', e); }
    });
  }

  // --- Auto Sync Polling for Multi-Device / PC Synchronization ---
  startAutoSync(intervalMs = 3000) {
    if (typeof setInterval !== 'undefined') {
      if (this._syncInterval) clearInterval(this._syncInterval);
      this._syncInterval = setInterval(() => {
        this.syncFromRemote().catch(() => {});
      }, intervalMs);
    }
  }

  stopAutoSync() {
    if (this._syncInterval) {
      clearInterval(this._syncInterval);
      this._syncInterval = null;
    }
  }

  // --- Remote Syncing with Supabase ---
  async syncFromRemote() {
    try {
      let changed = false;

      // Sync Pratos
      const remotePratos = await fetchTable('pratos');
      if (Array.isArray(remotePratos) && remotePratos.length > 0) {
        remotePratos.forEach(rp => {
          const mapped = {
            id: rp.id,
            nome: rp.nome,
            descricao: rp.descricao || '',
            preco: parseFloat(rp.preco) || 0,
            categoria: rp.categoria_id || 'Geral',
            imagem: rp.imagem_url || '',
            destaque: rp.destaque ?? false,
            ativo: rp.ativo ?? true,
            ingredientes: rp.ingredientes || []
          };
          const idx = this.data.pratos.findIndex(p => p.id === mapped.id);
          if (idx !== -1) {
            if (JSON.stringify(this.data.pratos[idx]) !== JSON.stringify({ ...this.data.pratos[idx], ...mapped })) {
              this.data.pratos[idx] = { ...this.data.pratos[idx], ...mapped };
              changed = true;
            }
          } else {
            this.data.pratos.push(mapped);
            changed = true;
          }
        });
      }

      // Sync Ingredientes
      const remoteIngredientes = await fetchTable('ingredientes');
      if (Array.isArray(remoteIngredientes) && remoteIngredientes.length > 0) {
        remoteIngredientes.forEach(ri => {
          const idx = this.data.ingredientes.findIndex(i => i.id === ri.id);
          if (idx !== -1) {
            this.data.ingredientes[idx] = { ...this.data.ingredientes[idx], ...ri };
            changed = true;
          } else {
            this.data.ingredientes.push(ri);
            changed = true;
          }
        });
      }

      // Sync Pedidos
      const remotePedidos = await fetchTable('pedidos');
      if (Array.isArray(remotePedidos) && remotePedidos.length > 0) {
        remotePedidos.forEach(rp => {
          const idx = this.data.pedidos.findIndex(p => p.id === rp.id);
          if (idx !== -1) {
            if (this.data.pedidos[idx].status !== rp.status || JSON.stringify(this.data.pedidos[idx]) !== JSON.stringify({ ...this.data.pedidos[idx], ...rp })) {
              this.data.pedidos[idx] = { ...this.data.pedidos[idx], ...rp };
              changed = true;
            }
          } else {
            this.data.pedidos.unshift(rp);
            changed = true;
          }
        });
      }

      // Sync Chamados
      const remoteChamados = await fetchTable('chamados');
      if (Array.isArray(remoteChamados) && remoteChamados.length > 0) {
        remoteChamados.forEach(rc => {
          const idx = this.data.chamados.findIndex(c => c.id === rc.id);
          if (idx !== -1) {
            if (this.data.chamados[idx].status !== rc.status) {
              this.data.chamados[idx] = { ...this.data.chamados[idx], ...rc };
              changed = true;
            }
          } else {
            this.data.chamados.unshift(rc);
            changed = true;
          }
        });
      }

      // Sync Pagamentos
      const remotePagamentos = await fetchTable('pagamentos');
      if (Array.isArray(remotePagamentos) && remotePagamentos.length > 0) {
        remotePagamentos.forEach(rpg => {
          const idx = this.data.pagamentos.findIndex(p => p.id === rpg.id);
          if (idx === -1) {
            this.data.pagamentos.unshift(rpg);
            changed = true;
          }
        });
      }

      if (changed) {
        this._saveData();
      }
      return true;
    } catch (err) {
      console.warn('Failed to sync from remote Supabase:', err.message);
      return false;
    }
  }

  // --- Users / Auth ---
  getUsers() {
    return this.data.usuarios || [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  authenticate(login, senha) {
    const user = this.getUsers().find(
      u => u.login.toLowerCase() === login.trim().toLowerCase() && u.senha === senha && u.ativo !== false
    );
    return user || null;
  }

  saveUser(user) {
    if (!user.id) {
      user.id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      user.criado_em = new Date().toISOString();
      this.data.usuarios.push(user);
    } else {
      const idx = this.data.usuarios.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        this.data.usuarios[idx] = { ...this.data.usuarios[idx], ...user };
      }
    }
    this._saveData();
    return user;
  }

  toggleUserActive(id) {
    const user = this.getUserById(id);
    if (user) {
      user.ativo = !user.ativo;
      this._saveData();
    }
    return user;
  }

  // --- Ingredients / Stock ---
  getIngredients() {
    return this.data.ingredientes || [];
  }

  getIngredientById(id) {
    return this.getIngredients().find(i => i.id === id);
  }

  saveIngredient(ing) {
    const isNew = !ing.id;
    if (isNew) {
      ing.id = 'ing_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      this.data.ingredientes.push(ing);
      insertRow('ingredientes', ing).catch(() => {});
    } else {
      const idx = this.data.ingredientes.findIndex(i => i.id === ing.id);
      if (idx !== -1) {
        this.data.ingredientes[idx] = { ...this.data.ingredientes[idx], ...ing };
        updateRow('ingredientes', 'id', ing.id, ing).catch(() => {});
      }
    }
    this._saveData();
    return ing;
  }

  updateStockQuantity(id, newQty) {
    const ing = this.getIngredientById(id);
    if (ing) {
      ing.quantidade = Math.max(0, parseFloat(newQty) || 0);
      this._saveData();
      updateRow('ingredientes', 'id', id, { quantidade: ing.quantidade }).catch(() => {});
    }
    return ing;
  }

  // --- Dishes / Menu & Availability ---
  getDishes() {
    return this.data.pratos || [];
  }

  getDishById(id) {
    return this.getDishes().find(p => p.id === id);
  }

  // RN-02: Disponibilidade calculada automaticamente por ingrediente
  getDishAvailability(dishId) {
    const dish = this.getDishById(dishId);
    if (!dish || dish.ativo === false) {
      return { available: false, maxQuantity: 0 };
    }
    if (!dish.ingredientes || dish.ingredientes.length === 0) {
      return { available: true, maxQuantity: 999 };
    }

    let maxQty = Infinity;
    for (const req of dish.ingredientes) {
      const ing = this.getIngredientById(req.ingrediente_id);
      if (!ing || ing.quantidade < req.quantidade) {
        return { available: false, maxQuantity: 0 };
      }
      const possible = Math.floor(ing.quantidade / req.quantidade);
      if (possible < maxQty) {
        maxQty = possible;
      }
    }

    return {
      available: maxQty > 0,
      maxQuantity: maxQty === Infinity ? 999 : maxQty
    };
  }

  saveDish(dish) {
    const isNew = !dish.id;
    if (isNew) {
      dish.id = 'prato_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      this.data.pratos.push(dish);
      insertRow('pratos', {
        id: dish.id,
        nome: dish.nome,
        descricao: dish.descricao,
        preco: dish.preco,
        destaque: dish.destaque,
        ativo: dish.ativo
      }).catch(() => {});
    } else {
      const idx = this.data.pratos.findIndex(p => p.id === dish.id);
      if (idx !== -1) {
        this.data.pratos[idx] = { ...this.data.pratos[idx], ...dish };
        updateRow('pratos', 'id', dish.id, {
          nome: dish.nome,
          descricao: dish.descricao,
          preco: dish.preco,
          destaque: dish.destaque,
          ativo: dish.ativo
        }).catch(() => {});
      }
    }
    this._saveData();
    return dish;
  }

  deleteDish(id) {
    this.data.pratos = this.data.pratos.filter(p => p.id !== id);
    this._saveData();
    deleteRow('pratos', 'id', id).catch(() => {});
  }

  // --- Orders ---
  getOrders() {
    return this.data.pedidos || [];
  }

  getOrderById(id) {
    return this.getOrders().find(p => p.id === id);
  }

  // RF-17 & RN-03: Criar pedido e abater ingrediente do estoque
  createOrder(mesaId, cartItems) {
    const mesaUser = this.getUserById(mesaId);
    if (!mesaUser) {
      throw new Error('Mesa não encontrada para realização do pedido.');
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('O carrinho está vazio.');
    }

    // Verificar estoque suficiente para todos os itens
    for (const item of cartItems) {
      const avail = this.getDishAvailability(item.prato_id);
      if (item.quantidade > avail.maxQuantity) {
        const dish = this.getDishById(item.prato_id);
        throw new Error(`Estoque insuficiente para o prato "${dish ? dish.nome : 'desconhecido'}". Máximo disponível: ${avail.maxQuantity}`);
      }
    }

    // Abater estoque de cada ingrediente
    for (const item of cartItems) {
      const dish = this.getDishById(item.prato_id);
      if (dish && dish.ingredientes) {
        for (const req of dish.ingredientes) {
          const ing = this.getIngredientById(req.ingrediente_id);
          if (ing) {
            ing.quantidade = Math.max(0, ing.quantidade - req.quantidade * item.quantidade);
            updateRow('ingredientes', 'id', ing.id, { quantidade: ing.quantidade }).catch(() => {});
          }
        }
      }
    }

    const valorTotal = cartItems.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0);

    const newOrder = {
      id: 'ped_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      mesa_id: mesaUser.id,
      nome_mesa: mesaUser.nome,
      itens: cartItems,
      valor_total: parseFloat(valorTotal.toFixed(2)),
      status: 'Recebido',
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    this.data.pedidos.unshift(newOrder);
    this._saveData();
    insertRow('pedidos', newOrder).catch(() => {});
    return newOrder;
  }

  // RN-04: Atualizar status e estornar estoque se "Cancelado"
  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const prevStatus = order.status;
    order.status = newStatus;
    order.atualizado_em = new Date().toISOString();

    // Se mudou para Cancelado e não estava cancelado antes, estorna estoque
    if (newStatus === 'Cancelado' && prevStatus !== 'Cancelado') {
      for (const item of order.itens) {
        const dish = this.getDishById(item.prato_id);
        if (dish && dish.ingredientes) {
          for (const req of dish.ingredientes) {
            const ing = this.getIngredientById(req.ingrediente_id);
            if (ing) {
              ing.quantidade = parseFloat((ing.quantidade + req.quantidade * item.quantidade).toFixed(3));
              updateRow('ingredientes', 'id', ing.id, { quantidade: ing.quantidade }).catch(() => {});
            }
          }
        }
      }
    }

    this._saveData();
    updateRow('pedidos', 'id', orderId, { status: newStatus, atualizado_em: order.atualizado_em }).catch(() => {});
    return order;
  }

  // --- Payments / Pagamentos da Mesa ---
  getPayments() {
    return this.data.pagamentos || [];
  }

  getTableUnpaidTotal(mesaId) {
    const tableOrders = this.getOrders().filter(
      p => p.mesa_id === mesaId && p.status !== 'Cancelado' && p.status !== 'Pago'
    );
    return parseFloat(tableOrders.reduce((sum, p) => sum + p.valor_total, 0).toFixed(2));
  }

  processPayment(mesaId, metodoPagamento, valor) {
    const mesaUser = this.getUserById(mesaId);
    if (!mesaUser) throw new Error('Mesa não encontrada.');

    const tableOrders = this.getOrders().filter(
      p => p.mesa_id === mesaId && p.status !== 'Cancelado' && p.status !== 'Pago'
    );

    if (tableOrders.length === 0) {
      throw new Error('Não há pedidos pendentes de pagamento para esta mesa.');
    }

    const totalDevido = tableOrders.reduce((sum, p) => sum + p.valor_total, 0);

    const newPayment = {
      id: 'pag_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      mesa_id: mesaUser.id,
      nome_mesa: mesaUser.nome,
      valor: parseFloat((valor || totalDevido).toFixed(2)),
      metodo: metodoPagamento || 'PIX',
      status: 'Aprovado',
      criado_em: new Date().toISOString()
    };

    // Marcar pedidos como Pago
    tableOrders.forEach(p => {
      p.status = 'Pago';
      p.atualizado_em = new Date().toISOString();
      updateRow('pedidos', 'id', p.id, { status: 'Pago', atualizado_em: p.atualizado_em }).catch(() => {});
    });

    this.data.pagamentos.unshift(newPayment);
    this._saveData();
    insertRow('pagamentos', newPayment).catch(() => {});
    return newPayment;
  }

  // --- Calls / Chamados ---
  getCalls() {
    return this.data.chamados || [];
  }

  getCallById(id) {
    return this.getCalls().find(c => c.id === id);
  }

  createCall(mesaId, justificativa) {
    const mesaUser = this.getUserById(mesaId);
    if (!mesaUser) {
      throw new Error('Mesa não encontrada.');
    }

    const newCall = {
      id: 'chm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      mesa_id: mesaUser.id,
      nome_mesa: mesaUser.nome,
      justificativa: justificativa ? justificativa.trim() : 'Atendimento solicitado',
      status: 'Pendente',
      criado_em: new Date().toISOString(),
      atendido_em: null
    };

    this.data.chamados.unshift(newCall);
    this._saveData();
    insertRow('chamados', newCall).catch(() => {});
    return newCall;
  }

  markCallAttended(callId) {
    const call = this.getCallById(callId);
    if (call) {
      call.status = 'Atendido';
      call.atendido_em = new Date().toISOString();
      this._saveData();
      updateRow('chamados', 'id', callId, { status: 'Atendido', atendido_em: call.atendido_em }).catch(() => {});
    }
    return call;
  }

  // --- Financial Analytics (RF-32, RF-33, RF-34, RN-08, RN-09) ---
  getFinancialMetrics(period = 'Este Mês') {
    const now = new Date();
    let startDate = new Date(0);

    if (period === 'Hoje') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === '7 Dias') {
      startDate = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    } else if (period === 'Este Mês') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // RN-08 & RN-04: apenas pedidos "Entregue" ou "Pago" dentro do período
    const validOrders = this.getOrders().filter(p => {
      const pDate = new Date(p.criado_em);
      return (p.status === 'Entregue' || p.status === 'Pago') && pDate >= startDate;
    });

    const totalFaturado = validOrders.reduce((sum, p) => sum + p.valor_total, 0);
    const qtdPedidos = validOrders.length;
    const ticketMedio = qtdPedidos > 0 ? totalFaturado / qtdPedidos : 0;

    // Pratos mais vendidos
    const dishSales = {};
    validOrders.forEach(p => {
      p.itens.forEach(item => {
        dishSales[item.nome_prato] = (dishSales[item.nome_prato] || 0) + item.quantidade;
      });
    });

    const topDishes = Object.entries(dishSales)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      period,
      totalFaturado: parseFloat(totalFaturado.toFixed(2)),
      qtdPedidos,
      ticketMedio: parseFloat(ticketMedio.toFixed(2)),
      topDishes
    };
  }

  // --- Backup / Export & Import (RF-41, RF-42) ---
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.usuarios || !parsed.pratos || !parsed.ingredientes) {
        throw new Error('Formato JSON inválido. Estruturas obrigatórias ausentes.');
      }
      this._saveData(parsed);
      return true;
    } catch (e) {
      throw new Error('Falha ao importar JSON: ' + e.message);
    }
  }
}
