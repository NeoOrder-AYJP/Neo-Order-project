// Componente de Dashboard de Faturamento (Gerente)

import { store } from '../store.js';

export function renderManagerBilling(container) {
  let filtroPeriodo = 'mes'; // 'dia' | 'semana' | 'mes'

  function render() {
    const pedidos = store.getPedidos();
    const pratos = store.getPratos();

    // Considerar apenas pedidos com status "Entregue" (ou finalizados), ignorando "Cancelado"
    const pedidosFinalizados = pedidos.filter(p => p.status === 'Entregue');

    const agora = new Date();
    const pedidosFiltrados = pedidosFinalizados.filter(p => {
      const dataPedido = new Date(p.criado_em);
      if (filtroPeriodo === 'dia') {
        return dataPedido.toDateString() === agora.toDateString();
      } else if (filtroPeriodo === 'semana') {
        const diffDias = (agora - dataPedido) / (1000 * 60 * 60 * 24);
        return diffDias <= 7;
      } else {
        // Mês atual
        return dataPedido.getMonth() === agora.getMonth() && dataPedido.getFullYear() === agora.getFullYear();
      }
    });

    const faturamentoTotal = pedidosFiltrados.reduce((sum, p) => sum + p.valor_total, 0);
    const qtdPedidos = pedidosFiltrados.length;
    const ticketMedio = qtdPedidos > 0 ? faturamentoTotal / qtdPedidos : 0;

    // Pratos mais vendidos
    const contagemPratos = {};
    pedidosFiltrados.forEach(p => {
      p.itens.forEach(item => {
        if (!contagemPratos[item.prato_id]) {
          contagemPratos[item.prato_id] = 0;
        }
        contagemPratos[item.prato_id] += item.quantidade;
      });
    });

    const rankingPratos = Object.keys(contagemPratos)
      .map(pratoId => {
        const prato = pratos.find(pr => pr.id === pratoId);
        return {
          pratoNome: prato ? prato.nome : 'Prato',
          quantidade: contagemPratos[pratoId]
        };
      })
      .sort((a, b) => b.quantidade - a.quantidade);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <h2>Dashboard de Faturamento</h2>
          <p class="caption">Acompanhe as métricas de receita e vendas do restaurante</p>
        </div>
        <div class="form-group" style="margin: 0;">
          <select class="form-control" id="select-filtro-periodo" style="padding: 8px 16px;">
            <option value="dia" ${filtroPeriodo === 'dia' ? 'selected' : ''}>Hoje</option>
            <option value="semana" ${filtroPeriodo === 'semana' ? 'selected' : ''}>Últimos 7 dias</option>
            <option value="mes" ${filtroPeriodo === 'mes' ? 'selected' : ''}>Mês Atual</option>
          </select>
        </div>
      </div>

      <!-- Métricas / Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-2xl);">
        <div class="card" style="border-top: 4px solid var(--color-primary);">
          <p class="caption" style="margin-bottom: var(--space-xs);">Faturamento Total</p>
          <h1 style="color: var(--color-primary);">R$ ${faturamentoTotal.toFixed(2).replace('.', ',')}</h1>
        </div>

        <div class="card" style="border-top: 4px solid var(--color-success);">
          <p class="caption" style="margin-bottom: var(--space-xs);">Pedidos Finalizados</p>
          <h1>${qtdPedidos}</h1>
        </div>

        <div class="card" style="border-top: 4px solid var(--color-highlight);">
          <p class="caption" style="margin-bottom: var(--space-xs);">Ticket Médio</p>
          <h1>R$ ${ticketMedio.toFixed(2).replace('.', ',')}</h1>
        </div>
      </div>

      <!-- Pratos Mais Vendidos -->
      <div class="card">
        <h3 style="margin-bottom: var(--space-md);"><i class="fa-solid fa-trophy" style="color: var(--color-highlight);"></i> Pratos Mais Vendidos no Período</h3>
        ${rankingPratos.length === 0 ? `
          <p class="caption">Nenhuma venda registrada no período selecionado.</p>
        ` : `
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Prato</th>
                  <th>Quantidade Vendida</th>
                </tr>
              </thead>
              <tbody>
                ${rankingPratos.map((item, index) => `
                  <tr>
                    <td style="font-weight: 600;">#${index + 1}</td>
                    <td>${item.pratoNome}</td>
                    <td style="font-weight: 600;">${item.quantidade} porções</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    container.querySelector('#select-filtro-periodo').addEventListener('change', (e) => {
      filtroPeriodo = e.target.value;
      render();
    });
  }

  render();
}
