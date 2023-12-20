import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const BASE_URL = `http://localhost:${process.env.PORT || 8001}`;

const shouldLogin = async (page: Page) => {
  await page.goto(`${BASE_URL}/user/login`);

  await page.fill('input[id="basic_userId"]', 'admin');
  await page.fill('input[id="basic_password"]', 'admin');

  await Promise.all([page.click('button[type="submit"]'), page.waitForURL(`${BASE_URL}/`)]);
};

test(`test profile page`, async ({ page }) => {
  await shouldLogin(page);

  await page.goto(`${BASE_URL}/account/center`);

  const twitter = await page.locator('#profile-twitter-container').innerText();
  expect(twitter).toBe('@momo');

  const github = await page.locator('#profile-github-container').innerText();
  expect(github).toBe('@momo');

  const telgram = await page.locator('#profile-telgram-container').innerText();
  expect(telgram).toBe('@momo');

  const discord = await page.locator('#profile-discord-container').innerText();
  expect(discord).toBe('@momo');

  const stars = await page.locator('#profile-statistics-stars-container').innerText();
  expect(stars).toBe('100 stars ');

  const queries = await page.locator('#profile-statistics-queries-container').innerText();
  expect(queries).toBe('100 queries ');

  const dashboards = await page.locator('#profile-statistics-dashboards-container').innerText();
  expect(dashboards).toBe('100 dashboards ');
});
