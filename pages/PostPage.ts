import { Page } from '@playwright/test';

export class PostPage {
    constructor(private page: Page) {}

    readonly postTitle = (title: string) =>
        this.page.getByRole('heading', { name: title });

    readonly postContent = (content: string) =>
        this.page.getByText(content);
}