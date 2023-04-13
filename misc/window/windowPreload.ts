import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import testContext from '@misc/window/testContext';

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
  test: testContext,
});
