<template>
  <v-app id="app" class="app-container">
    <div class="window-operations-container">
      <div><img class="logo" src="@/assets/sseukssak.png" alt="" /></div>
      <div class="operations">
        <BtnLoginGoogle/>
        <i class="far fa-window-minimize minimize" @click="minimizeWindow"></i>
        <i v-if="mini" class="fas fa-expand-alt" @click="resizeBigWindow"></i>
        <i
          v-if="!mini"
          class="fas fa-compress-alt"
          @click="resizeSmallWindow"
        ></i>
        <i class="fas fa-times close" @click="closeWindow"></i>
      </div>
    </div>
    <div class="app-main">
      <div v-if="!mini" class="menu">
        <div class="top-space"></div>
        <div class="menu--logo" @click="goInfoPage">
          <img class="app-logo" src="@/assets/sweeping.png" alt="" />
        </div>
        <div class="menu--separator"></div>
        <div
          class="menu--icon"
          v-for="item in items"
          :key="item.title"
          :to="item.path == '#' ? '' : item.path"
          @click="goMenu(item.id)"
          :class="{ active: activeTab === item.title }"
        >
          <span><i :class="item.icon"></i></span>
        </div>
        <div>
          <div
            v-show="this.$vuetify.theme.dark"
            class="menu--icon"
            @click="changeMode"
          >
            <span><i class="fas fa-sun fa-lg"></i></span>
          </div>
          <div
            v-show="!this.$vuetify.theme.dark"
            class="menu--icon"
            @click="changeMode"
          >
            <span><i class="fas fa-moon fa-lg"></i></span>
          </div>
        </div>
      </div>
      <div class="main">
        <!-- <div class="top-space"></div> -->
        <router-view></router-view>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Home from "@/views/Home.vue";
import "./components/styles/main.scss";
import BtnLoginGoogle from '@/components/googleDrive/BtnLoginGoogle.vue'

const { ipcRenderer, shell } = window.require("electron");

@Component({
  components: {
    Home,
    BtnLoginGoogle
  },
  data() {
    return {
      items: [
        { id: 1, title: "Home", icon: "fas fa-folders fa-lg", path: "/" },
        {
          id: 2,
          title: "Rename",
          icon: "fas fa-pencil fa-lg",
          path: "rename",
        },
        {
          id: 3,
          title: "Restore",
          icon: "fa fa-history fa-lg",
          path: "restore",
        },
      ],
    };
  },
})
export default class App extends Vue {
  activeTab: string = "Home";
  mini: boolean = false;

  goMenu(idx) {
    if (idx === 1 && this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    } else if (idx === 2 && this.$route.name !== "Rename") {
      this.activeTab = "Rename";
      this.$router.push({ name: "Rename" });
    } else if (idx === 3 && this.$route.name !== "Restore") {
      this.activeTab = "Restore";
      this.$router.push({ name: "Restore" });
    }
  }

  closeWindow() {
    const remote = window.require ? window.require("electron").remote : null;
    const WIN = remote.getCurrentWindow();
    WIN.close();
  }

  minimizeWindow() {
    const remote = window.require ? window.require("electron").remote : null;
    const WIN = remote.getCurrentWindow();
    WIN.minimize();
  }

  resizeSmallWindow() {
    this.mini = true;
    ipcRenderer.send("resize-me-smaller-please");
    if (this.$route.name !== "MiniMode") {
      this.activeTab = "MiniMode";
      this.$router.push({ name: "MiniMode" });
    }
  }

  resizeBigWindow() {
    this.mini = false;
    ipcRenderer.send("resize-me-bigger-please");
    if (this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    }
  }

  goInfoPage() {
    shell.openExternal("http://k3b304.p.ssafy.io/");
  }

  changeMode() {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }
}
</script>

<style>
#app {
  font-family: "Nanum Gothic", sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  color: #2c3e50;
}
</style>
