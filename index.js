import express from 'express';
import { chromium } from 'playwright';

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const prompt = req.body.prompt;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://replit.com/~', { waitUntil: 'networkidle' });
    await page.click('text=Start Building');
    await page.waitForSelector('textarea[placeholder*="Describe"]', { timeout: 15000 });
    await page.fill('textarea[placeholder*="Describe"]', prompt);
    await page.click('button:has-text("Generate")');
    await page.waitForSelector('label input[type="checkbox"]', { timeout: 30000 });

    const checkboxes = await page.$$('label input[type="checkbox"]');
    for (const cb of checkboxes) await cb.check();

    const nextBtn = await page.$('button:has-text("Next"), button:has-text("Continue")');
    if (nextBtn) await nextBtn.click();

    await page.waitForNavigation({ waitUntil: 'networkidle' });
    const link = page.url();

    await browser.close();
    return res.json({ link });
  } catch (err) {
    await browser.close();
    return res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => console.log('Server attivo su porta 10000'));
