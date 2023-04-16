import { ipcMain } from 'electron';
import bot from '@misc/window/bot';

export const registerTestIPC = () => {
  ipcMain.handle('submit-form', async (event, data) => {
    return await bot(data);
  });
}
