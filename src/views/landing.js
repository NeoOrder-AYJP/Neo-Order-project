import { store } from '../store.js';

let carouselInterval = null;
let currentSlideIndex = 0;

export function renderLandingPage(container) {
  if (carouselInterval) clearInterval(carouselInterval);

  const dishes = store.state.pratos.filter(p => p.ativo);
  const highlightedDishes = dishes.filter(p => p.destaque).length > 0
    ? dishes.filter(p => p.destaque)
    : dishes.slice(0, 3);

  container.innerHTML = `
    <div class="flex flex-col w-full">
      <!-- Carousel Section -->
      <section class="relative w-full px-margin-mobile lg:px-margin-desktop pt-space-lg pb-space-xl overflow-hidden">
        <div class="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div class="flex flex-col gap-space-xs">
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold flex items-center gap-space-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Gastronomia Autoral • Pratos do Chef
              </span>
              <h1 class="font-display-lg text-display-lg text-on-surface tracking-tight">Experiências que definem o paladar contemporâneo</h1>
            </div>
            <div class="flex items-center gap-space-sm self-start md:self-auto">
              <button id="slide-prev" aria-label="Slide anterior" class="w-11 h-11 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm hover:bg-surface-container-high transition-transform active:scale-95">
                <span class="material-symbols-outlined">arrow_back</span>
              </button>
              <button id="slide-next" aria-label="Próximo slide" class="w-11 h-11 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm hover:bg-surface-container-high transition-transform active:scale-95">
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div class="relative w-full rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden min-h-[420px] md:min-h-[460px]">
            <div id="carousel-track" class="w-full h-full flex transition-transform duration-700 ease-out">
              ${highlightedDishes.map((dish, idx) => {
                const avail = store.getDishAvailability(dish);
                return `
                  <div class="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 min-h-[420px] md:min-h-[460px]">
                    <div class="lg:col-span-6 p-space-lg md:p-space-xl flex flex-col justify-between bg-surface-container-lowest">
                      <div class="flex flex-col gap-space-sm">
                        <div class="flex items-center gap-space-xs">
                          <span class="px-space-sm py-space-xs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">Destaque Especial</span>
                          <span class="font-label-sm text-label-sm ${avail.disponivel ? 'text-emerald-600' : 'text-error'} font-semibold">
                            ${avail.disponivel ? '● Disponível' : '● Indisponível'}
                          </span>
                        </div>
                        <h2 class="font-headline-lg text-headline-lg text-on-surface">${dish.nome}</h2>
                        <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">${dish.descricao}</p>
                      </div>
                      <div class="pt-space-md flex items-baseline justify-between">
                        <div>
                          <span class="font-label-sm text-label-sm uppercase text-on-surface-variant block">Valor individual</span>
                          <span class="font-display-lg text-display-lg text-primary font-bold">R$ ${dish.preco.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button class="open-login-modal-btn px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all active:scale-[0.98]">
                          Fazer Pedido
                        </button>
                      </div>
                    </div>
                    <div class="lg:col-span-6 relative min-h-[240px] lg:min-h-full bg-surface-container-low overflow-hidden">
                      <img src="${dish.imagem_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}" alt="${dish.nome}" class="w-full h-full object-cover">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div id="carousel-dots" class="absolute bottom-4 left-6 flex items-center gap-2">
              ${highlightedDishes.map((_, idx) => `
                <button class="carousel-dot w-3 h-3 rounded-full transition-all ${idx === 0 ? 'bg-primary w-8' : 'bg-surface-variant'}" data-index="${idx}"></button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Full Menu Section -->
      <section class="w-full px-margin-mobile lg:px-margin-desktop py-space-xl bg-surface-container-lowest border-t border-surface-variant/40">
        <div class="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <h2 class="font-headline-lg text-headline-lg text-on-surface">Cardápio Completo</h2>
              <p class="font-body-md text-body-md text-on-surface-variant">Confira todas as nossas opções artesanais preparadas diariamente.</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="open-login-modal-btn px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-all">
                Fazer Pedido
              </button>
              <button class="open-staff-modal-btn px-space-md py-space-sm rounded-xl border border-outline text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-all">
                Área do Funcionário
              </button>
            </div>
          </div>

          <!-- Menu Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            ${dishes.map(dish => {
              const avail = store.getDishAvailability(dish);
              return `
                <div class="flex flex-col justify-between bg-surface-container-low rounded-2xl p-space-md border border-surface-variant/50 hover:shadow-md transition-all ${!avail.disponivel ? 'opacity-70 grayscale-[0.3]' : ''}">
                  <div class="flex flex-col gap-space-xs">
                    <div class="relative w-full h-48 rounded-xl overflow-hidden mb- space-xs bg-surface-container-high">
                      <img src="${dish.imagem_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}" alt="${dish.nome}" class="w-full h-full object-cover">
                      <span class="absolute top-3 right-3 px-3 py-1 rounded-full font-label-sm text-label-sm ${avail.disponivel ? 'bg-emerald-700 text-white' : 'bg-red-800 text-white'} shadow-md">
                        ${avail.disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <h3 class="font-headline-sm text-headline-sm text-on-surface">${dish.nome}</h3>
                      <span class="text-xl">${dish.emoji || '🍽️'}</span>
                    </div>
                    <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">${dish.descricao}</p>
                  </div>
                  <div class="pt-space-md flex items-center justify-between border-t border-surface-variant/30 mt-space-md">
                    <span class="font-headline-sm text-headline-sm text-primary font-bold">R$ ${dish.preco.toFixed(2).replace('.', ',')}</span>
                    ${avail.disponivel ? `
                      <button class="open-login-modal-btn px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary font-label-md font-medium hover:bg-secondary/90 transition-all">
                        Pedir
                      </button>
                    ` : `
                      <span class="font-label-sm text-label-sm text-error bg-error-container/50 px-2 py-1 rounded">Esgotado</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    </div>
  `;

  // Attach Carousel Logic
  const track = container.querySelector('#carousel-track');
  const dots = container.querySelectorAll('.carousel-dot');
  const totalSlides = highlightedDishes.length;

  const updateSlide = (index) => {
    currentSlideIndex = (index + totalSlides) % totalSlides;
    if (track) {
      track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.className = 'carousel-dot w-8 h-3 rounded-full bg-primary transition-all';
      } else {
        dot.className = 'carousel-dot w-3 h-3 rounded-full bg-surface-variant transition-all';
      }
    });
  };

  container.querySelector('#slide-prev')?.addEventListener('click', () => {
    updateSlide(currentSlideIndex - 1);
  });
  container.querySelector('#slide-next')?.addEventListener('click', () => {
    updateSlide(currentSlideIndex + 1);
  });
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      updateSlide(idx);
    });
  });

  // Autoplay carousel every 5s (RF-06)
  carouselInterval = setInterval(() => {
    updateSlide(currentSlideIndex + 1);
  }, 5000);

  // Attach login modal triggers
  container.querySelectorAll('.open-login-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => window.openTableLoginModal());
  });
  container.querySelectorAll('.open-staff-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => window.openStaffLoginModal());
  });
}
