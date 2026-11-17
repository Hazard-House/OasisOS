// Demo IPC for the browser build. It answers the calls the home, sidebar,
// settings, and About screens make on startup. It does not touch the disk,
// git, or Dyad's services.

export const WEB_DEMO_VERSION = "web-demo";

const WINDOW_SESSION_ID = "00000000-0000-4000-8000-000000000001";

type Settings = Record<string, unknown>;

function demoApp(id: number, name: string) {
  const now = new Date("2026-11-17T12:00:00.000Z");
  return {
    id,
    name,
    path: name.toLowerCase().replace(/\s+/g, "-"),
    createdAt: now,
    updatedAt: now,
    githubOrg: null,
    githubRepo: null,
    githubBranch: null,
    gitlabInstanceUrl: null,
    gitlabProjectId: null,
    gitlabProjectPath: null,
    gitlabBranch: null,
    supabaseProjectId: null,
    supabaseParentProjectId: null,
    supabaseOrganizationSlug: null,
    neonProjectId: null,
    neonDevelopmentBranchId: null,
    neonPreviewBranchId: null,
    neonActiveBranchId: null,
    selectedDatabaseBranchType: null,
    vercelProjectId: null,
    vercelProjectName: null,
    vercelDeploymentUrl: null,
    vercelTeamId: null,
    installCommand: null,
    startCommand: null,
    isFavorite: id === 1,
    testingEnabled: false,
    collectionId: null,
  };
}

const demoApps = [demoApp(1, "Welcome"), demoApp(2, "Sample site")];

function defaultSettings(): Settings {
  return {
    selectedModel: { name: "auto", provider: "auto" },
    providerSettings: {},
    telemetryConsent: "opted_out",
    telemetryUserId: "oasis-web-demo",
    hasRunBefore: true,
    enableAutoUpdate: false,
    releaseChannel: "stable",
    selectedTemplateId: "react",
    selectedChatMode: "build",
    defaultChatMode: "build",
    experiments: {},
    lastShownReleaseNotesVersion: WEB_DEMO_VERSION,
    zoomLevel: 100,
    language: "en",
    showSystemResourceUsage: true,
  };
}

let settings = defaultSettings();

function resourceUsage() {
  return {
    sampledAt: Date.now(),
    platform: "linux",
    cpu: { logicalCores: 4, usedPercent: 12 },
    memory: {
      totalBytes: 8 * 1024 * 1024 * 1024,
      usedBytes: 3 * 1024 * 1024 * 1024,
      committedBytes: null,
      commitLimitBytes: null,
      compressedBytes: null,
      swapUsedBytes: null,
      source: "linux",
    },
  };
}

const handlers: Record<string, (input: unknown) => unknown> = {
  "window-infrastructure:bootstrap": () => ({
    windowSessionId: WINDOW_SESSION_ID,
    currentQueryInvalidationEpoch: 0,
    missedInvalidations: [],
    recoveryScopes: [],
    mayMigrateLegacyChatTabSession: false,
    restorableWindowSessionIds: [WINDOW_SESSION_ID],
  }),
  "get-user-settings": () => settings,
  "set-user-settings": (input) => {
    settings = { ...settings, ...(input as Settings) };
    return settings;
  },
  "get-env-vars": () => ({}),
  "get-system-platform": () => "linux",
  "get-initial-load-telemetry-context": () => ({
    isFirstSession: false,
    previousSessionAppSize: null,
    pagefile: null,
  }),
  "get-app-version": () => ({ version: WEB_DEMO_VERSION }),
  "get-user-budget": () => null,
  "get-subscription-status": () => null,
  "codex-subscription:status": () => ({
    connected: false,
    pending: false,
    models: [],
    limitReached: false,
    windows: [],
  }),
  "get-language-model-providers": () => [
    {
      id: "auto",
      name: "OasisOS",
      type: "cloud",
      hasFreeTier: false,
      websiteUrl: "https://academy.dyad.sh/subscription",
      gatewayPrefix: "dyad/",
    },
  ],
  "get-language-models": () => [],
  "get-language-models-by-providers": () => ({}),
  "list-apps": () => ({ apps: demoApps }),
  "get-chats": () => [],
  "system:get-resource-usage": () => resourceUsage(),
  "does-release-note-exist": () => ({ exists: false }),
  "nodejs-status": () => ({
    nodeVersion: "24.0.0",
    pnpmVersion: null,
    nodeDownloadUrl: "https://nodejs.org/",
    source: "system",
    nodePath: "/usr/bin/node",
    managedNodeInstalled: false,
    managedNodeVersion: null,
    systemNodeTooOld: false,
    managedNodeSupported: false,
  }),
  "app:list-thumbnails": (input) => {
    const appIds =
      input && typeof input === "object" && "appIds" in input
        ? (input as { appIds: number[] }).appIds
        : [];
    return {
      thumbnails: appIds.map((appId) => ({ appId, thumbnailUrl: null })),
    };
  },
  "appCollections:list": () => [],
  "user-input:get-pending": () => [],
  "prompts:list": () => [],
  "get-themes": () => [],
  "get-custom-themes": () => [],
  "get-templates": () => [],
  "agent-tool:get-tools": () => [],
  "list-all-media": () => ({ apps: [] }),
  "free-agent-quota:get-status": () => ({
    messagesUsed: 0,
    messagesLimit: 5,
    isQuotaExceeded: false,
    windowStartTime: null,
    resetTime: null,
    hoursUntilReset: null,
  }),
  "gitlab:get-status": () => ({
    connected: false,
    instanceUrl: null,
    username: null,
    tokenExpiresAt: null,
  }),
  "get-custom-apps-folder": () => ({
    path: "/oasis-apps",
    isPathAvailable: true,
    isPathDefault: true,
  }),
  "open-external-url": (input) => {
    if (typeof input === "string") {
      window.open(input, "_blank", "noopener,noreferrer");
    }
    return undefined;
  },
  "native-theme:get-state": () => ({
    shouldUseDarkColors: false,
  }),
};

export function handleWebIpc(channel: string, input: unknown): unknown {
  const handler = handlers[channel];
  if (handler) {
    return handler(input);
  }
  console.info(`[oasis-web] No desktop handler for ${channel}`);
  return null;
}

export function resetWebIpcState(): void {
  settings = defaultSettings();
}

declare global {
  interface Window {
    __OASIS_WEB_DEMO__?: boolean;
    electron?: {
      ipcRenderer: {
        invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
        invokeEnvelope: (
          channel: string,
          ...args: unknown[]
        ) => Promise<unknown>;
        send: (channel: string, ...args: unknown[]) => void;
        on: (
          channel: string,
          listener: (...args: unknown[]) => void,
        ) => () => void;
        removeAllListeners: (channel: string) => void;
        removeListener: (
          channel: string,
          listener: (...args: unknown[]) => void,
        ) => void;
      };
      webFrame: {
        setZoomFactor: (factor: number) => void;
        getZoomFactor: () => number;
      };
    };
  }
}

export function installWebIpcStub(): void {
  window.__OASIS_WEB_DEMO__ = true;
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>();
  window.electron = {
    ipcRenderer: {
      invoke: (channel, ...args) =>
        Promise.resolve(handleWebIpc(channel, args[0])),
      send: () => undefined,
      on: (channel, listener) => {
        const set = listeners.get(channel) ?? new Set();
        set.add(listener);
        listeners.set(channel, set);
        return () => {
          set.delete(listener);
        };
      },
      removeAllListeners: (channel) => {
        listeners.delete(channel);
      },
      removeListener: (channel, listener) => {
        listeners.get(channel)?.delete(listener);
      },
    },
    webFrame: {
      setZoomFactor: () => undefined,
      getZoomFactor: () => 1,
    },
  };
}
