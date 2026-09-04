import BasePage from "./BasePage.js";

class MainPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async selectDay(index = 1) {
    // index=1 → завтра, nth-child(2)
    const daySelector = `.page-nav__day:nth-child(${index + 1})`;
    await this.commands.waitForSelector(daySelector);
    await this.commands.click(daySelector);
  }

  // Выбираем первый видимый сеанс и ждём загрузки схемы зала
  async selectFirstAvailableSession() {
    const sessionSelector = ".movie-seances__time";
    await this.commands.waitForSelector(sessionSelector, { visible: true, timeout: 10000 });

    // Делаем скриншот ДО клика для отладки, если нужно
    // await this.page.screenshot({ path: 'screenshots/before-session-click.png' });

    await this.commands.click(sessionSelector);

    // ВАЖНО: ждём появления схемы зала как подтверждение, что мы на нужной странице
    await this.commands.waitForSelector(".buying-scheme", { visible: true, timeout: 20000 });
  }

  async selectAnySession() {
    await this.selectFirstAvailableSession();
  }
}

export default MainPage;
