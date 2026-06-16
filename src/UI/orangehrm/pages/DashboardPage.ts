import { expect, type Locator, type Page } from '@playwright/test';
import { ROUTES } from '../../../config/orangehrm/routes'
import { SidePanel } from '../components/SidePanel';

export class DashboardPage {

    readonly page: Page;
    readonly dashBoardHeaderLocator: Locator;
    readonly timeAtWorkWidgetLocator: Locator;
    readonly myActionsWidgetLocator: Locator;
    readonly quickLaunchWidgetLocator: Locator;
    readonly buzzLatestPostsWidgetLocator: Locator;
    readonly employeeDistributionBySubUnitLocator: Locator;
    readonly employeeDistributionByLocationLocator: Locator;
    readonly sidePanel: SidePanel;

    constructor(page: Page) {
        this.page = page
        this.dashBoardHeaderLocator = page.getByRole('heading', { name: 'Dashboard' });
        this.timeAtWorkWidgetLocator = page.getByText('Time at Work', { exact: true });
        this.myActionsWidgetLocator = page.getByText('My Actions', { exact: true });
        this.quickLaunchWidgetLocator = page.getByText('Quick Launch', { exact: true });
        this.buzzLatestPostsWidgetLocator = page.getByText('Buzz Latest Posts', { exact: true });
        this.employeeDistributionBySubUnitLocator = page.getByText('Employee Distribution by Sub Unit', { exact: true });
        this.employeeDistributionByLocationLocator = page.getByText('Employee Distribution by Location', { exact: true });
        this.sidePanel = new SidePanel(this.page);
    }

    async navigate() {
        await this.page.goto(ROUTES.DASHBOARD);
    }

    async navigateToPIM() {
        return await this.sidePanel.openPIM();
    }

    // Validations
    async checkDashboard() {
        await expect(this.dashBoardHeaderLocator).toBeVisible();
    }

    async checkCoreWidgets() {
        await expect(this.timeAtWorkWidgetLocator).toBeVisible();
        await expect(this.myActionsWidgetLocator).toBeVisible();
        await expect(this.quickLaunchWidgetLocator).toBeVisible();
    }

    async checkBuzzAndDistributionWidgets() {
        await expect(this.buzzLatestPostsWidgetLocator).toBeVisible();
        await expect(this.employeeDistributionBySubUnitLocator).toBeVisible();
        await expect(this.employeeDistributionByLocationLocator).toBeVisible();
    }
}