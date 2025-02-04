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

test('code copy buttons', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read']);
  await page.goto('https://docs.etherlink.com/get-started/network-information');

  // Click copy button
  const mainnetAddressButton = page.locator('xpath=//a[@href="https://tzkt.io/sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf"]/following-sibling::button');
  await mainnetAddressButton.click();

  // Check clipboard contents
  const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
  await expect(clipboardContent).toEqual('sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf');

  // Try a different button
  const rpcButton = page.locator('xpath=//code[text()="https://node.mainnet.etherlink.com"]/following-sibling::button');
  await rpcButton.click();

  // Check clipboard contents
  const clipboardContent2 = await page.evaluate(() => navigator.clipboard.readText());
  await expect(clipboardContent2).toEqual('https://node.mainnet.etherlink.com');

});


// Can't select the search field
// test('search', async ({ page }) => {
//   await page.getByRole('button', { name: 'Search' }).click();

// });

// Can't select the feedback form button
/*
test('feedback form', async ({ page }) => {
  await page.goto('https://docs.etherlink.com');
  // Preferred ways of getting the Feedback button via page.getBy* fail
  // const feedbackFormButton = await page.getByRole('button', { name: 'Feedback' });
  // const feedbackFormButton = await page.getByLabel('Feedback');
  // const feedbackFormButton = await page.getByText('Feedback');
  const feedbackFormButton = page.locator('xpath=//a[@class="feedback-button-content"]');
  // fall back to xpath, but this doesn't work either
  // const feedbackFormButton = page.locator('xpath=//feedback-button');
  await expect(feedbackFormButton).toBeVisible();
  await feedbackFormButton.click();
  await page.screenshot({ path: 'screenshot.png' });
  // await feedbackFormButton.click();
  // const feedbackForm = await page.getByText('Share your feedback');
  // await expect(feedbackForm).toBeVisible();
});
*/