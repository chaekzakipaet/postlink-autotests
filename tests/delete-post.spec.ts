import {
  test,
  expect,
  request as playwrightRequest,
  APIRequestContext,
} from "@playwright/test";

import { LoginPage } from "../pages/LoginPage";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

let api: APIRequestContext;
let accessToken: string;
let postId: string;
let postTitle: string;

test.describe("Модуль постов: удаление поста", () => {
  test.beforeAll(async () => {
    api = await playwrightRequest.newContext({
      baseURL: API_URL,
    });

    const loginResponse = await api.post("/auth/login", {
      form: {
        username: TEST_USER.email,
        password: TEST_USER.password,
      },
    });

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();

    accessToken = body.access_token;

    expect(accessToken).toBeTruthy();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test("Пользователь может удалить свой пост через UI", async ({ page }) => {
    // 1. Создание тестового поста через API
    await test.step("1 Создание тестового поста через API", async () => {
      postTitle = `Автотест удаления поста ${Date.now()}`;

      const response = await api.post("/posts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          title: postTitle,
          content:
            "Это тестовый пост для проверки удаления через UI. Достаточное количество символов.",
        },
      });

      expect(response.status()).toBe(201);

      const body = await response.json();

      postId = body.id;
    });

    // 2. Авторизация в UI
    await test.step("2 Авторизация пользователя", async () => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login(TEST_USER.email, TEST_USER.password);

      await expect(page.getByTestId("auth-modal")).toHaveCount(0);
    });

    // 3. Поиск поста
    await test.step("3 Поиск созданного поста", async () => {
      await expect(page.getByText(postTitle, { exact: true })).toBeVisible();
    });

    // 4. Открытие меню поста
    await test.step("4 Открытие меню действий поста", async () => {
      const post = page.locator("article").filter({
        hasText: postTitle,
      });

      await post.getByLabel("Post actions").click();
    });

    // 5. Открытие удаления
    await test.step("5 Нажатие Delete", async () => {
      await page
        .getByRole("button", {
          name: "Delete",
        })
        .click();
    });

    // 6. Подтверждение удаления
    await test.step("6 Подтверждение удаления поста", async () => {
      const confirmationModal = page.getByLabel("Delete post confirmation");

      await expect(confirmationModal).toBeVisible();

      await confirmationModal
        .getByRole("button", {
          name: "Delete",
        })
        .click();
    });

    // 7. Проверка удаления
    await test.step("7 Проверка удаления поста", async () => {
      await expect(
        page.getByText(postTitle, { exact: true }),
      ).not.toBeVisible();

      const response = await api.get(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.status()).toBe(404);
    });
  });
});
