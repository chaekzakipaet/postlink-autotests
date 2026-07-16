import { test, expect } from "@playwright/test";

test.describe("Главная страница", () => {
  test("Гость открывает главную страницу и видит поиск", async ({ page }) => {
    await test.step("1 Переход на главную страницу", async () => {
      await page.goto("/");

      await page.waitForLoadState("networkidle");

      await expect(
        page.getByPlaceholder("Search", { exact: true }),
      ).toBeVisible({
        timeout: 10000,
      });

      await expect(page).toHaveURL("/");
    });

    await test.step("2 Проверка отображения поиска", async () => {
      await expect(
        page.getByPlaceholder("Search", { exact: true }),
      ).toBeVisible();
    });

    await test.step("3 Проверка отсутствия модального окна авторизации", async () => {
      await expect(page.getByTestId("auth-modal")).toHaveCount(0);
    });
  });
});
