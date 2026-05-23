import { test, expect } from '@/fixtures/auth.fixture';
import { DashboardPage } from '@/pages/dashboard.page';

test.describe('Account overview (authed)', () => {
  test('lands on /account with "My account" heading', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);

    await dashboard.goto();
    await expect(authedPage).toHaveURL(/\/account/);
    await expect(dashboard.heading).toHaveText('My account');
  });

  test('sign-out returns to login', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);

    await dashboard.goto();
    await dashboard.signOut();

    await expect(authedPage).toHaveURL(/\/auth\/login/);
  });
});
