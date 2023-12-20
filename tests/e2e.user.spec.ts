import { test, expect } from '@playwright/test';

const BASE_URL = `http://localhost:${process.env.PORT || 8001}`;

test(`test login page`, async ({ page }) => {
  await page.goto(`${BASE_URL}/user/login`);

  // login form
  await page.fill('input[id="basic_userId"]', 'admin');
  await page.fill('input[id="basic_password"]', 'admin');

  await Promise.all([page.click('button[type="submit"]'), page.waitForURL(`${BASE_URL}/`)]);

  // wait login redirect
  expect(page.url()).toBe(`${BASE_URL}/`);

  // exit page
});

test(`test register page`, async ({ page }) => {
  await page.goto(`${BASE_URL}/user/register`);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForURL(`${BASE_URL}/user/login`),
  ]);

  // wait login redirect
  expect(page.url()).toBe(`${BASE_URL}/user/login`);
});
