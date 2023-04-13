declare global {
  interface Window {
    electron_window: {
      titlebar: (event: Electron.IpcRendererEvent, ...args: any[]) => void;
      test: (data: any) => Promise<void>;
    }
  }
}
// Export a default value to satisfy TypeScript's module requirements
export default {};
