import { expect, test } from "@playwright/test";

const standardProjects = [
  "mobile-320",
  "mobile-360",
  "mobile-390",
  "mobile-430",
  "tablet-768",
  "desktop-1440",
];

test("renders the settled portrait hero across the approved viewport matrix", async ({
  page,
}, testInfo) => {
  test.skip(!standardProjects.includes(testInfo.project.name), "Six-size portrait hero matrix");
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
  await page.goto("/");
  const hero = page.getByTestId("hero-handoff");
  await expect(hero).toBeVisible();
  await expect(hero.getByRole("img", { name: "Anjali and Amit standing together" })).toBeVisible();
  await expect(hero.getByText("शुभ विवाह", { exact: true })).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { name: "Anjali" })).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { name: "Amit" })).toHaveCSS("opacity", "1");
  await expect(page.getByText("Daughter of", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Son of", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Mr. Neeraj Srivastava and Mrs. Roli Srivastava")).toHaveCount(0);
  await expect(page.getByText("Mr. Rajendra Prasad and Mrs. Rajpati Devi")).toHaveCount(0);
  await expect(page.getByText("Scroll to discover")).toHaveCSS("opacity", "1");
  if (["mobile-320", "mobile-390"].includes(testInfo.project.name)) {
    const portraitBox = await page.getByTestId("hero-portrait-stage").boundingBox();
    const brideBox = await page.getByRole("heading", { name: "Anjali" }).boundingBox();
    const groomBox = await page.getByRole("heading", { name: "Amit" }).boundingBox();
    const heroBox = await hero.boundingBox();
    expect(portraitBox).not.toBeNull();
    expect(brideBox).not.toBeNull();
    expect(groomBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    const hintBox = await page.getByTestId("scroll-hint").boundingBox();
    expect(hintBox).not.toBeNull();
    expect(brideBox!.y - (portraitBox!.y + portraitBox!.height)).toBeGreaterThanOrEqual(12);
    expect(heroBox!.y + heroBox!.height - (hintBox!.y + hintBox!.height)).toBeLessThanOrEqual(32);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-settled.png`),
    fullPage: true,
  });
});

test("starts the name reveal only after the doors finish and skips replay on refresh", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative interaction viewport");
  await page.goto("/?intro=1");
  await expect(page.getByTestId("preloader")).toBeHidden({ timeout: 5000 });
  const button = page.getByRole("button", { name: "TAP TO OPEN" });
  await button.click();
  await expect(page.getByTestId("hero-handoff")).toBeVisible({ timeout: 1500 });
  await expect(page.getByTestId("royal-doors")).toBeHidden({ timeout: 3500 });
  await expect(page.getByTestId("hero-portrait-image")).toHaveCSS(
    "filter",
    "blur(0px) brightness(1)",
    {
      timeout: 2500,
    },
  );
  await expect(page.getByTestId("hero-portrait-image")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { name: "Anjali" })).toHaveCSS("opacity", "1", {
    timeout: 2500,
  });
  await expect(page.getByRole("heading", { name: "Amit" })).toHaveCSS("opacity", "1", {
    timeout: 2500,
  });
  await expect(page.getByText("Scroll to discover")).toHaveCSS("opacity", "1", { timeout: 2500 });
  expect(await page.evaluate(() => sessionStorage.getItem("intro.opened"))).toBe("true");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "TAP TO OPEN" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Anjali" })).toHaveCSS("opacity", "1");
});

test("uses natural extra height on the shortest portrait screen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320", "Shortest portrait viewport");
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewport: innerHeight,
  }));
  expect(dimensions.height).toBeGreaterThan(dimensions.viewport);
  await expect(page.getByText("Scroll to discover")).toBeVisible();
});

test("keeps the compact landscape layout inside its content corridor", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "landscape-844", "Landscape boundary layout");
  await page.addInitScript(() => sessionStorage.setItem("intro.opened", "true"));
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Anjali and Amit standing together" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Amit" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
});

test("settles immediately for reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative accessibility viewport");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?intro=1");
  await expect(page.getByTestId("preloader")).toBeHidden({ timeout: 5000 });
  await page.getByRole("button", { name: "TAP TO OPEN" }).click();
  await expect(page.getByTestId("royal-doors")).toBeHidden({ timeout: 1200 });
  await expect(page.getByRole("heading", { name: "Anjali" })).toHaveCSS("opacity", "1", {
    timeout: 1500,
  });
  await expect(page.getByRole("heading", { name: "Amit" })).toHaveCSS("opacity", "1");
});
