import {
  test,
  expect,
  request as playwrightRequest,
  APIRequestContext,
} from "@playwright/test";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

let api: APIRequestContext;
let accessToken: string;

test.describe("API постов", () => {
  test.beforeAll(async () => {
    api = await playwrightRequest.newContext({
      baseURL: API_URL,
    });

    const loginResponse = await api.post("/auth/login", {
      form: {
        username: process.env.TEST_USER_EMAIL!,
        password: process.env.TEST_USER_PASSWORD!,
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

  test("Получение списка постов через API", async () => {
    const response = await api.get("/posts");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("total");

    expect(Array.isArray(body.items)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(0);

    if (body.items.length > 0) {
      expect(body.items[0]).toHaveProperty("id");
      expect(body.items[0]).toHaveProperty("title");
      expect(body.items[0]).toHaveProperty("preview");
    }
  });

  test("Создание поста через API", async () => {
    const title = `Автотестовый пост ${Date.now()}`;

    const response = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title,
        content:
          "Это тестовый пост, созданный автоматически через Playwright. Он содержит достаточно символов для прохождения валидации поля content.",
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(201);

    expect(typeof body.id).toBe("string");
    expect(body.title).toBe(title);
    expect(body.content).toContain("Playwright");
    expect(typeof body.author_username).toBe("string");
    expect(body.is_published).toBe(true);

    const getResponse = await api.get(`/posts/${body.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(getResponse.status()).toBe(200);

    const createdPost = await getResponse.json();

    expect(createdPost.id).toBe(body.id);
    expect(createdPost.title).toBe(title);
    expect(createdPost.content).toContain("Playwright");
    expect(createdPost.preview).toContain("Playwright");
    expect(typeof createdPost.author_username).toBe("string");
  });

  test("Создание поста с Markdown-разметкой через API", async () => {
    const markdownContent = `
# Заголовок

**Жирный текст**

*Курсивный текст*

- Первый пункт
- Второй пункт

\`code block\`
  `.trim();

    const title = `Markdown пост ${Date.now()}`;

    const response = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title,
        content: markdownContent,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.title).toBe(title);
    expect(body.content).toContain("**Жирный текст**");
    expect(body.content).toContain("*Курсивный текст*");
    expect(body.content).toContain("- Первый пункт");

    const getResponse = await api.get(`/posts/${body.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(getResponse.status()).toBe(200);

    const createdPost = await getResponse.json();

    expect(createdPost.content).toContain("**Жирный текст**");
    expect(createdPost.content).toContain("*Курсивный текст*");
    expect(createdPost.content).toContain("- Первый пункт");
  });

  test("Редактирование поста через API", async () => {
    const createResponse = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: `Автотест ${Date.now()}`,
        content:
          "Это тестовый пост для проверки редактирования. Он содержит достаточно символов для прохождения валидации.",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();

    const updatedTitle = `Обновленный пост ${Date.now()}`;

    const updatedContent =
      "Это уже обновленный текст поста. Он также содержит достаточное количество символов для прохождения валидации.";

    const updateResponse = await api.put(`/posts/${createdPost.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: updatedTitle,
        content: updatedContent,
        image_urls: [],
        is_published: true,
      },
    });

    expect(updateResponse.status()).toBe(200);

    const updatedPost = await updateResponse.json();

    expect(updatedPost.title).toBe(updatedTitle);
    expect(updatedPost.content).toBe(updatedContent);

    const getResponse = await api.get(`/posts/${createdPost.id}`);

    expect(getResponse.status()).toBe(200);

    const actualPost = await getResponse.json();

    expect(actualPost.title).toBe(updatedTitle);
    expect(actualPost.content).toBe(updatedContent);
  });

  test("Удаление поста через API", async () => {
    const createResponse = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: `Автотест для удаления ${Date.now()}`,
        content:
          "Это тестовый пост для проверки удаления. Он содержит достаточно символов для прохождения валидации.",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();

    const deleteResponse = await api.delete(`/posts/${createdPost.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);

    const getResponse = await api.get(`/posts/${createdPost.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(getResponse.status()).toBe(404);
  });
});
