import { describe, expect, it, beforeEach } from "vitest";
import { WEB_DEMO_VERSION, handleWebIpc, resetWebIpcState } from "./ipc_stub";

describe("web IPC stub", () => {
  beforeEach(() => {
    resetWebIpcState();
  });

  it("boots a window without a desktop session", () => {
    const bootstrap = handleWebIpc("window-infrastructure:bootstrap", {}) as {
      windowSessionId: string;
      mayMigrateLegacyChatTabSession: boolean;
    };
    expect(bootstrap.windowSessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(bootstrap.mayMigrateLegacyChatTabSession).toBe(false);
  });

  it("keeps settings changes for the demo", () => {
    const updated = handleWebIpc("set-user-settings", {
      theme: "dark",
    }) as { theme?: string; selectedTemplateId: string };
    expect(updated.theme).toBe("dark");
    expect(updated.selectedTemplateId).toBe("react");
    expect(
      (handleWebIpc("get-user-settings", undefined) as { theme?: string })
        .theme,
    ).toBe("dark");
  });

  it("reports the web demo version and sample apps", () => {
    expect(handleWebIpc("get-app-version", undefined)).toEqual({
      version: WEB_DEMO_VERSION,
    });
    const apps = handleWebIpc("list-apps", undefined) as {
      apps: { name: string }[];
    };
    expect(apps.apps.map((app) => app.name)).toEqual([
      "Welcome",
      "Sample site",
    ]);
  });
});
