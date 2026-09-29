// Componente da Landing Page (Carrossel + Cardápio Completo)

import { store } from '../store.js';

let sliderTimer = null;

export function renderLandingPage(container, onOpenLogin) {
  if (sliderTimer) {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }

  const pratos = store.getPratos().filter(p => p.ativo);
  const pratosDestaque = pratos.filter(p => p.destaque);
  const slidesData = pratosDestaque.length > 0 ? pratosDestaque : pratos;

  container.innerHTML = `
    <!-- Seção Banner / Slides de Destaque -->
    <section class="hero-slider" id="hero-slider">
      ${slidesData.map((prato, index) => `
        <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('${prato.imagem}')">
          <div class="slide-overlay">
            <h2 class="slide-title">${prato.nome}</h2>
            <p class="slide-desc">${prato.descricao}</p>
          </div>
        </div>
      `).join('')}

      <button class="slider-btn prev" id="slider-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="slider-btn next" id="slider-next"><i class="fa-solid fa-chevron-right"></i></button>

      <div class="slider-dots" id="slider-dots">
        ${slidesData.map((_, index) => `
          <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
        `).join('')}
      </div>
    </section>

    <!-- Seção de Chamada para Ação (Login) -->
    <section style="display: flex; gap: var(--space-md); justify-content: center; margin-bottom: var(--space-2xl); flex-wrap: wrap;">
      <button class="btn btn-primary" id="btn-fazer-pedido" style="padding: 14px 28px; font-size: 16px;">
        <i class="fa-solid fa-utensils"></i> Fazer Pedido (Mesa)
      </button>
      <button class="btn btn-secondary" id="btn-area-funcionario" style="padding: 14px 28px; font-size: 16px;">
        <i class="fa-solid fa-user-gear"></i> Área do Funcionário
      </button>
    </section>

    <!-- Seção Cardápio Completo -->
    <section>
      <div style="margin-bottom: var(--space-lg); text-align: center;">
        <h2>Nosso Cardápio</h2>
        <p class="caption">Explore nossos pratos preparados com ingredientes selecionados</p>
      </div>

      <div class="menu-grid">
        ${pratos.map(prato => {
          const disponivel = store.isPratoDisponivel(prato.id);
          return `
            <div class="card dish-card">
              <img src="${prato.imagem}" alt="${prato.nome}" class="dish-img">
              <div class="dish-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-xs); margin-bottom: var(--space-xs);">
                  <h3>${prato.nome}</h3>
                  <span class="badge ${disponivel ? 'badge-disponivel' : 'badge-indisponivel'}">
                    ${disponivel ? '<i class="fa-solid fa-check"></i> Disponível' : '<i class="fa-solid fa-xmark"></i> Indisponível'}
                  </span>
                </div>
                <p class="metadata" style="margin-bottom: var(--space-md); flex: 1;">${prato.descricao}</p>
                <div class="dish-price">
                  R$ ${prato.preco.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;

  // Inicializar lógica do carrossel
  let currentSlide = 0;
  const slides = container.querySelectorAll('.slide');
  const dots = container.querySelectorAll('.dot');

  function goToSlide(index) {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  container.querySelector('#slider-next').addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  container.querySelector('#slider-prev').addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      goToSlide(index);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    sliderTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(sliderTimer);
    startAutoSlide();
  }

  startAutoSlide();

  // Eventos de Login
  container.querySelector('#btn-fazer-pedido').addEventListener('click', () => {
    onOpenLogin('mesa');
  });

  container.querySelector('#btn-area-funcionario').addEventListener('click', () => {
    onOpenLogin('funcionario');
  });
}
