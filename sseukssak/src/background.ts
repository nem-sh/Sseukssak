"use strict";
declare const __static: string;
import path from "path";

import {
  app,
  protocol,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  screen,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
let loadingScreen: BrowserWindow | null;
let tray: Tray | null;
const browserWidth = 1000;
const browserHeight = 600;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createTray() {
  let appIcon = new Tray(path.join(__static, "sweeping.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function() {
        if (win !== null) {
          win.show();
        }
      },
    },
    {
      label: "Exit",
      click: function() {
        app.quit();
      },
    },
  ]);

  appIcon.on("double-click", function(event) {
    if (win !== null) {
      win.show();
    }
  });

  appIcon.setToolTip("쓱싹");
  appIcon.setContextMenu(contextMenu);

  return appIcon;
}
function createLoadingScreen() {
  loadingScreen = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    center: true,
    thickFrame: true,
    frame: false,
    transparent: true,
  });
  loadingScreen.setResizable(false);
  loadingScreen.setAlwaysOnTop(true);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    if (loadingScreen !== null) {
      console.log(__dirname);
      // loadingScreen.loadURL("file://" + __dirname + "/bundled/loading.html");
      // loadingScreen.once("ready-to-show", () => {
      //   if (loadingScreen !== null) {
      //     loadingScreen.show();
      //   }
      // });
    }
  } else {
    createProtocol("app");
    loadingScreen.loadURL("app://./loading.html");
    loadingScreen.once("ready-to-show", () => {
      if (loadingScreen !== null) {
        loadingScreen.show();
      }
    });
  }
  loadingScreen.on("closed", () => (loadingScreen = null));

  loadingScreen.webContents.on("did-finish-load", () => {
    if (loadingScreen !== null) {
      loadingScreen.show();
    }
  });
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: browserWidth,
    height: browserHeight,
    minWidth: browserWidth,
    minHeight: browserHeight,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    center: true,
    thickFrame: true,
    frame: false,
    transparent: true,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // develop
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // 개발자 모드에서 개발자 모드 On
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    // build
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");

    // 빌드 한 프로그램에서 개발자 모드 On
    // win.webContents.openDevTools({ mode: "undocked" });
  }
  win.once("ready-to-show", () => {
    if (win !== null) {
      win.show();
    }
  });

  win.on("closed", function() {
    tray = null;
    win = null;
  });

  win.webContents.on("did-finish-load", () => {
    if (loadingScreen) {
      loadingScreen.close();
    }
    if (win !== null) {
      win.show();
    }
  });

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createLoadingScreen();
  if (!tray) {
    tray = createTray();
  }
  setTimeout(() => {
    createWindow();
  }, 4000);

  ipcMain.on("resize-me-smaller-please", (event, arg) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    if (win !== null) {
      win.setMinimumSize(400, 200);
      win.setSize(400, 200);
      win.setPosition(width - 400, height - 200);
      win.setAlwaysOnTop(true);
      win.setResizable(false);
    }
  });

  ipcMain.on("resize-me-bigger-please", (event, arg) => {
    if (win !== null) {
      win.setSize(browserWidth, browserHeight);
      win.center();
      win.setAlwaysOnTop(false);
      win.setMinimumSize(browserWidth, browserHeight);
      win.setResizable(true);
    }
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
