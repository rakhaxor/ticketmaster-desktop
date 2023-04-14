import { ipcMain } from 'electron';
import bot from '@misc/window/bot';

export const registerTestIPC = () => {
  ipcMain.handle('submit-form', async (event, data) => {
    const json = JSON.parse(data);
    json.concurrency = Number(json.concurrency);
    json.runHeadless = json.runHeadless == 'true';
    json.buyUrl = String(json.buyUrl);
    json.maxRetries = Number(json.maxRetries);
    json.useProxy = json.useProxy == 'true';
    json.file = String(json.file);

    return await bot(json);
  });
}
