// Runs before the app module so startup IPC calls see a desktop stand-in.
// Keep the answers aligned with src/web/ipc_stub.ts.
(function installOasisWebIpc() {
  var sessionId = "00000000-0000-4000-8000-000000000001";
  var now = new Date("2026-11-17T12:00:00.000Z");
  function demoApp(id, name) {
    return {
      id: id,
      name: name,
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
  var apps = [demoApp(1, "Welcome"), demoApp(2, "Sample site")];
  var settings = {
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
    lastShownReleaseNotesVersion: "web-demo",
    zoomLevel: 100,
    language: "en",
    showSystemResourceUsage: true,
  };
  var handlers = {
    "window-infrastructure:bootstrap": function () {
      return {
        windowSessionId: sessionId,
        currentQueryInvalidationEpoch: 0,
        missedInvalidations: [],
        recoveryScopes: [],
        mayMigrateLegacyChatTabSession: false,
        restorableWindowSessionIds: [sessionId],
      };
    },
    "get-user-settings": function () {
      return settings;
    },
    "set-user-settings": function (input) {
      settings = Object.assign({}, settings, input || {});
      return settings;
    },
    "get-env-vars": function () {
      return {};
    },
    "get-system-platform": function () {
      return "linux";
    },
    "get-initial-load-telemetry-context": function () {
      return {
        isFirstSession: false,
        previousSessionAppSize: null,
        pagefile: null,
      };
    },
    "get-app-version": function () {
      return { version: "web-demo" };
    },
    "get-user-budget": function () {
      return null;
    },
    "get-subscription-status": function () {
      return null;
    },
    "codex-subscription:status": function () {
      return {
        connected: false,
        pending: false,
        models: [],
        limitReached: false,
        windows: [],
      };
    },
    "get-language-model-providers": function () {
      return [
        {
          id: "auto",
          name: "OasisOS",
          type: "cloud",
          hasFreeTier: false,
          websiteUrl: "https://academy.dyad.sh/subscription",
          gatewayPrefix: "dyad/",
        },
      ];
    },
    "get-language-models": function () {
      return [];
    },
    "get-language-models-by-providers": function () {
      return {};
    },
    "list-apps": function () {
      return { apps: apps };
    },
    "get-chats": function () {
      return [];
    },
    "system:get-resource-usage": function () {
      return {
        sampledAt: Date.now(),
        platform: "linux",
        cpu: { logicalCores: 4, usedPercent: 12 },
        memory: {
          totalBytes: 8589934592,
          usedBytes: 3221225472,
          committedBytes: null,
          commitLimitBytes: null,
          compressedBytes: null,
          swapUsedBytes: null,
          source: "linux",
        },
      };
    },
    "does-release-note-exist": function () {
      return { exists: false };
    },
    "nodejs-status": function () {
      return {
        nodeVersion: "24.0.0",
        pnpmVersion: null,
        nodeDownloadUrl: "https://nodejs.org/",
        source: "system",
        nodePath: "/usr/bin/node",
        managedNodeInstalled: false,
        managedNodeVersion: null,
        systemNodeTooOld: false,
        managedNodeSupported: false,
      };
    },
    "app:list-thumbnails": function (input) {
      var appIds = input && input.appIds ? input.appIds : [];
      return {
        thumbnails: appIds.map(function (appId) {
          return { appId: appId, thumbnailUrl: null };
        }),
      };
    },
    "appCollections:list": function () {
      return [];
    },
    "user-input:get-pending": function () {
      return [];
    },
    "prompts:list": function () {
      return [];
    },
    "get-themes": function () {
      return [];
    },
    "get-custom-themes": function () {
      return [];
    },
    "get-templates": function () {
      return [];
    },
    "agent-tool:get-tools": function () {
      return [];
    },
    "list-all-media": function () {
      return { apps: [] };
    },
    "free-agent-quota:get-status": function () {
      return {
        messagesUsed: 0,
        messagesLimit: 5,
        isQuotaExceeded: false,
        windowStartTime: null,
        resetTime: null,
        hoursUntilReset: null,
      };
    },
    "gitlab:get-status": function () {
      return {
        connected: false,
        instanceUrl: null,
        username: null,
        tokenExpiresAt: null,
      };
    },
    "get-custom-apps-folder": function () {
      return {
        path: "/oasis-apps",
        isPathAvailable: true,
        isPathDefault: true,
      };
    },
    "get-system-debug-info": function () {
      return {
        nodeVersion: "24.0.0",
        pnpmVersion: null,
        nodePath: "/usr/bin/node",
        telemetryId: "oasis-web-demo",
        telemetryConsent: "opted_out",
        telemetryUrl: "",
        dyadVersion: "web-demo",
        platform: "linux",
        architecture: "x64",
        logs: "",
        updaterLogs: null,
        selectedLanguageModel: "OasisOS",
      };
    },
    "open-external-url": function (input) {
      if (typeof input === "string") {
        window.open(input, "_blank", "noopener,noreferrer");
      }
    },
    "native-theme:get-state": function () {
      return { shouldUseDarkColors: false };
    },
  };

  function handle(channel, input) {
    var handler = handlers[channel];
    if (handler) return handler(input);
    console.info("[oasis-web] No desktop handler for " + channel);
    return null;
  }

  var listeners = {};
  window.__OASIS_WEB_DEMO__ = true;
  window.electron = {
    ipcRenderer: {
      invoke: function (channel, input) {
        return Promise.resolve(handle(channel, input));
      },
      send: function () {},
      on: function (channel, listener) {
        var set = listeners[channel] || (listeners[channel] = []);
        set.push(listener);
        return function () {
          listeners[channel] = (listeners[channel] || []).filter(
            function (item) {
              return item !== listener;
            },
          );
        };
      },
      removeAllListeners: function (channel) {
        delete listeners[channel];
      },
      removeListener: function (channel, listener) {
        listeners[channel] = (listeners[channel] || []).filter(function (item) {
          return item !== listener;
        });
      },
    },
    webFrame: {
      setZoomFactor: function () {},
      getZoomFactor: function () {
        return 1;
      },
    },
  };
})();
