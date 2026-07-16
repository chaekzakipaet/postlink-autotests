import {
  test,
  expect,
  request as playwrightRequest,
  APIRequestContext,
} from "@playwright/test";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

let api: APIRequestContext;
let accessToken: string;

test.describe("API пользователя", () => {
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

  test("Получение информации о текущем пользователе через API", async () => {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBeTruthy();
    expect(body.email).toBe(process.env.TEST_USER_EMAIL);
    expect(body.username).toBeTruthy();
    expect(body.role).toBeTruthy();
    expect(typeof body.is_verified).toBe("boolean");
    expect(body.created_at).toBeTruthy();
  });

  test("Обновление профиля пользователя через API", async () => {
    const currentUserResponse = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(currentUserResponse.status()).toBe(200);

    const currentUser = await currentUserResponse.json();

    const oldUsername = currentUser.username;
    const newUsername = `autotest_${Date.now()}`;

    const updateResponse = await api.put("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        username: newUsername,
      },
    });

    expect(updateResponse.status()).toBe(200);

    const updatedUser = await updateResponse.json();

    expect(updatedUser.username).toBe(newUsername);

    const restoreResponse = await api.put("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        username: oldUsername,
      },
    });

    expect(restoreResponse.status()).toBe(200);
  });
});
