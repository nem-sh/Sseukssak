module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      nodeModulesPath: ["../../node_modules", "./node_modules"],
      builderOptions: {
        productName: "sseukssak",
        appId: "com.sseukssak",
        win: {
          target: "nsis",
          icon: "./public/sweeping.ico",
        },
        mac: {
          target: ["default"],
          icon: "./public/sweeping_mac.ico",
        },
        dmg: {
          title: "sseukssak",
          icon: "./public/sweeping_mac.ico",
        },
        nsis: {
          installerIcon: "./public/sweeping_mac.ico",
          installerHeaderIcon: "./public/sweeping_mac.ico",
          deleteAppDataOnUninstall: true,
          createDesktopShortcut: true,
        },
      },
    },
  },
};
