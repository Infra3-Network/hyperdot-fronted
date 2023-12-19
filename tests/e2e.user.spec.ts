import { test, expect } from '@playwright/test';

const BASE_URL = `http://localhost:${process.env.PORT || 8001}`;

test(`test login page`, async ({ page }) => {
  await page.goto(`${BASE_URL}/user/login`);

  // login form
  await page.fill('input[id="basic_userId"]', 'admin', {
    timeout: 1000,
  });
  await page.fill('input[id="basic_password"]', 'admin', {
    timeout: 1000,
  });

  await Promise.all([
    page.click('button[type="submit"]', {
      timeout: 2000,
    }),

    page.waitForURL(`${BASE_URL}/`, {
      timeout: 2000,
    }),
  ]);

  // wait login redirect
  expect(page.url()).toBe(`${BASE_URL}/`);

  // exit page
});

test(`test register page`, async ({ page }) => {
  await page.goto(`${BASE_URL}/user/register`);
  await Promise.all([
    page.click('button[type="submit"]', {
      timeout: 2000,
    }),

    page.waitForURL(`${BASE_URL}/user/login`, {
      timeout: 2000,
    }),
  ]);

  // wait login redirect
  expect(page.url()).toBe(`${BASE_URL}/user/login`);
});
