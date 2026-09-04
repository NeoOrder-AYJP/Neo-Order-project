// Store / Gerenciamento de Estado do Sistema via localStorage e Eventos

import { CONFIG } from './config.js';
import { ApiService } from './api.js';

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'uuid-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}

const DEFAULT_INGREDIENTES = [
  { id: 'ing-feijao', nome: 'Feijão Preto', unidade: 'kg', quantidade: 15.0 },
  { id: 'ing-arroz', nome: 'Arroz Branco', unidade: 'kg', quantidade: 20.0 },
  { id: 'ing-carne-seca', nome: 'Carne Seca', unidade: 'kg', quantidade: 10.0 },
  { id: 'ing-couve', nome: 'Couve Fresca', unidade: 'kg', quantidade: 5.0 },
  { id: 'ing-laranja', nome: 'Laranja', unidade: 'kg', quantidade: 8.0 },
  { id: 'ing-file', nome: 'Filé Mignon', unidade: 'kg', quantidade: 12.0 },
  { id: 'ing-batata', nome: 'Batata', unidade: 'kg', quantidade: 25.0 },
  { id: 'ing-pao', nome: 'Pão de Hambúrguer', unidade: 'un', quantidade: 30 },
  { id: 'ing-queijo', nome: 'Queijo Mozzarella', unidade: 'kg', quantidade: 8.0 }
];

const DEFAULT_PRATOS = [
  {
    id: 'prato-feijoada',
    nome: 'Feijoada Completa',
    descricao: 'A tradicional feijoada brasileira acompanhada de arroz, couve refogada e rodelas de laranja.',
    preco: 45.90,
    imagem: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
    destaque: true,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-feijao', quantidade: 0.3, unidade: 'kg' },
      { ingrediente_id: 'ing-arroz', quantidade: 0.2, unidade: 'kg' },
      { ingrediente_id: 'ing-carne-seca', quantidade: 0.2, unidade: 'kg' },
      { ingrediente_id: 'ing-couve', quantidade: 0.1, unidade: 'kg' },
      { ingrediente_id: 'ing-laranja', quantidade: 0.1, unidade: 'kg' }
    ]
  },
  {
    id: 'prato-file-batata',
    nome: 'Filé Mignon com Batatas',
    descricao: 'Suculento medalhão de filé mignon grelhado, acompanhado de batatas rústicas douradas.',
    preco: 62.00,
    imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    destaque: true,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-file', quantidade: 0.3, unidade: 'kg' },
      { ingrediente_id: 'ing-batata', quantidade: 0.25, unidade: 'kg' }
    ]
  },
  {
    id: 'prato-burger',
    nome: 'Hambúrguer Artesanal Gourmet',
    descricao: 'Blend de carne nobre, queijo derretido e molho especial em pão artesanal macio.',
    preco: 32.50,
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    destaque: true,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-file', quantidade: 0.2, unidade: 'kg' },
      { ingrediente_id: 'ing-pao', quantidade: 1, unidade: 'un' },
      { ingrediente_id: 'ing-queijo', quantidade: 0.05, unidade: 'kg' }
    ]
  },
  {
    id: 'prato-batata-frita',
    nome: 'Porção de Batata Rústica',
    descricao: 'Batatas crocantes temperadas com ervas finas e sal marinho.',
    preco: 22.00,
    imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    destaque: false,
    ativo: true,
    ingredientes: [
      { ingrediente_id: 'ing-batata', quantidade: 0.4, unidade: 'kg' }
    ]
  }
];

const DEFAULT_USUARIOS = [
  {
    id: 'usr-gerente',
    tipo: 'funcionario',
    nome: 'Gerente Principal',
    login: 'gerente',
    senha: '123',
    perfil: 'Gerente',
    ativo: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 'usr-atendente',
    tipo: 'funcionario',
    nome: 'Atendente Silva',
    login: 'atendente',
    senha: '123',
    perfil: 'Atendente',
    ativo: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 'usr-mesa01',
    tipo: 'mesa',
    nome: 'Mesa 01',
    login: 'mesa01',
    senha: '123',
    perfil: null,
    ativo: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 'usr-mesa02',
    tipo: 'mesa',
    nome: 'Mesa 02',
    login: 'mesa02',
    senha: '123',
    perfil: null,
    ativo: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 'usr-mesa03',
    tipo: 'mesa',
    nome: 'Mesa 03',
    login: 'mesa03',
    senha: '123',
    perfil: null,
    ativo: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 'usr-mesa04',
    tipo: 'mesa',
    nome: 'Mesa 04',
    login: 'mesa04',
    senha: '123',
    perfil: null,
    ativo: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 'usr-mesa05',
    tipo: 'mesa',
    nome: 'Mesa 05',
    login: 'mesa05',
    senha: '123',
    perfil: null,
    ativo: true,
    criado_em: new Date().toISOString()
  }
];

class Store {
  constructor() {
    this.listeners = [];
    this.initStorage();
  }

  // Permite executar store em Node.js (testes) ou no navegador
  getStorageItem(key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return this._mockStorage ? this._mockStorage[key] : null;
  }

  setStorageItem(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      if (!this._mockStorage) this._mockStorage = {};
      this._mockStorage[key] = value;
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  initStorage() {
    if (!this.getStorageItem(CONFIG.STORAGE_KEYS.USUARIOS)) {
      this.setStorageItem(CONFIG.STORAGE_KEYS.USUARIOS, JSON.stringify(DEFAULT_USUARIOS));
    }
    if (!this.getStorageItem(CONFIG.STORAGE_KEYS.INGREDIENTES)) {
      this.setStorageItem(CONFIG.STORAGE_KEYS.INGREDIENTES, JSON.stringify(DEFAULT_INGREDIENTES));
    }
    if (!this.getStorageItem(CONFIG.STORAGE_KEYS.PRATOS)) {
      this.setStorageItem(CONFIG.STORAGE_KEYS.PRATOS, JSON.stringify(DEFAULT_PRATOS));
    }
    if (!this.getStorageItem(CONFIG.STORAGE_KEYS.PEDIDOS)) {
      this.setStorageItem(CONFIG.STORAGE_KEYS.PEDIDOS, JSON.stringify([]));
    }
    if (!this.getStorageItem(CONFIG.STORAGE_KEYS.CHAMADOS)) {
      this.setStorageItem(CONFIG.STORAGE_KEYS.CHAMADOS, JSON.stringify([]));
    }
  }

  // --- ENTIDADES ---
  getUsuarios() {
    return JSON.parse(this.getStorageItem(CONFIG.STORAGE_KEYS.USUARIOS) || '[]');
  }

  saveUsuarios(usuarios) {
    this.setStorageItem(CONFIG.STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
    ApiService.syncData('usuarios', usuarios).catch(() => {});
  }

  getIngredientes() {
    return JSON.parse(this.getStorageItem(CONFIG.STORAGE_KEYS.INGREDIENTES) || '[]');
  }

  saveIngredientes(ingredientes) {
    this.setStorageItem(CONFIG.STORAGE_KEYS.INGREDIENTES, JSON.stringify(ingredientes));
    ApiService.syncData('ingredientes', ingredientes).catch(() => {});
  }

  getPratos() {
    return JSON.parse(this.getStorageItem(CONFIG.STORAGE_KEYS.PRATOS) || '[]');
  }

  savePratos(pratos) {
    this.setStorageItem(CONFIG.STORAGE_KEYS.PRATOS, JSON.stringify(pratos));
    ApiService.syncData('pratos', pratos).catch(() => {});
  }

  getPedidos() {
    return JSON.parse(this.getStorageItem(CONFIG.STORAGE_KEYS.PEDIDOS) || '[]');
  }

  savePedidos(pedidos) {
    this.setStorageItem(CONFIG.STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
    ApiService.syncData('pedidos', pedidos).catch(() => {});
  }

  getChamados() {
    return JSON.parse(this.getStorageItem(CONFIG.STORAGE_KEYS.CHAMADOS) || '[]');
  }

  saveChamados(chamados) {
    this.setStorageItem(CONFIG.STORAGE_KEYS.CHAMADOS, JSON.stringify(chamados));
    ApiService.syncData('chamados', chamados).catch(() => {});
  }

  // --- REGRA DE NEGÓCIO: DISPONIBILIDADE DE PRATOS (RN-02) ---
  isPratoDisponivel(pratoId) {
    const pratos = this.getPratos();
    const prato = pratos.find(p => p.id === pratoId);
    if (!prato || !prato.ativo) return false;
    if (!prato.ingredientes || prato.ingredientes.length === 0) return true;

    const ingredientes = this.getIngredientes();
    for (const req of prato.ingredientes) {
      const ing = ingredientes.find(i => i.id === req.ingrediente_id);
      if (!ing || ing.quantidade < req.quantidade) {
        return false;
      }
    }
    return true;
  }

  getPratoPorcoesDisponiveis(pratoId) {
    const pratos = this.getPratos();
    const prato = pratos.find(p => p.id === pratoId);
    if (!prato || !prato.ativo) return 0;
    if (!prato.ingredientes || prato.ingredientes.length === 0) return 999;

    const ingredientes = this.getIngredientes();
    let maxPorcoes = Infinity;

    for (const req of prato.ingredientes) {
      const ing = ingredientes.find(i => i.id === req.ingrediente_id);
      if (!ing || req.quantidade <= 0) return 0;
      const porcoes = Math.floor(ing.quantidade / req.quantidade);
      if (porcoes < maxPorcoes) {
        maxPorcoes = porcoes;
      }
    }
    return maxPorcoes === Infinity ? 0 : maxPorcoes;
  }

  // --- CONFIRMAÇÃO DE PEDIDO E DÉBITO DE ESTOQUE (RN-03) ---
  fazerPedido(mesaId, itens) {
    if (!mesaId || !itens || itens.length === 0) {
      throw new Error('Pedido inválido.');
    }

    // Validar se todos os itens estão disponíveis
    const pratos = this.getPratos();
    const ingredientes = this.getIngredientes();

    for (const item of itens) {
      const prato = pratos.find(p => p.id === item.prato_id);
      if (!prato) throw new Error(`Prato não encontrado.`);
      if (!prato.ativo) throw new Error(`O prato "${prato.nome}" não está ativo.`);

      // Verificar estoque para a quantidade solicitada
      if (prato.ingredientes) {
        for (const req of prato.ingredientes) {
          const ing = ingredientes.find(i => i.id === req.ingrediente_id);
          const necessidadeTotal = req.quantidade * item.quantidade;
          if (!ing || ing.quantidade < necessidadeTotal) {
            throw new Error(`Estoque insuficiente de "${ing ? ing.nome : 'ingrediente'}" para o prato "${prato.nome}".`);
          }
        }
      }
    }

    // Debitar estoque
    for (const item of itens) {
      const prato = pratos.find(p => p.id === item.prato_id);
      if (prato.ingredientes) {
        for (const req of prato.ingredientes) {
          const ing = ingredientes.find(i => i.id === req.ingrediente_id);
          if (ing) {
            ing.quantidade = Math.max(0, ing.quantidade - (req.quantidade * item.quantidade));
          }
        }
      }
    }
    this.saveIngredientes(ingredientes);

    // Calcular valor total
    const valorTotal = itens.reduce((sum, item) => sum + (item.preco_unitario * item.quantidade), 0);

    const novoPedido = {
      id: generateUUID(),
      mesa_id: mesaId,
      itens: itens,
      valor_total: valorTotal,
      status: 'Recebido',
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    const pedidos = this.getPedidos();
    pedidos.unshift(novoPedido);
    this.savePedidos(pedidos);

    return novoPedido;
  }

  // --- ATUALIZAÇÃO DE STATUS DE PEDIDO E ESTORNO DE ESTOQUE (RN-04) ---
  atualizarStatusPedido(pedidoId, novoStatus) {
    const pedidos = this.getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) throw new Error('Pedido não encontrado.');

    const statusAnterior = pedido.status;
    if (statusAnterior === novoStatus) return pedido;

    const pratos = this.getPratos();
    const ingredientes = this.getIngredientes();

    // Se estiver cancelando e não estava cancelado antes, estorna estoque
    if (novoStatus === 'Cancelado' && statusAnterior !== 'Cancelado') {
      for (const item of pedido.itens) {
        const prato = pratos.find(p => p.id === item.prato_id);
        if (prato && prato.ingredientes) {
          for (const req of prato.ingredientes) {
            const ing = ingredientes.find(i => i.id === req.ingrediente_id);
            if (ing) {
              ing.quantidade += (req.quantidade * item.quantidade);
            }
          }
        }
      }
      this.saveIngredientes(ingredientes);
    }
    // Se estava cancelado e foi reativado para outro status, torna a debitar estoque
    else if (statusAnterior === 'Cancelado' && novoStatus !== 'Cancelado') {
      for (const item of pedido.itens) {
        const prato = pratos.find(p => p.id === item.prato_id);
        if (prato && prato.ingredientes) {
          for (const req of prato.ingredientes) {
            const ing = ingredientes.find(i => i.id === req.ingrediente_id);
            if (ing) {
              ing.quantidade = Math.max(0, ing.quantidade - (req.quantidade * item.quantidade));
            }
          }
        }
      }
      this.saveIngredientes(ingredientes);
    }

    pedido.status = novoStatus;
    pedido.atualizado_em = new Date().toISOString();
    this.savePedidos(pedidos);

    return pedido;
  }

  // --- CHAMADOS DE FUNCIONÁRIO ---
  criarChamado(mesaId, justificativa) {
    if (!mesaId || !justificativa) {
      throw new Error('Informe a mesa e a justificativa para o chamado.');
    }
    const chamados = this.getChamados();
    const novoChamado = {
      id: generateUUID(),
      mesa_id: mesaId,
      justificativa: justificativa.trim(),
      status: 'Pendente',
      criado_em: new Date().toISOString(),
      atendido_em: null
    };
    chamados.unshift(novoChamado);
    this.saveChamados(chamados);
    return novoChamado;
  }

  atenderChamado(chamadoId) {
    const chamados = this.getChamados();
    const chamado = chamados.find(c => c.id === chamadoId);
    if (chamado) {
      chamado.status = 'Atendido';
      chamado.atendido_em = new Date().toISOString();
      this.saveChamados(chamados);
    }
    return chamado;
  }

  // --- EXPORTAÇÃO E IMPORTAÇÃO DE BACKUP (JSON) ---
  exportarDadosJSON() {
    return JSON.stringify({
      usuarios: this.getUsuarios(),
      pratos: this.getPratos(),
      ingredientes: this.getIngredientes(),
      pedidos: this.getPedidos(),
      chamados: this.getChamados()
    }, null, 2);
  }

  importarDadosJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.usuarios) this.saveUsuarios(data.usuarios);
      if (data.pratos) this.savePratos(data.pratos);
      if (data.ingredientes) this.saveIngredientes(data.ingredientes);
      if (data.pedidos) this.savePedidos(data.pedidos);
      if (data.chamados) this.saveChamados(data.chamados);
      return true;
    } catch (e) {
      throw new Error('Arquivo JSON inválido ou corrompido: ' + e.message);
    }
  }
}

export const store = new Store();
