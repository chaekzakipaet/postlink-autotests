import {
  test,
  expect,
  request as playwrightRequest,
  APIRequestContext,
} from "@playwright/test";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

let api: APIRequestContext;
let accessToken: string;

test.describe("API сохранённых постов", () => {
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

  test("Сохранить пост через API", async () => {
    const createResponse = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: `Пост для сохранения ${Date.now()}`,
        content:
          "Это тестовый пост для проверки сохранения. Он содержит достаточное количество символов для прохождения валидации.",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();

    const saveResponse = await api.post(`/posts/${createdPost.id}/saved`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(saveResponse.status()).toBe(201);

    const savedPost = await saveResponse.json();

    expect(savedPost.post_id).toBe(createdPost.id);
    expect(typeof savedPost.user_id).toBe("string");
    expect(savedPost.created_at).toBeTruthy();
  });

  test("Удалить пост из сохранённых через API", async () => {
    const createResponse = await api.post("/posts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: `Пост для удаления из сохранённых ${Date.now()}`,
        content:
          "Это тестовый пост для проверки удаления из сохранённых. Он содержит достаточное количество символов для прохождения валидации.",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdPost = await createResponse.json();

    const saveResponse = await api.post(`/posts/${createdPost.id}/saved`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(saveResponse.status()).toBe(201);

    const deleteResponse = await api.delete(`/posts/${createdPost.id}/saved`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(deleteResponse.status()).toBe(204);
  });
});
