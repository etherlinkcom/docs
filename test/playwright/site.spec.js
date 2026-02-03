// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  await expect(page).toHaveTitle('What is Etherlink? | Etherlink documentation');
  await expect(page.getByAltText('logo')).toBeVisible();
});

test('navigation', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  await page.getByRole('button', { name: 'Developing' }).click();
  await expect(page.getByText('Ethereum endpoint support')).toBeVisible();
  await page.getByRole('button', { name: 'Governance' }).click();
  await expect(page.getByText('How is Etherlink governed?')).toBeVisible();
});

test('search', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  await page.getByText("Search").click()
  await page.getByRole('searchbox', { name: 'Search' }).fill('node');
  await page.getByRole('link', { name: 'Running an Etherlink Smart Rollup node', exact: true }).click();
  await expect(page).toHaveURL(/.*smart-rollup-nodes/);
});

test('feedback form', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  await expect(page.locator('feedback-button#default a')).toBeVisible();
  await page.locator('feedback-button#default a').click();
  await expect(page.getByText('Share your feedback')).toBeVisible();
});
