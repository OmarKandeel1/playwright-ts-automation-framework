import { LoginApi } from "../../../src/API/OrangeHRM/LoginApi";
import { test, expect, request } from '@playwright/test';
import tsData from '../../../test-data/OrangeHRM/login-users'


test.describe('OrangeHRM Login API @API', () => {
    //test.use({ storageState: undefined });


    test("Validating successful Login @API", async ({ request }) => {
        const loginApi = new LoginApi(request);
        await loginApi.login(tsData.validUsers[0].username, tsData.validUsers[0].password);
        console.log(await request.storageState());
        await loginApi.verifyLogin();

    });

    test.fail("Validating Failed Login @API", async ({ request }) => {
        const loginApi = new LoginApi(request);
        await loginApi.login(tsData.invalidUsers[0].username, tsData.invalidUsers[0].password);
        await loginApi.verifyLogin();

    });


});