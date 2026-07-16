import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly modal: Locator;
    readonly headerSignInButton: Locator;
    readonly signUpTab: Locator;

    readonly nicknameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly privacyCheckbox: Locator;
    readonly dataProcessingCheckbox: Locator;
    readonly registerButton: Locator;
    readonly successMessage: Locator;
    readonly errorNotification: Locator;

    constructor(page: Page) {
        this.page = page;

        this.modal = page.getByTestId('auth-modal').first();
        this.headerSignInButton = page.getByTestId('header-signin-btn');
        this.signUpTab = this.modal.getByTestId('auth-tab-signup').first();

        this.nicknameInput = this.modal.locator('input[name="username"]');
        this.emailInput = this.modal.locator('input[name="email"]');
        this.passwordInput = this.modal.locator('input[name="password"]');
        this.confirmPasswordInput = this.modal.locator('input[name="confirm_password"]');
        this.privacyCheckbox = this.modal.locator('input[name="privacy_policy"]');
        this.dataProcessingCheckbox = this.modal.locator('input[name="data_processing"]');
        this.registerButton = this.modal.getByTestId('create-account-btn').first();
        this.successMessage = page.getByText('Registration successful! Check your email for confirmation.').first();
        this.errorNotification = page.getByText('Field cannot be empty.').first();
    }

    /**
     * Метод для перехода к форме регистрации через интерфейс главной страницы
     */
    async goto() {
        await this.page.goto('/');
        await this.headerSignInButton.click();
        await this.signUpTab.click();
        await expect(this.nicknameInput).toBeVisible();
    }

    async fillRegistrationForm(nickname: string, email: string, pass: string) {
        await this.nicknameInput.fill(nickname);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.confirmPasswordInput.fill(pass);
    }

    async submit() {
        await this.registerButton.click({ force: true });
    }
}
