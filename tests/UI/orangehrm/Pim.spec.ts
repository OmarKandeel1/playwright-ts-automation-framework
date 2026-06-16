import { test, expect } from '@playwright/test';
import { PimPage } from '../../../src/UI/orangehrm/pages/PIMPage';


test.describe('PIM Module', () => {

    test.use({
        storageState: '.auth/admin.json'
    });

    test('Open PIM page and verify UI', async ({ page }) => {

        const pim = new PimPage(page);
        await pim.navigate();
        await pim.checkPIMPage();
    });

});