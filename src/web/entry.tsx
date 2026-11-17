import { installWebIpcStub } from "./ipc_stub";

// The page loads web/public/ipc-bootstrap.js before this module. Do not replace
// that stand-in, or startup calls lose the answers it already installed.
if (!window.electron?.ipcRenderer) {
  installWebIpcStub();
}

await import("../renderer");
