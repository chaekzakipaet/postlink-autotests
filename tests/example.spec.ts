import { test, expect } from '@playwright/test';

test('Главная страница PostLink открывается и показывает поиск', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header').locator('input[placeholder="Search"]')).toBeVisible();
    await expect(page.getByTestId('auth-modal')).toHaveCount(0);
});
