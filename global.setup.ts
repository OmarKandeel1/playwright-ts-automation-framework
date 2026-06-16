import { request, chromium } from '@playwright/test';
import tsData from './test-data/OrangeHRM/login-users';
import { ROUTES } from './src/config/orangehrm/routes';

async function globalSetup() {

    const context = await request.newContext({
        baseURL: 'https://opensource-demo.orangehrmlive.com'
    });

    // direct login request here (no class)
    const loginPage = await context.get(ROUTES.LOGIN);
    const html = await loginPage.text();

    const token = html.match(/:token="&quot;([^"]+)&quot;"/)?.[1];

    const response = await context.post(ROUTES.VALIDATE_LOGIN, {
        form: {
            username: tsData.validUsers[0].username,
            password: tsData.validUsers[0].password,
            _token: token || ''
        }
    });

    // validate redirect or cookie creation
    await context.storageState({
        path: '.auth/admin.json'
    });

    await context.dispose();
}

export default globalSetup;