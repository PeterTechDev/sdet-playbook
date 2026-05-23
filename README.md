# sdet-playbook

> A production-grade Playwright + TypeScript reference framework. Fork it. Ship tests today.

[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://github.com/PeterTechDev/sdet-playbook/actions/workflows/playwright.yml/badge.svg)](https://github.com/PeterTechDev/sdet-playbook/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

What's inside:

- **UI tests** with Page Object Model and role-based locators
- **API tests** with a typed REST client and JSON-schema assertions
- **Accessibility tests** via `@axe-core/playwright`
- **Sharded CI** on GitHub Actions — 4-way parallel, ~5 min total
- **Auth fixtures** that reuse a single login across tests
- **Env config** via `.env` (no secrets in repo)
- **Allure-style HTML reports** out of the box

## Why this exists

After 5+ years standing up test frameworks from scratch at NDG, WTEC, CI&T, and Fuerza, the same scaffold solves 80% of the problem. This is that scaffold, open-sourced, opinionated, and ready to fork.

## Quickstart

```bash
git clone https://github.com/PeterTechDev/sdet-playbook
cd sdet-playbook

npm install
npx playwright install --with-deps

cp .env.example .env

npm test                    # full suite
npm run test:ui             # UI only
npm run test:api            # API only
npm run test:a11y           # accessibility only
npm run report              # open HTML report
```

## Layout

```
sdet-playbook/
├─ src/
│  ├─ pages/          # Page Object Model classes
│  │  ├─ login.page.ts
│  │  └─ dashboard.page.ts
│  ├─ fixtures/       # Reusable Playwright fixtures
│  │  └─ auth.fixture.ts
│  └─ utils/
│     ├─ api-client.ts  # Typed REST client
│     └─ env.ts         # Validated env config
├─ tests/
│  ├─ ui/             # End-to-end UI tests
│  ├─ api/            # Pure HTTP tests
│  └─ accessibility/  # axe-core checks
├─ .github/workflows/
│  └─ playwright.yml  # 4-way sharded CI
├─ playwright.config.ts
└─ package.json
```

## CI: 4-way sharded run

`playwright.yml` runs four parallel jobs, each executing one shard, then merges reports:

```
job: shard-1-of-4 ────┐
job: shard-2-of-4 ────┤
job: shard-3-of-4 ────┼──▶ merge-reports ──▶ upload artifact
job: shard-4-of-4 ────┘
```

This cuts a 20-minute serial run to roughly 5 minutes wall-clock. See [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

## Patterns used

### Role-based locators (preferred)

```typescript
// Good: resilient to DOM changes
page.getByRole('button', { name: /sign in/i })
page.getByTestId('submit-button')
page.getByLabel('Email address')

// Avoid: fragile
page.locator('.btn-primary > span')
page.locator('xpath=//div[3]/button')
```

### Page Object Model

```typescript
// src/pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }
  async signIn(email: string, password: string) { /* ... */ }

  get errorMessage() { return this.page.getByRole('alert'); }
}
```

### Reusable auth fixture

```typescript
// tests/ui/dashboard.spec.ts
import { test, expect } from '@/fixtures/auth.fixture';

test('shows user widgets', async ({ authedPage }) => {
  await authedPage.goto('/dashboard');
  await expect(authedPage.getByTestId('widget')).toHaveCount(3);
});
```

The fixture handles login once per worker, persists the storage state, and injects an authenticated `page` into your test.

### Typed API client

```typescript
import { api } from '@/utils/api-client';

const user = await api.post<User>('/users', { email: 'me@example.com' });
expect(user.id).toBeDefined();
```

## Test selection cheatsheet

```bash
npx playwright test                          # all
npx playwright test tests/ui                 # one folder
npx playwright test --grep "@smoke"          # by tag
npx playwright test --project=chromium       # one browser
npx playwright test --shard=1/4              # sharded
npx playwright test --ui                     # interactive
npx playwright test --debug                  # inspector
```

## Opinions

- **Role > test-id > CSS.** Test IDs are second-best; CSS/XPath are last resort.
- **One assertion per `expect`.** Easier to read failures.
- **`expect(...).toBeVisible()` over `waitForTimeout`.** Always.
- **POMs do not assert.** Assertions live in tests, actions live in POMs.
- **No `if/else` inside tests.** If you need branching, you have two tests.
- **Fail loud in fixtures.** A failed auth fixture should crash the run, not silently degrade.

## Roadmap

- [x] UI + API + a11y scaffolds
- [x] Sharded CI
- [x] Auth fixture
- [ ] Visual regression via Playwright snapshots
- [ ] Contract tests (Pact) for microservices
- [ ] Docker compose target environment
- [ ] LLM-assisted test data generator (uses [playwright-ai-test-generator](https://github.com/PeterTechDev/playwright-ai-test-generator))

## License

MIT.
