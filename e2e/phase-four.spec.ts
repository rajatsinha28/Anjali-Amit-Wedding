import { expect, test } from "@playwright/test";

test("reveals the royal welcome letter once and keeps it open", async ({ page }, testInfo) => {
  test.skip(
    ![
      "mobile-320",
      "mobile-360",
      "mobile-390",
      "mobile-430",
      "tablet-768",
      "desktop-1440",
    ].includes(testInfo.project.name),
    "Bounded Phase 4 viewport matrix",
  );
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
  await page.goto("/");
  const letter = page.getByTestId("welcome-letter");
  await letter.scrollIntoViewIfNeeded();
  const scroll = letter.locator('[data-royal-scroll="welcome"]');
  await expect(scroll).toHaveAttribute("data-scroll-state", "opened", { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "आप सादर आमंत्रित हैं" })).toBeVisible();
  await expect(letter.getByText("नीरज एवं रोली श्रीवास्तव", { exact: true })).toBeVisible();
  await expect(letter.getByText("अंजलि", { exact: true })).toBeVisible();
  await expect(letter.getByText("अमित", { exact: true })).toBeVisible();
  await expect(letter.getByText("10 DECEMBER 2026", { exact: true })).toHaveCount(0);
  await page.getByTestId("hero-handoff").scrollIntoViewIfNeeded();
  await expect(scroll).toHaveAttribute("data-scroll-state", "opened");
  await letter.scrollIntoViewIfNeeded();
  await expect(scroll).toHaveAttribute("data-scroll-state", "opened");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-welcome.png`),
    fullPage: true,
  });
});

test("keeps the welcome copy readable with reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative reduced-motion viewport");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
  await page.goto("/");
  await page.getByTestId("welcome-letter").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "आप सादर आमंत्रित हैं" })).toHaveCSS("opacity", "1");
  await expect(page.getByText("नीरज एवं रोली श्रीवास्तव", { exact: true })).toBeVisible();
});

test("progressively reveals every royal scroll without a blank opening frame", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  test.skip(testInfo.project.name !== "mobile-390", "Representative mobile animation audit");
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
  await page.goto("/");

  for (const id of ["welcome", "ceremony:haldi", "ceremony:mehendi-sangeet", "ceremony:wedding"]) {
    const scroll = page.locator(`[data-royal-scroll="${id}"]`);
    await scroll.scrollIntoViewIfNeeded();
    await expect(scroll).toHaveAttribute("data-scroll-state", "opening", { timeout: 2000 });
    await expect
      .poll(
        () =>
          scroll
            .locator("[data-scroll-paper]")
            .evaluate((paper) =>
              Number.parseFloat(getComputedStyle(paper).getPropertyValue("--scroll-reveal").trim()),
            ),
        { timeout: 1800 },
      )
      .toBeLessThan(95);
    await expect(scroll).toHaveAttribute("data-scroll-state", "opened", { timeout: 10_000 });
    await expect(scroll.locator("[data-scroll-paper]")).toHaveCSS("clip-path", /inset\(0px/);
  }
});
