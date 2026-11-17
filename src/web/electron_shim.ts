// Browser stand-in for Electron. The desktop build does not import this file.
// The web demo aliases the "electron" package here so a shared module can load
// without a native runtime.

export const app = {
  getName: () => "OasisOS",
  getVersion: () => "web-demo",
  getPath: () => "",
  isPackaged: false,
  on: () => undefined,
  whenReady: () => Promise.resolve(),
};

export class BrowserWindow {}

export const ipcMain = {
  handle: () => undefined,
  on: () => undefined,
};

export const ipcRenderer = {};

export const contextBridge = {
  exposeInMainWorld: () => undefined,
};

export const shell = {
  openExternal: async (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  },
};

export const dialog = {};

export const nativeImage = {
  createFromPath: () => ({}),
};

export const safeStorage = {
  isEncryptionAvailable: () => false,
};

export const webFrame = {
  setZoomFactor: () => undefined,
  getZoomFactor: () => 1,
};

export default {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  contextBridge,
  shell,
  dialog,
  nativeImage,
  safeStorage,
  webFrame,
};
