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


    test("Validating deleting emp", async ({ page, request }) => {
        const pim = new PimPage(page);
        await pim.navigate();
        await page.getByRole('link', { name: 'PIM' }).click();

        const responw = await page.waitForResponse('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC');

        const body = await responw.json();
        const empId = body.data[0].empNumber;

        const cookies = await page.context().cookies();


        const delReqBody = { "ids": [empId] }

        const req = await request.delete('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees',
            {
                data: delReqBody,
                headers: {
                    Cookie: `orangehrm=${cookies[0]?.value}`
                }
            }
        )

        console.log(await req.json())


    })


});