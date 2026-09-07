import { BeforeAll, Before, After, AfterAll, setWorldConstructor } from '@cucumber/cucumber';
import puppeteer from 'puppeteer';
import CustomWorld from './world.js';
import MainPage from '../../pages/MainPage.js';
import HallPage from '../../pages/HallPage.js';
import BookingPage from '../../pages/BookingPage.js';

setWorldConstructor(CustomWorld);

let sharedBrowser = null;

BeforeAll(async function () {
  const headless = process.env.HEADLESS !== 'false';
  sharedBrowser = await puppeteer.launch({
    headless,
    slowMo: headless ? 0 : 50,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    defaultViewport: { width: 1280, height: 800 },
  });
});

Before(async function () {
  this.page = await sharedBrowser.newPage();
  // КРИТИЧЕСКИ ВАЖНО: создаем объекты и кладем в this
  this.mainPage = new MainPage(this.page);
  this.hallPage = new HallPage(this.page);
  this.bookingPage = new BookingPage(this.page);
});

After(async function () {
  if (this.page) {
    await this.page.close().catch(() => {});
  }
});

AfterAll(async function () {
  if (sharedBrowser) {
    await sharedBrowser.close().catch(() => {});
  }
});
