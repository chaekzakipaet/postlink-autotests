import { Page, Locator, expect } from "@playwright/test";

export class LiveChatPage {
  readonly page: Page;

  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly guestMessageInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.messageInput = page.locator(
      'input[placeholder="Write a message"]:not([readonly])',
    );

    this.guestMessageInput = page.getByRole("textbox", {
      name: "Sign in to join the chat",
    });

    this.sendButton = page
      .getByRole("button", {
        name: "Send message",
      })
      .last();
  }

  async sendMessage(text: string) {
    await expect(this.messageInput).toBeVisible();

    await this.messageInput.fill(text);

    await expect(this.sendButton).toBeEnabled({
      timeout: 5000,
    });

    await this.sendButton.click();
  }
}
