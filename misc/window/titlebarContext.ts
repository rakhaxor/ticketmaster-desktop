import { ipcRenderer } from 'electron';

const titlebarContext = {
  exit() {
    void ipcRenderer.invoke('window-close');
  },
  undo() {
    void ipcRenderer.invoke('web-undo');
  },
  redo() {
    void ipcRenderer.invoke('web-redo');
  },
  cut() {
    void ipcRenderer.invoke('web-cut');
  },
  copy() {
    void ipcRenderer.invoke('web-copy');
  },
  paste() {
    void ipcRenderer.invoke('web-paste');
  },
  delete() {
    void ipcRenderer.invoke('web-delete');
  },
  select_all() {
    void ipcRenderer.invoke('web-select-all');
  },
  reload() {
    void ipcRenderer.invoke('web-reload');
  },
  force_reload() {
    void ipcRenderer.invoke('web-force-reload');
  },
  toggle_devtools() {
    void ipcRenderer.invoke('web-toggle-devtools');
  },
  actual_size() {
    void ipcRenderer.invoke('web-actual-size');
  },
  zoom_in() {
    void ipcRenderer.invoke('web-zoom-in');
  },
  zoom_out() {
    void ipcRenderer.invoke('web-zoom-out');
  },
  toggle_fullscreen() {
    void ipcRenderer.invoke('web-toggle-fullscreen');
  },
  minimize() {
    void ipcRenderer.invoke('window-minimize');
  },
  toggle_maximize() {
    void ipcRenderer.invoke('window-toggle-maximize');
  },
  open_url(url: string) {
    void ipcRenderer.invoke('open-url', url);
  },
};

export type TitlebarContextApi = typeof titlebarContext;

export default titlebarContext;
