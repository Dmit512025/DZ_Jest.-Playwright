const selectors = require("./selectors");

/**
 * Клик по дню недели по индексу (0 = сегодня).
 */
async function selectDay(page, index = 0) {
  await page.waitForSelector(selectors.days);
  const days = await page.$$(selectors.days);
  await days[index].click();
}

/**
 * Клик по сеансу фильма по индексу.
 */
async function selectSeance(page, index = 0) {
  await page.waitForSelector(selectors.movieSeances);
  const seances = await page.$$(selectors.movieSeances);
  await seances[index].click();
  await page.waitForSelector(selectors.seat);
}

/**
 * Выбор свободного места по индексу.
 */
async function selectSeat(page, index = 0) {
  await page.waitForSelector(selectors.seatFree);
  const freeSeats = await page.$$(selectors.seatFree);
  await freeSeats[index].click();
  await page.waitForSelector(selectors.seatSelected);
}

/**
 * Нажатие кнопки «Забронировать».
 */
async function clickBookButton(page) {
  await page.waitForSelector(selectors.acceptinButton);
  await page.click(selectors.acceptinButton);
}

/**
 * Получить текст элемента.
 */
async function getText(page, selector) {
  await page.waitForSelector(selector);
  return page.$eval(selector, (el) => el.textContent.trim());
}

module.exports = {
  selectDay,
  selectSeance,
  selectSeat,
  clickBookButton,
  getText,
};
