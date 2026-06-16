import { expect, type Locator, type Page } from '@playwright/test';
import { ROUTES } from   '../../../config/orangehrm/routes'
import { DashboardPage } from './DashboardPage';

export class LoginPage {


    readonly page                             : Page;
    readonly userNameInputLocator             : Locator;
    readonly passwordInputLocator             : Locator;
    readonly loginBtnLocator                  : Locator;
    readonly dashBoardHeaderLocator           : Locator;
    readonly invalidErrorMsgLocator           : Locator;
    readonly userNameRequiredMsgLocator       : Locator;
    readonly passwordRequiredMsgLocator       : Locator;



    constructor(page: Page) {
        this.page = page
        this.userNameInputLocator   = page.locator("input[name='username']");
        this.passwordInputLocator   = page.locator("input[name='password']");
        this.loginBtnLocator        = page.getByRole("button", { name: "Login" });
        this.dashBoardHeaderLocator = page.getByRole("heading").filter({ hasText: 'Dashboard' });
        this.invalidErrorMsgLocator = page.locator('.oxd-alert-content-text');
        this.userNameRequiredMsgLocator    = page.locator('.oxd-input-field-error-message').first();
        this.passwordRequiredMsgLocator    = page.locator('.oxd-input-field-error-message').last();
    }

    async navigate() {
        await this.page.goto(ROUTES.LOGIN);
    }

    async login(userName: string, password: string) : Promise<DashboardPage> {
        await this.userNameInputLocator.fill(userName);
        await this.passwordInputLocator.fill(password);
        await this.loginBtnLocator.click();

        return new DashboardPage(this.page);
    }



    // Validations
    async checkInvalidCredsErrorMsg(expectedMsg : string) {
       await expect(this.invalidErrorMsgLocator).toHaveText(expectedMsg);
    }

    async checkUsernameRequiredErrorMsg(expectedMsg : string) {
       await expect(this.userNameRequiredMsgLocator).toHaveText(expectedMsg);
    }

    async checkPasswordRequiredErrorMsg(expectedMsg : string) {
       await expect(this.passwordRequiredMsgLocator).toHaveText(expectedMsg);
    }

    



}