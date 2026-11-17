import { installWebIpcStub } from "./ipc_stub";

const demoWindow = window as Window & {
  electron?: { ipcRenderer?: unknown };
};

// This module is the only browser stand-in. It runs before the renderer loads.
if (!demoWindow.electron?.ipcRenderer) {
  installWebIpcStub();
}

// The renderer evaluates after this turn, so the stub is in place first.
void import("../renderer");
