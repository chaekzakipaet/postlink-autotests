import { Page } from '@playwright/test';

export class MainPage {
    constructor(private page: Page) {}

    readonly postCardTitle = (title: string) =>
        this.page.getByRole('heading', { name: title });

    async openPost(title: string) {
        await this.postCardTitle(title).click();
    }
}