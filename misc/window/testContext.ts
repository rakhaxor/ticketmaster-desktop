import { ipcRenderer } from 'electron';

const testContext = async (data: any) => {
  return await ipcRenderer.invoke('submit-form', data);
}

export type TestContextAPI = typeof testContext;

export default testContext;
