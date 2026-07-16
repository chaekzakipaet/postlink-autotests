import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly modal: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly passwordToggle: Locator; //иконка глазок
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;
    readonly registerLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.modal = page.getByTestId('auth-modal');
        this.emailInput = this.modal.locator('#username');
        this.passwordInput = this.modal.locator('#password');

        this.loginButton = this.modal.getByTestId('sign-in-btn');

        this.passwordToggle = this.modal
            .locator('div')
            .filter({
                has: this.modal.locator('svg'),
            });
            
        this.errorMessage = page.getByText('Invalid login or password.').first();
        this.forgotPasswordLink = this.modal.getByRole('button', { name: 'Forgot password?' });
        this.registerLink = this.modal.getByTestId('auth-tab-signup').first();
    }

/**
 * Открыть страницу авторизации
 */
    async goto() {
        await this.page.goto('/');
        await this.page.getByTestId('header-signin-btn').click();
        await expect(this.modal).toBeVisible();
    }

/**
 * Выполнить вход в систему
 * @param email - почта из .evn
 * @param password - пароль из .evn
 */
    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click({ force: true });
    }

/**
 * Переключить видимость пароля
 */
    async togglePasswordVisibility() {
        await this.passwordToggle.click();
    }
}
