import BasePage from "./BasePage.js";

class HallPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async waitForHallLoaded() {
    await this.commands.waitForSelector(".buying-scheme", { visible: true, timeout: 20000 });
  }

  async getFreeSeatSelector() {
    const candidates = [
      ".buying-scheme__chair:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled)",
      ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)",
      ".buying-scheme__chair_vip:not(.buying-scheme__chair_taken)",
    ];

    for (const sel of candidates) {
      const count = await this.page.$$eval(sel, els => els.length).catch(() => 0);
      if (count > 0) {
        console.log(`[HallPage] Found free seats with selector: ${sel} (${count} items)`);
        return sel;
      }
    }
    return null;
  }

  async selectOneSeat() {
    await this.waitForHallLoaded();

    const selector = await this.getFreeSeatSelector();
    if (!selector) {
      await this.page.screenshot({ path: "screenshots/no-free-seats.png" });
      throw new Error("Нет свободных мест. Смотри screenshots/no-free-seats.png");
    }

    const seats = await this.page.$$(selector);
    if (seats.length === 0) throw new Error("Нет свободных мест");

    await seats[0].click();
  }

  async selectTwoSeats() {
    await this.waitForHallLoaded();

    const selector = await this.getFreeSeatSelector();
    if (!selector) {
      await this.page.screenshot({ path: "screenshots/no-free-seats-2.png" });
      throw new Error("Нет свободных мест. Смотри screenshots/no-free-seats-2.png");
    }

    const freeSeats = await this.page.$$(selector);
    if (freeSeats.length < 2) {
      throw new Error(`Недостаточно свободных мест: найдено ${freeSeats.length}, нужно 2`);
    }

    await freeSeats[0].click();
    await freeSeats[1].click();
  }

  async clickBookButton() {
    const bookBtnSelector = ".acceptin-button";
    await this.commands.waitForSelector(bookBtnSelector, { visible: true, timeout: 15000 });

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {}),
      this.commands.click(bookBtnSelector),
    ]);
  }

  async selectSeatsAndBook(seatsCount = 1) {
    await this.waitForHallLoaded();

    if (seatsCount === 1) {
      await this.selectOneSeat();
    } else if (seatsCount === 2) {
      await this.selectTwoSeats();
    } else {
      const selector = await this.getFreeSeatSelector();
      if (!selector) throw new Error("Нет свободных мест");
      const freeSeats = await this.page.$$(selector);
      const countToSelect = Math.min(seatsCount, freeSeats.length);
      for (let i = 0; i < countToSelect; i++) {
        await freeSeats[i].click();
      }
    }

    await this.clickBookButton();
  }
}

export default HallPage;
