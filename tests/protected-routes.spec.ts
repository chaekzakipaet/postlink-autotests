import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

test.describe("Защищенные маршруты", () => {
  test("Гость на /profile видит модальное окно авторизации", async ({
    page,
  }) => {
    await page.goto("/profile");

    await expect(page).toHaveURL(/\/profile$/);

    await expect(page.getByTestId("auth-modal")).toBeVisible();

    await expect(
      page.getByText("Profile Information").first(),
    ).not.toBeVisible();
  });

  test("Закрытие авторизации на /profile оставляет гостя на странице", async ({
    page,
  }) => {
    await page.goto("/profile");

    const modal = page.getByTestId("auth-modal");

    await expect(modal).toBeVisible();

    await modal.getByTestId("auth-modal-close").click();

    await expect(page.getByTestId("auth-modal")).toHaveCount(0);

    await expect(page).toHaveURL(/\/profile$/);

    await expect(
      page.getByText("Profile Information").first(),
    ).not.toBeVisible();
  });

  test("Авторизованный пользователь открывает профиль", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await expect(page.getByTestId("auth-modal")).toHaveCount(0);

    await page.goto("/profile");

    await expect(page.getByText("Profile Information").first()).toBeVisible();

    await expect(page).toHaveURL(/\/profile$/);
  });
});
