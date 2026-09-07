import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import testData from "../../helpers/testData.js";

Given("я открываю главную страницу кинотеатра", async function () {
  await this.mainPage.commands.goto(testData.url);
});

When("я выбираю завтрашний день", async function () {
  await this.mainPage.selectDay(1);
});

When("я выбираю первый доступный сеанс", async function () {
  await this.mainPage.selectAnySession();
});

When("я выбираю {int} свободное место", async function (count) {
  this.seatCount = count;
});

When("я выбираю {int} свободных места", async function (count) {
  this.seatCount = count;
});

When("я нажимаю кнопку {string}", { timeout: 30000 }, async function (buttonName) {
  if (buttonName === "Забронировать") {
    await this.hallPage.selectSeatsAndBook(this.seatCount || 1);
  } else if (buttonName === "Получить код бронирования") {
    await this.bookingPage.clickGetCodeButton();
  }
});

Then("я вижу электронный билет с QR-кодом", async function () {
  const isSuccess = await this.bookingPage.isBookingSuccessful();
  expect(isSuccess).to.be.true;

  const message = await this.bookingPage.getBookingMessage();
  expect(message).to.match(/электронный билет|QR/i);
});

Then("кнопка {string} неактивна", async function (buttonName) {
  const btn = await this.page.$(".acceptin-button");
  expect(btn).to.not.be.null;

  const isDisabled = await btn.evaluate((node) => {
    return node.disabled || node.classList.contains("acceptin-button-disabled");
  }).catch(() => false);

  expect(isDisabled).to.be.true;
});
