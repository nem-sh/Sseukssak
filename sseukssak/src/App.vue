<template>
  <v-app class="app-container">
    <div class="window-operations-container">
      <div><img class="logo" src="@/assets/sseukssak.png" alt="" /></div>
      <div class="operations">
        <i class="far fa-window-minimize minimize" @click="minimizeWindow"></i>
        <i class="fas fa-times close" @click="closeWindow"></i>
      </div>
    </div>
    <div class="app">
      <div class="menu">
        <div class="menu--icon">
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
      </div>
      <div class="main"><router-view></router-view></div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Home from "@/views/Home.vue";
import "./components/styles/main.scss";

@Component({
  components: {
    Home,
  },
  data() {
    return {
      items: [
        { id: 1, title: "Home", icon: "fas fa-home fa-lg", path: "/" },
        { id: 2, title: "Rename", icon: "far fa-edit fa-lg", path: "rename" },
      ],
    };
  },
})
export default class App extends Vue {
  activeTab: string = "Home";
  goMenu(idx) {
    if (idx === 1 && this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    } else if (idx === 2 && this.$route.name !== "Rename") {
      this.activeTab = "Rename";
      this.$router.push({ name: "Rename" });
    }
  }

  closeWindow() {
    console.log("close window");
    const remote = window.require ? window.require("electron").remote : null;
    const WIN = remote.getCurrentWindow();
    WIN.close();
  }

  minimizeWindow() {
    console.log("minimize window");
    const remote = window.require ? window.require("electron").remote : null;
    const WIN = remote.getCurrentWindow();
    WIN.minimize();
  }
}
</script>
