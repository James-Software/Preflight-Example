import { expect, test } from "@playwright/test";

test("demo: the form clears and reports success without sending a save request", async ({ page }) => {
  const submissions: string[] = [];
  const errors: string[] = [];
  page.on("request", request => { if (request.method() === "POST") submissions.push(request.url()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const email = page.getByLabel("Email address");
  await email.fill("demo@example.com");
  await page.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page.getByText("You have entered the waitlist!", { exact: true })).toBeVisible();
  await expect(email).toHaveValue("");
  expect(new URL(page.url()).search).toBe("");
  // This acceptance check documents the intentional demo failure. It is not
  // the desired regression assertion after the form has been repaired.
  await page.waitForTimeout(500);
  expect(submissions).toEqual([]);
  expect(errors).toEqual([]);
});
test("invalid and empty emails do not show success", async ({ page }) => {
  await page.goto("/");
  const submit = page.getByRole("button", { name: "Join the waitlist" });
  await submit.click();
  await expect(page.getByText("You have entered the waitlist!", { exact: true })).not.toBeVisible();
  await page.getByLabel("Email address").fill("not-an-email");
  await submit.click();
  await expect(page.getByLabel("Email address")).toHaveValue("not-an-email");
  expect(await page.getByLabel("Email address").evaluate((element: HTMLInputElement) => element.validity.valid)).toBe(false);
  await expect(page.getByText("You have entered the waitlist!", { exact: true })).not.toBeVisible();
});
test("mobile: form remains usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Join the waitlist" })).toBeVisible();
  const inputBounds = await page.getByLabel("Email address").boundingBox();
  expect(inputBounds!.height).toBeGreaterThanOrEqual(44);
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
});
