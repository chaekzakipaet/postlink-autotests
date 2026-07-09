# PostLink Autotests

Automation tests for the PostLink web application.

The project contains end-to-end UI tests written with Playwright and TypeScript.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)
- Git

## Project Structure

```text
postlink-autotests/
│
├── pages/                 # Page Object classes
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── CreatePostPage.ts
│   ├── MainPage.ts
│   └── PostPage.ts
│
├── tests/                 # Test scenarios
│
├── playwright.config.ts   # Playwright configuration
├── package.json
└── README.md
```

## Covered Scenarios

### Authentication

- User login
- User registration

### Posts

- Open post creation page
- Fill post creation form
- Validate post title and content limits
- Create a new post
- Verify created post

## Installation

Install dependencies:

```bash
npm install
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run specific test file:

```bash
npx playwright test tests/posts.spec.ts
```

Run tests with UI mode:

```bash
npx playwright test --ui
```

## Test Data

Test credentials are stored in environment variables in `.env` file:
```text
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

## Reports

After test execution Playwright generates an HTML report:
```bash
npx playwright show-report
```