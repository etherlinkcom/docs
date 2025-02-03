// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://docs.etherlink.com/');
  await expect(page).toHaveTitle("What is Etherlink? | Etherlink documentation");
});

test('code copy buttons', async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read"]);
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
