import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const DELETE_USER = {
  email: process.env.DELETE_USER_EMAIL!,
  password: process.env.DELETE_USER_PASSWORD!,
};

test.describe("Модуль пользователя: удаление аккаунта", () => {
  test("Пользователь может открыть форму удаления аккаунта", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("1 Авторизация пользователя", async () => {
      await loginPage.goto();
      await loginPage.login(DELETE_USER.email, DELETE_USER.password);

      await expect(page.getByTestId("auth-modal")).toHaveCount(0);
      await expect(page).toHaveURL("/");
    });

    await test.step("2 Переход в настройки", async () => {
      await page
        .locator("//a[@href='/settings']//div//*[name()='svg']")
        .click();
    });

    await test.step("3 Открытие формы удаления аккаунта", async () => {
      await page.getByText("Delete Account", { exact: true }).click();

      const passwordInput = page.locator("#delete_current_password");
      await expect(passwordInput).toBeVisible();

      await passwordInput.fill(DELETE_USER.password);

      await expect(
        page.getByRole("button", {
          name: "Permanently Delete My Account",
        }),
      ).toBeVisible();
    });
  });
});
