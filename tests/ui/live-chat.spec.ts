import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LiveChatPage } from "../pages/LiveChatPage";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
  nickname: process.env.TEST_USER_NICKNAME!,
};

test.describe("Live Chat", () => {
  test("Авторизованный пользователь может отправить сообщение в чате", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // временная проверка авторизации
    await page.waitForTimeout(2000);

    console.log("URL:", page.url());
    console.log("EMAIL:", TEST_USER.email);

    await page.screenshot({
      path: "login-result.png",
    });

    await page.goto("/posts/7913a36a-b1cf-4d35-ab1f-24279481a525");

    const chat = new LiveChatPage(page);

    await expect(chat.messageInput).toBeVisible();

    const message = `Test message ${Date.now()}`;

    await chat.sendMessage(message);

    await page.waitForTimeout(3000);

    await page.screenshot({
      path: "chat-result.png",
    });
  });
});
