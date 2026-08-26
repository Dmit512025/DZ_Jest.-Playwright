const puppeteer = require('puppeteer');
const { test, expect, beforeEach, afterEach } = require('@jest/globals');

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: 'new' });
  page = await browser.newPage();
});

afterEach(async () => {
  if (page) await page.close().catch(() => {});
  if (browser) await browser.close().catch(() => {});
});

describe('Github page tests', () => {
  test('The page loads and title contains GitHub', async () => {
    jest.setTimeout(60000);

    await page.goto('https://github.com/team', { waitUntil: 'domcontentloaded' });
    console.log('Current URL:', await page.url());

    const title = await page.title();
    expect(title).toContain('GitHub');
  }, 60000);

  test('The first link attribute', async () => {
    jest.setTimeout(10000);

    await page.goto('https://github.com/team', { waitUntil: 'domcontentloaded' });

    const href = await page.$eval('a', (link) => link.getAttribute('href'));
    expect(href).toEqual('#start-of-content');
  }, 10000);

  test('The page contains Sign up button', async () => {
    jest.setTimeout(25000);

    await page.goto('https://github.com/team', { waitUntil: 'domcontentloaded' });

    const btn = await page.waitForFunction(
      () => {
        const elements = Array.from(document.querySelectorAll('a, button'));
        return elements.find(el => {
          const text = (el.textContent || '').trim();
          return text.includes('Sign');
        });
      },
      { timeout: 20000 }
    );

    const text = await btn.evaluate(el => el.textContent.trim());
    console.log('Button text:', text);

    expect(text).toContain('Sign');
  }, 25000);
});
