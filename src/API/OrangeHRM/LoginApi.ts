import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { ROUTES } from '../../config/orangehrm/routes'

export class LoginApi {

    private loginResponse?: APIResponse;

    constructor(
        private readonly request: APIRequestContext

    ) { }

    async getValidToken() {
        const loginPageResponse = await this.request.get(ROUTES.LOGIN);
        const html = await loginPageResponse.text();
        return html.match(/:token="&quot;([^"]+)&quot;"/)?.[1];
    }

    async login(username: string, password: string) {
        const token = await this.getValidToken();
        this.loginResponse = await this.request.post(ROUTES.VALIDATE_LOGIN, {
            form: {
                username: username,
                password: password,
                _token: token || ''

            }
        });
        return this.loginResponse;
    }

    async verifyLogin() {
        expect(this.loginResponse?.url()).toContain(ROUTES.DASHBOARD);

    }







}