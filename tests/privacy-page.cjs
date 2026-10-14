const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const root = path.resolve(__dirname, "..");
const url = pathToFileURL(path.join(root, "index.html")).href;
const output = path.join(root, "artifacts");

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const results = [];
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (/^https?:/.test(request.url())) requests.push(request.url());
    });
    for (const mode of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme: mode });
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(url, { waitUntil: "load" });
        assert.equal(await page.locator("h1").innerText(), "Privacy policy");
        assert.equal(await page.locator(".policy > section").count(), 17);
        assert.equal(await page.locator("time").getAttribute("datetime"), "2026-10-14");
        assert.ok((await page.locator("body").innerText()).includes("Welcome Mashilo Galane"));
        assert.equal((await page.locator("body").innerText()).includes("welcomegalane@gmail.com"), false);
        await page.locator(".brand img").evaluate((img) => img.decode());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${mode}/${width}: horizontal overflow`);
        assert.deepEqual(await page.evaluate(() => {
          const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
          return ids.filter((id, index) => ids.indexOf(id) !== index);
        }), []);
        assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
          .map((link) => link.getAttribute("href"))
          .filter((hash) => !document.getElementById(hash.slice(1)))), []);
        const disclosure = page.locator(".contents-disclosure");
        assert.equal(await disclosure.getAttribute("open") !== null, width > 760);
        if (width <= 760) await disclosure.locator("summary").click();
        await page.locator('.contents a[href="#simple-study"]').click();
        assert.ok(page.url().endsWith("#simple-study"));
        await page.waitForFunction(() => document.querySelector('.contents a[href="#simple-study"]').getAttribute("aria-current") === "location");
        if (width <= 760) assert.equal(await disclosure.getAttribute("open"), null);
        const bounds = await page.locator("#simple-study").boundingBox();
        assert.ok(bounds.y >= 0 && bounds.y < 100, `Section navigation at ${width}px`);
        await page.screenshot({ path: path.join(output, `simple-study-${mode}-${width}.png`) });
        await page.locator(".back-to-top").click();
        await page.screenshot({ path: path.join(output, `privacy-${mode}-${width}.png`) });
        results.push({ mode, width, passed: true });
      }
    }
    await page.goto(url);
    // Editorial checks preserve material disclosures during future copy revisions.
    const sectionText = (id) => page.locator(`#${id}`).innerText();
    assert.match(await sectionText("who-we-are"), /Welcome Mashilo Galane, trading as Study Surge/);
    assert.match(await sectionText("simple-study"), /sent to our server and then to OpenAI/);
    assert.match(await sectionText("simple-study"), /necessary authority and lawful basis/);
    assert.match(await sectionText("ai"), /errors or omissions/);
    assert.match(await sectionText("ai"), /human review/);
    assert.match(await sectionText("ai"), /not whether you have Pro or buy credits/);
    assert.match(await sectionText("grade-12"), /saved in Firestore for use across devices/);
    assert.match(await sectionText("grade-12"), /also creates a social post/);
    assert.match(await sectionText("scope"), /Grade 12 Life Sciences A\+/);
    assert.match(await sectionText("scope"), /Grade 12 Parent/);
    assert.match(await sectionText("scope"), /Grade 12 Teacher/);
    assert.match(await sectionText("scope"), /Study Surge: Learning Games/);
    assert.match(await sectionText("scope"), /Simple Study/);
    assert.equal(await page.locator("#scope .product-register > li").count(), 6);
    assert.match(await sectionText("scope"), /co\.za\.primebytestudios\.allinone/);
    assert.match(await sectionText("scope"), /co\.za\.studysurge\.parent/);
    assert.match(await sectionText("scope"), /co\.za\.studysurge\.teacher/);
    assert.match(await sectionText("scope"), /co\.za\.studysurge\.learninggames/);
    assert.match(await sectionText("scope"), /com\.lsgrade12\.galane/);
    assert.match(await sectionText("grade-12"), /app-open and app-close alerts/);
    assert.match(await sectionText("grade-12"), /reason and severity/);
    assert.match(await sectionText("providers"), /Zoho ZeptoMail/);
    assert.match(await sectionText("your-rights"), /separate email deletion request/);
    assert.match(await sectionText("your-rights"), /do not need to list every stored record/);
    assert.match(await sectionText("young-learners"), /Where consent is required, it must be provided before/);
    assert.doesNotMatch(await sectionText("young-learners"), /learner ticking|proof of that consent|school recommending/i);
    assert.match(await sectionText("complaints"), /right to complain directly/);
    assert.match(await sectionText("scope"), /cannot lawfully be excluded/);
    assert.match(await sectionText("complaints"), /revision 5/);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Skip to privacy policy");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "main-content");
    await page.evaluate(() => { window.print = () => { window.printRequested = true; }; });
    await page.locator("[data-print]").click();
    assert.equal(await page.evaluate(() => window.printRequested), true);
    const requestLink = new URL(await page.locator(".button.primary").getAttribute("href"));
    assert.equal(requestLink.protocol, "mailto:");
    assert.equal(requestLink.pathname, "hello@studysurge.co.za");
    assert.equal(requestLink.searchParams.get("subject"), "Privacy request");
    assert.ok(requestLink.searchParams.get("body").includes("Product:"));
    await page.emulateMedia({ media: "print", colorScheme: "light" });
    assert.equal(await page.locator(".contents").isVisible(), false);
    await page.pdf({ path: path.join(output, "privacy-print-preview.pdf"), format: "A4", printBackground: true });
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, [], "Policy page must not load third-party services");
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const plain = await noJs.newPage();
    await plain.goto(url);
    assert.equal(await plain.locator(".policy > section").count(), 17);
    assert.equal(await plain.locator("[data-print]").isVisible(), false);
    assert.ok(await plain.locator("#simple-study").isVisible());
    await plain.locator('.contents a[href="#your-rights"]').click();
    assert.ok(plain.url().endsWith("#your-rights"));
    await noJs.close();
    fs.writeFileSync(path.join(output, "results.json"), JSON.stringify({ results, errors, externalRequests: requests }, null, 2));
    console.log("PASS: 17 sections, disclosure regression checks, eight light/dark viewport checks, working contents navigation, keyboard access, mailto request, print preview and no-JavaScript fallback. No third-party requests.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
