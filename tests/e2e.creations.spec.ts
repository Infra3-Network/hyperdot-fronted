import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = `http://localhost:${process.env.PORT || 8001}`;

const shouldLogin = async (page: Page) => {
  await page.goto(`${BASE_URL}/user/login`);

  // login form
  await page.fill('input[id="basic_userId"]', 'admin');
  await page.fill('input[id="basic_password"]', 'admin');

  await Promise.all([page.click('button[type="submit"]'), page.waitForURL(`${BASE_URL}/`)]);
};

test(`test creation query page`, async ({ page }) => {
  await shouldLogin(page);

  await page.goto(`${BASE_URL}/creations/queries`);

  const editor = page.locator('#monaco-editor-container > div');
  expect(editor).not.toBeNull();
  await editor.click();
  await editor.type('select * from test');

  const runBtn = page.locator('#query-editor-run-button');
  expect(runBtn).not.toBeNull();

  await Promise.all([await runBtn.click(), page.waitForURL(`${BASE_URL}/creations/queries/1`)]);

  expect(page.url()).toBe(`${BASE_URL}/creations/queries/1`);
});

test(`test creation dashboard page`, async ({ page }) => {
  await shouldLogin(page);

  const creationBtn = page.locator('#creation-dashboard-btn');
  expect(creationBtn).not.toBeNull();
  creationBtn.click();

  const btn = page.locator('#open-creation-dashboard-container');
  expect(btn).not.toBeNull();
  await btn.click();

  await page.locator('#creation-dashboard-name-input').fill('test');
  await page.locator('#creation-dashboard-desc-input').fill('test');
  await Promise.all([
    page.click('#creation-dashboard-save-btn'),

    page.waitForURL(`${BASE_URL}/creations/dashboards/1`),
  ]);
  expect(page.url()).toBe(`${BASE_URL}/creations/dashboards/1`);
});
