# 🎭 playwright-ts-orangehrm-framework

A personal learning project built with **Playwright** and **TypeScript**, covering both **UI** and **API** test automation across two real-world applications — **OrangeHRM** and **Restful-Booker**.

> **Author:** Omar Kandeel  
> **Purpose:** Learning & Portfolio  
> **Stack:** Playwright · TypeScript · GitHub Actions

---

## 📌 Overview

This framework demonstrates end-to-end and API test automation best practices including:

- Page Object Model (POM) for UI layer
- API helper classes for clean API interaction
- CSRF token extraction and injection for secure login flows
- Session state reuse via Playwright Storage State
- Data-driven testing using TypeScript data files
- Centralized route configuration
- CI/CD integration with GitHub Actions

---

## 🗂️ Project Structure

```
playwright-ts-orangehrm-framework/
│
├── .auth/                          # Persisted browser session state (admin.json)
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI pipeline
│
├── src/
│   ├── API/
│   │   ├── OrangeHRM/
│   │   │   └── LoginApi.ts         # OrangeHRM API login helper (with CSRF handling)
│   │   └── Restful-booker/
│   │       ├── Booking.ts          # Booking API helper class
│   │       └── Constants.ts        # Base URL constants
│   ├── UI/
│   │   └── orangehrm/
│   │       ├── components/
│   │       │   └── SidePanel.ts    # Sidebar navigation component
│   │       ├── fixtures/           # (reserved for custom fixtures)
│   │       └── pages/
│   │           ├── LoginPage.ts    # Login Page Object
│   │           ├── DashboardPage.ts# Dashboard Page Object
│   │           └── PIMPage.ts      # PIM Module Page Object
│   └── config/
│       └── orangehrm/
│           └── routes.ts           # Centralized route constants
│
├── test-data/
│   ├── OrangeHRM/
│   │   ├── login-users.ts          # Valid/invalid user data + error messages
│   │   └── login-users.json        # Supplementary login data
│   └── Restful-booker/
│       └── booking-data.ts         # Booking payload + headers
│
├── tests/
│   ├── API/
│   │   ├── OrangeHRM/
│   │   │   └── LoginApi.spec.ts    # OrangeHRM API login tests
│   │   └── RestfulBooker/
│   │       └── Booking.spec.ts     # Restful-Booker booking API tests
│   └── UI/
│       └── orangehrm/
│           ├── LoginTests.spec.ts  # OrangeHRM UI login tests
│           └── Pim.spec.ts         # PIM module UI tests
│
├── global.setup.ts                 # Global auth setup (CSRF token + session state)
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

---

## 🔐 CSRF Token Handling

OrangeHRM's login form is protected by a **CSRF token** that changes on every page load. This framework handles it properly at two levels:

### 1. Global Setup (`global.setup.ts`)
Before any UI test runs, the global setup:
1. Sends a `GET` request to the login page
2. Extracts the `_token` from the HTML response using regex
3. Sends a `POST` to the validate endpoint with the username, password, and the extracted `_token`
4. Saves the resulting session to `.auth/admin.json` for reuse across all UI tests

```ts
const loginPage = await context.get(ROUTES.LOGIN);
const html = await loginPage.text();
const token = html.match(/:token="&quot;([^"]+)&quot;"/)?.[1];

await context.post(ROUTES.VALIDATE_LOGIN, {
    form: {
        username: tsData.validUsers[0].username,
        password: tsData.validUsers[0].password,
        _token: token || ''
    }
});
```

### 2. API Login Class (`src/API/OrangeHRM/LoginApi.ts`)
The `LoginApi` class exposes the same logic as a reusable helper for API-level login tests:

```ts
async getValidToken() {
    const loginPageResponse = await this.request.get(ROUTES.LOGIN);
    const html = await loginPageResponse.text();
    return html.match(/:token="&quot;([^"]+)&quot;"/)?.[1];
}

async login(username: string, password: string) {
    const token = await this.getValidToken();
    this.loginResponse = await this.request.post(ROUTES.VALIDATE_LOGIN, {
        form: { username, password, _token: token || '' }
    });
}
```

---

## 📊 Data-Driven Testing (TypeScript Data Files)

Test data is maintained as **typed TypeScript modules** (`.ts`) rather than raw JSON, giving full type safety and IDE autocomplete.

### OrangeHRM Login Data (`test-data/OrangeHRM/login-users.ts`)
```ts
export default {
    validUsers: [{ username: "Admin", password: "admin123" }],
    invalidUsers: [
        { username: "Admin",    password: "notadmin123" },
        { username: "notAdmin", password: "admin123"    },
        { username: "notAdmin", password: "notadmin123" },
    ],
    errors: {
        invalidcreds: "Invalid credentials",
        requiredMsg:  "Required"
    }
}
```

Tests loop over these datasets, generating **one test case per entry**:

```ts
for (const { username, password } of validUsers) {
    test(`Validating successful Login with username: ${username}`, async () => {
        const dashboardPage = await loginPage.login(username, password);
        await dashboardPage.checkDashboard();
    });
}
```

### Restful-Booker Booking Data (`test-data/Restful-booker/booking-data.ts`)
```ts
export default {
    user: {
        firstname: "naOmar", lastname: "Kandeel",
        totalprice: 111, depositpaid: true,
        bookingdates: { checkin: "2018-01-01", checkout: "2019-01-01" },
        additionalneeds: "Breakfast"
    },
    header: { "content-Type": "application/json", "Accept": "application/json" }
}
```

---

## 🧪 Applications Under Test

### 1. OrangeHRM — `https://opensource-demo.orangehrmlive.com`

| Layer | Test File | What's Tested |
|-------|-----------|---------------|
| UI | `LoginTests.spec.ts` | Valid login, invalid credentials, empty fields, delete employee via API interception |
| UI | `Pim.spec.ts` | PIM page loads and verifies UI using saved session |
| API | `LoginApi.spec.ts` | Successful login via POST with CSRF token, failed login (expected failure) |

### 2. Restful-Booker — `https://restful-booker.herokuapp.com`

| Layer | Test File | What's Tested |
|-------|-----------|---------------|
| API | `Booking.spec.ts` | Fetch booking by ID, filter by query params, create a new booking |

---

## 🏗️ Page Object Model (POM)

UI tests follow the **Page Object Model** pattern to separate locator definitions from test logic.

| Class | Responsibility |
|-------|---------------|
| `LoginPage` | Fills login form, clicks login, exposes validation assertions |
| `DashboardPage` | Verifies dashboard heading, navigates to PIM via `SidePanel` |
| `PimPage` | Navigates to PIM, verifies page, searches employees |
| `SidePanel` | Shared navigation component (PIM link, Admin link) |

Page objects return other page objects to enable **fluent chaining**:
```ts
const dashboardPage = await loginPage.login(username, password);
await dashboardPage.checkDashboard();
```

---

## ⚙️ Playwright Configuration

Three projects are defined in `playwright.config.ts`:

| Project | Test Directory | Storage State | Purpose |
|---------|---------------|---------------|---------|
| `chromium` | `./tests` | none | Full suite on Desktop Chrome |
| `ui` | `./tests/UI` | `.auth/admin.json` | UI tests using saved session |
| `api` | `./tests/API` | `undefined` | Stateless API tests |

- **Base URL:** `https://opensource-demo.orangehrmlive.com`
- **Retries:** 2 on CI, 0 locally
- **Workers:** 1 on CI (parallel locally)
- **Reporter:** HTML

---

## 🤖 AI-Assisted Test Generation (Playwright MCP)

This project integrates with **[`@playwright/mcp`](https://github.com/microsoft/playwright-mcp)** — Playwright's Model Context Protocol server — enabling AI coding assistants like **GitHub Copilot** to observe live browser state and generate test cases interactively.

### How it works

Rather than describing a page to the AI from memory, Playwright MCP lets the agent **navigate the actual app** and inspect its state in real time — resulting in more accurate locators and realistic test scenarios.

### Structured Agent Prompt (`test_prompt.md`)

To keep AI-generated code consistent with the project's architecture, a dedicated **agent prompt file** ([`test_prompt.md`](test_prompt.md)) acts as a rulebook for the AI before it writes a single line of code. It enforces:

| Rule | Constraint |
|------|------------|
| 📁 File placement | Strict directory mapping for pages, components, specs, and data files |
| 🧱 Page Object structure | Locator declarations, constructor init, fluent chaining conventions |
| 🔗 Route safety | No hardcoded URLs — all routes must reference `ROUTES` constants |
| 📊 Data-driven tests | Test inputs must live in `test-data/` files, never inline |
| ♻️ Reuse over duplication | Existing Page Objects must be extended, not recreated |

**Used for:** Generating `Dashboard.spec.ts` UI test cases by letting Copilot observe the live OrangeHRM dashboard via MCP and follow the structured prompt constraints.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- npm

### Installation

```bash
git clone https://github.com/OmarKandeel1/playwright-ts-orangehrm-framework.git
cd playwright-ts-orangehrm-framework
npm ci
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run only UI tests
npx playwright test --project=ui

# Run only API tests
npx playwright test --project=api

# Run with headed browser (visible)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

---

## 🔄 CI/CD — GitHub Actions

The pipeline runs automatically on every push or pull request to `main`/`master`.

**Pipeline steps:**
1. Checkout code
2. Set up Node.js (LTS)
3. `npm ci` — install dependencies
4. Install Playwright browsers with OS dependencies
5. Run all Playwright tests
6. Upload HTML report as a downloadable artifact (retained for 30 days)

> Workflow file: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@playwright/test` | ^1.60.0 | Core test runner & browser automation |
| `typescript-eslint` | ^8.61.0 | TypeScript linting |
| `@eslint/js` | ^10.0.1 | ESLint JavaScript rules |
| `@types/node` | ^25.9.3 | Node.js type definitions |
| `dotenv` | ^17.4.2 | Environment variable support |

---

## 📁 Key Design Decisions

- **TypeScript `.ts` data files** over plain JSON — enables type safety, reuse of interfaces, and computed values
- **CSRF token extraction** — handled programmatically instead of hardcoding or skipping, making the framework work realistically with the live demo site
- **Storage State reuse** — login is performed once in `global.setup.ts` and the session is shared across all UI tests, avoiding repeated login steps
- **Centralized routes** — all URL paths live in `src/config/orangehrm/routes.ts`, so any URL change requires only one edit
- **API helper classes** — `LoginApi` and `Booking` classes abstract raw `request.*` calls, keeping test specs clean and readable

---

*Made with ❤️ by Omar Kandeel — learning Playwright one test at a time.*
