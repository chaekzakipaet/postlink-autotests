import { expect, type Locator, type Page } from '@playwright/test';

type CheckboxScope = Page | Locator;

export async function ensureCheckboxChecked(scope: CheckboxScope, name: string) {
    const checkbox = scope.locator(`input[type="checkbox"][name="${name}"]`);
    await checkbox.waitFor({ state: 'attached' });

    if (await checkbox.isChecked()) {
        return;
    }

    await checkbox.evaluate((element) => {
        (element as HTMLInputElement).click();
    });

    await expect(checkbox).toBeChecked();
}

export async function acceptRegistrationAgreements(scope: CheckboxScope) {
    await ensureCheckboxChecked(scope, 'privacy_policy');
    await ensureCheckboxChecked(scope, 'data_processing');
}
