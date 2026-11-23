import { expect, test } from "@playwright/test";

const requestedViewports = new Set([
  "mobile-320",
  "mobile-360",
  "mobile-390",
  "mobile-430",
  "tablet-768",
  "desktop-1440",
]);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("intro.opened", "true");
    localStorage.setItem("dateRevealed", "true");
  });
  await page.goto("/");
  await page.getByTestId("little-moments").scrollIntoViewIfNeeded();
});

test("keeps one stable book stage before and after opening", async ({ page }, testInfo) => {
  test.skip(!requestedViewports.has(testInfo.project.name), "Specified Phase 6R viewport");
  const stage = page.getByTestId("album-stage");
  const before = await stage.boundingBox();
  expect(before).not.toBeNull();
  await expect(page.getByTestId("album-cover-wordmark")).toHaveText("LOVIT");
  await expect(page.getByLabel("Anjali and Amit monogram")).toBeVisible();
  await expect(page.getByTestId("album-cover").getByText("Little moments")).toHaveCount(0);
  await expect(page.getByTestId("album-cover").getByText("10 · 12 · 2026")).toBeVisible();
  if (["mobile-320", "mobile-390", "mobile-430"].includes(testInfo.project.name)) {
    await page.screenshot({ path: testInfo.outputPath("album-closed.png") });
  }
  await page.getByRole("button", { name: "Open album" }).click();
  const during = await stage.boundingBox();
  expect(Math.abs(during!.width - before!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(during!.height - before!.height)).toBeLessThanOrEqual(1);
  await expect(stage).toHaveAttribute("data-album-state", "idle");
  const after = await stage.boundingBox();
  expect(Math.abs(after!.width - before!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1);
  console.info(
    `[album-size] ${testInfo.project.name}: closed ${before!.width.toFixed(2)}×${before!.height.toFixed(2)}; open ${after!.width.toFixed(2)}×${after!.height.toFixed(2)}`,
  );
  await expect(page.locator('[data-photo-slot="album-slot-01"]')).toBeVisible();
  await expect(page.locator('[data-photo-slot="album-slot-02"]')).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
  if (testInfo.project.name === "mobile-390") {
    await page.screenshot({ path: testInfo.outputPath("album-open.png") });
  }
});

test("turns a double-sided sheet and supports every control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative interaction viewport");
  test.setTimeout(45_000);
  const stage = page.getByTestId("album-stage");
  await page.getByRole("button", { name: "Open album" }).click();
  await expect(stage).toHaveAttribute("data-album-state", "idle");

  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByTestId("turning-sheet")).toBeVisible();
  await page.waitForTimeout(475);
  await page.screenshot({ path: testInfo.outputPath("album-turn-midpoint.png") });
  await expect(stage).toHaveAttribute("data-album-state", "idle");
  await expect(page.locator('[data-photo-slot="album-slot-03"]')).toBeVisible();
  await expect(page.locator('[data-photo-slot="album-slot-04"]')).toBeVisible();

  await stage.press("ArrowRight");
  await expect(stage).toHaveAttribute("data-album-state", "turning");
  await expect(stage).toHaveAttribute("data-album-state", "idle");
  await stage.dispatchEvent("pointerdown", {
    pointerId: 7,
    pointerType: "touch",
    isPrimary: true,
    clientX: 80,
    clientY: 120,
  });
  await stage.dispatchEvent("pointerup", {
    pointerId: 7,
    pointerType: "touch",
    isPrimary: true,
    clientX: 290,
    clientY: 122,
  });
  await expect(stage).toHaveAttribute("data-album-state", "turning");
  await expect(stage).toHaveAttribute("data-album-state", "idle");
  await expect(page.getByText("2 / 4")).toBeVisible();

  await page.getByRole("button", { name: "Next page" }).click();
  await expect(stage).toHaveAttribute("data-album-state", "turning");
  await expect(stage).toHaveAttribute("data-album-state", "idle");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(stage).toHaveAttribute("data-album-state", "turning");
  await expect(stage).toHaveAttribute("data-album-state", "idle");
  await page.getByRole("button", { name: "Start again" }).click();
  await expect(page.getByText("1 / 4")).toBeVisible();
});

test("uses immediate functional changes for reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative reduced-motion viewport");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByTestId("little-moments").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open album" }).click();
  await expect(page.getByTestId("album-stage")).toHaveAttribute("data-album-state", "idle");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("2 / 4")).toBeVisible();
  await expect(page.getByTestId("turning-sheet")).toHaveCount(0);
});
