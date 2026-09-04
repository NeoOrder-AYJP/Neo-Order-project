// Componente de Chamados de Funcionários com Alerta Sonoro (Web Audio API)

import { store } from '../store.js';

let audioEnabled = false;
let audioCtx = null;
let lastChamadosCount = 0;

function playBeep() {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Nota A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn('Não foi possível emitir o som de notificação:', e);
  }
}

export function renderStaffCalls(container) {
  function render() {
    const chamados = store.getChamados();
    const chamadosPendentes = chamados.filter(c => c.status === 'Pendente');
    const usuarios = store.getUsuarios();

    function getMesaNome(mesaId) {
      const u = usuarios.find(usr => usr.id === mesaId);
      return u ? u.nome : 'Mesa Desconhecida';
    }

    // Se houve novo chamado pendente, toca o beep
    if (chamadosPendentes.length > lastChamadosCount) {
      playBeep();
    }
    lastChamadosCount = chamadosPendentes.length;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <h2>Chamados das Mesas</h2>
          <p class="caption">Solicitações de atendimento enviadas pelos clientes</p>
        </div>
        <div>
          <button class="btn ${audioEnabled ? 'btn-secondary' : 'btn-primary'}" id="btn-toggle-audio">
            <i class="fa-solid ${audioEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>
            ${audioEnabled ? 'Notificações Sonoras Ativadas' : 'Ativar Notificações Sonoras'}
          </button>
        </div>
      </div>

      ${chamadosPendentes.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-3xl) var(--space-xl);">
          <i class="fa-solid fa-bell-slash" style="font-size: 48px; color: var(--color-text-sub); margin-bottom: var(--space-md);"></i>
          <h3>Nenhum chamado pendente no momento</h3>
          <p class="caption">Quando uma mesa solicitar atendimento, o chamado aparecerá aqui em tempo real.</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          ${chamadosPendentes.map(chamado => `
            <div class="card" style="border-left: 6px solid var(--color-error); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-xs);">
                  <span style="font-size: 18px; font-weight: 600; color: var(--color-text-main);">
                    <i class="fa-solid fa-chair" style="color: var(--color-primary);"></i> ${getMesaNome(chamado.mesa_id)}
                  </span>
                  <span class="badge badge-pendente">Pendente</span>
                </div>
                <p style="font-size: 15px; font-weight: 500; margin-bottom: var(--space-xs); color: var(--color-text-main);">
                  "${chamado.justificativa}"
                </p>
                <p class="caption">
                  Solicitado às ${new Date(chamado.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>

              <button class="btn btn-primary btn-atender-chamado" data-id="${chamado.id}">
                <i class="fa-solid fa-check"></i> Marcar como Atendido
              </button>
            </div>
          `).join('')}
        </div>
      `}
    `;

    // Eventos
    const btnAudio = container.querySelector('#btn-toggle-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
          playBeep(); // Teste de som ao ativar
        }
        render();
      });
    }

    container.querySelectorAll('.btn-atender-chamado').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        store.atenderChamado(id);
        render();
      });
    });
  }

  render();
}
