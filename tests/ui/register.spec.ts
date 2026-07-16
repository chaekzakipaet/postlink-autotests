import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { acceptRegistrationAgreements } from "../helpers/checkbox";

test.describe("Модуль 1: Регистрация", () => {
  test("Регистрация нового пользователя (М1-1)", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const uniqueId = Date.now();
    const testUser = {
      login: `user_${uniqueId}`,
      email: `test_${uniqueId}@example.com`,
      password: "Password12345!",
    };

    await test.step("1 Переход к форме регистрации", async () => {
      await registerPage.goto();
    });

    await test.step("2 Заполнение формы и отправка", async () => {
      await registerPage.fillRegistrationForm(
        testUser.login,
        testUser.email,
        testUser.password,
      );
      await acceptRegistrationAgreements(registerPage.modal);
      await registerPage.submit();
    });

    await test.step("3 Проверка уведомления об успехе", async () => {
      await expect(registerPage.successMessage).toBeVisible();
    });
  });

  test("Регистрация с пустым обязательным полем логина (М1-2)", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await test.step("1 Заполнение всех данных, кроме логина", async () => {
      await registerPage.emailInput.fill(`test_${Date.now()}@example.com`);
      await registerPage.passwordInput.fill("ValidPassword123!");
      await registerPage.confirmPasswordInput.fill("ValidPassword123!");
      await acceptRegistrationAgreements(registerPage.modal);
      await registerPage.submit();
    });

    await test.step("2 Проверка клиентской валидации", async () => {
      await expect(registerPage.errorNotification).toBeVisible();
    });
  });

  test("Регистрация с несовпадающими паролями показывает ошибку", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.nicknameInput.fill("valid_user");
    await registerPage.emailInput.fill(`test_${Date.now()}@example.com`);
    await registerPage.passwordInput.fill("ValidPassword123!");
    await registerPage.confirmPasswordInput.fill("AnotherPassword123!");
    await acceptRegistrationAgreements(registerPage.modal);
    await registerPage.submit();

    await expect(
      page.getByText("Passwords do not match").first(),
    ).toBeVisible();
  });

  test("Регистрация с уже занятым email показывает безопасное сообщение", async ({
    page,
  }) => {
    await page.route("**/auth/register", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Пользователь с таким email уже существует",
        }),
      });
    });

    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.fillRegistrationForm(
      "valid_user",
      "taken@example.com",
      "ValidPassword123!",
    );
    await acceptRegistrationAgreements(registerPage.modal);
    await registerPage.submit();

    await expect(
      page
        .getByText(
          "We couldn't complete registration. Check your details, or sign in if you already have an account.",
        )
        .first(),
    ).toBeVisible();
  });
});
