import { expect, test } from "@playwright/test";

interface AudioProbeWindow extends Window {
  __invitationAudioProbe?: {
    allowPlayback: boolean;
    calls: number;
    positions: number[];
  };
}

test("attempts music on load and retries from the beginning without the opening button", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative audio viewport");
  await page.addInitScript(() => {
    const probeWindow = window as AudioProbeWindow;
    probeWindow.__invitationAudioProbe = { allowPlayback: false, calls: 0, positions: [] };
    Object.defineProperty(HTMLMediaElement.prototype, "readyState", {
      configurable: true,
      get: () => 1,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      configurable: true,
      get: () => 89.6,
    });
    HTMLMediaElement.prototype.load = () => undefined;
    HTMLMediaElement.prototype.play = function () {
      const probe = probeWindow.__invitationAudioProbe!;
      probe.calls += 1;
      probe.positions.push(this.currentTime);
      return probe.allowPlayback
        ? Promise.resolve()
        : Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
    };
  });

  await page.goto("/?intro=1");
  await expect
    .poll(() =>
      page.evaluate(() => (window as AudioProbeWindow).__invitationAudioProbe?.calls ?? 0),
    )
    .toBeGreaterThanOrEqual(1);
  await page.waitForTimeout(100);
  const blockedCalls = await page.evaluate(
    () => (window as AudioProbeWindow).__invitationAudioProbe?.calls ?? 0,
  );
  await page.evaluate(() => {
    (window as AudioProbeWindow).__invitationAudioProbe!.allowPlayback = true;
    window.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerId: 11,
        pointerType: "touch",
        isPrimary: true,
      }),
    );
  });
  await expect
    .poll(() =>
      page.evaluate(() => (window as AudioProbeWindow).__invitationAudioProbe?.calls ?? 0),
    )
    .toBe(blockedCalls + 1);
  expect(
    await page.evaluate(() =>
      (window as AudioProbeWindow).__invitationAudioProbe?.positions.every((time) => time === 0),
    ),
  ).toBe(true);
});

test("runs one continuous sacred opening and hero handoff", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Representative transition viewport");
  await page.goto("/?intro=1");
  await expect(page.getByTestId("preloader")).toBeHidden({ timeout: 5500 });
  await page.waitForTimeout(2800);

  const heading = page.getByRole("heading", { name: "श्री गणेशाय नमः" });
  const verse = page.locator('[lang="sa"]');
  const button = page.getByRole("button", { name: "TAP TO OPEN" });
  await expect(heading).toBeVisible();
  await expect(verse).toBeVisible();
  await expect(button).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect(
    Number.parseFloat(await heading.evaluate((node) => getComputedStyle(node).fontSize)),
  ).toBeGreaterThanOrEqual(29);
  expect(
    Number.parseFloat(await verse.evaluate((node) => getComputedStyle(node).fontSize)),
  ).toBeGreaterThanOrEqual(18);
  await page.screenshot({ path: testInfo.outputPath("01-opening.png") });

  await button.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: testInfo.outputPath("02-doors-parting.png") });
  await page.waitForTimeout(1300);
  await expect(page.getByTestId("royal-doors")).toHaveCount(0);
  const portrait = page.getByTestId("hero-portrait-image");
  await expect(portrait).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("03-soft-hero.png") });

  await expect(portrait).toHaveCSS("filter", "blur(0px) brightness(1)", { timeout: 1800 });
  await expect(page.getByTestId("hero-jharokha")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { name: "Anjali" })).toHaveCSS("opacity", "1", {
    timeout: 1700,
  });
  await page.screenshot({ path: testInfo.outputPath("04-anjali-revealed.png") });
  await expect(page.getByRole("heading", { name: "Amit" })).toHaveCSS("opacity", "1", {
    timeout: 1900,
  });
  await expect(page.getByText("Scroll to discover")).toHaveCSS("opacity", "1", {
    timeout: 1200,
  });
  await page.screenshot({ path: testInfo.outputPath("05-final-hero.png") });

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(0);
  expect(await page.evaluate(() => sessionStorage.getItem("intro.opened"))).toBe("true");
});
