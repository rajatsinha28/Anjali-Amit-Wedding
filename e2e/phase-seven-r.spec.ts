import { expect, test } from "@playwright/test";

const viewportMatrix = new Set([
  "mobile-320",
  "mobile-360",
  "mobile-390",
  "mobile-430",
  "tablet-768",
  "desktop-1440",
]);

const ceremonies = [
  { id: "haldi", title: "HALDI CEREMONY", day: "09", time: "11:00 AM" },
  { id: "mehendi-sangeet", title: "MEHENDI & SANGEET", day: "09", time: "7:00 PM" },
  { id: "wedding", title: "THE WEDDING CEREMONY", day: "10", time: "8:00 PM" },
] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
});

test("keeps the royal ceremony hierarchy readable across the viewport matrix", async ({
  page,
}, testInfo) => {
  test.skip(!viewportMatrix.has(testInfo.project.name), "Phase 7R viewport matrix");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const ceremony of ceremonies) {
    const card = page.getByTestId(`ceremony-${ceremony.id}`);
    await card.scrollIntoViewIfNeeded();
    const title = card.getByRole("heading", { name: ceremony.title });
    const art = card.getByRole("button", { name: `Celebrate ${ceremony.title.toLowerCase()}` });
    const day = card.locator("[data-date-day]");
    const time = card.getByText(ceremony.time, { exact: true });
    const description = card.locator("[data-description]");
    const scroll = page.locator(`[data-royal-scroll="ceremony:${ceremony.id}"]`);
    for (const element of [title, art, day, time, description]) {
      await expect(element).toBeVisible();
    }
    await expect(card.getByText("Chancellor Club", { exact: true })).toHaveCount(0);
    await expect(scroll).toHaveAttribute("data-scroll-state", "opened", { timeout: 3500 });
    const boxes = await Promise.all(
      [title, art, day, time, description].map((element) => element.boundingBox()),
    );
    expect(boxes.every(Boolean)).toBe(true);
    for (let index = 1; index < boxes.length; index += 1) {
      expect(boxes[index]!.y).toBeGreaterThan(boxes[index - 1]!.y);
    }
    const sizes = await page.evaluate(
      ({ title, day, time, description }) => ({
        title: Number.parseFloat(getComputedStyle(document.querySelector(title)!).fontSize),
        day: Number.parseFloat(getComputedStyle(document.querySelector(day)!).fontSize),
        time: Number.parseFloat(getComputedStyle(document.querySelector(time)!).fontSize),
        description: Number.parseFloat(
          getComputedStyle(document.querySelector(description)!).fontSize,
        ),
      }),
      {
        title: `[data-testid="ceremony-${ceremony.id}"] h3`,
        day: `[data-testid="ceremony-${ceremony.id}"] [data-date-day]`,
        time: `[data-testid="ceremony-${ceremony.id}"] [data-time]`,
        description: `[data-testid="ceremony-${ceremony.id}"] [data-description]`,
      },
    );
    expect(sizes.title).toBeGreaterThanOrEqual(25);
    expect(sizes.day).toBeGreaterThanOrEqual(42);
    expect(sizes.time).toBeGreaterThanOrEqual(22);
    expect(sizes.description).toBeGreaterThanOrEqual(16);
    if (["mobile-390", "desktop-1440"].includes(testInfo.project.name)) {
      await card.screenshot({ path: testInfo.outputPath(`${ceremony.id}.png`) });
    }
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
});

test.describe("ceremony motion", () => {
  test("runs, responds, and pauses the ceremony atmosphere", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-390", "Representative motion viewport");
    await page.goto("/");
    const card = page.getByTestId("ceremony-haldi");
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute("data-active", "true");
    await page.screenshot({ path: testInfo.outputPath("entrance-start.png") });
    await expect(page.locator('[data-royal-scroll="ceremony:haldi"]')).toHaveAttribute(
      "data-scroll-state",
      "opened",
      { timeout: 5000 },
    );
    await expect(card.locator("[data-date-day]")).toHaveCSS("opacity", "1");
    await expect(card.locator("[data-description]")).toHaveCSS("opacity", "1");
    const ambientCount = await card.locator("[data-particle] > span").count();
    expect(ambientCount).toBeGreaterThanOrEqual(5);
    expect(ambientCount).toBeLessThanOrEqual(12);
    await card.getByRole("button", { name: "Celebrate haldi ceremony" }).click();
    await expect(card.locator("[data-burst] i")).not.toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath("settled-with-burst.png") });
    const mehendi = page.getByTestId("ceremony-mehendi-sangeet");
    await mehendi.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await expect(card).toHaveAttribute("data-active", "false");
    await expect(page.locator('[data-royal-scroll="ceremony:haldi"]')).toHaveAttribute(
      "data-scroll-state",
      "opened",
    );
    await expect(page.locator('[data-royal-scroll="ceremony:mehendi-sangeet"]')).toHaveAttribute(
      "data-scroll-state",
      "opened",
      { timeout: 5000 },
    );
  });
});

test("keeps all ceremony information visible with reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative accessibility viewport");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const card = page.getByTestId("ceremony-wedding");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-active", "false");
  await expect(card.getByText("10", { exact: true })).toBeVisible();
  await expect(card.getByText("8:00 PM", { exact: true })).toBeVisible();
  await expect(card.getByText("Chancellor Club", { exact: true })).toHaveCount(0);
  await card.getByRole("button", { name: "Celebrate the wedding ceremony" }).click();
  await expect(card.locator("[data-burst] i")).toHaveCount(0);
});
