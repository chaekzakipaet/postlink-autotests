import {
  test,
  expect,
  request as playwrightRequest,
  APIRequestContext,
} from "@playwright/test";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

let api: APIRequestContext;

test.describe("API авторизации", () => {
  test.beforeAll(async () => {
    api = await playwrightRequest.newContext({
      baseURL: API_URL,
    });
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test("Успешная авторизация пользователя через API", async () => {
    const response = await api.post("/auth/login", {
      form: {
        username: process.env.TEST_USER_EMAIL!,
        password: process.env.TEST_USER_PASSWORD!,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.access_token).toBeTruthy();
    expect(body.refresh_token).toBeTruthy();
    expect(body.token_type).toBe("bearer");
  });

  test("Авторизация с неверным паролем возвращает ошибку", async () => {
    const response = await api.post("/auth/login", {
      form: {
        username: process.env.TEST_USER_EMAIL!,
        password: "WrongPassword123!",
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.detail).toBe(
      "Проверьте корректность введённых данных и попробуйте ещё раз.",
    );
  });

  test("Авторизация с несуществующим пользователем возвращает ошибку", async () => {
    const response = await api.post("/auth/login", {
      form: {
        username: "not_exist_user@example.com",
        password: "WrongPassword123!",
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.detail).toBe(
      "Проверьте корректность введённых данных и попробуйте ещё раз.",
    );
  });
});
