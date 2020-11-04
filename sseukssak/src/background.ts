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

  appIcon.setToolTip("SseukSsak");
  appIcon.setContextMenu(contextMenu);

  return appIcon;
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
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, 'index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }));
    // win.webContents.openDevTools({ mode: "undocked" });
  }

  win.on("minimize", function(event) {
    event.preventDefault();
    // win.setSkipTaskbar(true);
    if (!tray) {
      tray = createTray();
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
  createWindow();

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
