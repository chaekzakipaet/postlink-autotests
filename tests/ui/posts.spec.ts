import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CreatePostPage } from "../pages/CreatePostPage";
import { MainPage } from "../pages/MainPage";
import { PostPage } from "../pages/PostPage";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

test.describe("Создание постов", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await loginPage.expectLoggedIn();

    await page.waitForLoadState("networkidle");
  });

  test("Авторизованный пользователь открывает форму создания поста", async ({
    page,
  }) => {
    const createPostPage = new CreatePostPage(page);

    await test.step("Переход на страницу создания поста", async () => {
      await createPostPage.openCreatePost();
    });

    await test.step("Проверка отображения формы создания поста", async () => {
      await expect(createPostPage.titleInput).toBeVisible();
      await expect(createPostPage.contentEditor).toBeVisible();
      await expect(createPostPage.publishButton).toBeVisible();
    });
  });

  test("Авторизованный пользователь может создать новый пост", async ({
    page,
  }) => {
    const createPostPage = new CreatePostPage(page);
    const mainPage = new MainPage(page);
    const postPage = new PostPage(page);

    const uniqueId = Date.now();

    const testPost = {
      title: `Автотест ${uniqueId}`.slice(0, 50),
      content: `Это тестовый пост через Playwright ${uniqueId}. Он содержит достаточно символов для проверки создания поста.`,
    };

    expect(testPost.title.length).toBeGreaterThanOrEqual(3);
    expect(testPost.title.length).toBeLessThanOrEqual(50);

    expect(testPost.content.length).toBeGreaterThanOrEqual(50);
    expect(testPost.content.length).toBeLessThanOrEqual(5000);

    await createPostPage.openCreatePost();

    await createPostPage.titleInput.fill(testPost.title);

    await createPostPage.contentEditor.click();
    await page.keyboard.insertText(testPost.content);

    await createPostPage.publishButton.click();

    await expect(page).toHaveURL(/\/$/);

    await expect(mainPage.postCardTitle(testPost.title)).toBeVisible();

    await mainPage.openPost(testPost.title);

    await expect(page).toHaveURL(/\/posts\/.+/);

    await expect(postPage.postTitle(testPost.title)).toBeVisible();

    await expect(postPage.postContent(testPost.content)).toBeVisible();
  });

  test("Пользователь не может создать пост с коротким заголовком", async ({
    page,
  }) => {
    const createPostPage = new CreatePostPage(page);

    const invalidPost = {
      title: "ab",
      content:
        "Это валидный текст поста, который содержит больше пятидесяти символов.",
    };

    await createPostPage.openCreatePost();

    await createPostPage.contentEditor.click();
    await page.keyboard.insertText(invalidPost.content);

    await createPostPage.titleInput.fill(invalidPost.title);

    await expect(createPostPage.publishButton).toBeDisabled();
  });

  test("Пользователь не может создать пост с длинным заголовком", async ({
    page,
  }) => {
    const createPostPage = new CreatePostPage(page);

    const invalidPost = {
      title: "A".repeat(51),
      content:
        "Это валидный текст поста, который содержит больше пятидесяти символов.",
    };

    await createPostPage.openCreatePost();

    await createPostPage.contentEditor.click();
    await page.keyboard.insertText(invalidPost.content);

    await createPostPage.titleInput.fill(invalidPost.title);

    await expect(createPostPage.publishButton).toBeDisabled();
  });

  test("Пользователь не может создать пост с коротким текстом", async ({
    page,
  }) => {
    const createPostPage = new CreatePostPage(page);

    const invalidPost = {
      title: "Автотестовый заголовок",
      content: "Короткий текст",
    };

    await createPostPage.openCreatePost();

    await createPostPage.titleInput.fill(invalidPost.title);

    await createPostPage.contentEditor.click();

    await page.keyboard.insertText(invalidPost.content);

    await expect(createPostPage.publishButton).toBeDisabled();
  });

  test("Пользователь не может создать пост с длинным текстом", async ({
    page,
  }) => {
    const createPostPage = new CreatePostPage(page);

    const invalidPost = {
      title: "Автотестовый заголовок",
      content: "A".repeat(5001),
    };

    await createPostPage.openCreatePost();

    await createPostPage.titleInput.fill(invalidPost.title);

    await createPostPage.contentEditor.click();

    await page.keyboard.insertText(invalidPost.content);

    await expect(createPostPage.publishButton).toBeDisabled();
  });
});
