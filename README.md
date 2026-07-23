# PostLink Autotests

Automated API and UI tests for the **PostLink** web application.

The project contains automated tests written with **Playwright**, **TypeScript**, and **Page Object Model (POM)** principles.

---

# Tech Stack

* Playwright
* TypeScript
* Node.js
* Page Object Model (POM)
* API Testing
* Git

---

# Project Structure

```text
postlink-autotests/
│
├── tests/
│   │
│   ├── api/
│   │   ├── auth.spec.ts
│   │   ├── likes.spec.ts
│   │   ├── posts.spec.ts
│   │   ├── saved-posts.spec.ts
│   │   └── users.spec.ts
│   │
│   ├── ui/
│   │   ├── auth.spec.ts
│   │   ├── delete-account.spec.ts
│   │   ├── delete-post.spec.ts
│   │   ├── home.spec.ts
│   │   ├── live-chat.spec.ts
│   │   ├── posts.spec.ts
│   │   ├── protected-routes.spec.ts
│   │   └── register.spec.ts
│   │
│   └── pages/
│       ├── CreatePostPage.ts
│       ├── LoginPage.ts
│       ├── MainPage.ts
│       ├── PostPage.ts
│       ├── ProfilePage.ts
│       └── RegisterPage.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

# Covered Scenarios

## API Testing

### Authentication

* Successful authorization
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

* Add like to a post
* Remove like from a post

### Saved Posts

* Save post
* Remove post from saved posts

---

## UI Testing

### Authentication

* User login
* Login validation
* Password reset request

### Registration

* User registration
* Required fields validation
* Password confirmation validation
* Registration button state validation
* Registration with existing email

### Posts

* Open post creation page
* Create a new post
* Title length validation
* Content length validation
* Delete own post

### Live Chat

* Send chat message
* Guest cannot send messages
* Verify WebSocket message delivery

### Protected Routes

* Guest access restrictions
* Open protected pages after authentication

### User Profile

* Open user profile
* Update user profile (API)

---

# Installation

Install project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# Environment Variables

The project uses a `.env` file with test credentials.

Example:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
BASE_URL=http://localhost:5173
```

---

# Running Tests

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

Run Playwright UI mode:

```bash
npx playwright test --ui
```

---

# Reports

Generate and open the HTML report:

```bash
npx playwright show-report
```

---

# Current Automated Coverage

* API testing
* UI end-to-end testing
* Authentication
* Registration
* Posts CRUD
* Live Chat
* WebSocket communication
* Protected routes
* Positive and negative scenarios
* Form validation
* Page Object Model architecture

Tests are executed using the Chromium browser.

---

# Test Suite

Current test suite includes:

* **14 API tests**
* **26 UI tests**
* **40 automated tests** in total
