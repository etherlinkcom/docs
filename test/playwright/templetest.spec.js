import { test, expect } from './temple-fixtures';

test('example test', async ({ page }) => {
  // await page.goto('http://localhost:3000');
  // const page = await context.newPage();
  await page.pause();
  // await expect(page.locator('body')).toHaveText('Changed by my-extension');
});

// test('popup page', async ({ page, extensionId }) => {
//   await page.goto(`chrome-extension://${extensionId}/popup.html`);
//   await expect(page.locator('body')).toHaveText('my-extension popup');
// });

// import path from 'path';

// const pathToExtension = path.join(__dirname, '../../', 'metamask-chrome');

// const context = await chromium.launchPersistentContext("", {
//   headless: false,
//   args:[
//         `--load-extension=${pathToExtension}`,
//         `--disable-extensions-except=${pathToExtension}`,
//       ]
// });

// const { chromium } = require('playwright');

// test('generate user data dir', async ({ page, extensionId }) => {
// });

// (async () => {
//     const userDataDir = path.join(__dirname, '/tmp/test-user-data-dir');
//     const browserContext = await chromium.launchPersistentContext(userDataDir, {
//         args: [
//             `--disable-extensions-except=${pathToExtension}`,
//             `--load-extension=${pathToExtension}`
//         ]
//     });

//     const page = await browserContext.newPage();
//     await page.goto('http://localhost:3000'); // Replace with your test URL
// })();
