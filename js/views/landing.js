// js/views/landing.js - Public Landing Page with Carousel, Full Menu, and Logins
import { store, setCurrentUser, navigateTo, showToast } from '../app.js';

let slideInterval = null;
let currentSlide = 0;

export function renderLandingView() {
  const container = document.getElementById('view-landing');
  if (!container) return;

  const dishes = store.getDishes().filter(d => d.ativo !== false);
  const featuredDishes = dishes.filter(d => d.destaque);

  container.innerHTML = `
    <!-- Hero Section with Auto-Rotating Carousel -->
    <div class="relative w-full bg-surface-container-low border-b border-surface-variant overflow-hidden py-10 md:py-16">
      <div class="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">

          <!-- Left Text & Actions -->
          <div class="flex-1 space-y-6 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Cardápio Autêntico & Experiência Digital</span>
            </div>
            <h1 class="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Sabor Excepcional, Gestão em Tempo Real
            </h1>
            <p class="text-base md:text-lg text-on-surface-variant max-w-xl">
              Seja bem-vindo ao nosso restaurante. Peça diretamente da sua mesa ou acesse a área corporativa para gerenciamento da operação.
            </p>

            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button id="btn-open-login-mesa" class="px-6 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-base hover:bg-primary-container shadow-lg transition-all active:scale-95 flex items-center gap-2">
                <span class="material-symbols-outlined">table_restaurant</span>
                <span>Fazer Pedido (Mesa)</span>
              </button>
              <button id="btn-open-login-func" class="px-6 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant font-bold text-base hover:bg-surface-container transition-all active:scale-95 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">badge</span>
                <span>Área do Funcionário</span>
              </button>
            </div>
          </div>

          <!-- Carousel Container -->
          <div class="w-full md:w-[480px] lg:w-[560px] relative">
            <div class="relative overflow-hidden rounded-2xl shadow-xl bg-surface-container-lowest border border-surface-variant aspect-[4/3]">
              <div id="carousel-track" class="flex h-full transition-transform duration-500 ease-in-out">
                ${featuredDishes.length > 0 ? featuredDishes.map(dish => `
                  <div class="w-full h-full flex-shrink-0 relative group">
                    <img src="${dish.imagem}" alt="${dish.nome}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md w-fit mb-2">Destaque da Casa</span>
                      <h3 class="text-xl font-bold">${dish.nome}</h3>
                      <p class="text-sm text-gray-200 line-clamp-2 mt-1">${dish.descricao}</p>
                      <div class="mt-3 flex items-center justify-between">
                        <span class="text-lg font-extrabold text-amber-300">R$ ${dish.preco.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                `).join('') : `
                  <div class="w-full h-full flex items-center justify-center p-6 text-on-surface-variant">
                    Sem pratos em destaque disponíveis.
                  </div>
                `}
              </div>

              <!-- Controls -->
              <button id="carousel-prev" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 transition-all">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button id="carousel-next" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 transition-all">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Public Menu Section -->
    <div class="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span class="text-xs font-bold text-primary uppercase tracking-wider">Cardápio Completo</span>
          <h2 class="text-2xl md:text-3xl font-extrabold text-on-surface mt-1">Conheça Nossas Delícias</h2>
        </div>

        <!-- Category Filter -->
        <div id="landing-category-filters" class="flex flex-wrap gap-2">
          <button data-cat="all" class="landing-cat-btn px-4 py-2 rounded-full text-xs font-bold bg-primary text-on-primary shadow-sm">
            Todos
          </button>
          <button data-cat="Pratos Principais" class="landing-cat-btn px-4 py-2 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
            Pratos Principais
          </button>
          <button data-cat="Peixes & Frutos do Mar" class="landing-cat-btn px-4 py-2 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
            Peixes
          </button>
          <button data-cat="Massas" class="landing-cat-btn px-4 py-2 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all">
            Massas
          </button>
        </div>
      </div>

      <!-- Menu Grid -->
      <div id="landing-menu-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Modal Login Client (Mesa) -->
    <div id="modal-login-mesa" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-variant relative">
        <button id="close-modal-mesa" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined">table_restaurant</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-on-surface">Login de Mesa</h3>
            <p class="text-xs text-on-surface-variant">Informe o usuário e senha da sua mesa</p>
          </div>
        </div>

        <form id="form-login-mesa" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Usuário / Mesa</label>
            <input type="text" id="input-mesa-login" required placeholder="ex: mesa05" class="w-full px-4 py-2.5 rounded-xl border border-outline/30 bg-surface focus:border-primary focus:outline-none text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Senha</label>
            <input type="password" id="input-mesa-senha" required placeholder="••••••" class="w-full px-4 py-2.5 rounded-xl border border-outline/30 bg-surface focus:border-primary focus:outline-none text-sm">
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-md transition-all">
            Acessar Minha Mesa
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Login Staff -->
    <div id="modal-login-func" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-variant relative">
        <button id="close-modal-func" class="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <span class="material-symbols-outlined">badge</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-on-surface">Área do Funcionário</h3>
            <p class="text-xs text-on-surface-variant">Acesso para Atendentes e Gerentes</p>
          </div>
        </div>

        <form id="form-login-func" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Usuário</label>
            <input type="text" id="input-func-login" required placeholder="ex: gerente ou atendente" class="w-full px-4 py-2.5 rounded-xl border border-outline/30 bg-surface focus:border-primary focus:outline-none text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">Senha</label>
            <input type="password" id="input-func-senha" required placeholder="••••••" class="w-full px-4 py-2.5 rounded-xl border border-outline/30 bg-surface focus:border-primary focus:outline-none text-sm">
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-secondary text-white font-bold text-sm hover:bg-secondary/90 shadow-md transition-all">
            Entrar no Painel
          </button>
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
    grid.innerHTML = `<p class="col-span-full text-center text-on-surface-variant py-8">Nenhum prato encontrado nesta categoria.</p>`;
    return;
  }

  grid.innerHTML = dishes.map(dish => {
    const avail = store.getDishAvailability(dish.id);
    return `
      <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div class="relative h-48 overflow-hidden">
          <img src="${dish.imagem}" alt="${dish.nome}" class="w-full h-full object-cover">
          <div class="absolute top-3 right-3">
            ${avail.available ? `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-green-600"></span> Disponível
              </span>
            ` : `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-red-600"></span> Indisponível
              </span>
            `}
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-base text-on-surface">${dish.nome}</h4>
            <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${dish.descricao}</p>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <span class="font-extrabold text-base text-primary">R$ ${dish.preco.toFixed(2)}</span>
            <button onclick="document.getElementById('btn-open-login-mesa').click()" class="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-on-surface hover:bg-primary hover:text-white transition-all">
              Pedir
            </button>
          </div>
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

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlide();
    });
  }

  // Auto rotate every 5 seconds (RNF-06)
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
  }, 5000);
}

function setupLandingEvents() {
  const modalMesa = document.getElementById('modal-login-mesa');
  const modalFunc = document.getElementById('modal-login-func');

  document.getElementById('btn-open-login-mesa')?.addEventListener('click', () => {
    modalMesa?.classList.remove('hidden');
  });

  document.getElementById('btn-open-login-func')?.addEventListener('click', () => {
    modalFunc?.classList.remove('hidden');
  });

  document.getElementById('close-modal-mesa')?.addEventListener('click', () => {
    modalMesa?.classList.add('hidden');
  });

  document.getElementById('close-modal-func')?.addEventListener('click', () => {
    modalFunc?.classList.add('hidden');
  });

  // Category buttons
  document.querySelectorAll('.landing-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.landing-cat-btn').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      e.currentTarget.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      e.currentTarget.classList.remove('bg-surface-container', 'text-on-surface-variant');

      const cat = e.currentTarget.dataset.cat;
      renderLandingMenuGrid(cat);
    });
  });

  // Client Login Submit
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

  // Staff Login Submit
  document.getElementById('form-login-func')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginVal = document.getElementById('input-func-login').value;
    const senhaVal = document.getElementById('input-func-senha').value;

    const user = store.authenticate(loginVal, senhaVal);
    if (user && user.tipo === 'funcionario') {
      setCurrentUser(user);
      modalFunc.classList.add('hidden');
      showToast(`Bem-vindo, ${user.nome}!`);
      if (user.perfil === 'gerente') {
        navigateTo('manager');
      } else {
        navigateTo('staff');
      }
    } else {
      alert('Login de funcionário inválido ou inativo.');
    }
  });
}
