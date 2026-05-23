import { test, expect } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { env } from '@/utils/env';

test.describe('Login flow @smoke', () => {
  test('valid credentials land on /account', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.signIn(env.TEST_USER_EMAIL, env.TEST_USER_PASSWORD);

    await expect(page).toHaveURL(/\/account/);
  });

  test('invalid credentials show error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.signIn('nobody@example.com', 'wrong-password');

    await expect(login.errorMessage).toBeVisible();
  });
});
