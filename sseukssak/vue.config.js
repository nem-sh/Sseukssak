module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      nodeModulesPath: ["../../node_modules", "./node_modules"],
      builderOptions: {
        productName: "쓱싹",
        appId: "com.sseukssak",
        win: {
          target: "nsis",
          icon: "./public/sweeping.ico",
        },
        nsis: {
          installerIcon: "./public/sweeping.ico",
          installerHeaderIcon: "./public/sweeping.ico",
          deleteAppDataOnUninstall: true,
          createDesktopShortcut: true,
        },
      },
    },
  },
};
