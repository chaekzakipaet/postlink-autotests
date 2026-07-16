import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const DELETE_USER = {
  email: process.env.DELETE_USER_EMAIL!,
  password: process.env.DELETE_USER_PASSWORD!,
};

test.describe("Модуль пользователя: удаление аккаунта", () => {
  test("Пользователь может открыть форму удаления аккаунта", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step("1 Авторизация пользователя", async () => {
      await loginPage.goto();
      await loginPage.login(DELETE_USER.email, DELETE_USER.password);

      await expect(page.getByTestId("auth-modal")).toHaveCount(0);
      await expect(page).toHaveURL("/");
    });

    await test.step("2 Переход в настройки", async () => {
      await page.goto("/settings");

      await page.waitForLoadState("networkidle");
    });

    await test.step("3 Открытие формы удаления аккаунта", async () => {
      await expect(
        page.getByText("Delete Account", { exact: true }),
      ).toBeVisible({
        timeout: 10000,
      });

      await page.getByText("Delete Account", { exact: true }).click();

      const passwordInput = page.locator("#delete_current_password");

      await expect(passwordInput).toBeVisible();
    });
  });
});
