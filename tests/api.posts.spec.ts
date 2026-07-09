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

    console.log("LOGIN STATUS:", loginResponse.status());

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();

    console.log("LOGIN BODY:", body);

    accessToken = body.access_token;

    expect(accessToken).toBeTruthy();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test("Получение списка постов через API", async () => {
    const response = await api.get("/posts");

    console.log("GET /posts status:", response.status());

    expect(response.status()).toBe(200);

    const body = await response.json();

    console.log("GET /posts body:", body);

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

    console.log("POST /posts status:", response.status());

    const body = await response.json();

    console.log("POST /posts body:", body);

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

    console.log("GET /posts/:id body:", createdPost);

    expect(createdPost.id).toBe(body.id);
    expect(createdPost.title).toBe(title);
    expect(createdPost.content).toContain("Playwright");
    expect(createdPost.preview).toContain("Playwright");
    expect(createdPost.author_username).toBe(body.author_username);
  });
});
