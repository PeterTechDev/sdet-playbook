import type { Locator, Page } from '@playwright/test';

/**
 * Account overview after sign-in. Site uses /account as the post-login landing page.
 */
export class DashboardPage {
  readonly heading: Locator;
  readonly subNavLinks: Locator;
  private readonly navMenuToggle: Locator;
  private readonly signOutLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByTestId('page-title');
    this.subNavLinks = page.locator('[data-test^="nav-"]:not([data-test^="nav-my-"])').filter({
      has: page.locator(':scope a, :scope[role="link"]'),
    });
    this.navMenuToggle = page.getByTestId('nav-menu');
    this.signOutLink = page.getByTestId('nav-sign-out');
  }

  async goto(): Promise<void> {
    await this.page.goto('/account');
  }

  async signOut(): Promise<void> {
    await this.navMenuToggle.click();
    await this.signOutLink.click();
  }
}
