import { type Locator, type Page } from '@playwright/test';
import { PIMPage } from '../pages/PIMPage';

export class SidePanel {


    readonly page: Page;
    readonly pimLink: Locator;
    readonly adminLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pimLink = this.page.getByRole('link', { name: 'PIM' });
        this.adminLink = this.page.getByRole('link', { name: 'Admin' });
    }


    async openPIM() {
        await this.pimLink.click();
        return new PIMPage(this.page);
    }


    // async openAdmin() {
    //     await this.adminLink.click();
    //     return new AdminPage(this.page);
    // }


}