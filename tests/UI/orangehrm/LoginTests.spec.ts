import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../../../UI/pages/orangehrm/LoginPage';
import tsData from '../../../test-data/OrangeHRM/login-users'
import { log } from 'node:console';

let loginPage: LoginPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
});


const validUsers = tsData.validUsers;
const inValidUsers = tsData.invalidUsers;

test.describe('OrangeHRM Login',()=>{

for(const {username , password} of validUsers){
    test(`Validating successful Login with username: ${username} , password: ${password}`, async () => {

        await loginPage.login(username, password);
        await loginPage.checkNavigate();
        await loginPage.checkDashboard();
    });
}


for(const{username , password} of inValidUsers){
    test(`Validating Invalid Login with wrong cred - ${username} / ${password} `, async () => {

        await loginPage.login(username, password);
        await loginPage.checkInvalidCredsErrorMsg(tsData.errors.invalidcreds);
    });
}


test('Validating empty input fields', async () => {

    await loginPage.login('', '');
    await loginPage.checkUsernameRequiredErrorMsg(tsData.errors.requiredMsg);
    await loginPage.checkPasswordRequiredErrorMsg(tsData.errors.requiredMsg);
});

test("Validating deleting emp",async ({page, request})=>{

    const {username , password} = tsData.validUsers[0];
    await loginPage.login(username,password);
    
    await page.getByRole('link', { name: 'PIM' }).click();
    
    const responw = await page.waitForResponse('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC');

    const body = await responw.json();
    const empId = body.data[0].empNumber;
    
    const cookies = await page.context().cookies(); 
    

    const delReqBody = {"ids": [empId] }

    const req = await request.delete('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees',
        {
            data: delReqBody,
            headers: {
                Cookie:`orangehrm=${cookies[0]?.value}`}
        }
    )

    console.log(await req.json())
    
    
    


})




})