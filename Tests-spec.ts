import { Selector, Role } from "testcafe";
import page from "./login/login-model";

fixture`Tests`.page`@siteURL`;
const email = "@email";
const password = "@password";
test("Header of the page", async (t) => {
  await t.expect(Selector("h1").withText("LOG IN").innerText).eql("LOG IN");
});

test("check login", async (t) => {
  await page.LogIn(email, password);
});
test("check nav Menu", async (t) => {
  await page.LogIn(email, password);
  const navMenu = Selector(".page-section nav a");
  await t.expect(navMenu.count).eql(4);
});
test("password Change", async (t) => {
  // TODO : wait needs tobe removed and refactor the password field selector
  await page.LogIn(email, password);
  await t.click(Selector("button").withText("Change")).wait(2000);
  await t.typeText(Selector("#newPassword"), "Qazwsx");
  const lengthError = Selector("#Length").withText(
    "Password must be at least 8 characters long!"
  );
  await t.expect(lengthError.exists).ok();
  const pwdButton = await Selector("button").withText("CHANGE PASSWORD");
  await t.expect(pwdButton.hasClass("btn-disabled")).ok();
  await t.typeText(Selector("#password"), "Qazwsx23#df");
  await t.typeText(Selector("#newPassword"), "Qazwsx23#df");
  await t.expect(pwdButton.hasClass("btn-primary")).ok().wait(4000);
  await t.click(pwdButton).wait(5000);
  const validationInvalidPassword = Selector(
    "#change-password-api-error"
  ).withText("Old password invalid.");
  await t.expect(validationInvalidPassword.exists).ok().wait(1000);
  await t.typeText(Selector("#password"), "Qetuo@1357");
  await t.typeText(Selector("#newPassword"), "Qetuo@1357");
  await t.click(pwdButton).wait(2000);
  const validationLastusedPassword = Selector(
    "#change-password-api-error"
  ).withText("You can't enter a password you've used before. Sorry!");
  await t.expect(validationLastusedPassword.exists).ok();
  await t.typeText(Selector("#password"), "Qetuo@1357");
  await t.typeText(Selector("#newPassword"), "Zcbm@1357");
  await t.click(pwdButton);
});
