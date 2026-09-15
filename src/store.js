import { api } from './api.js';

const STORAGE_KEYS = {
  PRATOS: 'neo_order_pratos',
  INGREDIENTES: 'neo_order_ingredientes',
  PEDIDOS: 'neo_order_pedidos',
  CHAMADOS: 'neo_order_chamados',
  MESAS: 'neo_order_mesas',
  FUNCIONARIOS: 'neo_order_funcionarios',
  CATEGORIAS: 'neo_order_categorias'
};

// Initial default seed data
const DEFAULT_CATEGORIES = [
  { id: '08150b4b-782f-4097-903a-8c933dc2167d', nome: 'Pratos', ativo: true }
];

const DEFAULT_INGREDIENTS = [
  { id: 'ing-1', nome: 'Feijão Preto', unidade: 'kg', quantidade: 25.0 },
  { id: 'ing-2', nome: 'Arroz Jasmine', unidade: 'kg', quantidade: 30.0 },
  { id: 'ing-3', nome: 'Costelinha de Porco', unidade: 'kg', quantidade: 12.0 },
  { id: 'ing-4', nome: 'Couve Fresca', unidade: 'kg', quantidade: 5.0 },
  { id: 'ing-5', nome: 'Massa de Lasanha', unidade: 'kg', quantidade: 10.0 },
  { id: 'ing-6', nome: 'Carne Moída', unidade: 'kg', quantidade: 15.0 },
  { id: 'ing-7', nome: 'Massa de Pizza', unidade: 'kg', quantidade: 20.0 },
  { id: 'ing-8', nome: 'Mussarela', unidade: 'kg', quantidade: 10.0 },
  { id: 'ing-9', nome: 'Mandioca', unidade: 'kg', quantidade: 0.5 }, // low stock test
  { id: 'ing-10', nome: 'Carne Seca', unidade: 'kg', quantidade: 10.0 }
];

const DEFAULT_DISHES = [
  {
    id: '4c7f16fc-ba66-47f1-93e8-7b2c1751ac8f',
    categoria_id: '08150b4b-782f-4097-903a-8c933dc2167d',
    nome: 'Feijoada Completa',
    descricao: 'Cortes nobres selecionados, paio defumado artesanalmente e costelinha tenra. Acompanha arroz e couve.',
    preco: 58.90,
    emoji: '🍲',
    imagem_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
    destaque: true,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-1', quantidade: 0.3, unidade: 'kg' },
      { ingrediente_id: 'ing-2', quantidade: 0.2, unidade: 'kg' },
      { ingrediente_id: 'ing-3', quantidade: 0.25, unidade: 'kg' },
      { ingrediente_id: 'ing-4', quantidade: 0.1, unidade: 'kg' }
    ]
  },
  {
    id: '11612a0a-a536-4ca8-ab74-5891317208bf',
    categoria_id: '08150b4b-782f-4097-903a-8c933dc2167d',
    nome: 'Lasanha à Bolonhesa',
    descricao: 'Lasanha tradicional artesanal com molho bolonhesa encorpado e bastante queijo derretido.',
    preco: 42.90,
    emoji: '🍝',
    imagem_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    destaque: true,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-5', quantidade: 0.25, unidade: 'kg' },
      { ingrediente_id: 'ing-6', quantidade: 0.2, unidade: 'kg' },
      { ingrediente_id: 'ing-8', quantidade: 0.15, unidade: 'kg' }
    ]
  },
  {
    id: 'a0de4780-e47d-452f-bf3d-343644217615',
    categoria_id: '08150b4b-782f-4097-903a-8c933dc2167d',
    nome: 'Pizza Margherita',
    descricao: 'Pizza crocante com molho de tomate pelati fresco, mussarela especial e manjericão fresco.',
    preco: 39.90,
    emoji: '🍕',
    imagem_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    destaque: true,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-7', quantidade: 0.3, unidade: 'kg' },
      { ingrediente_id: 'ing-8', quantidade: 0.2, unidade: 'kg' }
    ]
  },
  {
    id: 'e2be6797-b41a-4efd-919e-304f35a1b4dd',
    categoria_id: '08150b4b-782f-4097-903a-8c933dc2167d',
    nome: 'Escondidinho de Carne Seca',
    descricao: 'Purê cremoso de mandioca gratinado com recheio abundante de carne seca desfiada.',
    preco: 32.90,
    emoji: '🥘',
    imagem_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    destaque: false,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-9', quantidade: 0.4, unidade: 'kg' },
      { ingrediente_id: 'ing-10', quantidade: 0.2, unidade: 'kg' }
    ]
  }
];

const DEFAULT_MESAS = [
  { id: 'mesa-01', nome: 'Mesa 01', login: 'mesa01', senha: '123', ativo: true },
  { id: 'mesa-02', nome: 'Mesa 02', login: 'mesa02', senha: '123', ativo: true },
  { id: 'mesa-05', nome: 'Mesa 05', login: 'mesa05', senha: '123', ativo: true }
];

const DEFAULT_FUNCIONARIOS = [
  { id: 'func-01', nome: 'Carlos Silva', login: 'atendente', senha: '123', perfil: 'Atendente', ativo: true },
  { id: 'func-02', nome: 'Mariana Costa', login: 'gerente', senha: '123', perfil: 'Gerente', ativo: true }
];

class Store {
  constructor() {
    this.listeners = [];
    this.state = {
      pratos: [],
      ingredientes: [],
      pedidos: [],
      chamados: [],
      mesas: [],
      funcionarios: [],
      categorias: []
    };
    this.init();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.state));
  }

  async init() {
    // Load local storage first
    this.loadFromLocalStorage();

    // If local storage is empty, initialize defaults
    if (this.state.pratos.length === 0) {
      this.state.pratos = DEFAULT_DISHES;
      this.saveToLocalStorage(STORAGE_KEYS.PRATOS, this.state.pratos);
    }
    if (this.state.ingredientes.length === 0) {
      this.state.ingredientes = DEFAULT_INGREDIENTS;
      this.saveToLocalStorage(STORAGE_KEYS.INGREDIENTES, this.state.ingredientes);
    }
    if (this.state.mesas.length === 0) {
      this.state.mesas = DEFAULT_MESAS;
      this.saveToLocalStorage(STORAGE_KEYS.MESAS, this.state.mesas);
    }
    if (this.state.funcionarios.length === 0) {
      this.state.funcionarios = DEFAULT_FUNCIONARIOS;
      this.saveToLocalStorage(STORAGE_KEYS.FUNCIONARIOS, this.state.funcionarios);
    }
    if (this.state.categorias.length === 0) {
      this.state.categorias = DEFAULT_CATEGORIES;
      this.saveToLocalStorage(STORAGE_KEYS.CATEGORIAS, this.state.categorias);
    }

    this.notify();

    // Try fetching remote data from Supabase
    await this.syncFromSupabase();
  }

  loadFromLocalStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      this.state.pratos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRATOS) || '[]');
      this.state.ingredientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTES) || '[]');
      this.state.pedidos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS) || '[]');
      this.state.chamados = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAMADOS) || '[]');
      this.state.mesas = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESAS) || '[]');
      this.state.funcionarios = JSON.parse(localStorage.getItem(STORAGE_KEYS.FUNCIONARIOS) || '[]');
      this.state.categorias = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIAS) || '[]');
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }

  saveToLocalStorage(key, val) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
    }
  }

  async syncFromSupabase() {
    try {
      const remoteDishes = await api.get('pratos');
      if (Array.isArray(remoteDishes) && remoteDishes.length > 0) {
        // Merge with local dish ingredients if remote does not have them
        const merged = remoteDishes.map(rd => {
          const localMatch = this.state.pratos.find(p => p.id === rd.id);
          return {
            ...rd,
            ingredientes: rd.ingredientes || (localMatch ? localMatch.ingredientes : [])
          };
        });
        this.state.pratos = merged;
        this.saveToLocalStorage(STORAGE_KEYS.PRATOS, this.state.pratos);
      }

      const remoteCat = await api.get('categorias');
      if (Array.isArray(remoteCat) && remoteCat.length > 0) {
        this.state.categorias = remoteCat;
        this.saveToLocalStorage(STORAGE_KEYS.CATEGORIAS, this.state.categorias);
      }

      const remotePed = await api.get('pedidos');
      if (Array.isArray(remotePed) && remotePed.length > 0) {
        this.state.pedidos = remotePed;
        this.saveToLocalStorage(STORAGE_KEYS.PEDIDOS, this.state.pedidos);
      }

      const remoteCham = await api.get('chamados');
      if (Array.isArray(remoteCham) && remoteCham.length > 0) {
        this.state.chamados = remoteCham;
        this.saveToLocalStorage(STORAGE_KEYS.CHAMADOS, this.state.chamados);
      }

      this.notify();
    } catch (e) {
      console.warn('Supabase sync skipped/failed:', e);
    }
  }

  // Dish availability calculation logic (RN-02)
  getDishAvailability(dish) {
    if (!dish.ativo) return { disponivel: false, motivo: 'Prato inativo' };
    if (!dish.ingredientes || dish.ingredientes.length === 0) return { disponivel: true, porcoes: 999 };

    let minPorcoes = Infinity;
    for (const reqItem of dish.ingredientes) {
      const ing = this.state.ingredientes.find(i => i.id === reqItem.ingrediente_id);
      if (!ing || ing.quantidade < reqItem.quantidade) {
        return { disponivel: false, motivo: `Estoque insuficiente de ${ing ? ing.nome : 'ingrediente'}` };
      }
      const porcoesPossiveis = Math.floor(ing.quantidade / reqItem.quantidade);
      if (porcoesPossiveis < minPorcoes) {
        minPorcoes = porcoesPossiveis;
      }
    }

    return { disponivel: minPorcoes > 0, porcoes: minPorcoes };
  }

  // Stock operations (RN-03, RN-04)
  debitStockForOrder(itens) {
    itens.forEach(item => {
      const dish = this.state.pratos.find(p => p.id === item.prato_id);
      if (dish && dish.ingredientes) {
        dish.ingredientes.forEach(reqItem => {
          const ing = this.state.ingredientes.find(i => i.id === reqItem.ingrediente_id);
          if (ing) {
            ing.quantidade = Math.max(0, ing.quantidade - (reqItem.quantidade * item.quantidade));
          }
        });
      }
    });
    this.saveToLocalStorage(STORAGE_KEYS.INGREDIENTES, this.state.ingredientes);
  }

  restockForOrder(itens) {
    itens.forEach(item => {
      const dish = this.state.pratos.find(p => p.id === item.prato_id);
      if (dish && dish.ingredientes) {
        dish.ingredientes.forEach(reqItem => {
          const ing = this.state.ingredientes.find(i => i.id === reqItem.ingrediente_id);
          if (ing) {
            ing.quantidade += (reqItem.quantidade * item.quantidade);
          }
        });
      }
    });
    this.saveToLocalStorage(STORAGE_KEYS.INGREDIENTES, this.state.ingredientes);
  }

  // CRUD Operations & Actions

  // Pedidos
  async addPedido(pedidoData) {
    const newPedido = {
      id: 'ped-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      mesa_id: pedidoData.mesa_id,
      mesa_nome: pedidoData.mesa_nome || 'Mesa',
      itens: pedidoData.itens,
      valor_total: pedidoData.valor_total,
      status: 'Recebido', // Statuses: Recebido, Em preparo, Pronto, Entregue, Cancelado
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    // Debit stock RN-03
    this.debitStockForOrder(newPedido.itens);

    this.state.pedidos.unshift(newPedido);
    this.saveToLocalStorage(STORAGE_KEYS.PEDIDOS, this.state.pedidos);
    this.notify();

    // Background sync to Supabase
    api.post('pedidos', {
      id: newPedido.id,
      mesa_id: newPedido.mesa_id,
      valor_total: newPedido.valor_total,
      status: newPedido.status
    }).catch(e => console.warn('Supabase order post error:', e));

    return newPedido;
  }

  async updateOrderStatus(pedidoId, newStatus) {
    const pedido = this.state.pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const oldStatus = pedido.status;
    pedido.status = newStatus;
    pedido.atualizado_em = new Date().toISOString();

    // If changing to Cancelado and wasn't already canceled, restock RN-04
    if (newStatus === 'Cancelado' && oldStatus !== 'Cancelado') {
      this.restockForOrder(pedido.itens);
    }

    this.saveToLocalStorage(STORAGE_KEYS.PEDIDOS, this.state.pedidos);
    this.notify();

    api.patch('pedidos', `id=eq.${pedidoId}`, { status: newStatus }).catch(e => console.warn(e));
  }

  // Chamados
  async addChamado(mesaId, mesaNome, justificativa) {
    const newChamado = {
      id: 'cham-' + Date.now(),
      mesa_id: mesaId,
      mesa_nome: mesaNome,
      justificativa: justificativa,
      status: 'Pendente',
      criado_em: new Date().toISOString(),
      atendido_em: null
    };

    this.state.chamados.unshift(newChamado);
    this.saveToLocalStorage(STORAGE_KEYS.CHAMADOS, this.state.chamados);
    this.notify();

    api.post('chamados', {
      id: newChamado.id,
      mesa_id: newChamado.mesa_id,
      justificativa: newChamado.justificativa,
      status: newChamado.status
    }).catch(e => console.warn('Supabase chamado post error:', e));

    return newChamado;
  }

  async markChamadoAtendido(chamadoId) {
    const c = this.state.chamados.find(ch => ch.id === chamadoId);
    if (c) {
      c.status = 'Atendido';
      c.atendido_em = new Date().toISOString();
      this.saveToLocalStorage(STORAGE_KEYS.CHAMADOS, this.state.chamados);
      this.notify();

      api.patch('chamados', `id=eq.${chamadoId}`, { status: 'Atendido' }).catch(e => console.warn(e));
    }
  }

  // Pratos (CRUD)
  savePrato(prato) {
    if (prato.id) {
      const idx = this.state.pratos.findIndex(p => p.id === prato.id);
      if (idx !== -1) {
        this.state.pratos[idx] = { ...this.state.pratos[idx], ...prato };
      }
    } else {
      const newDish = {
        id: 'prato-' + Date.now(),
        categoria_id: '08150b4b-782f-4097-903a-8c933dc2167d',
        ativo: true,
        destaque: false,
        ingredientes: [],
        ...prato
      };
      this.state.pratos.unshift(newDish);
    }
    this.saveToLocalStorage(STORAGE_KEYS.PRATOS, this.state.pratos);
    this.notify();
  }

  deletePrato(pratoId) {
    this.state.pratos = this.state.pratos.filter(p => p.id !== pratoId);
    this.saveToLocalStorage(STORAGE_KEYS.PRATOS, this.state.pratos);
    this.notify();
  }

  // Ingredientes (CRUD)
  saveIngrediente(ingrediente) {
    if (ingrediente.id) {
      const idx = this.state.ingredientes.findIndex(i => i.id === ingrediente.id);
      if (idx !== -1) {
        this.state.ingredientes[idx] = { ...this.state.ingredientes[idx], ...ingrediente };
      }
    } else {
      const newIng = {
        id: 'ing-' + Date.now(),
        ...ingrediente
      };
      this.state.ingredientes.unshift(newIng);
    }
    this.saveToLocalStorage(STORAGE_KEYS.INGREDIENTES, this.state.ingredientes);
    this.notify();
  }

  // Mesas (CRUD)
  saveMesa(mesa) {
    if (mesa.id) {
      const idx = this.state.mesas.findIndex(m => m.id === mesa.id);
      if (idx !== -1) {
        this.state.mesas[idx] = { ...this.state.mesas[idx], ...mesa };
      }
    } else {
      const newMesa = {
        id: 'mesa-' + Date.now(),
        ativo: true,
        ...mesa
      };
      this.state.mesas.push(newMesa);
    }
    this.saveToLocalStorage(STORAGE_KEYS.MESAS, this.state.mesas);
    this.notify();
  }

  // Funcionários (CRUD)
  saveFuncionario(func) {
    if (func.id) {
      const idx = this.state.funcionarios.findIndex(f => f.id === func.id);
      if (idx !== -1) {
        this.state.funcionarios[idx] = { ...this.state.funcionarios[idx], ...func };
      }
    } else {
      const newFunc = {
        id: 'func-' + Date.now(),
        ativo: true,
        ...func
      };
      this.state.funcionarios.push(newFunc);
    }
    this.saveToLocalStorage(STORAGE_KEYS.FUNCIONARIOS, this.state.funcionarios);
    this.notify();
  }

  // Backup & Restore
  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.pratos) this.state.pratos = parsed.pratos;
      if (parsed.ingredientes) this.state.ingredientes = parsed.ingredientes;
      if (parsed.pedidos) this.state.pedidos = parsed.pedidos;
      if (parsed.chamados) this.state.chamados = parsed.chamados;
      if (parsed.mesas) this.state.mesas = parsed.mesas;
      if (parsed.funcionarios) this.state.funcionarios = parsed.funcionarios;
      if (parsed.categorias) this.state.categorias = parsed.categorias;

      this.saveToLocalStorage(STORAGE_KEYS.PRATOS, this.state.pratos);
      this.saveToLocalStorage(STORAGE_KEYS.INGREDIENTES, this.state.ingredientes);
      this.saveToLocalStorage(STORAGE_KEYS.PEDIDOS, this.state.pedidos);
      this.saveToLocalStorage(STORAGE_KEYS.CHAMADOS, this.state.chamados);
      this.saveToLocalStorage(STORAGE_KEYS.MESAS, this.state.mesas);
      this.saveToLocalStorage(STORAGE_KEYS.FUNCIONARIOS, this.state.funcionarios);
      this.saveToLocalStorage(STORAGE_KEYS.CATEGORIAS, this.state.categorias);

      this.notify();
      return true;
    } catch (e) {
      console.error('Invalid JSON import:', e);
      return false;
    }
  }
}

export const store = new Store();
