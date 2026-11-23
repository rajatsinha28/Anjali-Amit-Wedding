import { expect, test } from "@playwright/test";

test("completes the interactive invitation journey", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  test.skip(testInfo.project.name !== "mobile-390", "Representative full-flow viewport");
  await page.addInitScript(() => {
    sessionStorage.setItem("intro.opened", "true");
    localStorage.removeItem("dateRevealed");
  });
  await page.goto("/");

  const dateSection = page.getByTestId("date-reveal");
  await dateSection.scrollIntoViewIfNeeded();
  const canvas = dateSection.getByLabel("Scratch the gold to reveal the wedding date");
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  for (let row = 1; row <= 3; row += 1) {
    const y = box!.y + (box!.height * row) / 4;
    await page.mouse.move(box!.x + 8, y);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width - 8, y, { steps: 20 });
    await page.mouse.up();
  }
  await expect(canvas).toHaveCount(0);
  await expect(page.getByText("Thursday, 10 December. We’ll be waiting for you!")).toBeVisible();
  await expect(page.getByText(/Baraat arrives · 10 DECEMBER 2026 · 9:00 PM IST/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to Calendar" })).toBeVisible();

  const album = page.getByTestId("little-moments");
  await album.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open album" }).click();
  await expect(page.getByTestId("album-open")).toBeVisible();
  await expect(page.getByTestId("album-stage")).toHaveAttribute("data-album-state", "idle");
  for (const slots of [
    ["album-slot-03", "album-slot-04"],
    ["album-slot-05", "album-slot-06"],
    ["album-slot-07", "album-slot-08"],
  ]) {
    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByTestId("album-stage")).toHaveAttribute("data-album-state", "turning");
    await expect(page.getByTestId("album-stage")).toHaveAttribute("data-album-state", "idle");
    for (const slot of slots)
      await expect(page.locator(`[data-photo-slot="${slot}"]`)).toBeVisible();
  }
  await page.getByRole("button", { name: "Start again" }).click();
  await expect(page.getByText("1 / 4")).toBeVisible({ timeout: 1500 });

  for (const ceremony of [
    { id: "haldi", title: "HALDI CEREMONY" },
    { id: "mehendi-sangeet", title: "MEHENDI & SANGEET" },
    { id: "wedding", title: "THE WEDDING CEREMONY" },
  ]) {
    const card = page.getByTestId(`ceremony-${ceremony.id}`);
    await card.scrollIntoViewIfNeeded();
    await expect(page.locator(`[data-royal-scroll="ceremony:${ceremony.id}"]`)).toHaveAttribute(
      "data-scroll-state",
      "opened",
      { timeout: 5000 },
    );
    await expect(page.getByRole("heading", { name: ceremony.title })).toBeVisible();
  }
  await expect(page.getByTestId("venue")).toBeVisible();
  await page.getByTestId("closing-portrait").scrollIntoViewIfNeeded();
  await expect(
    page.getByTestId("closing-portrait").getByRole("img", {
      name: "Anjali and Amit standing together in dark traditional outfits",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "We can’t wait to celebrate with you" }),
  ).toBeVisible();
  await expect(page.getByText("Neeraj and Roli Srivastava", { exact: true }).last()).toBeVisible();
  await expect(page.getByTestId("closing-portrait").locator("svg")).toHaveCSS(
    "animation-name",
    /ringSpin/,
  );
  await page.getByRole("button", { name: "Read a Special Note From Our Family" }).click();
  await expect(page.getByRole("button", { name: "Close Special Note" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(
    page.getByText(/With the blessings of the Almighty and our elders, we cordially invite/),
  ).toBeVisible();
  await expect(page.getByText(/Then vs/i)).toHaveCount(0);
  await expect(page.getByText(/Hand in Hand/i)).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
  await page.screenshot({ path: testInfo.outputPath("complete-invitation.png"), fullPage: true });
});

test("renders the complete settled invitation at boundary widths", async ({ page }, testInfo) => {
  test.skip(
    !["mobile-320", "desktop-1440"].includes(testInfo.project.name),
    "Boundary layout pair",
  );
  await page.addInitScript(() => {
    sessionStorage.setItem("intro.opened", "true");
    localStorage.setItem("dateRevealed", "true");
  });
  await page.goto("/");
  await expect(page.getByTestId("date-reveal")).toBeAttached();
  await expect(page.getByTestId("little-moments")).toBeAttached();
  await expect(page.getByTestId("ceremonies")).toBeAttached();
  await expect(page.getByTestId("closing-portrait")).toBeAttached();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
});

test("starts the scratch card covered again after every load", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative scratch viewport");
  await page.addInitScript(() => {
    sessionStorage.setItem("intro.opened", "true");
    localStorage.setItem("dateRevealed", "true");
  });
  await page.goto("/");
  const dateSection = page.getByTestId("date-reveal");
  await expect(dateSection).toBeAttached({ timeout: 15_000 });
  await dateSection.scrollIntoViewIfNeeded();
  const scratchLabel = "Scratch the gold to reveal the wedding date";
  await expect(page.getByLabel(scratchLabel)).toBeVisible();
  await page.getByRole("button", { name: "Reveal the date" }).click();
  await expect(page.getByLabel(scratchLabel)).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("date-reveal")).toBeAttached({ timeout: 15_000 });
  await page.getByTestId("date-reveal").scrollIntoViewIfNeeded();
  await expect(page.getByLabel(scratchLabel)).toBeVisible();
});
