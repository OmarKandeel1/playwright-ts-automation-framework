import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {


    readonly page: Page;
    readonly userNameInputLocator   : Locator;
    readonly passwordInputLocator   : Locator;
    readonly loginBtnLocator        : Locator;
    readonly dashBoardHeaderLocator : Locator;
    readonly invalidErrorMsgLocator : Locator;
    readonly userNameRequiredMsg    : Locator;
    readonly passwordRequiredMsg    : Locator;


    readonly url : string = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

    constructor(page: Page) {
        this.page = page
        this.userNameInputLocator   = page.locator("input[name='username']");
        this.passwordInputLocator   = page.locator("input[name='password']");
        this.loginBtnLocator        = page.getByRole("button", { name: "Login" });
        this.dashBoardHeaderLocator = page.getByRole("heading").filter({ hasText: 'Dashboard' });
        this.invalidErrorMsgLocator = page.locator('.oxd-alert-content-text');
        this.userNameRequiredMsg    = page.locator('.oxd-input-field-error-message').first();
        this.passwordRequiredMsg    = page.locator('.oxd-input-field-error-message').last();
    }

    async navigate() {
        await this.page.goto(this.url);
    }

    async login(userName: string, password: string) {
        await this.userNameInputLocator.fill(userName);
        await this.passwordInputLocator.fill(password);
        await this.loginBtnLocator.click();
    }



    // Validations
    async checkNavigate() {
        await expect(this.page).toHaveURL(/dashboard/);
    }

    async checkDashboard() {
        await expect(this.dashBoardHeaderLocator).toBeVisible();
    }

    async checkInvalidCredsErrorMsg(expectedMsg : string) {
       await expect(this.invalidErrorMsgLocator).toHaveText(expectedMsg);
    }

    async checkUsernameRequiredErrorMsg(expectedMsg : string) {
       await expect(this.userNameRequiredMsg).toHaveText(expectedMsg);
    }

    async checkPasswordRequiredErrorMsg(expectedMsg : string) {
       await expect(this.passwordRequiredMsg).toHaveText(expectedMsg);
    }

    



}