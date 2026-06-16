import { expect, type Locator, type Page } from '@playwright/test';
import { ROUTES } from   '../../../config/orangehrm/routes'

export class PimPage {

    readonly page: Page;

    // Locators
    readonly pimHeader: Locator;
    readonly addEmployeeBtn: Locator;
    readonly employeeNameInput: Locator;
    readonly searchBtn: Locator;
    readonly employeeRows: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pimHeader = page.getByRole('heading', { name: 'PIM' });

        this.addEmployeeBtn = page.getByRole('button', { name: 'Add' });

        this.employeeNameInput = page.locator(
            "input[placeholder='Type for hints...']"
        );

        this.searchBtn = page.getByRole('button', { name: 'Search' });

        this.employeeRows = page.locator('.oxd-table-card');
    }

    // ---------------- Navigation ----------------

    async navigate() {
        await this.page.goto(ROUTES.PIM);
    }

    // ---------------- Validations ----------------

    async checkPIMPage() {
        await expect(this.pimHeader).toBeVisible();
    }

    async verifyEmployeesTableVisible() {
        await expect(this.employeeRows.first()).toBeVisible();
    }

    // ---------------- Actions ----------------

    async clickAddEmployee() {
        await this.addEmployeeBtn.click();
    }

    async searchEmployee(name: string) {
        await this.employeeNameInput.fill(name);
        await this.searchBtn.click();
    }
}