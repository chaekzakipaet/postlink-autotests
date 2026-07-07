import { test, expect, request as playwrightRequest } from '@playwright/test';

const API_URL = process.env.POSTLINK_API_URL ?? 'http://localhost:8000';

test.describe('API постов', () => {
    test('Получение списка постов через API', async () => {
        const api = await playwrightRequest.newContext({ baseURL: API_URL });

        const response = await api.get('/posts');
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);

        await api.dispose();
    });

    test('Создание поста через API', async () => {
        test.skip(!process.env.ACCESS_TOKEN, 'Нужен ACCESS_TOKEN для проверки создания поста на реальном backend.');

        const api = await playwrightRequest.newContext({
            baseURL: API_URL,
            extraHTTPHeaders: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        });

        const response = await api.post('/posts', {
            data: {
                title: `Автотестовый пост ${Date.now()}`,
                preview: 'Это текст в формате **Markdown**',
            },
        });

        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.title).toContain('Автотестовый пост');

        await api.dispose();
    });
});
