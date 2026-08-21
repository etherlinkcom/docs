// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  await expect(page).toHaveTitle('What is Etherlink? | Etherlink documentation');
  await expect(page.getByAltText('logo')).toBeVisible();
});

test('navigation', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  // "Developing" is nested under "EVM Interface", so expand that first.
  await page.getByRole('button', { name: 'EVM Interface' }).click();
  await page.getByRole('button', { name: 'Developing' }).first().click();
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
  // The PushFeedback widget renders a <feedback-button> web component (no inner
  // <a>) that hydrates asynchronously; a click only opens the modal once its
  // handler is attached, so retry the click until the modal appears.
  const button = page.locator('feedback-button#default');
  await button.waitFor({ state: 'attached' });
  await expect(async () => {
    await button.click({ force: true });
    await expect(page.getByText('Share your feedback')).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 20000 });
});
