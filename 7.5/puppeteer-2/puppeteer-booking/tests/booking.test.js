import puppeteer from "puppeteer";
import MainPage from "../pages/MainPage.js";
import HallPage from "../pages/HallPage.js";
import BookingPage from "../pages/BookingPage.js";
import testData from "../helpers/testData.js";
import { existsSync, mkdirSync } from "fs";

describe("Бронирование билетов (Ticket Booking)", () => {
  let browser;
  let page;
  let mainPage;
  let hallPage;
  let bookingPage;

  beforeAll(async () => {
    if (!existsSync("screenshots")) {
      mkdirSync("screenshots");
    }

    const headless = process.env.HEADLESS !== "false";
    browser = await puppeteer.launch({
      headless,
      slowMo: headless ? 0 : 50,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
      defaultViewport: { width: 1280, height: 800 },
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    mainPage = new MainPage(page);
    hallPage = new HallPage(page);
    bookingPage = new BookingPage(page);

    await mainPage.commands.goto(testData.url);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  // Тест-кейс 1: Happy Path - бронирование 1 билета
  test("Happy Path #1: Успешное бронирование 1 билета", async () => {
    await mainPage.selectDay(1);
    await mainPage.selectAnySession();
    await hallPage.selectSeatsAndBook(1);
    await bookingPage.submitBooking(testData.validUser1);

    const isSuccess = await bookingPage.isBookingSuccessful();
    const message = await bookingPage.getBookingMessage();

    expect(isSuccess).toBe(true);
    expect(message).toMatch(/электронный билет|QR|забронирован/i);
  }, 120000);

  // Тест-кейс 2: Happy Path - бронирование 2 билетов
  test("Happy Path #2: Успешное бронирование 2 билетов", async () => {
    await mainPage.selectDay(1);
    await mainPage.selectAnySession();
    await hallPage.selectSeatsAndBook(2);
    await bookingPage.submitBooking(testData.validUser2);

    const isSuccess = await bookingPage.isBookingSuccessful();
    const message = await bookingPage.getBookingMessage();

    expect(isSuccess).toBe(true);
    expect(message).toMatch(/электронный билет|QR|забронирован/i);
  }, 120000);

  // Тест-кейс 3: Sad Path - кнопка "Забронировать" неактивна без выбора мест
  test("Sad Path #1: Кнопка «Забронировать» неактивна без выбора места", async () => {
    await mainPage.selectDay(1);
    await mainPage.selectAnySession();

    // НЕ выбираем место — проверяем, что кнопка неактивна
    const isDisabled = await hallPage.isBookButtonDisabled
      ? await hallPage.isBookButtonDisabled()
      : await bookingPage.isBookButtonDisabled();

    expect(isDisabled).toBe(true);
  }, 120000);
});
