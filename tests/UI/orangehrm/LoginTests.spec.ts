import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../../../src/UI/orangehrm/pages/LoginPage';
import tsData from '../../../test-data/OrangeHRM/login-users'


let loginPage: LoginPage;
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
});


const validUsers = tsData.validUsers;
const inValidUsers = tsData.invalidUsers;

test.describe('OrangeHRM Login',()=>{

    test.use({ storageState: undefined });

for(const {username , password} of validUsers){
    test(`Validating successful Login with username: ${username} , password: ${password}`, async () => {

        const dashboardPage = await loginPage.login(username, password);
        await dashboardPage.checkDashboard();

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





})