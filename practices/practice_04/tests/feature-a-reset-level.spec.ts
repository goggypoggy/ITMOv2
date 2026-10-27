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
});
