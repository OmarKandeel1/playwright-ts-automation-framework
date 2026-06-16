import { expect, type Locator, type Page } from '@playwright/test';
import { ROUTES } from '../../../config/orangehrm/routes'
import { SidePanel } from '../components/SidePanel';

export class DashboardPage {




    readonly page: Page;
    readonly dashBoardHeaderLocator: Locator;
    readonly sidePanel: SidePanel;


    constructor(page: Page) {
        this.page = page
        this.dashBoardHeaderLocator = page.getByRole('heading', { name: 'Dashboard' });
        this.sidePanel = new SidePanel(this.page);
    }

    async navigate() {
        await this.page.goto(ROUTES.DASHBOARD);
    }


    async navigateToPIM()
    {
        await this.sidePanel.openPIM();
    }





    // Validations
    async checkDashboard() {
        await expect(this.dashBoardHeaderLocator).toBeVisible();
    }




}