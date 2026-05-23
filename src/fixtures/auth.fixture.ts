import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { env } from '@/utils/env';
import path from 'node:path';
import fs from 'node:fs';

const AUTH_DIR = path.resolve('playwright/.auth');

/**
 * Provides an `authedPage` per test. Auth runs once per worker and the storage
 * state is cached on disk — keyed by workerIndex so parallel workers do not
 * race on the same file or share invalidated sessions on shared demo backends.
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use, testInfo) => {
    const storageFile = path.join(AUTH_DIR, `user-${testInfo.workerIndex}.json`);

    if (!fs.existsSync(storageFile)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      const login = new LoginPage(page);

      await login.goto();
      await login.signIn(env.TEST_USER_EMAIL, env.TEST_USER_PASSWORD);
      await expect(page).toHaveURL(/\/account/);

      await ctx.storageState({ path: storageFile });
      await ctx.close();
    }

    const ctx = await browser.newContext({ storageState: storageFile });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

export { expect };
