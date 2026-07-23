import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LiveChatPage } from "../pages/LiveChatPage";

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
  nickname: process.env.TEST_USER_NICKNAME!,
};

const TEST_USER_2 = {
  email: process.env.TEST_USER_2_EMAIL!,
  password: process.env.TEST_USER_2_PASSWORD!,
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

  test("Гость не может отправить сообщение в Live Chat", async ({ page }) => {
    await page.goto("/posts/7913a36a-b1cf-4d35-ab1f-24279481a525");

    const chat = new LiveChatPage(page);

    await expect(chat.guestMessageInput).toBeVisible();

    await expect(chat.guestMessageInput).toHaveAttribute("readonly", "");
  });

  test("Сообщение пользователя отображается у другого пользователя через WebSocket", async ({
    browser,
  }) => {
    const user1Page = await browser.newPage();
    const user2Page = await browser.newPage();

    const loginUser1 = new LoginPage(user1Page);
    const loginUser2 = new LoginPage(user2Page);

    await loginUser1.goto();
    await loginUser1.login(TEST_USER.email, TEST_USER.password);

    await loginUser1.expectLoggedIn();

    await loginUser2.goto();
    await loginUser2.login(TEST_USER_2.email, TEST_USER_2.password);

    await loginUser2.expectLoggedIn();

    const postUrl = "/posts/7913a36a-b1cf-4d35-ab1f-24279481a525";

    await user1Page.goto(postUrl);
    await user2Page.goto(postUrl);

    const chatUser1 = new LiveChatPage(user1Page);
    const chatUser2 = new LiveChatPage(user2Page);

    await expect(chatUser1.messageInput).toBeVisible();
    await expect(chatUser2.messageInput).toBeVisible();

    const message = `WebSocket message ${Date.now()}`;

    await chatUser1.sendMessage(message);

    await expect(user2Page.getByText(message)).toBeVisible({
      timeout: 10000,
    });

    await user1Page.close();
    await user2Page.close();
  });
});
