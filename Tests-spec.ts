import { Selector, Role } from "testcafe";
import page from "./login/login-model";

fixture`Tests`.page`http://first-test.com`;
test("Header of the page", async (t) => {
  await t.expect(Selector("h1").withText("LOG IN").innerText).eql("LOG IN");
});

test("Test form value", async (t) => {
  await page.LogIn("@yourEmail", "@yourpassword");
  const navMenu = Selector(".page-section nav a");
  await t.expect(navMenu.count).eql(4);
});
