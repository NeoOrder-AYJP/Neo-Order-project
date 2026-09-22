// js/views/landing.js - Public Landing Page View
import { store, setCurrentUser, navigateTo, showToast } from '../app.js';

let slideInterval = null;
let currentSlide = 0;

export function renderLandingView() {
  const container = document.getElementById('view-landing');
  if (!container) return;

  const dishes = store.getDishes().filter(d => d.ativo !== false);
  const featuredDishes = dishes.filter(d => d.destaque);

  container.innerHTML = `
    <!-- Hero Banner with Carousel -->
    <div style="background-color: var(--bg-light); border-bottom: 1px solid var(--border-color); padding: 48px 0;">
      <div class="container flex flex-col items-center justify-between gap-6" style="flex-direction: row; flex-wrap: wrap;">

        <!-- Text CTA -->
        <div style="flex: 1; min-width: 300px;">
          <span class="badge badge-available" style="margin-bottom: 12px;">Cardápio Autêntico & Gestão Digital</span>
          <h1 style="font-size: 36px; font-weight: 700; margin-bottom: 16px; line-height: 1.2;">
            Sabor Excepcional, Operação em Tempo Real
          </h1>
          <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 16px;">
            Peça diretamente da sua mesa ou acesse o painel corporativo do restaurante.
          </p>
          <div class="flex gap-3">
            <button id="btn-open-login-mesa" class="btn btn-primary">
              <span class="material-symbols-outlined">table_restaurant</span>
              <span>Fazer Pedido (Mesa)</span>
            </button>
            <button id="btn-open-login-func" class="btn btn-secondary">
              <span class="material-symbols-outlined">badge</span>
              <span>Área do Funcionário</span>
            </button>
          </div>
        </div>

        <!-- Carousel -->
        <div style="width: 100%; max-width: 500px;">
          <div class="carousel-container">
            <div id="carousel-track" class="carousel-track">
              ${featuredDishes.length > 0 ? featuredDishes.map(dish => `
                <div class="carousel-slide">
                  <img src="${dish.imagem}" alt="${dish.nome}">
                  <div class="carousel-caption">
                    <span class="badge badge-pending" style="margin-bottom: 6px;">Destaque</span>
                    <h3 style="font-size: 18px; font-weight: 600;">${dish.nome}</h3>
                    <p style="font-size: 13px; color: #EEE;">${dish.descricao}</p>
                    <div style="font-weight: 700; color: var(--tertiary); margin-top: 8px;">R$ ${dish.preco.toFixed(2)}</div>
                  </div>
                </div>
              `).join('') : `
                <div class="carousel-slide flex items-center justify-center" style="color: #FFF;">
                  Sem pratos em destaque.
                </div>
              `}
            </div>
            <button id="carousel-prev" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #FFF; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer;">‹</button>
            <button id="carousel-next" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #FFF; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer;">›</button>
          </div>
        </div>

      </div>
    </div>

    <!-- Public Menu Section -->
    <div class="container">
      <div class="flex items-center justify-between" style="margin-bottom: 24px;">
        <h2>Cardápio Completo</h2>
        <div id="landing-category-filters" class="flex gap-2">
          <button data-cat="all" class="landing-cat-btn btn btn-sm btn-primary">Todos</button>
          <button data-cat="Pratos Principais" class="landing-cat-btn btn btn-sm btn-secondary">Pratos Principais</button>
          <button data-cat="Peixes & Frutos do Mar" class="landing-cat-btn btn btn-sm btn-secondary">Peixes</button>
          <button data-cat="Massas" class="landing-cat-btn btn btn-sm btn-secondary">Massas</button>
        </div>
      </div>

      <div id="landing-menu-grid" class="grid grid-cols-4 gap-6"></div>
    </div>

    <!-- Modal Login Client -->
    <div id="modal-login-mesa" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-mesa" class="modal-close">×</button>
        <h3 style="margin-bottom: 16px;">Login de Mesa</h3>
        <form id="form-login-mesa">
          <div class="form-group">
            <label>Usuário / Mesa</label>
            <input type="text" id="input-mesa-login" required placeholder="ex: mesa05">
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" id="input-mesa-senha" required placeholder="••••••">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Acessar Minha Mesa</button>
        </form>
      </div>
    </div>

    <!-- Modal Login Staff -->
    <div id="modal-login-func" class="modal-overlay hidden">
      <div class="modal-content">
        <button id="close-modal-func" class="modal-close">×</button>
        <h3 style="margin-bottom: 16px;">Área do Funcionário</h3>
        <form id="form-login-func">
          <div class="form-group">
            <label>Usuário</label>
            <input type="text" id="input-func-login" required placeholder="ex: gerente ou atendente">
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" id="input-func-senha" required placeholder="••••••">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar no Painel</button>
        </form>
      </div>
    </div>
  `;

  setupCarousel(featuredDishes.length);
  renderLandingMenuGrid('all');
  setupLandingEvents();
}

function renderLandingMenuGrid(category = 'all') {
  const grid = document.getElementById('landing-menu-grid');
  if (!grid) return;

  let dishes = store.getDishes().filter(d => d.ativo !== false);
  if (category !== 'all') {
    dishes = dishes.filter(d => d.categoria === category);
  }

  if (dishes.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum prato nesta categoria.</p>`;
    return;
  }

  grid.innerHTML = dishes.map(dish => {
    const avail = store.getDishAvailability(dish.id);
    return `
      <div class="card flex flex-col justify-between" style="padding: 0; overflow: hidden;">
        <div style="height: 180px; position: relative;">
          <img src="${dish.imagem}" alt="${dish.nome}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 12px; right: 12px;">
            ${avail.available ? `<span class="badge badge-available">Disponível</span>` : `<span class="badge badge-unavailable">Indisponível</span>`}
          </div>
        </div>
        <div style="padding: 16px;">
          <h4 style="font-size: 16px; font-weight: 600;">${dish.nome}</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${dish.descricao}</p>
        </div>
        <div style="padding: 16px; border-top: 1px solid var(--border-color);" class="flex items-center justify-between">
          <span style="font-weight: 700; color: var(--primary);">R$ ${dish.preco.toFixed(2)}</span>
          <button onclick="document.getElementById('btn-open-login-mesa').click()" class="btn btn-secondary btn-sm">Pedir</button>
        </div>
      </div>
    `;
  }).join('');
}

function setupCarousel(totalSlides) {
  if (slideInterval) clearInterval(slideInterval);
  if (totalSlides <= 1) return;

  currentSlide = 0;
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  function updateSlide() {
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }

  nextBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
  });

  prevBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide();
  });

  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
  }, 5000);
}

function setupLandingEvents() {
  const modalMesa = document.getElementById('modal-login-mesa');
  const modalFunc = document.getElementById('modal-login-func');

  document.getElementById('btn-open-login-mesa')?.addEventListener('click', () => modalMesa?.classList.remove('hidden'));
  document.getElementById('btn-open-login-func')?.addEventListener('click', () => modalFunc?.classList.remove('hidden'));
  document.getElementById('close-modal-mesa')?.addEventListener('click', () => modalMesa?.classList.add('hidden'));
  document.getElementById('close-modal-func')?.addEventListener('click', () => modalFunc?.classList.add('hidden'));

  document.querySelectorAll('.landing-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.landing-cat-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      e.currentTarget.classList.add('btn-primary');
      e.currentTarget.classList.remove('btn-secondary');
      renderLandingMenuGrid(e.currentTarget.dataset.cat);
    });
  });

  document.getElementById('form-login-mesa')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginVal = document.getElementById('input-mesa-login').value;
    const senhaVal = document.getElementById('input-mesa-senha').value;
    const user = store.authenticate(loginVal, senhaVal);
    if (user && user.tipo === 'mesa') {
      setCurrentUser(user);
      modalMesa.classList.add('hidden');
      showToast(`Bem-vindo, ${user.nome}!`);
      navigateTo('client');
    } else {
      alert('Login de mesa inválido ou inativo.');
    }
  });

  document.getElementById('form-login-func')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginVal = document.getElementById('input-func-login').value;
    const senhaVal = document.getElementById('input-func-senha').value;
    const user = store.authenticate(loginVal, senhaVal);
    if (user && user.tipo === 'funcionario') {
      setCurrentUser(user);
      modalFunc.classList.add('hidden');
      showToast(`Bem-vindo, ${user.nome}!`);
      if (user.perfil === 'gerente') navigateTo('manager');
      else navigateTo('staff');
    } else {
      alert('Login de funcionário inválido ou inativo.');
    }
  });
}
