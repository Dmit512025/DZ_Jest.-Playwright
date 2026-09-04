// pages/BasePage.js
import CustomCommands from "../helpers/customCommands.js";

export default class BasePage {
  constructor(page) {
    this.page = page;
    this.commands = new CustomCommands(page);
  }
}
