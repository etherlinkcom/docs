import { test as base, chromium, type BrowserContext } from '@playwright/test';
import { ALL } from 'dns';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, '../../', 'temple-chrome');
    const userDataDir = path.resolve(__dirname, './temple-data-dir');
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      headless: false,
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // for manifest v3:
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker)
      serviceWorker = await context.waitForEvent('serviceworker');

    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});
export const expect = test.expect;