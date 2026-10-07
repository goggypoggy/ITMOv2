import { test, expect } from '@playwright/test';

test.describe('Feature A: Level Switcher', () => {
  test('renders default level and updates program and pricing on change', async ({ page }) => {
    await page.goto('/');

    // Default render should be Новичок
    const activeBtn = page.locator('#level-switcher .level-switcher__btn.is-active');
    await expect(activeBtn).toHaveCount(1);
    await expect(activeBtn).toHaveText(/Новичок/);

    // Program items render
    const catalog = page.locator('#catalog-list .catalog__item');
    await expect(catalog.first()).toBeVisible();
    const countCatalog = await catalog.count();
    expect(countCatalog).toBeGreaterThan(0);
    const firstCatalogText = await catalog.first().textContent();
    expect(firstCatalogText || '').toMatch(/Введение|Основы JavaScript|DOM/);

    // Pricing cards render
    const pricingCards = page.locator('#pricing-cards .pricing-card');
    await expect(pricingCards.first()).toBeVisible();
    const countPricing = await pricingCards.count();
    expect(countPricing).toBeGreaterThan(0);

    // Switch to Средний and verify content updates
    await page.getByRole('tab', { name: 'Средний' }).click();
    const activeMid = page.locator('#level-switcher .level-switcher__btn.is-active');
    await expect(activeMid).toHaveText(/Средний/);

    // Program should include async topics
    await expect(catalog.first()).toContainText(/Асинхронность|Модули ES|Тестирование/);

    // Pricing should reflect Средний level names
    await expect(pricingCards.first()).toContainText(/Практика|Ментор/);

    // Switch to Продвинутый and verify
    await page.getByRole('tab', { name: 'Продвинутый' }).press('Enter');
    await expect(page.locator('#level-switcher .level-switcher__btn.is-active')).toHaveText(/Продвинутый/);
    await expect(catalog.first()).toContainText(/Проектирование|Производительность JS|Паттерны|Алгоритмы/);
  });
});
