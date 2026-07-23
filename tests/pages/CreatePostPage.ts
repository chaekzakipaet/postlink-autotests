import { Page, Locator, expect } from "@playwright/test";

export class CreatePostPage {
  readonly page: Page;

  readonly newPostButton: Locator;
  readonly titleInput: Locator;
  readonly contentEditor: Locator;
  readonly imageUpload: Locator;
  readonly publishButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.newPostButton = page.getByTitle("New post");

    this.titleInput = page.getByPlaceholder("Enter post title");

    this.contentEditor = page.locator(
      "#simplemde-editor-1-wrapper .CodeMirror",
    );

    this.imageUpload = page.getByLabel(
      "Click to upload or drag and dropPNG, JPEG, GIF up to 500 KB",
    );

    this.publishButton = page.getByRole("button", {
      name: "Post Now",
    });
  }

  async openCreatePost() {
    await expect(this.newPostButton).toBeVisible();
    await expect(this.newPostButton).toBeEnabled();

    await Promise.all([
      this.page.waitForURL("**/posts/new"),
      this.newPostButton.click(),
    ]);

    await expect(this.titleInput).toBeVisible({
      timeout: 10000,
    });
  }
}
