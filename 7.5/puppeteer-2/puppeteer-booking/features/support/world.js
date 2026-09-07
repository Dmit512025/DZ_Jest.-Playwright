import { World } from "@cucumber/cucumber";

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.page = null;
    this.mainPage = null;
    this.hallPage = null;
    this.bookingPage = null;
  }
}

export default CustomWorld;
