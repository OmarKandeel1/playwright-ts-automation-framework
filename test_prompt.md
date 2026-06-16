# Playwright MCP Test Generation Prompt

---

## 🔒 AGENT CONSTRAINTS — READ BEFORE GENERATING ANY CODE

You are a Playwright TypeScript test automation assistant.
Before writing any code, you MUST read and follow ALL rules below without exception.

---

### 1. PROJECT STRUCTURE — WHERE TO PUT FILES

| What you are creating | Where it goes |
|-----------------------|---------------|
| New Page Object class | `src/UI/orangehrm/pages/PageName.ts` |
| New shared component  | `src/UI/orangehrm/components/ComponentName.ts` |
| New route constant    | `src/config/orangehrm/routes.ts` — add to the existing `ROUTES` object |
| New UI test spec      | `tests/UI/orangehrm/TestName.spec.ts` |
| New API test spec     | `tests/API/OrangeHRM/TestName.spec.ts` or `tests/API/RestfulBooker/TestName.spec.ts` |
| New test data file    | `test-data/OrangeHRM/name.ts` or `test-data/Restful-booker/name.ts` |

**Never create files outside the structure above. Never put logic inside spec files that belongs in a Page Object.**

---

### 2. PAGE OBJECT CLASS RULES

Every Page Object class MUST follow this exact structure:

```ts
import { expect, type Locator, type Page } from '@playwright/test';
import { ROUTES } from '../../../config/orangehrm/routes';

export class MyPage {

    readonly page: Page;
    readonly someLocator: Locator;          // declare ALL locators here

    constructor(page: Page) {
        this.page = page;
        this.someLocator = page.getByRole('button', { name: 'Example' });
    }

    // Navigation
    async navigate() {
        await this.page.goto(ROUTES.MY_ROUTE);
    }

    // Actions
    async clickSomething() {
        await this.someLocator.click();
    }

    // Validations — always prefixed with "check" or "verify"
    async checkSomething() {
        await expect(this.someLocator).toBeVisible();
    }
}
```

Rules:
- ALL locators are declared as `readonly` properties at the top of the class
- ALL locators are initialized inside the `constructor` — NEVER inline them inside methods
- Actions are separate methods from validations
- Validation methods are prefixed with `check` or `verify`
- Navigation is always a separate `navigate()` method using `ROUTES`
- If an action leads to another page, return a `new OtherPage(this.page)` from the method

---

### 3. EXISTING PAGES — EXTEND, DO NOT DUPLICATE

The following Page Objects already exist. You MUST import and reuse them. Never recreate their logic.

| Class | File | What it does |
|-------|------|-------------|
| `LoginPage` | `src/UI/orangehrm/pages/LoginPage.ts` | Fills login form, clicks login, returns `DashboardPage` |
| `DashboardPage` | `src/UI/orangehrm/pages/DashboardPage.ts` | Verifies dashboard heading, navigates to PIM via `SidePanel` |
| `PimPage` | `src/UI/orangehrm/pages/PIMPage.ts` | Navigates to PIM, searches employees, verifies page |
| `SidePanel` | `src/UI/orangehrm/components/SidePanel.ts` | Clicks sidebar links (PIM, Admin), returns target page |

If the test steps require a page action or validation that is **missing** from an existing class:
- ADD the missing locator, action, or validation **to the existing class**
- Do NOT inline it in the spec file

---

### 4. ROUTES — NEVER HARDCODE URLs

All routes are defined in `src/config/orangehrm/routes.ts`:

```ts
export const ROUTES = {
  LOGIN:          '/web/index.php/auth/login',
  VALIDATE_LOGIN: '/web/index.php/auth/validate',
  DASHBOARD:      '/web/index.php/dashboard/index',
  PIM:            '/web/index.php/pim/viewEmployeeList'
};
```

- NEVER use a raw URL string like `page.goto('/web/index.php/...')` in a Page Object or spec
- If a new route is needed, add it to the `ROUTES` object first, then reference it

---

### 5. TEST SPEC RULES

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/UI/orangehrm/pages/LoginPage';
import tsData from '../../../test-data/OrangeHRM/login-users';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
});

test.describe('Feature Name', () => {

    test('does something specific', async ({ page }) => {
        // use Page Object methods only — no raw locators here
    });
});
```

Rules:
- Use `test.describe` to group related tests
- Use `test.beforeEach` for repeated setup (navigate, instantiate page object)
- NEVER use raw `page.locator()`, `page.click()`, or `page.fill()` directly inside a spec — all interactions go through Page Object methods
- For tests that need an authenticated session, add: `test.use({ storageState: '.auth/admin.json' });`
- For tests that must NOT use a session (e.g., login tests), add: `test.use({ storageState: undefined });`

---

### 6. DATA-DRIVEN TEST RULES

Test data MUST live in TypeScript files under `test-data/`, not inside spec files.

```ts
// test-data/OrangeHRM/my-data.ts
export default {
    items: [
        { input: 'value1', expected: 'result1' },
        { input: 'value2', expected: 'result2' },
    ]
}
```

Loop over it in the spec:
```ts
for (const { input, expected } of tsData.items) {
    test(`test name for ${input}`, async () => {
        // ...
    });
}
```

- NEVER hardcode test inputs inside `test()` blocks
- All expected messages/strings come from the data file

---

### 7. COMPONENT RULES

Shared UI elements that appear across multiple pages (e.g., sidebar, header, modals) are components.

- Components live in `src/UI/orangehrm/components/`
- A Page Object that uses a component declares it as a `readonly` property and initializes it in the constructor:
  ```ts
  readonly sidePanel: SidePanel;
  constructor(page: Page) {
      this.sidePanel = new SidePanel(this.page);
  }
  ```
- Never instantiate a component inside a method — always in the constructor

---

### 8. WHAT IS CURRENTLY MISSING (complete these when steps require it)

The following are known gaps in the existing codebase that you should fill in when the test steps touch them:

**`DashboardPage.ts`** is missing:
- A `navigate()` using `ROUTES.DASHBOARD` ✅ (already exists)
- Additional sidebar navigation methods beyond `navigateToPIM()` (e.g., `navigateToAdmin()`, `navigateToLeave()`, etc.) — add them via `SidePanel` as needed
- A `checkWelcomeMessage()` or user-greeting validation if steps require it

**`SidePanel.ts`** is missing:
- `openAdmin()` method is commented out — uncomment and complete it if steps require navigating to Admin

**`tests/UI/orangehrm/`** is missing:
- A dedicated Dashboard spec file (`Dashboard.spec.ts`)
- Any spec that tests navigation flows between modules

When you add a missing method to an existing class, add the locator to the constructor and the method in the correct section (Navigation / Actions / Validations).

---

## ✍️ TEST STEPS — 



**Target Application:** OrangeHRM  
**Test Type:** UI  
**Authentication:** logged in (use storage state) 
**pre conditions:** 
1. You are logged in using the default global setup that exists 
**Steps:**
1. open Orange HRM web site check the baseurl if you need it and login with valid username you will find it in test data
2. navigate to dashboard page and check what can be tested
3. go to dashboard page at our project and see what is missing and complete it
4. create test cases at the test for dashboard

**Expected Result:**
- to cover most important cases for dashboard page i don't want everything to be coverd

---


