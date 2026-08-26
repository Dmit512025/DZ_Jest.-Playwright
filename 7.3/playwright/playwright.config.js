import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  //globalSetup: './tests/e2e/global-setup.ts',// можно убрать, если нет
  //globalTeardown: './tests/e2e/global-teardown.ts', // можно убрать
  reporter: [['html', { open: 'never' }]],
projects: [
  {
    name: 'chromium',
    use: { ...require('@playwright/test').devices['Desktop Chrome'] },
  },
],
});