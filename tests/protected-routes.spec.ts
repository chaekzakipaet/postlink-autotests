import { test, expect } from '@playwright/test';

test.describe('Защищенные маршруты', () => {
    test('Гость на /profile видит модальное окно авторизации, а профиль скрыт', async ({ page }) => {
        await page.goto('/profile');

        await expect(page).toHaveURL(/\/profile$/);
        await expect(page.getByTestId('auth-modal')).toBeVisible();
        await expect(page.getByText('Profile Information').first()).not.toBeVisible();
    });

    test('Закрытие авторизации на /profile оставляет URL и показывает приглашение войти', async ({ page }) => {
        await page.goto('/profile');
        const modal = page.getByTestId('auth-modal').first();

        await expect(modal).toBeVisible();
        await modal.getByRole('button', { name: '×' }).click();

        await expect(page.getByTestId('auth-modal')).toHaveCount(0);
        await expect(page).toHaveURL(/\/profile$/);
        await expect(page.getByTestId('protected-guest-sign-in')).toBeVisible();
        await expect(page.getByText('Profile Information').first()).not.toBeVisible();
    });

    test('Вход с /profile закрывает модальное окно и оставляет пользователя на /profile', async ({ page }) => {
        await page.route('**/auth/login', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ access_token: 'mock_access_token', refresh_token: 'mock_refresh_token' }),
            });
        });
        await page.route('**/users/me', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: '00000000-0000-0000-0000-000000000001',
                    email: 'user@example.com',
                    username: 'user',
                    role: 'user',
                }),
            });
        });
        await page.route('**/posts', async (route) => {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
        });

        await page.goto('/profile');
        const modal = page.getByTestId('auth-modal').first();

        await modal.locator('input[name="username"]').fill('user@example.com');
        await modal.locator('input[name="password"]').fill('Abcdefghijk1!');
        await modal.getByTestId('sign-in-btn').click({ force: true });

        await expect(page.getByTestId('auth-modal')).toHaveCount(0);
        await expect(page).toHaveURL(/\/profile$/);
        await expect(page.getByText('Profile Information').first()).toBeVisible();
    });
});
