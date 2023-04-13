import { ipcMain } from 'electron';
import puppeteer from 'puppeteer';

const runPuppeteer = async (data: any) => {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
  return { success: true, message: 'Data processed successfully' };
}

export const registerTestIPC = () => {
  ipcMain.handle('submit-form', async (event, data) => {
    console.log(data);
    // json to object
    const obj = JSON.parse(data);
    console.log(obj);
    return await runPuppeteer(data);
  });
}
