# PostLink Autotests

Automation tests for the PostLink web application.

The project contains API and UI automated tests written with **Playwright**, **TypeScript**, and **Page Object Model (POM)**.

## Tech Stack

* Playwright
* TypeScript
* Node.js
* Page Object Model (POM)
* API Testing
* Git

## Project Structure

```text
postlink-autotests/
│
├── tests/
│   │
│   ├── api/                    # API test scenarios
│   │   ├── auth.spec.ts
│   │   ├── likes.spec.ts
│   │   ├── posts.spec.ts
│   │   ├── saved-posts.spec.ts
│   │   └── users.spec.ts
│   │
│   ├── ui/                     # UI test scenarios
│   │   ├── auth.spec.ts
│   │   ├── delete-account.spec.ts
│   │   ├── delete-post.spec.ts
│   │   ├── home.spec.ts
│   │   ├── posts.spec.ts
│   │   ├── protected-routes.spec.ts
│   │   └── register.spec.ts
│   │
│   └── pages/                  # Page Object classes
│       ├── LoginPage.ts
│       ├── RegisterPage.ts
│       ├── CreatePostPage.ts
│       ├── MainPage.ts
│       ├── PostPage.ts
│       └── ProfilePage.ts
│
├── playwright.config.ts        # Playwright configuration
├── package.json
└── README.md
```

## Covered Scenarios

## API Testing

### Authentication

* Successful user authorization
* Authorization with invalid password
* Authorization with non-existing user

### Posts

* Get posts list
* Create post
* Create post with Markdown content
* Update post
* Delete post

### User

* Get current user profile
* Update user profile

### Likes

* Add like to post
* Remove like from post

### Saved Posts

* Save post
* Remove post from saved list

## UI Testing

### Authentication

* User login
* Login validation
* Password reset request flow

### Registration

* User registration
* Validation of required fields
* Password confirmation validation
* Registration with existing email

### Posts

* Open post creation page
* Create a new post
* Verify created post
* Validate title length limits
* Validate content length limits

### User Profile

* Access protected routes
* Open user profile
* Delete user account

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Environment Variables

Test credentials are stored in `.env` file:

```text
TEST_USER_EMAIL
TEST_USER_PASSWORD
BASE_URL
```

Example:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
BASE_URL=http://localhost:5173
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run API tests:

```bash
npx playwright test tests/api
```

Run UI tests:

```bash
npx playwright test tests/ui
```

Run a specific test file:

```bash
npx playwright test tests/ui/posts.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run tests with Playwright UI mode:

```bash
npx playwright test --ui
```

## Reports

After test execution Playwright generates an HTML report:

```bash
npx playwright show-report
```

## Test Results

Current test suite includes:

* API tests
* UI end-to-end tests
* Page Object Model architecture
* Positive and negative test scenarios
* Form validation checks
* Protected route checks

All tests are executed with Chromium browser.
