import { Page } from '@playwright/test';

export class PostPage {
    constructor(private page: Page) {}

    get postArticle() {
        return this.page.locator('article');
    }

    postTitle(title: string) {
        return this.postArticle.getByRole('heading', { name: title });
    }

    postContent(content: string) {
        return this.postArticle.getByText(content);
    }
}