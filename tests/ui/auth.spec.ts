import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
  nickname: process.env.TEST_USER_NICKNAME!,
};

test("Авторизация пользователя с корректными данными (М1-12)", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await test.step("1 Переход к форме входа", async () => {
    await loginPage.goto();
  });

  await test.step("2 Авторизация под тестовым пользователем", async () => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);
  });

  await test.step("3 Проверка успешного входа и закрытия модального окна", async () => {
    await expect(page.getByTestId("auth-modal")).toHaveCount(0);
    await expect(page.getByTestId("header-signin-btn")).toHaveCount(0);
    await expect(page).toHaveURL("/");
  });
});

test("Авторизация с пустым email показывает клиентскую ошибку (М1-13)", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login("", TEST_USER.password);

  await expect(
    page.getByText("Field cannot be empty.", { exact: true }),
  ).toBeVisible();
});

test("Авторизация с пустым паролем показывает клиентскую ошибку (М1-14)", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await test.step("1 Ввод email без пароля", async () => {
    await loginPage.emailInput.fill(TEST_USER.email);
    await loginPage.passwordInput.focus();
    await loginPage.passwordInput.blur();
    await loginPage.loginButton.click({ force: true });
  });

  await test.step("2 Проверка сообщения валидации", async () => {
    await expect(
      page.getByText("Field cannot be empty.").first(),
    ).toBeVisible();
    await expect(page.getByTestId("auth-modal")).toBeVisible();
  });
});

test("Авторизация с неверным паролем (М1-25)", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await test.step("1 Ввод корректного email и неверного пароля", async () => {
    await loginPage.login(TEST_USER.email, "InvalidPassword123!");
  });

  await test.step("2 Проверка сообщения об ошибке", async () => {
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page.getByTestId("auth-modal")).toBeVisible();
  });
});

test("Запрос восстановления пароля показывает экран отправки письма", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.forgotPasswordLink.click();

  await loginPage.modal.getByLabel("Email").fill(TEST_USER.email);

  await loginPage.modal
    .getByRole("button", { name: "Send Reset Link" })
    .click();

  await expect(
    page.getByText("Password Reset Link Sent").first(),
  ).toBeVisible();
});
