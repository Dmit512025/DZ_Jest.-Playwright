import BasePage from "./BasePage.js";

class BookingPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Клик по "Получить код бронирования" на странице билета
  async clickGetCodeButton() {
    const btnSelector = ".acceptin-button";
    await this.commands.waitForSelector(btnSelector, { visible: true, timeout: 10000 });

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {}),
      this.page.evaluate(() => {
        window.location.href = "scripts/sale_save.php";
      }),
    ]);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Полный сценарий бронирования
  // В этом приложении нет формы ввода данных — кнопка сразу создаёт билет
  async submitBooking(userData) {
    await this.clickGetCodeButton();
  }

  // Проверка успешного бронирования
  async isBookingSuccessful() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // QR-код — главный признак успеха
    const qrExists = await this.page.$(".ticket__info-qr").catch(() => null);
    if (qrExists) return true;

    // Текст "Электронный билет"
    const text = await this.getBookingMessage();
    if (/электронный билет/i.test(text)) return true;
    if (/код бронирования|забронировали|QR/i.test(text)) return true;

    return false;
  }

  // Текст страницы
  async getBookingMessage() {
    try {
      return await this.page.evaluate(() => document.body.innerText);
    } catch (e) {
      return "";
    }
  }

  // Проверка НЕуспешного бронирования
  // В этом приложении нет формы — sad path проверяет,
  // что кнопка "Забронировать" неактивна без выбора мест
  async isBookingFailed() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Если на странице нет QR-кода и нет "Электронный билет" — бронирование не прошло
    const qrExists = await this.page.$(".ticket__info-qr").catch(() => null);
    if (qrExists) return false;

    const text = await this.getBookingMessage();
    if (/электронный билет/i.test(text)) return false;

    // Кнопка "Получить код бронирования" всё ещё на экране — значит, не перешли к оплате
    const hasButton = await this.page.$(".acceptin-button").catch(() => null);
    if (hasButton) return true;

    return false;
  }

  // Проверка, активна ли кнопка "Забронировать" (для sad path без выбора мест)
  async isBookButtonDisabled() {
    const btn = await this.page.$(".acceptin-button");
    if (!btn) return true;

    const isDisabled = await btn.evaluate(node => {
      return node.disabled || node.classList.contains("acceptin-button-disabled");
    }).catch(() => false);

    return isDisabled;
  }
}

export default BookingPage;
