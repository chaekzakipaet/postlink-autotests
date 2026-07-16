import {
  test,
  expect,
  request as playwrightRequest,
  APIRequestContext,
} from "@playwright/test";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

let api: APIRequestContext;
let accessToken: string;

test.describe("API лайков", () => {
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

  test("Поставить лайк на пост через API", async () => {
    const createResponse = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: `Пост для лайка ${Date.now()}`,
        content:
          "Это тестовый пост для проверки постановки лайка. Он содержит достаточное количество символов для прохождения валидации.",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();

    const likeResponse = await api.post(`/posts/${createdPost.id}/like`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(likeResponse.status()).toBe(201);

    const like = await likeResponse.json();

    expect(like.post_id).toBe(createdPost.id);
    expect(typeof like.user_id).toBe("string");
    expect(like.created_at).toBeTruthy();
  });

  test("Убрать лайк с поста через API", async () => {
    const createResponse = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: `Пост для удаления лайка ${Date.now()}`,
        content:
          "Это тестовый пост для проверки удаления лайка. Он содержит достаточное количество символов для прохождения валидации.",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();

    await api.post(`/posts/${createdPost.id}/like`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const unlikeResponse = await api.delete(`/posts/${createdPost.id}/like`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(unlikeResponse.status()).toBe(204);
  });
});
