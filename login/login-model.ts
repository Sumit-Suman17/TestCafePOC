import { Selector, t } from "testcafe";

class Page {
  emailInput: Selector;
  submitButton: Selector;
  passwordInput: Selector;
  constructor() {
    this.emailInput = Selector("#email");
    this.passwordInput = Selector("#password");
    this.submitButton = Selector("button").withText("LOG IN");
  }

  async LogIn(email, password) {
    await t
      .typeText(this.emailInput, email)
      .typeText(this.passwordInput, password)
      .click(this.submitButton);
  }
}

export default new Page();
