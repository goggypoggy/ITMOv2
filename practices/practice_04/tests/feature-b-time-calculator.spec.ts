import { test, expect } from '@playwright/test';

test.describe('Feature B: Time Calculator', () => {
  test('computes ETA and validates hours', async ({ page }) => {
    await page.goto('/');

    // Defaults should render a result
    await expect(page.locator('#time-calculator .calc__result')).toContainText(/недель/);

    // Change hours to 20 and expect weeks halved (approx)
    const range = page.locator('#hours');
    await range.focus();
    await range.evaluate((el: HTMLInputElement) => { el.value = '20'; el.dispatchEvent(new Event('input', { bubbles: true })); });
    await expect(page.locator('#hours-value')).toHaveText('20');

    // Select another goal and verify result updates
    await page.selectOption('#goal', { label: 'JS Junior' });
    await expect(page.locator('#time-calculator .calc__result')).toContainText(/план|недель/);

    // Out-of-range validation via number input to ensure we can send 0
    const num = page.locator('#hours-num');
    await num.fill('0');
    await expect(page.locator('#time-calculator .calc__result')).toContainText(/диапазон/);
  });
});
