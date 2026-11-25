// Renders every svg/kadr_XX.svg to png/kadr_XX.png at 1920x1080.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const files = fs.readdirSync(path.join(dir, 'svg')).filter(f => f.endsWith('.svg')).sort();
  for (const f of files) {
    await page.goto('file://' + path.join(dir, 'svg', f));
    await page.screenshot({ path: path.join(dir, 'png', f.replace('.svg', '.png')) });
  }
  await browser.close();
  console.log('rendered', files.length);
})();
