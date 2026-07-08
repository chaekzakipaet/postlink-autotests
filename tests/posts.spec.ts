import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CreatePostPage } from '../pages/CreatePostPage';
import { MainPage } from '../pages/MainPage';
import { PostPage } from '../pages/PostPage';

const TEST_USER = {
    email: process.env.TEST_USER_EMAIL!,
    password: process.env.TEST_USER_PASSWORD!,
};

test.describe('Создание постов', () => {

    test('Авторизованный пользователь открывает форму создания поста', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const createPostPage = new CreatePostPage(page);

        await test.step('1 Авторизация пользователя', async () => {
            await loginPage.goto();

            await loginPage.login(
                TEST_USER.email,
                TEST_USER.password
            );

            await expect(page.getByTestId('header-signin-btn')).toHaveCount(0);
        });

        await test.step('2 Переход на страницу создания поста', async () => {

            await createPostPage.newPostButton.click();

            await expect(page).toHaveURL('/posts/new');
        });

        await test.step('3 Проверка отображения формы создания поста', async () => {
            await expect(createPostPage.titleInput).toBeVisible();
            await expect(createPostPage.contentEditor).toBeVisible();
            await expect(createPostPage.publishButton).toBeVisible();
        });
    });

    test('Авторизованный пользователь может создать новый пост', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createPostPage = new CreatePostPage(page);
    const mainPage = new MainPage(page);
    const postPage = new PostPage(page);

    const testPost = {
    title: `Автотест ${Date.now()}`.slice(0, 50),
    content: `
        Это тестовый пост, созданный автоматически через Playwright.
        Он содержит достаточно символов для прохождения валидации поля Content.
    `.trim(),
    };

    expect(testPost.title.length).toBeGreaterThanOrEqual(3);
    expect(testPost.title.length).toBeLessThanOrEqual(50);

    expect(testPost.content.length).toBeGreaterThanOrEqual(50);
    expect(testPost.content.length).toBeLessThanOrEqual(5000);

    await loginPage.goto();
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await expect(page.getByTestId('header-signin-btn')).toHaveCount(0);

    await createPostPage.newPostButton.click();
    await expect(page).toHaveURL('/posts/new');

    await createPostPage.titleInput.fill(testPost.title);

    await createPostPage.contentEditor.click();
    await page.keyboard.type(testPost.content);

    await expect(createPostPage.titleInput).toHaveValue(testPost.title);

    await createPostPage.publishButton.click();

    // после публикации возвращаемся на главную
    await expect(page).toHaveURL('/');

    // проверяем, что пост появился
    await expect(mainPage.postCardTitle(testPost.title)).toBeVisible();

    // открываем пост
    await mainPage.openPost(testPost.title);

    // проверяем переход на страницу поста
    await expect(page).toHaveURL(/\/posts\/.+/);

    await expect(postPage.postTitle(testPost.title)).toBeVisible();

    await expect(postPage.postContent(testPost.content)).toBeVisible();
});

});