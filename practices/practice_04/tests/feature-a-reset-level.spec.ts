import { test, expect } from '@playwright/test';

test.describe('Feature A: Reset Level', () => {
  test('resets level to Novice and updates sections', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // Switch to another level first
    await page.getByRole('tab', { name: 'Средний' }).click();
    // Sanity: ensure some content changes
    const beforeCatalog = await page.locator('#catalog-list').innerText();

    // Click reset
    await page.getByRole('button', { name: /Сбросить уровень/ }).click();

    // Active tab back to Novice
    await expect(page.getByRole('tab', { name: 'Новичок' })).toHaveAttribute('aria-selected', 'true');

    // Sections updated
    await expect(page.locator('#catalog-list')).not.toHaveText(beforeCatalog);
    await expect(page.locator('#pricing-cards')).not.toBeEmpty();
  });

  test('idempotent reset when Novice is already active', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // Initially Novice is active
    await page.getByRole('tab', { name: 'Новичок' }).isVisible();
    const catalogItems = page.locator('#catalog-list .catalog__item');
    const pricingCards = page.locator('#pricing-cards .pricing-card');
    const catalogCountBefore = await catalogItems.count();
    const pricingCountBefore = await pricingCards.count();
    const firstCardTitleBefore = await pricingCards.first().locator('.pricing-card__title').innerText();

    // Click reset twice
    const resetBtn = page.getByRole('button', { name: /Сбросить уровень/ });
    await resetBtn.click();
    await resetBtn.click();

    // State should remain the same
    await expect(page.getByRole('tab', { name: 'Новичок' })).toHaveAttribute('aria-selected', 'true');
    await expect(catalogItems).toHaveCount(catalogCountBefore);
    await expect(pricingCards).toHaveCount(pricingCountBefore);
    await expect(pricingCards.first().locator('.pricing-card__title')).toHaveText(firstCardTitleBefore);
  });
});
