// import { test } from '@playwright/test';
// import { DashboardPage } from '../../../src/UI/orangehrm/pages/DashboardPage';

// let dashboardPage: DashboardPage;

// test.use({ storageState: '.auth/admin.json' });

// test.beforeEach(async ({ page }) => {
//     dashboardPage = new DashboardPage(page);
//     await dashboardPage.navigate();
// });

// test.describe('Dashboard Page', () => {
//     test('shows the dashboard heading and core widgets', async () => {
//         await dashboardPage.checkDashboard();
//         await dashboardPage.checkCoreWidgets();
//     });

//     test('shows the additional dashboard sections', async () => {
//         await dashboardPage.checkBuzzAndDistributionWidgets();
//     });

//     test('opens the PIM page from the dashboard sidebar', async () => {
//         const pimPage = await dashboardPage.navigateToPIM();
//         await pimPage.checkPIMPage();
//     });
// });