import { catalogByLevel } from '../data/catalog.js';
import { pricingByLevel } from '../data/pricing.js';

function renderCatalog(level, container) {
  const modules = catalogByLevel[level] || [];
  container.innerHTML = modules
    .map(
      (m) => `
      <div class="catalog__item">
        <span class="catalog__badge">${m.badge}</span>
        <span class="catalog__title">${m.title}</span>
      </div>`
    )
    .join('');
}

function renderPricing(level, container) {
  const plans = pricingByLevel[level] || [];
  container.innerHTML = plans
    .map(
      (p) => `
      <article class="card pricing-card">
        <header class="pricing-card__header">
          <h3 class="pricing-card__title">${p.name}</h3>
          <div class="pricing-card__price">${p.price}</div>
        </header>
        <ul class="pricing-card__features">
          ${p.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
        <button class="btn btn--primary" type="button" aria-label="Выбрать тариф ${p.name}">Выбрать</button>
      </article>`
    )
    .join('');
}

export function initLevelSwitcher({ onChange } = {}) {
  const switcher = document.getElementById('level-switcher');
  if (!switcher) return;
  const buttons = Array.from(switcher.querySelectorAll('.level-switcher__btn'));
  const catalogEl = document.getElementById('catalog-list');
  const pricingEl = document.getElementById('pricing-cards');

  function setActive(level) {
    buttons.forEach((b) => {
      const active = b.dataset.level === level;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) b.setAttribute('tabindex', '0'); else b.setAttribute('tabindex', '-1');
    });
  }

  function apply(level) {
    setActive(level);
    if (catalogEl) renderCatalog(level, catalogEl);
    if (pricingEl) renderPricing(level, pricingEl);
    if (onChange) onChange(level);
  }

  // click/keyboard interaction
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => apply(btn.dataset.level));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        apply(btn.dataset.level);
      }
    });
  });

  // default
  apply('Новичок');
}

// Named exports for rendering if needed elsewhere
export const renderers = { renderCatalog, renderPricing };
