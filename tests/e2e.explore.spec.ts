import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = `http://localhost:${process.env.PORT || 8001}`;

const shouldLogin = async (page: Page) => {
  await page.goto(`${BASE_URL}/user/login`);

  await page.fill('input[id="basic_userId"]', 'admin');
  await page.fill('input[id="basic_password"]', 'admin');

  await Promise.all([page.click('button[type="submit"]'), page.waitForURL(`${BASE_URL}/`)]);
};

test(`test explore dashboard page`, async ({ page }) => {
  await shouldLogin(page);

  for (let i = 1; i < 2; i++) {
    await page.goto(`${BASE_URL}/explore/dashboards`);
    await page.locator(`#dashboard-list-link-${i}`).click();
    await page.waitForURL(`${BASE_URL}/explore/dashboards/${i}`);
    expect(page.url()).toBe(`${BASE_URL}/explore/dashboards/${i}`);
    await page.goBack();
  }
});

test(`test explore query page`, async ({ page }) => {
  await shouldLogin(page);

  for (let i = 1; i < 2; i++) {
    await page.goto(`${BASE_URL}/explore/queries`);
    await page.locator(`#query-list-link-${i}`).click();
    await page.waitForURL(`${BASE_URL}/creations/queries/${i}`);
    expect(page.url()).toBe(`${BASE_URL}/creations/queries/${i}`);
    await page.goBack();
  }
});
