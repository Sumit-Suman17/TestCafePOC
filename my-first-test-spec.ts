import { Selector, Role } from "testcafe";

fixture`Minecraft Tests`.page`https://my.minecraft.net/en-us/login/`;
test("Header of the page", async (t) => {
  await t.expect(Selector("h1").withText("LOG IN").innerText).eql("LOG IN");
});

test("Test form value", async (t) => {
  await t
    .typeText(Selector("#email"), "aws@gmail.com")
    .typeText(Selector("#password"), "Qazwsx@123")
    .expect(Selector("#email").value)
    .eql("aws@gmail.com")
    .expect(Selector("#password").value)
    .eql("Qazwsx@123")
    .click(Selector("button").withText("LOG IN"));
});

test("Check Title of the page", async (t) => {
  await t.expect(Selector("title").innerText).eql("Log in | Minecraft");
});
