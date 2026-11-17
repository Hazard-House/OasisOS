import { installWebIpcStub } from "./ipc_stub";

// This module is the only browser stand-in. It runs before the renderer loads.
if (!window.electron?.ipcRenderer) {
  installWebIpcStub();
}

// The renderer evaluates after this turn, so the stub is in place first.
void import("../renderer");
