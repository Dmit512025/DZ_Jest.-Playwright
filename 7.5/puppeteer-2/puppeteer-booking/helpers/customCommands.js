// helpers/customCommands.js
export default class CustomCommands {
  constructor(page) {
    this.page = page;
  }

  // Переход по URL
  async goto(url) {
    await this.page.goto(url, { waitUntil: "networkidle2" });
  }

  // Клик по элементу с ожиданием
  async click(selector) {
    await this.page.waitForSelector(selector, { visible: true });
    await this.page.click(selector);
  }

  // Клик по элементу, содержащему текст
  async clickByText(text) {
    const selector = `::-p-text(${text})`;
    await this.page.waitForFunction(
      (txt) => [...document.querySelectorAll("*")].some((el) => el.innerText?.trim() === txt),
      {},
      text
    );
    await this.page.evaluate((txt) => {
      const elements = [...document.querySelectorAll("*")];
      const target = elements.find((el) => el.innerText?.trim() === txt);
      if (target) target.click();
    }, text);
  }

  // Заполнение input по селектору
  async fillInput(selector, value) {
    await this.page.waitForSelector(selector, { visible: true });
    await this.page.focus(selector);
    await this.page.keyboard.down("Control");
    await this.page.keyboard.press("A");
    await this.page.keyboard.up("Control");
    await this.page.keyboard.press("Backspace");
    await this.page.type(selector, value, { delay: 10 });
  }

  // Ожидание появления текста на странице
  async waitForText(text, timeout = 10000) {
    await this.page.waitForFunction(
      (txt) => document.body.innerText.includes(txt),
      { timeout },
      text
    );
  }

  // Проверка, что текст присутствует
  async hasText(text) {
    const content = await this.page.content();
    return content.includes(text);
  }

  // Ожидание селектора
  async waitForSelector(selector, options = { visible: true }) {
    await this.page.waitForSelector(selector, options);
  }

  // Получить текст элемента
  async getText(selector) {
    await this.page.waitForSelector(selector, { visible: true });
    return this.page.$eval(selector, (el) => el.textContent.trim());
  }

  // Сделать скриншот (полезно при падении)
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
}
