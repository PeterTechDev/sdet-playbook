import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { env } from '@/utils/env';
import path from 'node:path';
import fs from 'node:fs';

const AUTH_DIR = path.resolve('playwright/.auth');
const STORAGE_FILE = path.join(AUTH_DIR, 'user.json');

export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    if (!fs.existsSync(STORAGE_FILE)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      const login = new LoginPage(page);

      await login.goto();
      await login.signIn(env.TEST_USER_EMAIL, env.TEST_USER_PASSWORD);
      await expect(page).toHaveURL(/dashboard|account/i);

      await ctx.storageState({ path: STORAGE_FILE });
      await ctx.close();
    }

    const ctx = await browser.newContext({ storageState: STORAGE_FILE });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

export { expect };
