const { USER_EMAIL, USER_PASSWORD } = require('../../user');
const puppeteer = require('puppeteer');

describe('Netology auth tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true
    });
    page = await browser.newPage();
  });

  test('Successful authorization', async () => {
    await page.goto('https://netology.ru/?modal=sign_in');
    await page.waitForSelector('[name="email"]');
    
    await page.type('[name="email"]', USER_EMAIL);
    await page.type('[name="password"]', USER_PASSWORD);
    
    await page.click('[data-testid="login-submit-btn"]');
    
    await page.waitForSelector('[data-testid="main-page"] h2');
    const title = await page.$eval('[data-testid="main-page"] h2', el => el.textContent);
    
    expect(title).toBe('Моё обучение');
  }, 10000);

  afterAll(async () => {
    await browser.close();
  });
});

test('Failed authorization', async () => {
  await page.goto('https://netology.ru/?modal=sign_in');
  await page.waitForSelector('[name="email"]');
  
  await page.type('[name="email"]', 'wrong@example.com');
  await page.type('[name="password"]', 'wrongpassword');
  
  await page.click('[data-testid="login-submit-btn"]');
  
  await page.waitForSelector('[data-testid="login-error-hint"]');
  const error = await page.$eval('[data-testid="login-error-hint"]', el => el.textContent);
  
  expect(error).toBe('Вы ввели неправильно логин или пароль');
}, 10000);